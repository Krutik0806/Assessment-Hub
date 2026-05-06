"""
Cleans up stale/duplicate packages from the database.
Run: python manage.py cleanup_packages
Added to Render build command to auto-clean on deploy.
"""
from django.core.management.base import BaseCommand
from quiz.models import Package


class Command(BaseCommand):
    help = "Remove stale packages (e.g. old CAD folder) from the database."

    def handle(self, *args, **kwargs):
        # Delete any package that shouldn't exist
        stale_names = ['CAD']
        for name in stale_names:
            deleted, _ = Package.objects.filter(name=name).delete()
            if deleted:
                self.stdout.write(self.style.SUCCESS(f'Deleted stale package: "{name}"'))
            else:
                self.stdout.write(f'Package "{name}" not found — nothing to delete.')

        # Ensure PU SN exists
        pkg, created = Package.objects.get_or_create(
            name='PU SN',
            defaults={'description': 'ServiceNow CAD Practice Tests', 'is_active': True}
        )
        if created:
            self.stdout.write(self.style.SUCCESS('Created "PU SN" package.'))
        else:
            self.stdout.write('"PU SN" package already exists.')
