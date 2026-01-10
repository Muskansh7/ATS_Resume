import pdfplumber
import docx
import pytesseract
from PIL import Image
import fitz  # PyMuPDF
import io

def extract_text(file_bytes, filename):
    ext = filename.split(".")[-1].lower()

    # ---------- DOCX ----------
    if ext == "docx":
        doc = docx.Document(io.BytesIO(file_bytes))
        return "\n".join(p.text for p in doc.paragraphs)

    # ---------- PDF ----------
    if ext == "pdf":
        text = ""

        # Try text-based extraction first
        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            for page in pdf.pages:
                text += page.extract_text() or ""

        # If text is too small → OCR fallback
        if len(text.strip()) < 100:
            doc = fitz.open(stream=file_bytes, filetype="pdf")
            for page in doc:
                pix = page.get_pixmap(dpi=300)
                img = Image.open(io.BytesIO(pix.tobytes("png")))
                text += pytesseract.image_to_string(img)

        return text

    # ---------- IMAGE ----------
    if ext in ["jpg", "jpeg", "png"]:
        img = Image.open(io.BytesIO(file_bytes))
        return pytesseract.image_to_string(img)

    return ""
