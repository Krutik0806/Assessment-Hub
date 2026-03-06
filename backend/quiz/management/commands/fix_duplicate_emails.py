from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.db.models import Count

class Command(BaseCommand):
    help = 'Remove duplicate email addresses - keep only one account per email'

    def add_arguments(self, parser):
        parser.add_argument(
            '--execute',
            action='store_true',
            help='Actually delete duplicates (default is dry-run)',
        )

    def handle(self, *args, **kwargs):
        execute = kwargs.get('execute', False)
        
        if not execute:
            self.stdout.write(self.style.WARNING('🔍 DRY RUN MODE - No changes will be made'))
            self.stdout.write(self.style.WARNING('   Run with --execute flag to actually delete duplicates\n'))
        
        self.stdout.write('🔍 Searching for duplicate email addresses...\n')
        
        # Find emails that appear more than once
        duplicates = User.objects.values('email').annotate(
            count=Count('id')
        ).filter(count__gt=1).order_by('-count')
        
        if not duplicates:
            self.stdout.write(self.style.SUCCESS('✅ No duplicate emails found!'))
            return
        
        self.stdout.write(f'⚠️  Found {len(duplicates)} duplicate email(s):\n')
        
        total_would_remove = 0
        total_removed = 0
        
        for dup in duplicates:
            email = dup['email']
            count = dup['count']
            
            users = User.objects.filter(email=email).order_by('date_joined')
            self.stdout.write(f'\n📧 Email: {email} ({count} accounts)')
            
            # Keep the first account (oldest by date_joined)
            keep_user = users.first()
            duplicate_users = users.exclude(id=keep_user.id)
            
            self.stdout.write(f'   ✅ Keeping: User ID {keep_user.id} (username: {keep_user.username}, joined {keep_user.date_joined})')
            
            for user in duplicate_users:
                attempt_count = user.attempts.count()
                violation_count = user.violations.count()
                
                info = f'   ❌ {"Will delete" if not execute else "Deleting"}: User ID {user.id} (username: {user.username}, joined {user.date_joined})'
                if attempt_count > 0 or violation_count > 0:
                    info += f' - Has {attempt_count} attempts, {violation_count} violations'
                
                self.stdout.write(info)
                
                if execute:
                    user.delete()
                    total_removed += 1
                else:
                    total_would_remove += 1
        
        self.stdout.write(f'\n{"="*70}')
        if execute:
            self.stdout.write(self.style.SUCCESS(f'✅ Cleanup complete: {total_removed} duplicate user(s) removed'))
        else:
            self.stdout.write(self.style.WARNING(f'📊 DRY RUN: Would remove {total_would_remove} duplicate user(s)'))
            self.stdout.write(self.style.WARNING(f'💡 Run with --execute flag to actually delete: python manage.py fix_duplicate_emails --execute'))

