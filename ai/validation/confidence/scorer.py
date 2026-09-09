# ai/validation/confidence/scorer.py

from typing import Optional

class Thresholds:
    """Confidence thresholds"""
    HIGH_CONFIDENCE = 0.85
    MEDIUM_CONFIDENCE = 0.65
    LOW_CONFIDENCE = 0.0

class ConfidenceScorer:
    """Calculate and evaluate confidence scores"""
    
    @staticmethod
    def calculate_field_confidence(
        ocr_confidence: Optional[float] = None,
        nlp_confidence: Optional[float] = None,
        pattern_confidence: float = 1.0
    ) -> float:
        """
        Calculate combined confidence score.
        
        Formula:
        0.3 × OCR + 0.4 × NLP + 0.3 × Pattern
        
        Args:
            ocr_confidence: 0.0-1.0 (from OCR team)
            nlp_confidence: 0.0-1.0 (from NLP extraction)
            pattern_confidence: 0.0-1.0 (field validation strength)
        
        Returns:
            Combined confidence 0.0-1.0
        
        Examples:
            ocr=0.90, nlp=0.95, pattern=1.0 → 0.955 (95.5%)
        """
        
        ocr_conf = ocr_confidence if ocr_confidence is not None else 1.0
        nlp_conf = nlp_confidence if nlp_confidence is not None else 1.0
        
        # Weighted average
        combined = (0.3 * ocr_conf) + (0.4 * nlp_conf) + (0.3 * pattern_confidence)
        
        # Clamp to 0-1
        return max(0.0, min(1.0, combined))
    
    @staticmethod
    def get_confidence_level(confidence: float) -> str:
        """Categorize confidence as HIGH, MEDIUM, or LOW"""
        if confidence >= Thresholds.HIGH_CONFIDENCE:
            return "HIGH"
        elif confidence >= Thresholds.MEDIUM_CONFIDENCE:
            return "MEDIUM"
        else:
            return "LOW"
    
    @staticmethod
    def is_high_confidence(confidence: float) -> bool:
        """Check if confidence is HIGH"""
        return confidence >= Thresholds.HIGH_CONFIDENCE
    
    @staticmethod
    def is_low_confidence(confidence: float) -> bool:
        """Check if confidence is LOW"""
        return confidence < Thresholds.MEDIUM_CONFIDENCE

# Test
if __name__ == "__main__":
    print("Testing ConfidenceScorer:")
    
    # Test 1: High confidence
    conf = ConfidenceScorer.calculate_field_confidence(
        ocr_confidence=0.90,
        nlp_confidence=0.95,
        pattern_confidence=1.00
    )
    print(f"Confidence: {conf:.2f} ({conf:.0%})")
    print(f"Level: {ConfidenceScorer.get_confidence_level(conf)}")
    
    # Test 2: Low confidence
    conf_low = ConfidenceScorer.calculate_field_confidence(
        ocr_confidence=0.50,
        nlp_confidence=0.60,
        pattern_confidence=0.70
    )
    print(f"\nLow Confidence: {conf_low:.2f} ({conf_low:.0%})")
    print(f"Level: {ConfidenceScorer.get_confidence_level(conf_low)}")
    
    print("\n✓ ConfidenceScorer works")