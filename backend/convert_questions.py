import json
import re

# Read the questions.js file
with open('../src/data/questions.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

# Remove export statement
js_content = re.sub(r'export const TESTS\s*=\s*', '', js_content)

# Convert JS booleans to Python
js_content = js_content.replace('false', 'False').replace('true', 'True')

# Remove comments
js_content = re.sub(r'//[^\n]*', '', js_content)

# Remove trailing commas
js_content = re.sub(r',(\s*[}\]])', r'\1', js_content)

# Execute to get Python dict
tests_data = eval(js_content)

print(f"Found {len(tests_data)} tests")
for test_num, test_info in tests_data.items():
    print(f"  Test {test_num}: {test_info['name']} - {len(test_info['questions'])} questions")

# Write Python format
print("\n\nGenerating Python format...")
print("TESTS_DATA = {")
for test_num in sorted(tests_data.keys()):
    test = tests_data[test_num]
    slug = f"test{test_num}"
    print(f'    "{slug}": {{')
    print(f'        "name": "{test["name"]}",')
    print(f'        "questions": {test["questions"]!r}')
    print(f'    }},')
print("}")
