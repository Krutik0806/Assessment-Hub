import json
import os

with open("tmp_test8_q1_20.json", "r", encoding="utf-8") as f:
    q1 = json.load(f)
with open("tmp_test8_q21_40.json", "r", encoding="utf-8") as f:
    q2 = json.load(f)
with open("tmp_test8_q41_60.json", "r", encoding="utf-8") as f:
    q3 = json.load(f)

all_questions = q1 + q2 + q3

# ensure length is 60
if len(all_questions) != 60:
    print(f"Error! Length is {len(all_questions)}")
    exit(1)

for idx, q in enumerate(all_questions):
    q["id"] = idx + 1

# Format as string
formatted_questions = json.dumps(all_questions, indent=12)
formatted_questions = formatted_questions.replace("            {", "            {")

# Building the new test block
new_test_block = f"""    8: {{
        name: "Practice Test 8",
        total: 60,
        questions: {formatted_questions}
    }}"""

# Append to questions.js
with open("src/data/questions.js", "r", encoding="utf-8") as f:
    content = f.read()

# We need to insert it before the last closing brace of TESTS object
# The file ends with:
#     }
# };
# Find the position to insert
insert_pos = content.rfind("    7: {")
if insert_pos == -1:
    print("Could not find Test 7!")
    exit(1)

end_of_7 = content.find("    }", insert_pos)
# Test 7 ends with:
#         ]
#     }
# Wait, Test 7 format is:
#         ]
#     }
# Let's find exactly the last closing brace of Test 7.
# It's better to find the closing brace of TESTS.
tests_end = content.rfind("};")
if tests_end == -1:
    tests_end = content.rfind("}")

# The tests object ends with:
#     }
# };

# Add comma to the end of test 7
last_test_end = content.rfind("    }", 0, tests_end)
# We can replace the last `    }` with `    },` if it's not already comma severed.
# Actually, since it's JS, trailing commas are fine. Just insert the new test block right before `};`
insert_at = content.rfind("};")

new_content = content[:insert_at] + ",\n" + new_test_block + "\n" + content[insert_at:]

with open("src/data/questions.js", "w", encoding="utf-8") as f:
    f.write(new_content)

print("Practice Test 8 successfully appended!")
