from PyPDF2 import PdfReader
import tempfile
from typing import Union
from fastapi import UploadFile

async def extract_text_simple(uploaded_file: UploadFile) -> str:
    ext = uploaded_file.filename.split(".")[-1].lower()
    with tempfile.NamedTemporaryFile(delete=False, suffix=f".{ext}") as tmp:
        content = await uploaded_file.read()
        tmp.write(content)
        tmp_path = tmp.name

    if ext == "pdf":
        try:
            reader = PdfReader(tmp_path)
            text = ""
            for p in reader.pages:
                text += p.extract_text() or ""
            return text.strip()
        finally:
            try: 
                pass
            except: 
                pass
    elif ext in ("txt", "text"):
        with open(tmp_path, "r", encoding="utf-8", errors="ignore") as f:
            return f.read()
    else:
        # Optionally handle DOCX if python-docx installed
        try:
            from docx import Document
            doc = Document(tmp_path)
            return "\n".join([p.text for p in doc.paragraphs])
        except Exception:
            raise ValueError("Unsupported file type. Use PDF, TXT or DOCX.")
