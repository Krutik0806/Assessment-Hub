"""
Sets up the 'PU SN' package and assigns all existing tests to it.
Also creates a Django admin superuser and promotes Google OAuth users.
Run: python manage.py setup_admin
"""
from django.core.management.base import BaseCommand
from quiz.models import Package, Test


class Command(BaseCommand):
    help = "Creates package, assigns tests, and sets up admin users."

    def handle(self, *args, **kwargs):
        # 1. Create PU SN package
        package, created = Package.objects.get_or_create(
            name="PU SN",
            defaults={"description": "Practice Tests", "is_active": True}
        )
        action = "Created" if created else "Found existing"
        self.stdout.write(f"  {action} package: {package.name}")

        # 2. Assign all tests to it with proper order
        for i, test in enumerate(Test.objects.all().order_by('id'), start=1):
            test.package = package
            test.order = i
            test.save()
            self.stdout.write(f"  Assigned: {test.name}")

        # 3. Create Django admin superuser (for /admin/ login)
        from django.contrib.auth.models import User
        admin_username = "admin"
        admin_password = "admin123"  # Change this password after first login!
        
        try:
            admin_user = User.objects.get(username=admin_username)
            self.stdout.write(f"  Found existing admin user: {admin_username}")
        except User.DoesNotExist:
            admin_user = User.objects.create_superuser(
                username=admin_username,
                email="chamthakrutik4@gmail.com",
                password=admin_password
            )
            self.stdout.write(self.style.SUCCESS(f"  ✓ Created admin user: {admin_username}"))
            self.stdout.write(self.style.WARNING(f"  ⚠ Password: {admin_password} (CHANGE THIS!)"))

        # 4. Set Google OAuth admin user by email
        admin_email = "chamthakrutik4@gmail.com"
        try:
            user = User.objects.get(email=admin_email)
            if user.username != admin_username:  # Don't duplicate if it's the same user
                user.is_staff = True
                user.is_superuser = True
                user.save()
                self.stdout.write(self.style.SUCCESS(f"  ✓ {admin_email} → promoted to superuser"))
        except User.DoesNotExist:
            self.stdout.write(self.style.WARNING(
                f"  ⚠ Google user '{admin_email}' not found yet. "
                f"Will be auto-promoted on first Google login."
            ))

        self.stdout.write(self.style.SUCCESS("\nDone! Django admin: username='admin', password='admin123'"))

