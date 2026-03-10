from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    # Auth
    # path('auth/register/', views.register),  # TEMPORARILY DISABLED - hardcoded auth only
    # path('auth/google/', views.google_login),  # TEMPORARILY DISABLED - hardcoded auth only
    path('auth/login/', views.login),  # Hardcoded student authentication
    path('auth/refresh/', TokenRefreshView.as_view()),
    path('auth/me/', views.me),

    # Packages & Tests
    path('packages/', views.package_list),
    path('tests/', views.test_list),
    path('tests/exams/', views.exam_test_list),
    path('tests/<slug:slug>/questions/', views.test_questions),
    path('tests/<slug:slug>/leaderboard/', views.leaderboard),

    # Attempts
    path('attempts/', views.my_attempts),
    path('attempts/submit/', views.submit_attempt),
    path('attempts/<int:pk>/', views.attempt_detail),

    # Exam Proctoring
    path('exam/warn/', views.exam_warn),
    path('exam/status/<int:test_id>/', views.exam_status),

    # Admin Panel
    path('admin-panel/dashboard/', views.admin_dashboard),
    path('admin-panel/tests/<int:test_id>/lock/', views.admin_toggle_lock),
    path('admin-panel/tests/<int:test_id>/active/', views.admin_toggle_active),
    path('admin-panel/tests/<int:test_id>/exam/', views.admin_toggle_exam),
    path('admin-panel/tests/<int:test_id>/auto-ban/', views.admin_toggle_auto_ban),
    path('admin-panel/tests/<int:test_id>/end/', views.admin_end_test),
    path('admin-panel/tests/<int:test_id>/timing/', views.admin_update_test_timing),
    path('admin-panel/tests/<int:test_id>/export/', views.admin_export_test_results),
    path('admin-panel/tests/<int:test_id>/delete/', views.admin_delete_test),
    path('admin-panel/users/', views.admin_users),
    path('admin-panel/users/<int:user_id>/toggle/', views.admin_toggle_user),
    path('admin-panel/users/<int:user_id>/unban/', views.admin_unban_user),

    # AI Test Creation
    path('admin-panel/create-from-pdf/', views.admin_create_test_from_pdf),

    # Health Check (for Render.com keep-alive)
    path('health/', views.health_check),
]
