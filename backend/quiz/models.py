from django.db import models
from django.contrib.auth.models import User


class Package(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Test(models.Model):
    package = models.ForeignKey(Package, on_delete=models.SET_NULL, null=True, blank=True, related_name='tests')
    name = models.CharField(max_length=100)
    slug = models.CharField(max_length=20, unique=True)
    is_locked = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    # Exam mode: admin marks this test as a proctored exam
    is_exam_test = models.BooleanField(default=False)
    
    # Proctoring settings
    enable_auto_ban = models.BooleanField(default=True, help_text="Auto-ban users after 3 violations. If disabled, only warnings are given.")
    is_ended = models.BooleanField(default=False, help_text="Admin marks test as ended. Review answers become available.")
    
    # Timing and Scheduling configurations
    duration_minutes = models.PositiveIntegerField(default=60)
    scheduled_start_time = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['order', 'id']

    def __str__(self):
        return self.name

    @property
    def total(self):
        return self.questions.count()


class Question(models.Model):
    test = models.ForeignKey(Test, on_delete=models.CASCADE, related_name='questions')
    number = models.PositiveIntegerField()
    question = models.TextField()
    options = models.JSONField()
    answer = models.JSONField()
    explanation = models.TextField(blank=True)
    image = models.CharField(max_length=255, blank=True)
    multi = models.BooleanField(default=False)

    class Meta:
        ordering = ['number']

    def __str__(self):
        return f"{self.test.name} - Q{self.number}"


class TestAttempt(models.Model):
    MODE_CHOICES = [('practice', 'Practice'), ('exam', 'Exam')]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='attempts')
    test = models.ForeignKey(Test, on_delete=models.CASCADE, related_name='attempts')
    mode = models.CharField(max_length=10, choices=MODE_CHOICES, default='practice')
    score = models.PositiveIntegerField(default=0)
    total = models.PositiveIntegerField(default=0)
    completed_at = models.DateTimeField(auto_now_add=True)
    # Time taken in seconds (for leaderboard tiebreaking)
    time_taken = models.PositiveIntegerField(default=0)

    # Pre-exam Registration Details
    candidate_name = models.CharField(max_length=255, blank=True, null=True)
    enrollment_number = models.CharField(max_length=100, blank=True, null=True)
    roll_no = models.CharField(max_length=100, blank=True, null=True)
    candidate_email = models.EmailField(blank=True, null=True)
    batch = models.CharField(max_length=10, blank=True, null=True, help_text="Batch (e.g., A, B, C)")

    @property
    def percentage(self):
        if self.total == 0:
            return 0
        return round((self.score / self.total) * 100, 1)

    def __str__(self):
        return f"{self.user.username} – {self.test.name} ({self.percentage}%)"


class UserAnswer(models.Model):
    attempt = models.ForeignKey(TestAttempt, on_delete=models.CASCADE, related_name='user_answers')
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    selected = models.JSONField()
    is_correct = models.BooleanField(default=False)


class ExamViolation(models.Model):
    """Tracks tab-switch / focus-loss violations during a proctored exam."""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='violations')
    test = models.ForeignKey(Test, on_delete=models.CASCADE, related_name='violations')
    warnings = models.PositiveIntegerField(default=0)
    is_banned = models.BooleanField(default=False)
    banned_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = [['user', 'test']]

    def __str__(self):
        return f"{self.user.username} – {self.test.name} – warnings={self.warnings} banned={self.is_banned}"
