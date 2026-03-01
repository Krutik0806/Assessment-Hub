from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from .models import Package, Test, Question, TestAttempt, UserAnswer, ExamViolation


# Inline admin for Questions inside Test
class QuestionInline(admin.TabularInline):
    model = Question
    extra = 1
    fields = ('number', 'question', 'options', 'answer', 'multi', 'explanation', 'image')
    show_change_link = True


# Inline admin for UserAnswers inside TestAttempt
class UserAnswerInline(admin.TabularInline):
    model = UserAnswer
    extra = 0
    readonly_fields = ('question', 'selected', 'is_correct')
    can_delete = False


@admin.register(Package)
class PackageAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'is_active', 'test_count', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('name', 'description')
    list_editable = ('is_active',)
    ordering = ('name',)
    readonly_fields = ('created_at',)
    
    def test_count(self, obj):
        return obj.tests.count()
    test_count.short_description = 'Number of Tests'


@admin.register(Test)
class TestAdmin(admin.ModelAdmin):
    list_display = ('name', 'package', 'is_active', 'is_exam_test', 'duration_minutes', 'question_count', 'order')
    list_filter = ('package', 'is_active', 'is_exam_test')
    search_fields = ('name', 'slug')
    inlines = [QuestionInline]
    list_editable = ('is_active', 'is_exam_test', 'duration_minutes', 'order')
    actions = ['activate_tests', 'deactivate_tests', 'mark_as_exam', 'mark_as_practice']
    fieldsets = (
        ('Basic Information', {
            'fields': ('package', 'name', 'slug', 'order')
        }),
        ('Test Configuration', {
            'fields': ('is_active', 'is_locked', 'is_exam_test', 'duration_minutes', 'scheduled_start_time')
        }),
    )
    
    def question_count(self, obj):
        return obj.questions.count()
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
        queryset.update(is_exam_test=True)
        self.message_user(request, f'{queryset.count()} tests marked as exam.')
    mark_as_exam.short_description = 'Mark as exam'
    
    def mark_as_practice(self, request, queryset):
        queryset.update(is_exam_test=False)
        self.message_user(request, f'{queryset.count()} tests marked as practice.')
    mark_as_practice.short_description = 'Mark as practice'


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('id', 'test', 'number', 'question_preview', 'multi', 'has_image')
    list_filter = ('test__package', 'test', 'multi')
    search_fields = ('question', 'explanation', 'id')
    list_per_page = 50
    ordering = ('test', 'number')
    fieldsets = (
        ('Question Information', {
            'fields': ('test', 'number', 'question', 'image')
        }),
        ('Answer Options', {
            'fields': ('options', 'answer', 'multi')
        }),
        ('Explanation', {
            'fields': ('explanation',),
            'classes': ('collapse',)
        }),
    )
    
    def question_preview(self, obj):
        return obj.question[:80] + '...' if len(obj.question) > 80 else obj.question
    question_preview.short_description = 'Question'
    
    def has_image(self, obj):
        return bool(obj.image)
    has_image.boolean = True
    has_image.short_description = 'Image?'


@admin.register(TestAttempt)
class TestAttemptAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'candidate_name', 'test', 'score_display', 'mode', 'time_taken_display', 'completed_at')
    list_filter = ('test__package', 'test', 'mode', 'completed_at')
    search_fields = ('user__username', 'user__email', 'candidate_name', 'candidate_email', 'enrollment_number')
    date_hierarchy = 'completed_at'
    readonly_fields = ('user', 'test', 'score', 'total', 'completed_at', 'time_taken')
    inlines = [UserAnswerInline]
    list_per_page = 50
    actions = ['delete_selected_attempts']
    fieldsets = (
        ('User Information', {
            'fields': ('user', 'candidate_name', 'candidate_email', 'enrollment_number', 'roll_no')
        }),
        ('Test Information', {
            'fields': ('test', 'mode', 'score', 'total', 'time_taken', 'completed_at')
        }),
    )
    
    def score_display(self, obj):
        return f'{obj.percentage}%'
    score_display.short_description = 'Score'
    score_display.admin_order_field = 'score'
    
    def time_taken_display(self, obj):
        mins = obj.time_taken // 60
        secs = obj.time_taken % 60
        return f'{mins}m {secs}s'
    time_taken_display.short_description = 'Time Taken'
    
    def delete_selected_attempts(self, request, queryset):
        count = queryset.count()
        queryset.delete()
        self.message_user(request, f'{count} test attempts deleted.')
    delete_selected_attempts.short_description = 'Delete selected attempts'


@admin.register(UserAnswer)
class UserAnswerAdmin(admin.ModelAdmin):
    list_display = ('attempt_id', 'username', 'question_preview', 'selected_preview', 'is_correct')
    list_filter = ('is_correct', 'question__test')
    search_fields = ('attempt__user__username', 'attempt__user__email', 'question__question')
    readonly_fields = ('attempt', 'question', 'selected', 'is_correct')
    list_per_page = 100
    
    def attempt_id(self, obj):
        return obj.attempt.id
    attempt_id.short_description = 'Attempt ID'
    
    def username(self, obj):
        return obj.attempt.user.username
    username.short_description = 'User'
    
    def question_preview(self, obj):
        return obj.question.question[:50] + '...' if len(obj.question.question) > 50 else obj.question.question
    question_preview.short_description = 'Question'
    
    def selected_preview(self, obj):
        return str(obj.selected)[:50]
    selected_preview.short_description = 'Answer'


@admin.register(ExamViolation)
class ExamViolationAdmin(admin.ModelAdmin):
    list_display = ('user', 'test', 'warnings', 'is_banned', 'banned_at', 'created_at')
    list_filter = ('is_banned', 'test', 'created_at')
    date_hierarchy = 'created_at'
    readonly_fields = ('created_at', 'updated_at')
    search_fields = ('user__username', 'user__email', 'test__name')
    fieldsets = (
        ('Violation Information', {
            'fields': ('user', 'test', 'warnings', 'is_banned', 'banned_at')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


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
