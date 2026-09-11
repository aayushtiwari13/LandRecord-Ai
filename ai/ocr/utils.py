"""
utils.py
--------
File-type detection and the top-level extract_text() entry point that
M2 (backend) will call.
"""

import logging
import os

import cv2
import numpy as np

from .engine import ocr_image
from .pdf_processor import ocr_pdf
from .preprocess import preprocess_image
from .schemas import OCRResult, error_result

logger = logging.getLogger("m5.ocr.utils")

SUPPORTED_IMAGE_EXTS = {".jpg", ".jpeg", ".png"}
SUPPORTED_PDF_EXTS = {".pdf"}


def detect_file_type(file_path: str) -> str:
    """Return 'image', 'pdf', or 'unsupported' based on file extension."""
    ext = os.path.splitext(file_path)[1].lower()
    if ext in SUPPORTED_IMAGE_EXTS:
        return "image"
    if ext in SUPPORTED_PDF_EXTS:
        return "pdf"
    return "unsupported"


def ocr_image_file(image_path: str, lang: str = "en", preprocess: bool = True) -> OCRResult:
    """Load an image file from disk and run OCR on it."""
    image = cv2.imread(image_path)
    if image is None:
        return error_result(f"Could not read image file: {image_path}")

    proc_image = preprocess_image(image) if preprocess else image
    return ocr_image(proc_image, lang=lang)


def extract_text(file_path: str, lang: str = "en", preprocess: bool = True) -> OCRResult:
    """
    Main M5 entry point. M2 calls this with a path to an uploaded document.

    Args:
        file_path: path to a .pdf, .jpg, .jpeg, or .png file
        lang: 'en' or 'hi' (PaddleOCR language model to use)
        preprocess: whether to run the default preprocessing chain

    Returns a standardized OCRResult dict (see schemas.py):
        { "success": True, "text": "...", "confidence": 0.94, ... }
        { "success": False, "error": "..." }
    """
    if not os.path.exists(file_path):
        return error_result(f"File not found: {file_path}")

    file_type = detect_file_type(file_path)
    logger.info(f"Document received: {file_path} (type={file_type})")

    if file_type == "unsupported":
        return error_result(f"Unsupported file format: {file_path}")

    try:
        if file_type == "pdf":
            result = ocr_pdf(file_path, lang=lang, preprocess=preprocess)
        else:
            result = ocr_image_file(file_path, lang=lang, preprocess=preprocess)
    except Exception as exc:
        logger.exception("Unexpected OCR failure")
        return error_result(f"Unexpected OCR failure: {exc}")

    if result.get("success"):
        logger.info(
            f"OCR completed. Average confidence: {result.get('confidence')}, "
            f"characters extracted: {len(result.get('text', ''))}"
        )
    return result


def extract_text_bilingual(file_path: str, preprocess: bool = True) -> OCRResult:
    """
    Convenience helper for mixed Hindi/English documents: runs OCR with
    both language models and keeps whichever result has higher confidence.
    Simple and effective for MVP — avoids the complexity of true script
    detection.
    """
    result_en = extract_text(file_path, lang="en", preprocess=preprocess)
    result_hi = extract_text(file_path, lang="hi", preprocess=preprocess)

    candidates = [r for r in (result_en, result_hi) if r.get("success")]
    if not candidates:
        return result_en  # return the English error for consistency

    return max(candidates, key=lambda r: r.get("confidence", 0))
