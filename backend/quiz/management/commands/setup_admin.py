"""
Sets up the 'PU SN' package and assigns all existing tests to it.
Also sets chamthakrutik4@gmail.com as staff/admin if they exist.
Run: python manage.py setup_admin
"""
from django.core.management.base import BaseCommand
from quiz.models import Package, Test


class Command(BaseCommand):
    help = "Creates the 'PU SN' package, assigns all tests to it, and sets the admin user."

    def handle(self, *args, **kwargs):
        # 1. Create PU SN package
        package, created = Package.objects.get_or_create(
            name="PU SN",
            defaults={"description": "ServiceNow Certified System Administrator – Practice Tests", "is_active": True}
        )
        action = "Created" if created else "Found existing"
        self.stdout.write(f"  {action} package: {package.name}")

        # 2. Assign all tests to it with proper order
        for i, test in enumerate(Test.objects.all().order_by('id'), start=1):
            test.package = package
            test.order = i
            test.save()
            self.stdout.write(f"  Assigned: {test.name}")

        # 3. Set admin user by email
        from django.contrib.auth.models import User
        admin_email = "chamthakrutik4@gmail.com"
        try:
            user = User.objects.get(email=admin_email)
            user.is_staff = True
            user.is_superuser = True
            user.save()
            self.stdout.write(self.style.SUCCESS(f"  ✓ {admin_email} → set as superuser"))
        except User.DoesNotExist:
            self.stdout.write(self.style.WARNING(
                f"  ⚠ User '{admin_email}' not found yet. "
                f"They will be auto-promoted the first time they log in via Google."
            ))

        self.stdout.write(self.style.SUCCESS("Done!"))
