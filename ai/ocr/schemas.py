"""
schemas.py
----------
Standardized OCR result shape. M6 depends on this contract staying stable.

M5 gives raw text + confidence (+ optional blocks). M5 must NOT return
structured land-record fields (owner_name, khasra_number, etc.) — that is
M6's job.
"""

from typing import List, Optional, TypedDict


class OCRBlock(TypedDict):
    text: str
    confidence: float
    bbox: List[int]  # [x_min, y_min, x_max, y_max]


class OCRPageResult(TypedDict, total=False):
    page: int
    text: str
    confidence: float
    blocks: List[OCRBlock]


class OCRResult(TypedDict, total=False):
    success: bool
    text: str
    confidence: float
    blocks: List[OCRBlock]
    pages: List[OCRPageResult]
    overall_confidence: float
    error: str


def success_result(
    text: str,
    confidence: float,
    blocks: Optional[List[OCRBlock]] = None,
    pages: Optional[List[OCRPageResult]] = None,
) -> OCRResult:
    result: OCRResult = {
        "success": True,
        "text": text,
        "confidence": round(confidence, 4),
    }
    if blocks is not None:
        result["blocks"] = blocks
    if pages is not None:
        result["pages"] = pages
        result["overall_confidence"] = round(confidence, 4)
    return result


def error_result(message: str) -> OCRResult:
    return {"success": False, "error": message}
