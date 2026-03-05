from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.models import User
from django.db.models import Avg, Count
from django.utils import timezone
from django.conf import settings
from django_ratelimit.decorators import ratelimit
import csv
import requests
from google.oauth2 import id_token as google_id_token
from google.auth.transport import requests as google_requests
from .models import Package, Test, Question, TestAttempt, UserAnswer, ExamViolation
from .serializers import (
    RegisterSerializer, UserSerializer,
    PackageSerializer, TestSerializer, QuestionSerializer, ExamQuestionSerializer,
    AttemptCreateSerializer, TestAttemptSerializer, LeaderboardEntrySerializer,
    AdminUserSerializer,
)

GOOGLE_CLIENT_ID = '695327652700-q7qoans9eib141m420a7tdv0fsinb0fe.apps.googleusercontent.com'
ADMIN_EMAIL = 'chamthakrutik4@gmail.com'


def is_admin_user(user):
    return user.is_authenticated and (user.is_staff or user.email == ADMIN_EMAIL)


def verify_recaptcha(token, action=None):
    """Verify reCAPTCHA v3 token and return (is_valid, score, error_message)
    
    NOTE: This is now OPTIONAL - returns True even if token is missing.
    This prevents blocking legitimate users with ad blockers, VPNs, or in restricted countries.
    Bot protection is primarily handled by middleware + rate limiting.
    """
    import logging
    logger = logging.getLogger(__name__)
    
    # If no token provided, allow but log warning
    if not token:
        logger.warning(f'No reCAPTCHA token provided for action: {action}')
        return True, 0.0, 'No token (allowed)'
    
    try:
        response = requests.post(settings.RECAPTCHA_VERIFY_URL, data={
            'secret': settings.RECAPTCHA_SECRET_KEY,
            'response': token
        }, timeout=5)
        
        result = response.json()
        
        if not result.get('success'):
            error_codes = result.get('error-codes', [])
            logger.warning(f'reCAPTCHA failed: {error_codes}')
            return True, 0.0, f'Verification failed (allowed): {error_codes}'
        
        score = result.get('score', 0.0)
        result_action = result.get('action', '')
        
        # Verify action matches if provided
        if action and result_action != action:
            logger.warning(f'reCAPTCHA action mismatch: expected {action}, got {result_action}')
            return True, score, f'Action mismatch (allowed)'
        
        # Check score threshold (lowered to 0.3 for privacy users)
        if score < 0.3:
            logger.warning(f'Low reCAPTCHA score: {score} for action: {action}')
            return True, score, f'Low score (allowed): {score}'
        
        logger.info(f'reCAPTCHA verified: score={score}, action={action}')
        return True, score, None
        
    except requests.RequestException as e:
        logger.error(f'reCAPTCHA request error: {str(e)}')
        return True, 0.0, f'Request error (allowed): {str(e)}'
    except Exception as e:
        logger.error(f'reCAPTCHA unexpected error: {str(e)}')
        return True, 0.0, f'Error (allowed): {str(e)}'


# ── Auth ──────────────────────────────────────────────────────────────────────

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    # Verify reCAPTCHA (optional - just logs suspicious activity)
    captcha_token = request.data.get('captcha_token')
    is_valid, score, error = verify_recaptcha(captcha_token, action='register')
    # Note: is_valid is now always True, this just logs bot detection
    
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data, 
            'access': str(refresh.access_token), 
            'refresh': str(refresh),
            'captcha_score': score
        }, status=201)
    return Response(serializer.errors, status=400)


@api_view(['POST'])
@permission_classes([AllowAny])
def google_login(request):
    # Verify reCAPTCHA (optional - just logs suspicious activity)
    captcha_token = request.data.get('captcha_token')
    is_valid, score, error = verify_recaptcha(captcha_token, action='google_login')
    # Note: is_valid is now always True, this just logs bot detection
    
    credential = request.data.get('credential')
    email = request.data.get('email')
    google_sub = request.data.get('google_sub')
    name = request.data.get('name', '')

    if credential:
        try:
            idinfo = google_id_token.verify_oauth2_token(credential, google_requests.Request(), GOOGLE_CLIENT_ID)
            email = idinfo.get('email')
            name = idinfo.get('given_name', idinfo.get('name', ''))
        except ValueError as e:
            return Response({'error': f'Invalid Google token: {e}'}, status=400)
    elif not (email and google_sub):
        return Response({'error': 'Provide credential or email+google_sub.'}, status=400)

    if not email:
        return Response({'error': 'Could not retrieve email.'}, status=400)

    # Safe name parsing to avoid crashes
    first_name = ''
    if name:
        name_parts = name.strip().split()
        first_name = name_parts[0] if name_parts else ''

    user, created = User.objects.get_or_create(
        email=email, 
        defaults={
            'username': email.split('@')[0], 
            'first_name': first_name
        }
    )
    
    if created and User.objects.filter(username=user.username).exclude(pk=user.pk).exists():
        user.username = f"{email.split('@')[0]}_{user.pk}"
    
    if email == ADMIN_EMAIL and not user.is_staff:
        user.is_staff = True
        user.is_superuser = True
    
    user.save()

    refresh = RefreshToken.for_user(user)
    return Response({
        'user': UserSerializer(user).data, 
        'access': str(refresh.access_token), 
        'refresh': str(refresh), 
        'is_new_user': created,
        'captcha_score': score
    })


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """Custom login view with reCAPTCHA verification"""
    from django.contrib.auth import authenticate
    
    # Verify reCAPTCHA (optional - just logs suspicious activity)
    captcha_token = request.data.get('captcha_token')
    is_valid, score, error = verify_recaptcha(captcha_token, action='login')
    # Note: is_valid is now always True, this just logs bot detection
    
    # Authenticate user
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response({'error': 'Username and password are required'}, status=400)
    
    user = authenticate(username=username, password=password)
    
    if user is None:
        return Response({'error': 'Invalid credentials'}, status=401)
    
    # Generate tokens
    refresh = RefreshToken.for_user(user)
    return Response({
        'user': UserSerializer(user).data,
        'access': str(refresh.access_token),
        'refresh': str(refresh),
        'captcha_score': score
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me(request):
    return Response(UserSerializer(request.user).data)


# ── Package & Test ─────────────────────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([AllowAny])
def package_list(request):
    packages = Package.objects.filter(is_active=True)
    return Response(PackageSerializer(packages, many=True, context={'request': request}).data)


@api_view(['GET'])
@permission_classes([AllowAny])
def test_list(request):
    tests = Test.objects.filter(is_active=True).order_by('order', 'id')
    return Response(TestSerializer(tests, many=True, context={'request': request}).data)


@api_view(['GET'])
@permission_classes([AllowAny])
def exam_test_list(request):
    """Returns only tests marked as exam tests (for the Exam Tests section)."""
    tests = Test.objects.filter(is_active=True, is_exam_test=True).order_by('order', 'id')
    return Response(TestSerializer(tests, many=True, context={'request': request}).data)


@api_view(['GET'])
@permission_classes([AllowAny])
def test_questions(request, slug):
    try:
        test = Test.objects.get(slug=slug, is_active=True)
    except Test.DoesNotExist:
        return Response({'error': 'Test not found'}, status=404)

    if test.is_locked and not is_admin_user(request.user):
        return Response({'error': 'This test is currently locked by an administrator.'}, status=403)

    # Check if user is banned from this exam
    if test.is_exam_test and request.user.is_authenticated:
        ban = ExamViolation.objects.filter(user=request.user, test=test, is_banned=True).first()
        if ban:
            return Response({'error': 'You are banned from this exam due to violations. Please contact an administrator.', 'banned': True}, status=403)

    questions = test.questions.all()
    
    # Check if this is practice mode (query parameter)
    mode = request.GET.get('mode', None)
    
    # For exam mode (not practice), don't send answers/explanations to prevent cheating
    # Users will only see answers after submitting (in the results endpoint)
    # Practice mode always gets answers regardless of test type
    if test.is_exam_test and mode != 'practice':
        return Response(ExamQuestionSerializer(questions, many=True).data)
    else:
        return Response(QuestionSerializer(questions, many=True).data)


# ── Attempts ──────────────────────────────────────────────────────────────────

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_attempt(request):
    serializer = AttemptCreateSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=400)

    data = serializer.validated_data
    try:
        test = Test.objects.get(id=data['test_id'])
    except Test.DoesNotExist:
        return Response({'error': 'Test not found'}, status=404)

    if test.is_locked and not is_admin_user(request.user):
        return Response({'error': 'This test is locked.'}, status=403)

    # Prevent duplicate submissions within 30 seconds
    from datetime import timedelta
    recent_cutoff = timezone.now() - timedelta(seconds=30)
    recent_attempt = TestAttempt.objects.filter(
        user=request.user,
        test=test,
        mode=data['mode'],
        completed_at__gte=recent_cutoff
    ).first()
    
    if recent_attempt:
        return Response({
            'error': 'Submission too soon. Please wait before submitting again.',
            'attempt': TestAttemptSerializer(recent_attempt).data
        }, status=429)

    attempt = TestAttempt.objects.create(
        user=request.user, 
        test=test, 
        mode=data['mode'],
        total=len(data['answers']), 
        time_taken=data.get('time_taken', 0),
        candidate_name=data.get('candidate_name', ''),
        enrollment_number=data.get('enrollment_number', ''),
        roll_no=data.get('roll_no', ''),
        candidate_email=data.get('candidate_email', ''),
        batch=data.get('batch', '')
    )
    correct_count = 0
    user_answers_created = 0
    
    for ans in data['answers']:
        try:
            question = Question.objects.get(id=ans['question_id'])
        except Question.DoesNotExist:
            import logging
            logging.warning(f"Question ID {ans.get('question_id')} not found during submission")
            continue
        selected = sorted(ans['selected']) if ans['selected'] else []
        correct = sorted(question.answer)
        is_correct = selected == correct
        if is_correct:
            correct_count += 1
        UserAnswer.objects.create(attempt=attempt, question=question, selected=ans['selected'], is_correct=is_correct)
        user_answers_created += 1

    attempt.score = correct_count
    attempt.save()
    
    # Reload attempt with user_answers to return complete data
    attempt = TestAttempt.objects.prefetch_related('user_answers__question').get(pk=attempt.pk)
    
    import logging
    logging.info(f"Submission complete: attempt_id={attempt.id}, score={correct_count}/{len(data['answers'])}, user_answers_created={user_answers_created}")
    
    return Response(TestAttemptSerializer(attempt).data, status=201)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_attempts(request):
    # Prefetch user_answers and related question data to avoid N+1 queries
    attempts = TestAttempt.objects.filter(user=request.user).prefetch_related('user_answers__question').order_by('-completed_at')
    return Response(TestAttemptSerializer(attempts, many=True).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def attempt_detail(request, pk):
    try:
        # Prefetch user_answers to include full question data
        attempt = TestAttempt.objects.prefetch_related('user_answers__question').get(pk=pk, user=request.user)
    except TestAttempt.DoesNotExist:
        return Response({'error': 'Not found'}, status=404)
    return Response(TestAttemptSerializer(attempt).data)


# ── Exam Proctoring ────────────────────────────────────────────────────────────

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def exam_warn(request):
    """
    Called when a student switches tabs/windows during a proctored exam.
    
    If test.enable_auto_ban is True:
        - Ban on 3rd violation
    If test.enable_auto_ban is False:
        - Just count violations, no ban (keep warning)
    
    Always tracks violation count for reporting.
    """
    test_id = request.data.get('test_id')
    if not test_id:
        return Response({'error': 'test_id required'}, status=400)

    try:
        test = Test.objects.get(id=test_id, is_exam_test=True)
    except Test.DoesNotExist:
        return Response({'error': 'Exam test not found'}, status=404)

    violation, _ = ExamViolation.objects.get_or_create(user=request.user, test=test)

    if violation.is_banned:
        return Response({
            'warnings': violation.warnings, 
            'banned': True,
            'message': 'You are banned from this exam due to multiple violations.'
        })

    # Increment violation count
    violation.warnings += 1
    
    # Check if auto-ban is enabled and threshold reached
    if test.enable_auto_ban and violation.warnings >= 3:
        violation.is_banned = True
        violation.banned_at = timezone.now()
        violation.save()
        return Response({
            'warnings': violation.warnings, 
            'banned': True,
            'message': 'You have been banned from this exam due to multiple violations (tab switches, extensions, or popups).'
        })
    
    violation.save()
    
    # Return warning message
    if test.enable_auto_ban:
        remaining = 3 - violation.warnings
        message = f'Warning {violation.warnings}/3: Violation detected (tab switch, extension popup, or focus loss). {remaining} more violation(s) will result in a ban.'
    else:
        message = f'Warning {violation.warnings}: Violation detected (tab switch, extension popup, or focus loss). Stay focused on the exam.'
    
    return Response({
        'warnings': violation.warnings, 
        'banned': False,
        'message': message,
        'auto_ban_enabled': test.enable_auto_ban
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def exam_status(request, test_id):
    """Check if user is banned from an exam test before starting."""
    try:
        test = Test.objects.get(id=test_id, is_exam_test=True)
    except Test.DoesNotExist:
        return Response({'error': 'Not found'}, status=404)

    violation = ExamViolation.objects.filter(user=request.user, test=test).first()
    return Response({
        'warnings': violation.warnings if violation else 0,
        'banned': violation.is_banned if violation else False,
    })


# ── Leaderboard ────────────────────────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([AllowAny])
def leaderboard(request, slug):
    """Returns top 50 exam attempts for a test, sorted by score desc then time asc.
    Shows only the BEST attempt per user."""
    try:
        test = Test.objects.get(slug=slug)
    except Test.DoesNotExist:
        return Response({'error': 'Test not found'}, status=404)

    # Get best attempt per user (highest score, then fastest time)
    from django.db.models import Max, Min
    from django.db.models.functions import Coalesce
    
    # Subquery to get best score per user
    user_best_scores = (
        TestAttempt.objects
        .filter(test=test, mode='exam')
        .values('user')
        .annotate(best_score=Max('score'), min_time=Min('time_taken'))
    )
    
    # Get the actual best attempts
    best_attempts = []
    seen_users = set()
    
    # Get all attempts ordered by score desc, time asc
    all_attempts = TestAttempt.objects.filter(test=test, mode='exam').order_by('-score', 'time_taken', 'completed_at')
    
    # Select only the best attempt per user
    for attempt in all_attempts:
        if attempt.user_id not in seen_users:
            best_attempts.append(attempt)
            seen_users.add(attempt.user_id)
    
    return Response({
        'test_name': test.name,
        'is_ended': test.is_ended,
        'entries': LeaderboardEntrySerializer(best_attempts, many=True).data,
    })


# ── Admin API ──────────────────────────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_dashboard(request):
    if not is_admin_user(request.user):
        return Response({'error': 'Admin access required.'}, status=403)

    total_users = User.objects.count()
    total_attempts = TestAttempt.objects.count()
    avg_score = TestAttempt.objects.aggregate(avg=Avg('score'))['avg'] or 0
    
    # Optimize: Use annotate to calculate aggregations in one query instead of N+1 queries
    tests = Test.objects.annotate(
        attempt_count=Count('attempts'),
        avg_attempt_score=Avg('attempts__score')
    ).all()

    test_stats = []
    for t in tests:
        avg = t.avg_attempt_score or 0
        test_stats.append({
            'id': t.id, 'name': t.name, 'slug': t.slug,
            'is_locked': t.is_locked, 'is_active': t.is_active,
            'is_exam_test': t.is_exam_test,
            'total_questions': t.total,
            'attempt_count': t.attempt_count,
            'avg_score': round((avg / t.total * 100) if t.total else 0, 1),
        })

    banned_users = ExamViolation.objects.filter(is_banned=True).count()
    return Response({
        'total_users': total_users, 'total_attempts': total_attempts,
        'avg_score': round(avg_score, 1), 'banned_users': banned_users, 'tests': test_stats,
    })


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def admin_toggle_lock(request, test_id):
    if not is_admin_user(request.user):
        return Response({'error': 'Admin access required.'}, status=403)
    try:
        test = Test.objects.get(id=test_id)
    except Test.DoesNotExist:
        return Response({'error': 'Not found'}, status=404)
    test.is_locked = not test.is_locked
    test.save()
    return Response({'id': test.id, 'name': test.name, 'is_locked': test.is_locked})


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def admin_toggle_active(request, test_id):
    if not is_admin_user(request.user):
        return Response({'error': 'Admin access required.'}, status=403)
    try:
        test = Test.objects.get(id=test_id)
    except Test.DoesNotExist:
        return Response({'error': 'Not found'}, status=404)
    test.is_active = not test.is_active
    test.save()
    return Response({'id': test.id, 'name': test.name, 'is_active': test.is_active})


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def admin_toggle_exam(request, test_id):
    """Toggle whether a test is a proctored exam test."""
    if not is_admin_user(request.user):
        return Response({'error': 'Admin access required.'}, status=403)
    try:
        test = Test.objects.get(id=test_id)
    except Test.DoesNotExist:
        return Response({'error': 'Not found'}, status=404)
    test.is_exam_test = not test.is_exam_test
    test.save()
    return Response({'id': test.id, 'name': test.name, 'is_exam_test': test.is_exam_test})


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def admin_toggle_auto_ban(request, test_id):
    """Toggle auto-ban setting for a proctored exam test."""
    if not is_admin_user(request.user):
        return Response({'error': 'Admin access required.'}, status=403)
    try:
        test = Test.objects.get(id=test_id)
    except Test.DoesNotExist:
        return Response({'error': 'Not found'}, status=404)
    test.enable_auto_ban = not test.enable_auto_ban
    test.save()
    return Response({
        'id': test.id, 
        'name': test.name, 
        'enable_auto_ban': test.enable_auto_ban,
        'message': f"Auto-ban {'enabled' if test.enable_auto_ban else 'disabled'} - Users will {'be banned after 3 violations' if test.enable_auto_ban else 'only receive warnings'}"
    })


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def admin_end_test(request, test_id):
    """Toggle test ended status. When ended, review answers become available."""
    if not is_admin_user(request.user):
        return Response({'error': 'Admin access required.'}, status=403)
    try:
        test = Test.objects.get(id=test_id)
    except Test.DoesNotExist:
        return Response({'error': 'Not found'}, status=404)
    test.is_ended = not test.is_ended
    test.save()
    return Response({
        'id': test.id, 
        'name': test.name, 
        'is_ended': test.is_ended,
        'message': f"Test {'ended' if test.is_ended else 'reopened'} - Review answers {'available' if test.is_ended else 'locked'}"
    })


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def admin_update_test_timing(request, test_id):
    """Update duration and scheduled start time for a test."""
    if not is_admin_user(request.user):
        return Response({'error': 'Admin access required.'}, status=403)
    try:
        test = Test.objects.get(id=test_id)
    except Test.DoesNotExist:
        return Response({'error': 'Not found'}, status=404)
        
    duration = request.data.get('duration_minutes')
    start_time = request.data.get('scheduled_start_time')
    
    if duration is not None:
        try:
            test.duration_minutes = max(1, int(duration))
        except ValueError:
            return Response({'error': 'Invalid duration format'}, status=400)
            
    if 'scheduled_start_time' in request.data: # Allow nulling out
        if not start_time:
            test.scheduled_start_time = None
        else:
            from django.utils.dateparse import parse_datetime
            parsed = parse_datetime(start_time)
            if parsed:
                test.scheduled_start_time = parsed
            else:
                return Response({'error': 'Invalid datetime format. Use ISO format.'}, status=400)
                
    test.save()
    return Response({
        'id': test.id, 
        'name': test.name, 
        'duration_minutes': test.duration_minutes,
        'scheduled_start_time': test.scheduled_start_time
    })


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def admin_delete_test(request, test_id):
    """Permanently delete a test and all its questions / attempts."""
    if not is_admin_user(request.user):
        return Response({'error': 'Admin access required.'}, status=403)
    try:
        test = Test.objects.get(id=test_id)
        test.delete()
        return Response({'success': True, 'id': test_id})
    except Test.DoesNotExist:
        return Response({'error': 'Not found'}, status=404)


from django.http import HttpResponse

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_export_test_results(request, test_id):
    """Export all exam attempts for a test as a CSV file, grouped by batch."""
    if not is_admin_user(request.user):
        return Response({'error': 'Admin access required.'}, status=403)
    try:
        test = Test.objects.get(id=test_id)
    except Test.DoesNotExist:
        return Response({'error': 'Not found'}, status=404)

    attempts = TestAttempt.objects.filter(test=test, mode='exam').order_by('batch', '-score', 'time_taken')

    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = f'attachment; filename="exam_results_{test.slug}.csv"'

    writer = csv.writer(response)
    
    # Group attempts by batch
    from itertools import groupby
    grouped_attempts = groupby(attempts, key=lambda x: x.batch or 'No Batch')
    
    first_batch = True
    for batch_name, batch_attempts in grouped_attempts:
        # Add separator between batches (skip for first batch)
        if not first_batch:
            writer.writerow([])  # Empty row as separator
        
        # Batch header
        writer.writerow([f'===== BATCH {batch_name} ====='])
        writer.writerow(['Username', 'Candidate Name', 'Enrollment Number', 'Roll Number', 'Email', 'Batch', 'Score', 'Total Questions', 'Percentage', 'Time Taken (s)', 'Violations', 'Banned', 'Completed At'])
        
        for attempt in batch_attempts:
            # Get violation count for this user and test
            violation = ExamViolation.objects.filter(user=attempt.user, test=test).first()
            violation_count = violation.warnings if violation else 0
            is_banned = 'Yes' if (violation and violation.is_banned) else 'No'
            
            # Format enrollment number with leading quote to prevent Excel scientific notation
            enrollment_display = f"'{attempt.enrollment_number}" if attempt.enrollment_number else ''
            
            writer.writerow([
                attempt.user.username,
                attempt.candidate_name or '',
                enrollment_display,
                attempt.roll_no or '',
                attempt.candidate_email or '',
                attempt.batch or '',
                attempt.score,
                attempt.total,
                f"{attempt.percentage:.2f}%",
                attempt.time_taken,
                violation_count,
                is_banned,
                attempt.completed_at.strftime('%d-%m-%Y %H:%M')
            ])
        
        first_batch = False

    return response


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_users(request):
    if not is_admin_user(request.user):
        return Response({'error': 'Admin access required.'}, status=403)
    # Optimize: Use annotate + prefetch_related to avoid N+1 queries
    # Was: 1 + (3 × num_users) queries, Now: 4 total queries
    users = User.objects.annotate(
        attempt_count=Count('attempts')
    ).prefetch_related(
        'attempts',
        'violations'
    ).order_by('-date_joined')
    return Response(AdminUserSerializer(users, many=True).data)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def admin_toggle_user(request, user_id):
    if not is_admin_user(request.user):
        return Response({'error': 'Admin access required.'}, status=403)
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({'error': 'Not found'}, status=404)
    if user.email == ADMIN_EMAIL:
        return Response({'error': 'Cannot deactivate the primary admin.'}, status=400)
    user.is_active = not user.is_active
    user.save()
    return Response({'id': user.id, 'username': user.username, 'is_active': user.is_active})


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def admin_unban_user(request, user_id):
    """Unban a user from all exam tests they were banned from."""
    if not is_admin_user(request.user):
        return Response({'error': 'Admin access required.'}, status=403)
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({'error': 'Not found'}, status=404)

    test_id = request.data.get('test_id')
    if test_id:
        ExamViolation.objects.filter(user=user, test_id=test_id).update(is_banned=False, warnings=0)
    else:
        ExamViolation.objects.filter(user=user, is_banned=True).update(is_banned=False, warnings=0)

    return Response({'success': True, 'message': f'{user.username} has been unbanned.'})


# ── PDF → Test (Gemini) ────────────────────────────────────────────────────────

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def admin_create_test_from_pdf(request):
    """
    Admin uploads a PDF. Gemini extracts questions → creates a Test.
    Form fields:  pdf (file)   test_name (str)   package_id (int, optional)
    """
    if not is_admin_user(request.user):
        return Response({'error': 'Admin access required.'}, status=403)

    pdf_file = request.FILES.get('pdf')
    test_name = request.POST.get('test_name', '').strip()

    if not pdf_file:
        return Response({'error': 'No PDF file uploaded.'}, status=400)
    if not test_name:
        return Response({'error': 'test_name is required.'}, status=400)
    if not pdf_file.name.lower().endswith('.pdf'):
        return Response({'error': 'Only PDF files are accepted.'}, status=400)

    pdf_bytes = pdf_file.read()

    # Track extraction time
    import time
    start_time = time.time()
    
    try:
        from .pdf_extractor import extract_questions_with_gemini
        questions = extract_questions_with_gemini(pdf_bytes, test_name)
    except Exception as e:
        return Response({'error': f'Gemini extraction failed: {str(e)}'}, status=500)

    extraction_time = round(time.time() - start_time, 2)

    if not questions:
        return Response({'error': 'No questions could be extracted from the PDF.'}, status=400)

    # Create the test
    package_id = request.POST.get('package_id')
    package = None
    if package_id:
        try:
            package = Package.objects.get(id=package_id)
        except Package.DoesNotExist:
            pass

    # Auto-generate a slug
    import re as _re
    base_slug = _re.sub(r'[^a-z0-9]+', '-', test_name.lower()).strip('-')[:20]
    slug = base_slug
    counter = 1
    while Test.objects.filter(slug=slug).exists():
        slug = f"{base_slug[:16]}-{counter}"
        counter += 1

    # Get next order
    max_order = Test.objects.aggregate(m=__import__('django.db.models', fromlist=['Max']).Max('order'))['m'] or 0

    test = Test.objects.create(
        name=test_name, slug=slug,
        package=package, order=max_order + 1,
        is_active=True, is_locked=False,
    )

    created_questions = []
    multi_choice_count = 0
    single_choice_count = 0
    
    for i, q in enumerate(questions, 1):
        qq = Question.objects.create(
            test=test, number=i,
            question=q['question'], options=q['options'],
            answer=q['answer'], explanation=q['explanation'],
            multi=q['multi'],
        )
        
        if q['multi']:
            multi_choice_count += 1
        else:
            single_choice_count += 1
            
        created_questions.append({
            'number': i, 'question': qq.question[:80] + ('…' if len(qq.question) > 80 else ''),
            'options': len(qq.options), 'answer': qq.answer,
        })

    # Generate extraction summary for admin notification
    summary = {
        'total_questions': len(created_questions),
        'single_choice': single_choice_count,
        'multi_choice': multi_choice_count,
        'extraction_time_seconds': extraction_time,
        'pdf_filename': pdf_file.name,
        'test_id': test.id,
        'test_name': test.name,
        'test_slug': test.slug,
        'package': package.name if package else 'No Package',
    }
    
    import logging
    logger = logging.getLogger(__name__)
    logger.info(f"""
    ✅ PDF EXTRACTION COMPLETE
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    📄 PDF: {pdf_file.name}
    📝 Test Created: {test.name} (ID: {test.id}, slug: {test.slug})
    📦 Package: {package.name if package else 'None'}
    
    📊 EXTRACTION SUMMARY:
    • Total Questions: {len(created_questions)}
    • Single Choice: {single_choice_count}
    • Multi Choice: {multi_choice_count}
    • Processing Time: {extraction_time}s
    
    🎯 Top 3 Questions:
    {chr(10).join([f"  {i+1}. {q['question'][:60]}..." for i, q in enumerate(created_questions[:3])])}
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    """)

    return Response({
        'success': True,
        'message': f'✅ Successfully extracted {len(created_questions)} questions from "{pdf_file.name}"',
        'test': {
            'id': test.id, 
            'name': test.name, 
            'slug': test.slug, 
            'total': len(created_questions),
            'package': package.name if package else None,
        },
        'summary': summary,
        'questions_preview': created_questions[:5],
    }, status=201)


# ── Health Check (for Render.com keep-alive) ──────────────────────────────────

@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    """Simple health check endpoint for keep-alive pings."""
    return Response({'status': 'healthy', 'message': 'Server is alive! ✅'}, status=200)

