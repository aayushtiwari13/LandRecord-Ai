"""
preprocess.py
----------------
PDF -> page images -> OCR each page -> combine text.

Uses PyMuPDF (fitz) to rasterize pages, so we never depend on the PDF
having a text layer (handles pure scanned/image-only PDFs correctly).
"""

import logging
from typing import List

import fitz  # PyMuPDF
import numpy as np

from .engine import ocr_image
from .schemas import OCRPageResult, OCRResult, error_result, success_result

logger = logging.getLogger("m5.ocr.pdf_processor")

DEFAULT_DPI = 300


def pdf_to_images(pdf_path: str, dpi: int = DEFAULT_DPI) -> List[np.ndarray]:
    """Rasterize every page of a PDF into a list of numpy (RGB) images."""
    images: List[np.ndarray] = []
    zoom = dpi / 72  # PyMuPDF's default rendering is at 72 DPI
    matrix = fitz.Matrix(zoom, zoom)

    with fitz.open(pdf_path) as doc:
        logger.info(f"PDF pages detected: {doc.page_count}")
        for page in doc:
            pix = page.get_pixmap(matrix=matrix)
            img = np.frombuffer(pix.samples, dtype=np.uint8).reshape(pix.height, pix.width, pix.n)
            if pix.n == 4:  # RGBA -> RGB
                img = img[:, :, :3]
            images.append(img)

    return images


def ocr_pdf(pdf_path: str, lang: str = "en", preprocess: bool = True) -> OCRResult:
    """
    Run OCR over every page of a PDF and return combined + per-page results.

    Output shape:
    {
      "success": True,
      "text": "--- PAGE 1 ---\\n...\\n--- PAGE 2 ---\\n...",
      "confidence": 0.91,           # overall (mean of page confidences)
      "pages": [ {page, text, confidence}, ... ]
    }
    """
    try:
        page_images = pdf_to_images(pdf_path)
    except Exception as exc:
        logger.exception("Failed to open/rasterize PDF")
        return error_result(f"Corrupt or unreadable PDF: {exc}")

    if not page_images:
        return error_result("PDF contains no pages")

    from .preprocess import preprocess_image  # local import to avoid a hard
    # dependency on OpenCV for callers that only need pdf_to_images

    combined_parts: List[str] = []
    page_results: List[OCRPageResult] = []
    confidences: List[float] = []

    for idx, image in enumerate(page_images, start=1):
        proc_image = preprocess_image(image) if preprocess else image
        result = ocr_image(proc_image, lang=lang)

        if not result.get("success"):
            logger.warning(f"Page {idx}: OCR failed - {result.get('error')}")
            page_text = ""
            page_conf = 0.0
        else:
            page_text = result["text"]
            page_conf = result["confidence"]
            confidences.append(page_conf)

        combined_parts.append(f"--- PAGE {idx} ---\n\n{page_text}")
        page_results.append({"page": idx, "text": page_text, "confidence": page_conf})

    if not confidences:
        return error_result("No text detected in any page of the document")

    combined_text = "\n\n".join(combined_parts)
    overall_confidence = sum(confidences) / len(confidences)

    return success_result(
        text=combined_text,
        confidence=overall_confidence,
        pages=page_results,
    )
