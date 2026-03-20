"""
Extracts questions from the JS source file and seeds all 4 tests.
Run: python manage.py seed_all_tests
"""
import re, json
from django.core.management.base import BaseCommand
from quiz.models import Package, Test, Question


def parse_js_questions(js_text, test_num):
    """Very simple regex-based extractor for the questions.js format."""
    # Find the block for this test number
    pattern = rf"\b{test_num}:\s*\{{\s*name:"
    start_match = re.search(pattern, js_text)
    if not start_match:
        return []

    # Find "questions: [" after the test number
    questions_start = js_text.find('questions:', start_match.end())
    if questions_start == -1:
        return []
    
    # Find the opening bracket of questions array
    arr_start = js_text.find('[', questions_start)
    if arr_start == -1:
        return []
    
    depth = 0
    i = arr_start
    while i < len(js_text):
        if js_text[i] == '[':
            depth += 1
        elif js_text[i] == ']':
            depth -= 1
            if depth == 0:
                arr_end = i + 1
                break
        i += 1
    else:
        return []

    raw = js_text[arr_start:arr_end]

    # Replace JS booleans with JSON booleans  
    raw = raw.replace('false', 'false').replace('true', 'true').replace('False', 'false').replace('True', 'true')

    # Remove JS comments
    raw = re.sub(r'//[^\n]*', '', raw)

    # Remove trailing commas before } or ]
    raw = re.sub(r',(\s*[}\]])', r'\1', raw)
    
    # Quote unquoted keys (id, question, options, answer, explanation, multi, image)
    raw = re.sub(r'\b(id|question|options|answer|explanation|multi|image):', r'"\1":', raw)

    try:
        questions = json.loads(raw)
        return questions
    except Exception as e:
        return []


class Command(BaseCommand):
    help = "Seeds questions for all 4 tests from the old questions.js file."

    def handle(self, *args, **kwargs):
        import os
        # Look for questions.js relative to base dir
        base = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))))
        # Try src/data first (current version), then fall back to old_version
        js_path = os.path.join(base, 'src', 'data', 'questions.js')
        if not os.path.exists(js_path):
            js_path = os.path.join(base, 'old_version', 'questions.js')
        if not os.path.exists(js_path):
            self.stdout.write(self.style.ERROR(f'questions.js not found, tried {js_path}'))
            return

        self.stdout.write(f'Reading: {js_path}')
        with open(js_path, 'r', encoding='utf-8') as f:
            js_text = f.read()

        pkg, _ = Package.objects.get_or_create(name='PU SN', defaults={'description': 'ServiceNow CSA Practice Tests', 'is_active': True})

        test_map = [(i, f'test{i}', f'Practice Test {i}') for i in range(1, 10)]

        for test_num, slug, name in test_map:
            test, _ = Test.objects.get_or_create(slug=slug, defaults={'name': name, 'package': pkg, 'order': test_num})
            test.package = pkg
            test.order = test_num
            test.save()

            questions = parse_js_questions(js_text, test_num)
            if not questions:
                self.stdout.write(self.style.WARNING(f'  {name}: could not parse questions'))
                continue

            test.questions.all().delete()
            created = 0
            for q in questions:
                # Skip comment-only entries
                if not isinstance(q, dict) or 'question' not in q:
                    continue
                Question.objects.create(
                    test=test,
                    number=q.get('id', created + 1),
                    question=q.get('question', ''),
                    options=q.get('options', []),
                    answer=q.get('answer', []),
                    explanation=q.get('explanation', ''),
                    image=q.get('image', ''),
                    multi=q.get('multi', False),
                )
                created += 1
            self.stdout.write(f'  ✓ {name}: {created} questions')

        self.stdout.write(self.style.SUCCESS('Done!'))
