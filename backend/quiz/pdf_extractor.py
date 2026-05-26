"""
PDF → Test extractor.

Priority order:
  1. Table parser (pdfplumber) — for PDFs with structured Q|A|B|C|D|Answer table
  2. Groq AI (llama-3.3-70b)  — for free-form / narrative PDFs
  3. Gemini 2.0-flash          — fallback if Groq fails
  4. Gemini binary upload      — for scanned/image PDFs (no text layer)
"""
import json, re, io, os, gc

GROQ_API_KEY   = os.environ.get("GROQ_API_KEY",   "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")
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "AIzaSyCzIVhXWwuHCbmFBF6OwVGAdi9NfEqCd0Y")

MAX_CHUNK_CHARS = 20_000
MAX_PDF_MB      = 20  # Hard limit to protect Render free-tier 512 MB RAM

# Letter → 0-based index map
LETTER_INDEX = {l: i for i, l in enumerate("ABCDEFGHIJ")}

SYSTEM_PROMPT = (
    "You are an exam paper parser. Extract ALL questions and return a JSON array ONLY "
    "(no markdown fences, no explanation, no extra text).\n\n"
    "CRITICAL RULES:\n"
    "1. Each answer option is ONE item in the list — NEVER split a single option into multiple items.\n"
    "   Example: 'Save and Merge' is ONE option, not two separate options.\n"
    "2. Strip only the leading letter prefix (A. B. C. D. or A) B) C) D)) from each option text.\n"
    "   Keep the full option text intact after stripping the prefix.\n"
    "3. 'answer' must be a list of 0-based indexes: A=0, B=1, C=2, D=3, E=4.\n"
    "   Example: if the correct answer is C, answer=[2]. If B and D, answer=[1,3].\n"
    "4. Do NOT guess or invent answers. Only use what is explicitly stated in the PDF.\n\n"
    "Each item must have exactly:\n"
    '  "question"    : string\n'
    '  "options"     : list of strings (one string per answer choice)\n'
    '  "answer"      : list of 0-based indexes of correct option(s)\n'
    '  "explanation" : brief string — generate one if missing\n'
    '  "multi"       : boolean (true only if multiple correct answers)\n\n'
    'Example: [{"question":"What is 2+2?","options":["3","4","5","6"],"answer":[1],"explanation":"2+2=4","multi":false}]\n\n'
    "Return ONLY a valid JSON array, nothing else."
)


# ── Helpers ─────────────────────────────────────────────────────────────────────

def validate_questions(questions: list) -> list:
    """Normalise and validate question dicts."""
    validated = []
    for q in questions:
        if not isinstance(q, dict) or not q.get("question"):
            continue
        
        # Parse and sanitize answer list
        raw_ans = q.get("answer", [0])
        if not isinstance(raw_ans, list):
            raw_ans = [raw_ans]
        ans_list = []
        for a in raw_ans:
            try:
                ans_list.append(int(a))
            except (ValueError, TypeError):
                pass
        if not ans_list:
            ans_list = [0]
            
        options = [str(o).strip() for o in q.get("options", [])]
        
        # Clamp indexes to valid range
        ans_list = [a for a in ans_list if a < len(options)]
        if not ans_list:
            ans_list = [0]
            
        is_multi = bool(q.get("multi")) or len(ans_list) > 1
        
        # Append "(Select N)" hint to multi-select questions if not already there
        question_text = str(q.get("question", "")).strip()
        if is_multi and len(ans_list) > 1 and "select" not in question_text.lower():
            question_text = f"{question_text} (Select {len(ans_list)})"
            
        validated.append({
            "question":    question_text,
            "options":     options,
            "answer":      ans_list,
            "explanation": str(q.get("explanation", "")).strip(),
            "multi":       is_multi,
        })
    return validated


def parse_json_response(raw: str):
    """Strip markdown fences and parse JSON — returns list or dict."""
    raw = raw.strip()
    raw = re.sub(r"^```(?:json)?", "", raw).strip()
    raw = re.sub(r"```$", "", raw).strip()
    return json.loads(raw)


def letters_to_indexes(answer_str: str) -> list:
    """
    Convert answer letter string to 0-based index list.
    e.g. 'B'      → [1]
         'A,B,C'  → [0,1,2]
         'B,C,D'  → [1,2,3]
    """
    indexes = []
    for part in re.split(r"[,\s]+", answer_str.strip().upper()):
        part = part.strip()
        if part in LETTER_INDEX:
            indexes.append(LETTER_INDEX[part])
    return indexes if indexes else [0]


def _join_cell(text: str) -> str:
    """
    Smart join of newlines inside a PDF table cell.
    Rule: if the accumulated text so far has NO spaces (it's a single identifier
    token like a camelCase method name), join the next line directly (no space).
    Otherwise it's a wrapped sentence — join with a space.
    """
    parts = [p.strip() for p in text.split('\n') if p.strip()]
    result = ''
    for part in parts:
        if not result:
            result = part
        elif ' ' not in result and result[-1].islower() and part[0].islower():
            result = result + part   # split camelCase word — join without space
        else:
            result = result + ' ' + part   # wrapped sentence — join with space
    return result.strip()


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


# ── Method 1: Table Parser (pdfplumber) ─────────────────────────────────────────

def _detect_col_structure(header: list):
    """
    Given a header row, return (q_col, option_cols, answer_col) or None.
    Handles both 'A/B/C/D' and 'Opt A/Opt B/Opt C/Opt D' column naming.
    """
    h = [str(c).strip().upper().replace("\n", " ") if c else "" for c in header]

    # Question column: prefer exact "QUESTION", else first cell containing it (not "NO"/"NUM")
    q_col = None
    for i, cell in enumerate(h):
        if cell == "QUESTION":
            q_col = i
            break
    if q_col is None:
        for i, cell in enumerate(h):
            if "QUESTION" in cell and "NO" not in cell and "NUM" not in cell:
                q_col = i
                break
    if q_col is None:
        return None

    # Option columns: match "A","B" OR "OPT A","OPT B" OR "OPTION A"
    option_cols = {}
    for letter in "ABCDEF":
        for i, cell in enumerate(h):
            if cell == letter or cell in (f"OPT {letter}", f"OPT{letter}", f"OPTION {letter}", f"OPTION{letter}"):
                option_cols[letter] = i
                break

    # Answer column
    answer_col = None
    for i, cell in enumerate(h):
        if cell in ("ANS", "KEY", "ANSWER") or "ANSWER" in cell or "CORRECT" in cell:
            answer_col = i
            break

    if len(option_cols) < 2 or answer_col is None:
        return None

    return q_col, option_cols, answer_col


def _is_valid_header(row: list) -> bool:
    """Returns True if this row looks like a table header (not a data row)."""
    if not row:
        return False
    h = [str(c).strip().upper().replace("\n", " ") if c else "" for c in row]
    has_question = any("QUESTION" in c for c in h)
    has_options  = (
        sum(1 for c in h if c in ("A", "B", "C", "D")) >= 2 or
        sum(1 for c in h if re.match(r"OPT\s*[A-F]|OPTION\s*[A-F]", c)) >= 2
    )
    return has_question and has_options


def extract_with_table(pdf_bytes: bytes) -> list:
    """
    Parse PDFs that use a structured Q/A/B/C/D table.
    Handles:
      - 'Question | A | B | C | D | Answer' format (demo PDF)
      - 'Question no | Question | Opt A | Opt B | ... | Ans' format (SSNF PDF)
      - Pages that don't repeat the header (carries structure from page 1)
    Memory-safe: processes one page at a time and closes each page after use.
    Returns [] if no valid table is found → triggers AI fallback.
    """
    try:
        import pdfplumber
    except ImportError:
        return []

    all_questions = []
    # Column structure discovered from the first valid header row
    col_structure = None   # (q_col, option_cols, answer_col)

    with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
        page_count = len(pdf.pages)
        for page_idx in range(page_count):
            # Access page by index and release after processing
            page = pdf.pages[page_idx]
            try:
                tables = page.extract_tables()
            except Exception:
                tables = []

            for table in tables:
                if not table:
                    continue

                # Determine start row: find header if present, else use saved structure
                data_start = 0
                for idx, row in enumerate(table):
                    if _is_valid_header(row):
                        structure = _detect_col_structure(row)
                        if structure:
                            col_structure = structure
                            data_start = idx + 1
                            break

                if col_structure is None:
                    continue   # Haven't found a valid table yet

                q_col, option_cols, answer_col = col_structure

                for row in table[data_start:]:
                    if not row or len(row) <= q_col or not row[q_col]:
                        continue

                    question_text = _join_cell(str(row[q_col]))
                    # Skip rows that are just headers or empty
                    if not question_text or question_text.upper() in ("QUESTION", "Q"):
                        continue

                    # Build options in order A, B, C, D, E, F — skip dash placeholders
                    options = []
                    for letter in sorted(option_cols.keys()):
                        col = option_cols[letter]
                        val = _join_cell(row[col]) if col < len(row) and row[col] else ""
                        if val and val != "-":   # '-' means no option exists
                            options.append(val)

                    if not options:
                        continue

                    raw_answer = str(row[answer_col]).replace("\n", " ").strip() if answer_col < len(row) and row[answer_col] else ""
                    answer_indexes = letters_to_indexes(raw_answer)

                    # Clamp indexes to valid range
                    answer_indexes = [a for a in answer_indexes if a < len(options)]
                    if not answer_indexes:
                        answer_indexes = [0]

                    is_multi = len(answer_indexes) > 1

                    # Append "(Select N)" hint to multi-select questions if not already there
                    q_display = question_text
                    if is_multi and "select" not in question_text.lower():
                        q_display = f"{question_text} (Select {len(answer_indexes)})"

                    # Auto-generate explanation from correct answer text
                    correct_parts = []
                    for idx in answer_indexes:
                        if idx < len(options):
                            letter = chr(65 + idx)
                            correct_parts.append(f"{letter}) {options[idx]}")
                    explanation = "Correct answer: " + ", ".join(correct_parts) if correct_parts else ""

                    all_questions.append({
                        "question":    q_display,
                        "options":     options,
                        "answer":      answer_indexes,
                        "explanation": explanation,
                        "multi":       is_multi,
                    })

            # Explicitly release the page object and collected tables to free RAM
            del page, tables
            gc.collect()

    # Generate real explanations via Groq in a single batch call
    if all_questions:
        try:
            _batch_generate_explanations(all_questions)
        except Exception as e:
            import logging
            logging.warning(f"Explanation generation skipped: {e}")
            # Keep the fallback "Correct answer: ..." explanations already set

    return all_questions


def _batch_generate_explanations(questions: list) -> None:
    """
    Calls Groq once with all Q+A pairs and fills in proper explanations in-place.
    Each explanation explains WHY the correct answer is right (1-2 sentences).
    """
    from groq import Groq
    client = Groq(api_key=GROQ_API_KEY)

    # Build a compact prompt listing all questions with their correct answers
    lines = ["For each question below, write a 1-2 sentence explanation of WHY the correct answer is right.",
             "Return a JSON array of strings — one explanation per question, in the same order.",
             "Return ONLY the JSON array, no other text.\n"]

    for i, q in enumerate(questions, 1):
        correct_opts = ", ".join(
            f"{chr(65+idx)}) {q['options'][idx]}"
            for idx in q["answer"] if idx < len(q["options"])
        )
        lines.append(f"{i}. Q: {q['question']}")
        lines.append(f"   Correct: {correct_opts}\n")

    prompt = "\n".join(lines)

    # Split into batches of 30 to avoid token limits
    BATCH = 30
    all_explanations = []
    q_list = questions[:]

    for start in range(0, len(q_list), BATCH):
        batch = q_list[start:start + BATCH]
        batch_lines = [
            "For each question below, write ONE short sentence explaining what the correct answer does or means.",
            "Style: direct and factual, like: 'The oldValue method retrieves the old value of a field in an onCellEdit script.'",
            "No intro like 'The correct answer is...'. Just the explanation sentence.",
            "Return a JSON array of strings — one per question in order. ONLY the JSON array.\n"
        ]
        for i, q in enumerate(batch, start + 1):
            correct_opts = ", ".join(
                f"{chr(65+idx)}) {q['options'][idx]}"
                for idx in q["answer"] if idx < len(q["options"])
            )
            batch_lines.append(f"{i}. Q: {q['question']}")
            batch_lines.append(f"   Correct: {correct_opts}\n")

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": "\n".join(batch_lines)}],
            timeout=60,
        )
        raw = response.choices[0].message.content
        parsed = parse_json_response(raw)
        if isinstance(parsed, list):
            all_explanations.extend(parsed)

    # Fill explanations back in-place
    for i, q in enumerate(questions):
        if i < len(all_explanations) and all_explanations[i]:
            q["explanation"] = str(all_explanations[i]).strip()


# ── Method 2: Groq AI ───────────────────────────────────────────────────────────

def extract_with_groq(chunks: list) -> list:
    """Use Groq (llama-3.3-70b) to extract questions from free-form text."""
    from groq import Groq
    client = Groq(api_key=GROQ_API_KEY)
    all_questions = []

    for i, chunk in enumerate(chunks):
        prompt = f"{SYSTEM_PROMPT}\n\nPDF Content (part {i+1}/{len(chunks)}):\n\n{chunk}"
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            timeout=60,
        )
        raw = response.choices[0].message.content
        data = parse_json_response(raw)
        if isinstance(data, dict):
            questions = next((v for v in data.values() if isinstance(v, list)), [])
        else:
            questions = data
        all_questions.extend(validate_questions(questions))

    return all_questions


# ── Gemini quota/rate-limit helper ──────────────────────────────────────────────

def _is_quota_error(exc: Exception) -> bool:
    """
    Returns True if the exception is a Gemini 429 / ResourceExhausted / quota error.
    Works for both the old google-generativeai SDK and the newer google-genai SDK.
    """
    msg = str(exc).lower()
    return (
        "429" in msg
        or "quota" in msg
        or "resource_exhausted" in msg
        or "resourceexhausted" in msg
        or "rate" in msg and "limit" in msg
    )


# ── Method 3: Gemini fallback ───────────────────────────────────────────────────

def extract_with_gemini(chunks: list) -> list:
    """Use Gemini 2.0-flash as fallback if Groq fails."""
    import google.generativeai as genai
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel("gemini-2.0-flash")
    all_questions = []

    for i, chunk in enumerate(chunks):
        prompt = f"{SYSTEM_PROMPT}\n\nPDF Content (part {i+1}/{len(chunks)}):\n\n{chunk}"
        try:
            response = model.generate_content(
                prompt,
                generation_config={"response_mime_type": "application/json"},
                request_options={"timeout": 90},
            )
        except Exception as e:
            if _is_quota_error(e):
                raise ValueError(
                    "Gemini API daily quota exhausted. "
                    "Please try again tomorrow, or use a text-based (non-scanned) PDF "
                    "so Groq can process it instead."
                ) from e
            raise
        questions = parse_json_response(response.text)
        all_questions.extend(validate_questions(questions))

    return all_questions


# ── Method 4: Gemini binary (scanned PDFs) ──────────────────────────────────────

def extract_with_gemini_binary(pdf_bytes: bytes) -> list:
    """Upload PDF directly to Gemini for scanned/image-based PDFs."""
    import google.generativeai as genai, tempfile
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel("gemini-2.0-flash")

    with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp:
        tmp.write(pdf_bytes)
        tmp_path = tmp.name
    try:
        try:
            uploaded = genai.upload_file(tmp_path, mime_type="application/pdf")
            response = model.generate_content(
                [SYSTEM_PROMPT, uploaded],
                generation_config={"response_mime_type": "application/json"},
                request_options={"timeout": 90},
            )
        except Exception as e:
            if _is_quota_error(e):
                raise ValueError(
                    "This PDF appears to be scanned/image-based (no selectable text). "
                    "Processing it requires Gemini Vision, but the free-tier daily quota is exhausted.\n"
                    "Options:\n"
                    "  1. Try again tomorrow (quota resets daily).\n"
                    "  2. Use a text-based PDF instead (e.g. export from Word/PowerPoint).\n"
                    "  3. Use an OCR tool (e.g. Adobe Acrobat, Smallpdf) to convert the scanned PDF to text first."
                ) from e
            raise
        return validate_questions(parse_json_response(response.text))
    finally:
        os.unlink(tmp_path)


# ── Main entry point ─────────────────────────────────────────────────────────────

def extract_questions_with_gemini(pdf_bytes: bytes, test_name: str = "") -> list:
    """
    Extract questions from PDF bytes.

    Flow:
      1. File-size guard              — reject PDFs > MAX_PDF_MB to protect server RAM
      2. Try pdfplumber table parser  — perfect for Q|A|B|C|D|Answer table PDFs
      3. Try Groq (llama-3.3-70b)    — for free-form/narrative PDFs
      4. Fall back to Gemini          — if Groq fails
      5. Gemini binary upload         — for scanned/image PDFs (no text layer)
    """
    import logging
    logger = logging.getLogger(__name__)

    # Step 0: Reject oversized PDFs before any parsing (protects 512 MB Render RAM)
    pdf_mb = len(pdf_bytes) / (1024 * 1024)
    if pdf_mb > MAX_PDF_MB:
        raise ValueError(
            f"PDF is {pdf_mb:.1f} MB — exceeds the {MAX_PDF_MB} MB limit. "
            "Please split the PDF into smaller parts before uploading."
        )

    # Step 1: Try table parser first (fast, accurate, no AI needed)
    try:
        table_questions = extract_with_table(pdf_bytes)
        if table_questions:
            logger.info(f"Table parser: extracted {len(table_questions)} questions")
            return table_questions
        logger.info("Table parser: no table found, falling back to AI")
    except Exception as e:
        logger.warning(f"Table parser failed: {e}")
    finally:
        gc.collect()   # free pdfplumber memory before next stage

    # Step 2: Check if PDF has extractable text — process page-by-page to save RAM
    pdf_text = None
    has_text = False
    try:
        import PyPDF2
        reader = PyPDF2.PdfReader(io.BytesIO(pdf_bytes))
        text_parts = []
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text_parts.append(page_text)
            del page_text   # release immediately
        pdf_text = "\n\n".join(text_parts)
        del text_parts
        has_text = len(pdf_text.strip()) >= 100
        del reader
        gc.collect()
    except Exception:
        pdf_text = None
        has_text = False

    if has_text:
        chunks = chunk_text(pdf_text)
        del pdf_text   # free full text — only need chunks now
        gc.collect()

        # Step 3a: Groq
        try:
            return extract_with_groq(chunks)
        except Exception as groq_err:
            logger.warning(f"Groq failed, falling back to Gemini: {groq_err}")

        # Step 3b: Gemini text fallback
        return extract_with_gemini(chunks)

    # Step 4: Scanned/image PDF
    return extract_with_gemini_binary(pdf_bytes)
