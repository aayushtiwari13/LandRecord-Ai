"""
engine.py
---------
Core OCR engine. Wraps PaddleOCR and exposes a clean, minimal interface:

    ocr_image(image) -> OCRResult

PaddleOCR is loaded once (lazily) and reused across calls — re-initializing
it per request is slow and unnecessary.
"""

import logging
from typing import Optional

import numpy as np

from .schemas import OCRBlock, OCRResult, error_result, success_result

logger = logging.getLogger("m5.ocr.engine")

_ocr_instance = None  # lazy singleton


def _get_ocr(lang: str = "en"):
    """
    Lazily initialize and cache a PaddleOCR instance.

    lang: 'en' for English, 'hi' for Hindi. PaddleOCR ships separate
    language models; for MVP we pick a language per call rather than
    trying to auto-detect script.
    """
    global _ocr_instance
    if _ocr_instance is None or _ocr_instance[0] != lang:
        from paddleocr import PaddleOCR  # imported lazily so the module
        # can be imported even in environments where paddleocr isn't
        # installed yet (e.g. during early scaffolding/testing).
        logger.info(f"Initializing PaddleOCR (lang={lang})")
        instance = PaddleOCR(use_angle_cls=True, lang=lang, show_log=False)
        _ocr_instance = (lang, instance)
    return _ocr_instance[1]


def ocr_image(image: np.ndarray, lang: str = "en") -> OCRResult:
    """
    Run OCR on a single preprocessed image (numpy array, grayscale or BGR).

    Returns a standardized OCRResult:
        { "success": True, "text": "...", "confidence": 0.94, "blocks": [...] }
    or on failure:
        { "success": False, "error": "..." }
    """
    if image is None or image.size == 0:
        return error_result("Empty image provided to OCR engine")

    try:
        ocr = _get_ocr(lang)
        raw_result = ocr.ocr(image, cls=True)
    except Exception as exc:
        logger.exception("PaddleOCR failed")
        return error_result(f"OCR engine failure: {exc}")

    if not raw_result or raw_result[0] is None:
        return error_result("No text detected in document")

    blocks: list[OCRBlock] = []
    lines: list[str] = []
    confidences: list[float] = []

    for line in raw_result[0]:
        box, (text, conf) = line
        if not text or not text.strip():
            continue
        xs = [p[0] for p in box]
        ys = [p[1] for p in box]
        bbox = [int(min(xs)), int(min(ys)), int(max(xs)), int(max(ys))]

        blocks.append({"text": text, "confidence": round(float(conf), 4), "bbox": bbox})
        lines.append(text)
        confidences.append(float(conf))

    if not lines:
        return error_result("No text detected in document")

    full_text = "\n".join(lines)
    overall_confidence = sum(confidences) / len(confidences)

    return success_result(text=full_text, confidence=overall_confidence, blocks=blocks)


def detect_language_hint(image: np.ndarray) -> str:
    """
    Placeholder for language selection. For MVP we default to English and
    let the caller pass lang='hi' explicitly for known-Hindi documents, or
    try both and keep the higher-confidence result (see pdf_processor.py /
    extract_text for that fallback pattern). Real script-detection is out
    of scope for the prototype.
    """
    return "en"
