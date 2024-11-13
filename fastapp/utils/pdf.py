from PyPDF2 import PdfReader
from fastapi import UploadFile
import io
import re

async def extract_text_from_pdf(file: UploadFile) -> str:
    """Extract text from uploaded PDF file"""
    pdf_content = await file.read()
    
    # Create a PDF reader object
    reader = PdfReader(io.BytesIO(pdf_content))
    
    # Extract text from all pages
    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n"
    
    # Clean up text
    text = re.sub(r'\s+', ' ', text)
    return text.strip() 