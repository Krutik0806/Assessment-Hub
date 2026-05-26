from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Package, Test, Question, TestAttempt, UserAnswer, ExamViolation

ADMIN_EMAIL = "chamthakrutik4@gmail.com"


# ── Auth ──────────────────────────────────────────────────────────────────────

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2']

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({'password': 'Passwords do not match.'})
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        return User.objects.create_user(**validated_data)


class UserSerializer(serializers.ModelSerializer):
    is_admin = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'date_joined', 'is_admin']

    def get_is_admin(self, obj):
        return obj.is_staff or obj.email == ADMIN_EMAIL


# ── Package & Quiz ─────────────────────────────────────────────────────────────

class TestSerializer(serializers.ModelSerializer):
    total = serializers.IntegerField(read_only=True)
    has_attempted = serializers.SerializerMethodField()

    class Meta:
        model = Test
        fields = ['id', 'name', 'slug', 'total', 'is_locked', 'is_active', 'order', 'is_exam_test', 'enable_auto_ban', 'is_ended', 'duration_minutes', 'scheduled_start_time', 'has_attempted']

    def get_has_attempted(self, obj):
        request = self.context.get('request')
        if request and request.user and request.user.is_authenticated:
            return obj.attempts.filter(user=request.user, mode='exam').exists()
        return False


class PackageSerializer(serializers.ModelSerializer):
    tests = serializers.SerializerMethodField()

    class Meta:
        model = Package
        fields = ['id', 'name', 'description', 'is_active', 'tests']

    def get_tests(self, obj):
        tests = obj.tests.filter(is_active=True, is_exam_test=False).order_by('order')
        return TestSerializer(tests, many=True, context=self.context).data


class QuestionSerializer(serializers.ModelSerializer):
    correct_count = serializers.SerializerMethodField()

    class Meta:
        model = Question
        fields = ['id', 'number', 'question', 'options', 'answer', 'explanation', 'image', 'multi', 'correct_count']

    def get_correct_count(self, obj):
        return len(obj.answer) if isinstance(obj.answer, list) else 1


class ExamQuestionSerializer(serializers.ModelSerializer):
    """Serializer for exam questions - excludes answers and explanations to prevent cheating via inspect"""
    correct_count = serializers.SerializerMethodField()

    class Meta:
        model = Question
        fields = ['id', 'number', 'question', 'options', 'image', 'multi', 'correct_count']

    def get_correct_count(self, obj):
        return len(obj.answer) if isinstance(obj.answer, list) else 1


# ── Attempts ──────────────────────────────────────────────────────────────────

class UserAnswerInputSerializer(serializers.Serializer):
    question_id = serializers.IntegerField()
    selected = serializers.ListField(child=serializers.IntegerField())


class AttemptCreateSerializer(serializers.Serializer):
    test_id = serializers.IntegerField()
    mode = serializers.ChoiceField(choices=['practice', 'exam'])
    answers = UserAnswerInputSerializer(many=True)
    time_taken = serializers.IntegerField(default=0)
    
    # Optional candidate details (passed in during exam mode)
    candidate_name = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    enrollment_number = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    roll_no = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    candidate_email = serializers.EmailField(required=False, allow_blank=True, allow_null=True)
    batch = serializers.CharField(required=False, allow_blank=True, allow_null=True)


class UserAnswerSerializer(serializers.ModelSerializer):
    question_number = serializers.IntegerField(source='question.number', read_only=True)
    question_text = serializers.CharField(source='question.question', read_only=True)
    correct_answer = serializers.JSONField(source='question.answer', read_only=True)
    options = serializers.JSONField(source='question.options', read_only=True)
    explanation = serializers.CharField(source='question.explanation', read_only=True)

    class Meta:
        model = UserAnswer
        fields = ['question_number', 'question_text', 'options', 'correct_answer', 'selected', 'is_correct', 'explanation']


class TestAttemptSerializer(serializers.ModelSerializer):
    test_name = serializers.CharField(source='test.name', read_only=True)
    test_slug = serializers.CharField(source='test.slug', read_only=True)
    percentage = serializers.FloatField(read_only=True)
    user_answers = UserAnswerSerializer(many=True, read_only=True)

    class Meta:
        model = TestAttempt
        fields = [
            'id', 'test_name', 'test_slug', 'mode', 'score', 'total', 'percentage', 'time_taken', 'completed_at', 
            'candidate_name', 'enrollment_number', 'roll_no', 'candidate_email', 'batch', 'user_answers'
        ]


# ── Leaderboard ────────────────────────────────────────────────────────────────

class LeaderboardEntrySerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    display_name = serializers.SerializerMethodField()
    percentage = serializers.FloatField(read_only=True)

    class Meta:
        model = TestAttempt
        fields = ['username', 'display_name', 'candidate_name', 'enrollment_number', 'batch', 'score', 'total', 'percentage', 'time_taken', 'completed_at']
    
    def get_display_name(self, obj):
        """Return candidate_name if available, otherwise username"""
        return obj.candidate_name if obj.candidate_name else obj.user.username


# ── Admin ──────────────────────────────────────────────────────────────────────

class TestAdminSerializer(serializers.ModelSerializer):
    total = serializers.IntegerField(read_only=True)
    attempt_count = serializers.SerializerMethodField()

    class Meta:
        model = Test
        fields = ['id', 'name', 'slug', 'total', 'is_locked', 'is_active', 'order', 'is_exam_test', 'is_ended', 'enable_auto_ban', 'duration_minutes', 'scheduled_start_time', 'attempt_count']

    def get_attempt_count(self, obj):
        return obj.attempts.count()


class AdminUserSerializer(serializers.ModelSerializer):
    attempt_count = serializers.IntegerField(read_only=True)  # From annotate
    last_attempt = serializers.SerializerMethodField()
    active_bans = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'date_joined', 'is_active', 'attempt_count', 'last_attempt', 'active_bans']

    def get_last_attempt(self, obj):
        # Use prefetched attempts to avoid N+1 query
        attempts = getattr(obj, '_prefetched_objects_cache', {}).get('attempts', obj.attempts.all())
        try:
            last = max(attempts, key=lambda a: a.completed_at)
            return str(last.completed_at)
        except (ValueError, AttributeError):
            return None

    def get_active_bans(self, obj):
        # Use prefetched violations to avoid N+1 query
        violations = getattr(obj, '_prefetched_objects_cache', {}).get('violations', obj.violations.all())
        bans = [v for v in violations if v.is_banned]
        return [{'test_id': b.test_id, 'test_name': b.test.name} for b in bans]
