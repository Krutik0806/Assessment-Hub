"""
Gemini PDF → Test extractor.

Primary:  Groq (llama-3.3-70b) — extremely fast, free tier
Fallback: Gemini 1.5-flash     — if Groq fails or is rate-limited

Usage: PUT this file at  quiz/pdf_extractor.py
"""
import json, re, io, os

GROQ_API_KEY   = os.environ.get("GROQ_API_KEY",   "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")
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "AIzaSyCzIVhXWwuHCbmFBF6OwVGAdi9NfEqCd0Y")

# Max characters to send per chunk (keeps each request fast)
MAX_CHUNK_CHARS = 20_000

SYSTEM_PROMPT = (
    "You are an exam paper parser. Extract ALL questions from the text and return a JSON array ONLY "
    "(no markdown fences, no explanation, no extra text).\n\n"
    "Each item must have exactly these fields:\n"
    '  "question"    : string\n'
    '  "options"     : list of strings (strip letter prefixes A. B. etc.)\n'
    '  "answer"      : list of 0-based indexes of correct option(s)\n'
    '  "explanation" : brief string — generate one if missing\n'
    '  "multi"       : boolean (true if multiple correct answers)\n\n'
    "Return ONLY a valid JSON array."
)


# ── Text extraction ────────────────────────────────────────────────────────────

def pdf_bytes_to_text(pdf_bytes: bytes) -> str:
    """Extract plain text from PDF bytes using PyPDF2."""
    try:
        import PyPDF2
        reader = PyPDF2.PdfReader(io.BytesIO(pdf_bytes))
        pages = [page.extract_text() for page in reader.pages if page.extract_text()]
        return "\n\n".join(pages)
    except Exception as e:
        raise ValueError(f"Failed to read PDF: {e}")


def chunk_text(text: str, max_chars: int = MAX_CHUNK_CHARS) -> list:
    """Split large text into chunks at paragraph boundaries."""
    if len(text) <= max_chars:
        return [text]
    chunks = []
    while text:
        if len(text) <= max_chars:
            chunks.append(text)
            break
        split_at = text.rfind("\n\n", 0, max_chars)
        if split_at == -1:
            split_at = text.rfind("\n", 0, max_chars)
        if split_at == -1:
            split_at = max_chars
        chunks.append(text[:split_at].strip())
        text = text[split_at:].strip()
    return [c for c in chunks if c]


def validate_questions(questions: list) -> list:
    """Normalise and validate question dicts."""
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


def parse_json_response(raw: str) -> list:
    """Strip markdown fences and parse JSON."""
    raw = raw.strip()
    raw = re.sub(r"^```(?:json)?", "", raw).strip()
    raw = re.sub(r"```$", "", raw).strip()
    return json.loads(raw)


# ── Groq (primary) ─────────────────────────────────────────────────────────────

def extract_with_groq(chunks: list) -> list:
    """Use Groq (llama-3.3-70b) to extract questions — fast and free."""
    from groq import Groq
    client = Groq(api_key=GROQ_API_KEY)
    all_questions = []

    for i, chunk in enumerate(chunks):
        prompt = f"{SYSTEM_PROMPT}\n\nPDF Content (part {i+1}/{len(chunks)}):\n\n{chunk}"
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            # No response_format — let model return plain JSON array as instructed in prompt
            timeout=60,
        )
        raw = response.choices[0].message.content
        # parse_json_response strips fences AND parses JSON — returns list or dict
        data = parse_json_response(raw)
        if isinstance(data, dict):
            # Unwrap if model returned {"questions": [...]}
            questions = next((v for v in data.values() if isinstance(v, list)), [])
        else:
            questions = data  # Already a list
        all_questions.extend(validate_questions(questions))

    return all_questions


# ── Gemini (fallback) ──────────────────────────────────────────────────────────

def extract_with_gemini(chunks: list) -> list:
    """Use Gemini 2.0-flash as fallback if Groq fails."""
    import google.generativeai as genai
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel("gemini-2.0-flash")
    all_questions = []

    for i, chunk in enumerate(chunks):
        prompt = f"{SYSTEM_PROMPT}\n\nPDF Content (part {i+1}/{len(chunks)}):\n\n{chunk}"
        response = model.generate_content(
            prompt,
            generation_config={"response_mime_type": "application/json"},
            request_options={"timeout": 90},
        )
        questions = parse_json_response(response.text)
        all_questions.extend(validate_questions(questions))

    return all_questions


# ── Binary PDF fallback (scanned/image PDFs) ───────────────────────────────────

def extract_with_gemini_binary(pdf_bytes: bytes) -> list:
    """Upload PDF directly to Gemini for scanned/image-based PDFs."""
    import google.generativeai as genai, tempfile
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel("gemini-2.0-flash")

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
        return validate_questions(parse_json_response(response.text))
    finally:
        os.unlink(tmp_path)


# ── Main entry point ───────────────────────────────────────────────────────────

def extract_questions_with_gemini(pdf_bytes: bytes, test_name: str = "") -> list:
    """
    Extract questions from PDF bytes.

    Flow:
      1. Extract text via PyPDF2
      2a. Try Groq (llama-3.3-70b) — fastest
      2b. Fall back to Gemini 1.5-flash if Groq fails
      3.  If no text (scanned PDF), upload binary to Gemini
    """
    # Step 1: text extraction
    try:
        pdf_text = pdf_bytes_to_text(pdf_bytes)
        has_text = len(pdf_text.strip()) >= 100
    except Exception:
        pdf_text = None
        has_text = False

    if has_text:
        chunks = chunk_text(pdf_text)

        # Step 2a: Try Groq first
        try:
            return extract_with_groq(chunks)
        except Exception as groq_err:
            import logging
            logging.warning(f"Groq failed, falling back to Gemini: {groq_err}")

        # Step 2b: Gemini fallback
        return extract_with_gemini(chunks)

    # Step 3: scanned/image PDF — binary upload to Gemini
    return extract_with_gemini_binary(pdf_bytes)
