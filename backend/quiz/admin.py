from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from .models import Package, Test, Question, TestAttempt, UserAnswer, ExamViolation


# Inline admin for Questions inside Test
class QuestionInline(admin.TabularInline):
    model = Question
    extra = 1
    fields = ('question_text', 'options', 'correct_answer', 'is_multi_answer', 'explanation', 'image')
    show_change_link = True


# Inline admin for UserAnswers inside TestAttempt
class UserAnswerInline(admin.TabularInline):
    model = UserAnswer
    extra = 0
    readonly_fields = ('question', 'selected_answer', 'is_correct')
    can_delete = False


# Inline admin for ExamViolations inside TestAttempt
class ExamViolationInline(admin.TabularInline):
    model = ExamViolation
    extra = 0
    readonly_fields = ('violation_type', 'timestamp', 'details')
    can_delete = False


@admin.register(Package)
class PackageAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'description', 'test_count')
    search_fields = ('name', 'code', 'description')
    ordering = ('name',)
    
    def test_count(self, obj):
        return obj.test_set.count()
    test_count.short_description = 'Number of Tests'


@admin.register(Test)
class TestAdmin(admin.ModelAdmin):
    list_display = ('name', 'package', 'is_active', 'is_exam', 'duration_minutes', 'question_count', 'created_at')
    list_filter = ('package', 'is_active', 'is_exam', 'created_at')
    search_fields = ('name', 'description')
    date_hierarchy = 'created_at'
    inlines = [QuestionInline]
    list_editable = ('is_active', 'is_exam', 'duration_minutes')
    actions = ['activate_tests', 'deactivate_tests', 'mark_as_exam', 'mark_as_practice']
    fieldsets = (
        ('Basic Information', {
            'fields': ('package', 'name', 'description')
        }),
        ('Test Configuration', {
            'fields': ('is_active', 'is_exam', 'duration_minutes', 'scheduled_start_time')
        }),
        ('Metadata', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
    readonly_fields = ('created_at',)
    
    def question_count(self, obj):
        return obj.question_set.count()
    question_count.short_description = 'Questions'
    
    def activate_tests(self, request, queryset):
        queryset.update(is_active=True)
        self.message_user(request, f'{queryset.count()} tests activated.')
    activate_tests.short_description = 'Activate selected tests'
    
    def deactivate_tests(self, request, queryset):
        queryset.update(is_active=False)
        self.message_user(request, f'{queryset.count()} tests deactivated.')
    deactivate_tests.short_description = 'Deactivate selected tests'
    
    def mark_as_exam(self, request, queryset):
        queryset.update(is_exam=True)
        self.message_user(request, f'{queryset.count()} tests marked as exam.')
    mark_as_exam.short_description = 'Mark as exam'
    
    def mark_as_practice(self, request, queryset):
        queryset.update(is_exam=False)
        self.message_user(request, f'{queryset.count()} tests marked as practice.')
    mark_as_practice.short_description = 'Mark as practice'


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('id', 'test', 'question_preview', 'is_multi_answer', 'has_image', 'created_at')
    list_filter = ('test__package', 'test', 'is_multi_answer', 'created_at')
    search_fields = ('question_text', 'explanation', 'id')
    date_hierarchy = 'created_at'
    readonly_fields = ('created_at',)
    list_per_page = 50
    fieldsets = (
        ('Question Information', {
            'fields': ('test', 'question_text', 'image')
        }),
        ('Answer Options', {
            'fields': ('options', 'correct_answer', 'is_multi_answer')
        }),
        ('Explanation', {
            'fields': ('explanation',),
            'classes': ('collapse',)
        }),
        ('Metadata', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
    
    def question_preview(self, obj):
        return obj.question_text[:80] + '...' if len(obj.question_text) > 80 else obj.question_text
    question_preview.short_description = 'Question'
    
    def has_image(self, obj):
        return bool(obj.image)
    has_image.boolean = True
    has_image.short_description = 'Image?'


@admin.register(TestAttempt)
class TestAttemptAdmin(admin.ModelAdmin):
    list_display = ('id', 'user_email', 'candidate_name', 'test', 'score_display', 'time_taken', 'violations_count', 'completed_at')
    list_filter = ('test__package', 'test', 'completed_at')
    search_fields = ('user_email', 'candidate_name', 'candidate_email')
    date_hierarchy = 'completed_at'
    readonly_fields = ('user_email', 'score', 'completed_at', 'time_taken')
    inlines = [UserAnswerInline, ExamViolationInline]
    list_per_page = 50
    actions = ['delete_selected_attempts']
    fieldsets = (
        ('User Information', {
            'fields': ('user_email', 'candidate_name', 'candidate_email')
        }),
        ('Test Information', {
            'fields': ('test', 'score', 'time_taken', 'completed_at')
        }),
    )
    
    def score_display(self, obj):
        return f'{obj.score}%'
    score_display.short_description = 'Score'
    score_display.admin_order_field = 'score'
    
    def violations_count(self, obj):
        count = obj.examviolation_set.count()
        return count if count > 0 else '-'
    violations_count.short_description = 'Violations'
    
    def delete_selected_attempts(self, request, queryset):
        count = queryset.count()
        queryset.delete()
        self.message_user(request, f'{count} test attempts deleted.')
    delete_selected_attempts.short_description = 'Delete selected attempts'


@admin.register(UserAnswer)
class UserAnswerAdmin(admin.ModelAdmin):
    list_display = ('attempt_id', 'user_email', 'question_preview', 'selected_answer_preview', 'is_correct')
    list_filter = ('is_correct', 'question__test')
    search_fields = ('attempt__user_email', 'question__question_text')
    readonly_fields = ('attempt', 'question', 'selected_answer', 'is_correct')
    list_per_page = 100
    
    def attempt_id(self, obj):
        return obj.attempt.id
    attempt_id.short_description = 'Attempt ID'
    
    def user_email(self, obj):
        return obj.attempt.user_email
    user_email.short_description = 'User'
    
    def question_preview(self, obj):
        return obj.question.question_text[:50] + '...' if len(obj.question.question_text) > 50 else obj.question.question_text
    question_preview.short_description = 'Question'
    
    def selected_answer_preview(self, obj):
        return str(obj.selected_answer)[:50]
    selected_answer_preview.short_description = 'Answer'


@admin.register(ExamViolation)
class ExamViolationAdmin(admin.ModelAdmin):
    list_display = ('attempt_id', 'user_email', 'violation_type', 'timestamp')
    list_filter = ('violation_type', 'timestamp')
    date_hierarchy = 'timestamp'
    readonly_fields = ('attempt', 'violation_type', 'timestamp', 'details')
    search_fields = ('attempt__user_email', 'violation_type', 'details')
    
    def attempt_id(self, obj):
        return obj.attempt.id
    attempt_id.short_description = 'Attempt ID'
    
    def user_email(self, obj):
        return obj.attempt.user_email
    user_email.short_description = 'User'


# Extend User admin to manage admin permissions
class CustomUserAdmin(BaseUserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'is_superuser', 'last_login')
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'last_login')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    actions = ['make_admin', 'remove_admin', 'make_superuser', 'remove_superuser']
    
    def make_admin(self, request, queryset):
        queryset.update(is_staff=True)
        self.message_user(request, f'{queryset.count()} users granted admin access.')
    make_admin.short_description = 'Grant admin access'
    
    def remove_admin(self, request, queryset):
        queryset.update(is_staff=False, is_superuser=False)
        self.message_user(request, f'{queryset.count()} users removed from admin.')
    remove_admin.short_description = 'Remove admin access'
    
    def make_superuser(self, request, queryset):
        queryset.update(is_staff=True, is_superuser=True)
        self.message_user(request, f'{queryset.count()} users granted superuser access.')
    make_superuser.short_description = 'Make superuser'
    
    def remove_superuser(self, request, queryset):
        queryset.update(is_superuser=False)
        self.message_user(request, f'{queryset.count()} users removed from superuser.')
    remove_superuser.short_description = 'Remove superuser access'


# Unregister the default User admin and register custom one
admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)

# Customize admin site header and title
admin.site.site_header = 'Assessment Hub Administration'
admin.site.site_title = 'Assessment Hub Admin'
admin.site.index_title = 'Welcome to Assessment Hub Admin Panel'
