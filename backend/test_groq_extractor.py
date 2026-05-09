"""
Quick local test for pdf_extractor.py
Run from: backend/ directory
"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
os.environ.setdefault("PYTHONUTF8", "1")

SAMPLE_TEXT = """
Question 1: What does CPU stand for?
A) Central Processing Unit
B) Computer Processing Unit
C) Central Program Unit
D) Core Processing Unit
Answer: A

Question 2: Which of the following is NOT an operating system?
A) Windows
B) Linux
C) Python
D) macOS
Answer: C

Question 3: What is RAM used for?
A) Permanent storage
B) Temporary storage for running programs
C) Storing the BIOS
D) Graphics processing
Answer: B
"""

print("=" * 50)
print("Testing Groq extractor...")
print("=" * 50)

try:
    from quiz.pdf_extractor import (
        GROQ_API_KEY, GEMINI_API_KEY,
        chunk_text, extract_with_groq
    )

    print(f"[OK] Groq API Key: {GROQ_API_KEY[:20]}...")
    print(f"[OK] Gemini API Key: {GEMINI_API_KEY[:20]}...")

    chunks = chunk_text(SAMPLE_TEXT)
    print(f"[OK] Text chunked into {len(chunks)} chunk(s)")
    print("\n>> Calling Groq API (llama-3.3-70b)...")

    questions = extract_with_groq(chunks)

    print(f"\n[SUCCESS] Extracted {len(questions)} questions:\n")
    for i, q in enumerate(questions, 1):
        print(f"  Q{i}: {q['question'][:70]}")
        print(f"       Options : {q['options']}")
        print(f"       Answer  : index {q['answer']}")
        print()

except Exception as e:
    print(f"\n[FAILED] {e}")
    import traceback
    traceback.print_exc()
