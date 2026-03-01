from django.core.management.base import BaseCommand
from django.db import connection


class Command(BaseCommand):
    help = 'Display current database connection information'

    def handle(self, *args, **options):
        db_settings = connection.settings_dict
        
        self.stdout.write(self.style.SUCCESS('\n=== DATABASE CONNECTION INFO ===\n'))
        
        engine = db_settings.get('ENGINE', 'Unknown')
        
        if 'postgresql' in engine:
            self.stdout.write(self.style.SUCCESS('✓ Using PostgreSQL (Supabase)'))
            self.stdout.write(f"  Engine: {engine}")
            self.stdout.write(f"  Host: {db_settings.get('HOST', 'N/A')}")
            self.stdout.write(f"  Port: {db_settings.get('PORT', 'N/A')}")
            self.stdout.write(f"  Database: {db_settings.get('NAME', 'N/A')}")
            self.stdout.write(f"  User: {db_settings.get('USER', 'N/A')}")
            
            # Test actual connection
            with connection.cursor() as cursor:
                cursor.execute("SELECT version();")
                version = cursor.fetchone()[0]
                self.stdout.write(f"  PostgreSQL Version: {version.split(',')[0]}")
                
        elif 'sqlite' in engine:
            self.stdout.write(self.style.WARNING('⚠ Using SQLite (Local Development)'))
            self.stdout.write(f"  Engine: {engine}")
            self.stdout.write(f"  Database File: {db_settings.get('NAME', 'N/A')}")
        else:
            self.stdout.write(self.style.ERROR(f'✗ Unknown database: {engine}'))
        
        self.stdout.write(self.style.SUCCESS('\n================================\n'))
