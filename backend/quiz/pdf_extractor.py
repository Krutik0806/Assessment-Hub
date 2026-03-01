"""
Gemini PDF → Test extractor.

Usage: PUT this file at  quiz/pdf_extractor.py
"""
import json, re, io, pathlib
import google.generativeai as genai

GEMINI_API_KEY = "AIzaSyArRgW-RNrOJ0AFxIh_j_fqOXXfvEbkIAk"

SYSTEM_PROMPT = """
You are an expert exam paper parser.

Given text extracted from a PDF (an exam / quiz / test paper), extract ALL questions and return a JSON array.

Rules:
1. Each item must have EXACTLY these fields:
   - "question": string (full question text)
   - "options": list of strings (A, B, C, D ... text only, no letter prefix)
   - "answer": list of 0-based indexes of the correct option(s) (e.g. [0] for A, [1,2] for B & C)
   - "explanation": string (explanation of why the answer is correct – if missing, write a brief one)
   - "multi": boolean (true if multiple answers are correct)

2. If the answer is not explicit but can be inferred, infer it.
3. If an explanation is missing or blank, GENERATE a concise one using your knowledge.
4. Strip all leading letters/numbers from options (A., 1., etc.).
5. Return ONLY a valid JSON array, no markdown fences, no extra text.

Example output:
[
  {
    "question": "What is a CI in ServiceNow?",
    "options": ["Configuration Item", "Custom Interface", "Core Integration", "Cloud Instance"],
    "answer": [0],
    "explanation": "A CI (Configuration Item) is any component that needs to be managed in order to deliver an IT service.",
    "multi": false
  }
]
"""


def pdf_bytes_to_text(pdf_bytes: bytes) -> str:
    """Extract text from PDF bytes using PyPDF2."""
    try:
        import PyPDF2
        reader = PyPDF2.PdfReader(io.BytesIO(pdf_bytes))
        pages = []
        for page in reader.pages:
            text = page.extract_text()
            if text:
                pages.append(text)
        return "\n\n".join(pages)
    except Exception as e:
        raise ValueError(f"Failed to read PDF: {e}")


def extract_questions_with_gemini(pdf_bytes: bytes, test_name: str = "") -> list[dict]:
    """
    Send PDF text to Gemini and return a list of parsed question dicts.
    Falls back to sending the PDF as a binary blob if text extraction fails.
    """
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel("gemini-2.5-flash")

    # Try text extraction first (faster, cheaper)
    try:
        pdf_text = pdf_bytes_to_text(pdf_bytes)
        if len(pdf_text.strip()) < 100:
            raise ValueError("Too little text extracted, trying binary upload")
    except Exception:
        pdf_text = None

    if pdf_text:
        prompt = f"{SYSTEM_PROMPT}\n\nPDF Content:\n\n{pdf_text}"
        response = model.generate_content(prompt)
    else:
        # Upload the PDF binary directly to Gemini Files API
        import tempfile, os
        with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp:
            tmp.write(pdf_bytes)
            tmp_path = tmp.name
        try:
            uploaded = genai.upload_file(tmp_path, mime_type="application/pdf")
            response = model.generate_content([SYSTEM_PROMPT, uploaded])
        finally:
            os.unlink(tmp_path)

    raw = response.text.strip()

    # Strip markdown fences if present
    raw = re.sub(r"^```(?:json)?", "", raw).strip()
    raw = re.sub(r"```$", "", raw).strip()

    questions = json.loads(raw)

    # Validate and normalise
    validated = []
    for i, q in enumerate(questions):
        if not isinstance(q, dict) or "question" not in q:
            continue
        validated.append({
            "question":    str(q.get("question", "")),
            "options":     [str(o) for o in q.get("options", [])],
            "answer":      [int(a) for a in q.get("answer", [0])],
            "explanation": str(q.get("explanation", "")),
            "multi":       bool(q.get("multi", len(q.get("answer", [])) > 1)),
        })

    return validated
