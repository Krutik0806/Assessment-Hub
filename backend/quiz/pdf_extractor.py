"""
Gemini PDF → Test extractor.

Usage: PUT this file at  quiz/pdf_extractor.py
"""
import json, re, io, os
import google.generativeai as genai

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "AIzaSyCzIVhXWwuHCbmFBF6OwVGAdi9NfEqCd0Y")

# ── Constants ──────────────────────────────────────────────────────────────────
# gemini-1.5-flash is significantly faster than 2.5-flash → avoids 504 timeouts
MODEL_NAME = "gemini-1.5-flash"

# Max characters to send per chunk to Gemini (keeps requests fast)
MAX_CHUNK_CHARS = 25_000

SYSTEM_PROMPT = """You are an exam paper parser. Extract ALL questions from the text below and return a JSON array ONLY (no markdown, no extra text).

Each item must have exactly:
- "question": string
- "options": list of strings (no letter prefix like A. B.)
- "answer": list of 0-based indexes of correct option(s)
- "explanation": brief string (generate one if missing)
- "multi": boolean (true if multiple correct answers)

Return ONLY valid JSON array."""


# ── Helpers ────────────────────────────────────────────────────────────────────

def pdf_bytes_to_text(pdf_bytes: bytes) -> str:
    """Extract plain text from PDF bytes using PyPDF2."""
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


def chunk_text(text: str, max_chars: int = MAX_CHUNK_CHARS) -> list[str]:
    """Split text into chunks of max_chars, breaking at paragraph/newline boundaries."""
    if len(text) <= max_chars:
        return [text]

    chunks = []
    while text:
        if len(text) <= max_chars:
            chunks.append(text)
            break
        # Find a clean break point near the limit
        split_at = text.rfind("\n\n", 0, max_chars)
        if split_at == -1:
            split_at = text.rfind("\n", 0, max_chars)
        if split_at == -1:
            split_at = max_chars
        chunks.append(text[:split_at].strip())
        text = text[split_at:].strip()

    return [c for c in chunks if c]


def call_gemini(model, prompt: str) -> list[dict]:
    """Call Gemini with a prompt and parse the returned JSON array."""
    response = model.generate_content(
        prompt,
        generation_config={"response_mime_type": "application/json"},
        request_options={"timeout": 90},  # 90s hard timeout per chunk
    )
    raw = response.text.strip()

    # Strip markdown fences if model ignores mime_type hint
    raw = re.sub(r"^```(?:json)?", "", raw).strip()
    raw = re.sub(r"```$", "", raw).strip()

    return json.loads(raw)


def validate_questions(questions: list) -> list[dict]:
    """Validate and normalise question dicts returned by Gemini."""
    validated = []
    for q in questions:
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


# ── Main entry point ───────────────────────────────────────────────────────────

def extract_questions_with_gemini(pdf_bytes: bytes, test_name: str = "") -> list[dict]:
    """
    Send PDF content to Gemini and return a list of parsed question dicts.

    Strategy:
    1. Extract text via PyPDF2 (fast, no upload needed)
    2. If text is too large, split into chunks and call Gemini per chunk
    3. Falls back to binary upload if text extraction yields too little text
    """
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel(MODEL_NAME)

    # ── Step 1: Try text extraction ────────────────────────────────────────────
    try:
        pdf_text = pdf_bytes_to_text(pdf_bytes)
        if len(pdf_text.strip()) < 100:
            raise ValueError("Too little text — trying binary upload")
    except Exception:
        pdf_text = None

    # ── Step 2a: Text path (preferred — faster, no file upload) ───────────────
    if pdf_text:
        chunks = chunk_text(pdf_text)
        all_questions: list[dict] = []

        for i, chunk in enumerate(chunks):
            prompt = f"{SYSTEM_PROMPT}\n\nPDF Content (part {i+1}/{len(chunks)}):\n\n{chunk}"
            try:
                questions = call_gemini(model, prompt)
                all_questions.extend(validate_questions(questions))
            except Exception as e:
                raise ValueError(f"Gemini failed on chunk {i+1}: {e}")

        return all_questions

    # ── Step 2b: Binary upload fallback (scanned/image PDFs) ──────────────────
    import tempfile
    with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp:
        tmp.write(pdf_bytes)
        tmp_path = tmp.name

    try:
        uploaded = genai.upload_file(tmp_path, mime_type="application/pdf")
        response = model.generate_content(
            [SYSTEM_PROMPT, uploaded],
            generation_config={"response_mime_type": "application/json"},
            request_options={"timeout": 90},
        )
        raw = response.text.strip()
        raw = re.sub(r"^```(?:json)?", "", raw).strip()
        raw = re.sub(r"```$", "", raw).strip()
        questions = json.loads(raw)
        return validate_questions(questions)
    finally:
        os.unlink(tmp_path)
