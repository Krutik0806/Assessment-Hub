"""Test table parser - show explanation and multi-select for SSNF PDF."""
import sys
sys.path.insert(0, '.')
from quiz.pdf_extractor import extract_questions_with_gemini

PDF_PATH = r"C:\Users\Krutik\OneDrive\Desktop\Assesment Hud\Module 1 SSNF - SSNF 2 (1).pdf"
with open(PDF_PATH, "rb") as f:
    pdf_bytes = f.read()

questions = extract_questions_with_gemini(pdf_bytes, "SSNF Module 1")
print(f"Total questions: {len(questions)}\n")

# Show a few single and multi-select to verify both
for idx in [0, 11, 17, 30, 44]:
    if idx >= len(questions): continue
    q = questions[idx]
    print(f"Q{idx+1}: {q['question']}")
    for j, opt in enumerate(q["options"]):
        marker = " <-- CORRECT" if j in q["answer"] else ""
        print(f"  {chr(65+j)}: {opt}{marker}")
    print(f"  Explanation: {q['explanation']}")
    print(f"  Multi: {q['multi']}")
    print()
