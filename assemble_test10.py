import json
import os

with open("tmp_test10_q1_20.json", "r", encoding="utf-8") as f:
    q1 = json.load(f)
with open("tmp_test10_q21_40.json", "r", encoding="utf-8") as f:
    q2 = json.load(f)
with open("tmp_test10_q41_60.json", "r", encoding="utf-8") as f:
    q3 = json.load(f)

all_questions = q1 + q2 + q3

if len(all_questions) != 60:
    print(f"Error! Length is {len(all_questions)}")
    exit(1)

for idx, q in enumerate(all_questions):
    q["id"] = idx + 1

formatted_questions = json.dumps(all_questions, indent=12)
formatted_questions = formatted_questions.replace("            {", "            {")

new_test_block = f"""    10: {{
        name: "Practice Test 10",
        total: 60,
        questions: {formatted_questions}
    }}"""


with open("src/data/questions.js", "r", encoding="utf-8") as f:
    content = f.read()

insert_at = content.rfind("};")

new_content = content[:insert_at] + ",\n" + new_test_block + "\n" + content[insert_at:]

with open("src/data/questions.js", "w", encoding="utf-8") as f:
    f.write(new_content)

print("Practice Test 10 successfully appended!")
