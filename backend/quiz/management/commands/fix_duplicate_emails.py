from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.db.models import Count

class Command(BaseCommand):
    help = 'Find and fix duplicate email addresses in the database'

    def handle(self, *args, **kwargs):
        self.stdout.write('🔍 Searching for duplicate email addresses...\n')
        
        # Find emails that appear more than once
        duplicates = User.objects.values('email').annotate(
            count=Count('id')
        ).filter(count__gt=1).order_by('-count')
        
        if not duplicates:
            self.stdout.write(self.style.SUCCESS('✅ No duplicate emails found!'))
            return
        
        self.stdout.write(f'⚠️  Found {len(duplicates)} duplicate email(s):\n')
        
        total_removed = 0
        for dup in duplicates:
            email = dup['email']
            count = dup['count']
            
            users = User.objects.filter(email=email).order_by('id')
            self.stdout.write(f'\n📧 Email: {email} ({count} accounts)')
            
            # Keep the oldest account (first by ID)
            keep_user = users.first()
            duplicate_users = users.exclude(id=keep_user.id)
            
            self.stdout.write(f'   ✅ Keeping: User ID {keep_user.id} (username: {keep_user.username}, created first)')
            
            for user in duplicate_users:
                # Check if duplicate has any data we need to preserve
                attempt_count = user.attempts.count()
                violation_count = user.violations.count()
                
                if attempt_count > 0 or violation_count > 0:
                    self.stdout.write(self.style.WARNING(
                        f'   ⚠️  User ID {user.id} has {attempt_count} attempts and {violation_count} violations'
                    ))
                    self.stdout.write(self.style.WARNING(
                        f'      Skipping deletion - manual review needed!'
                    ))
                else:
                    user.delete()
                    self.stdout.write(self.style.SUCCESS(
                        f'   ❌ Deleted: User ID {user.id} (username: {user.username}, no activity)'
                    ))
                    total_removed += 1
        
        self.stdout.write(f'\n{"="*60}')
        self.stdout.write(self.style.SUCCESS(f'✅ Cleanup complete: {total_removed} duplicate user(s) removed'))
        self.stdout.write('💡 For users with activity, manually merge data or keep oldest account')
