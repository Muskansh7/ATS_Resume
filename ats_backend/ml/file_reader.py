import tempfile
from fastapi import UploadFile, HTTPException
from PyPDF2 import PdfReader
from pdf2image import convert_from_path
from PIL import Image
import pytesseract
import os

def extract_text(file: UploadFile) -> str:
    ext = file.filename.split(".")[-1].lower()

    with tempfile.NamedTemporaryFile(delete=False, suffix=f".{ext}") as tmp:
        tmp.write(file.file.read())
        path = tmp.name

    # ---------- TXT ----------
    if ext == "txt":
        return open(path, "r", encoding="utf-8", errors="ignore").read()

    # ---------- DOCX ----------
    if ext == "docx":
        from docx import Document
        doc = Document(path)
        return "\n".join(p.text for p in doc.paragraphs)

    # ---------- PDF (TRY NORMAL) ----------
    if ext == "pdf":
        text = ""
        try:
            reader = PdfReader(path)
            for page in reader.pages:
                text += page.extract_text() or ""
        except:
            pass

        if text.strip():
            return text

        # ---------- PDF OCR FALLBACK ----------
        images = convert_from_path(path)
        ocr_text = ""
        for img in images:
            ocr_text += pytesseract.image_to_string(img)

        return ocr_text.strip()

    # ---------- IMAGE OCR ----------
    if ext in ("png", "jpg", "jpeg"):
        img = Image.open(path)
        return pytesseract.image_to_string(img)

    raise HTTPException(
        status_code=400,
        detail="Unsupported file type"
    )
