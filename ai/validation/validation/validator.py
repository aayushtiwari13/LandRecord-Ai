# ai/validation/validation/validator.py

from typing import List, Dict, Optional
from .normalizer import Normalizer, FieldName as NormalizerFieldName
from .rules import ValidationRules, ValidationStatus, FieldName as RulesFieldName

class FieldName:
    """Field names"""
    OWNER_NAME = "owner_name"
    KHASRA_NUMBER = "khasra_number"
    KHATA_NUMBER = "khata_number"
    AREA = "area"
    VILLAGE = "village"
    TEHSIL = "tehsil"
    DISTRICT = "district"
    CLASSIFICATION = "classification"

class RecordStatus:
    """Record statuses"""
    VALIDATED = "VALIDATED"
    VERIFICATION_REQUIRED = "VERIFICATION_REQUIRED"
    NOT_VALIDATED = "NOT_VALIDATED"

class Thresholds:
    """Thresholds"""
    HIGH_CONFIDENCE = 0.85
    MEDIUM_CONFIDENCE = 0.65

class ConfidenceScorer:
    """Confidence scoring"""
    @staticmethod
    def calculate_field_confidence(
        ocr_confidence: Optional[float] = None,
        nlp_confidence: Optional[float] = None,
        pattern_confidence: float = 1.0
    ) -> float:
        ocr_conf = ocr_confidence if ocr_confidence is not None else 1.0
        nlp_conf = nlp_confidence if nlp_confidence is not None else 1.0
        combined = (0.3 * ocr_conf) + (0.4 * nlp_conf) + (0.3 * pattern_confidence)
        return max(0.0, min(1.0, combined))
    
    @staticmethod
    def is_low_confidence(confidence: float) -> bool:
        return confidence < Thresholds.MEDIUM_CONFIDENCE

class FieldResult:
    """Result for a single field"""
    def __init__(self, field_name, extracted_value, reference_value, validation_status, confidence=None, reason=None):
        self.field_name = field_name
        self.extracted_value = extracted_value
        self.reference_value = reference_value
        self.validation_status = validation_status
        self.confidence = confidence
        self.reason = reason

class ValidationResult:
    """Complete validation result"""
    def __init__(self, record_status, fields, record_id=None, overall_confidence=None, requires_verification=False, reason=None):
        self.record_status = record_status
        self.fields = fields
        self.record_id = record_id
        self.overall_confidence = overall_confidence
        self.requires_verification = requires_verification
        self.reason = reason

class LandRecordValidator:
    """Main validation engine"""
    
    def validate_record(self, extracted: Dict, reference: Dict, record_id: Optional[str] = None, ocr_confidence: Optional[float] = None) -> ValidationResult:
        """
        Complete validation of a land record.
        
        Args:
            extracted: Dict with fields like {"owner_name": {"value": "...", "confidence": 0.98}}
            reference: Dict with reference values like {"owner_name": "Ramesh Kumar"}
            record_id: Optional record ID
            ocr_confidence: Overall OCR confidence
        
        Returns:
            ValidationResult with all field validations and decision
        """
        
        field_results = []
        
        # Iterate through all extracted fields
        for field_name, field_data in extracted.items():
            extracted_value = field_data.get("value") if isinstance(field_data, dict) else field_data
            extracted_confidence = field_data.get("confidence") if isinstance(field_data, dict) else None
            
            # Get reference value
            reference_value = reference.get(field_name)
            
            # Normalize values
            normalized_extracted = Normalizer.normalize_field(field_name, extracted_value)
            normalized_reference = Normalizer.normalize_field(field_name, reference_value)
            
            # Compare
            validation_status, reason = ValidationRules.compare_values(
                field_name,
                normalized_extracted,
                normalized_reference
            )
            
            # Calculate confidence
            field_confidence = ConfidenceScorer.calculate_field_confidence(
                ocr_confidence=ocr_confidence,
                nlp_confidence=extracted_confidence
            )
            
            # Create field result
            field_result = FieldResult(
                field_name=field_name,
                extracted_value=extracted_value,
                reference_value=reference_value,
                validation_status=validation_status,
                confidence=field_confidence,
                reason=reason
            )
            
            field_results.append(field_result)
        
        # Determine overall record status
        record_status, requires_verification, overall_reason = self._determine_record_status(field_results)
        
        # Calculate overall confidence
        confidences = [f.confidence for f in field_results if f.confidence is not None]
        overall_confidence = sum(confidences) / len(confidences) if confidences else None
        
        return ValidationResult(
            record_status=record_status,
            fields=field_results,
            record_id=record_id,
            overall_confidence=overall_confidence,
            requires_verification=requires_verification,
            reason=overall_reason
        )
    
    def _determine_record_status(self, field_results: List[FieldResult]) -> tuple:
        """
        Determine overall record status.
        
        Rules:
        - If critical field is MISMATCH → VERIFICATION_REQUIRED
        - If critical field is NOT_FOUND → VERIFICATION_REQUIRED
        - If any field has LOW confidence → VERIFICATION_REQUIRED
        - Otherwise → VALIDATED
        """
        
        for field_result in field_results:
            # Check if critical field has issues
            if self._is_critical_field(field_result.field_name):
                if field_result.validation_status == ValidationStatus.MISMATCH:
                    return (
                        RecordStatus.VERIFICATION_REQUIRED,
                        True,
                        f"Critical field '{field_result.field_name}' has mismatch"
                    )
                
                if field_result.validation_status == ValidationStatus.NOT_FOUND:
                    return (
                        RecordStatus.VERIFICATION_REQUIRED,
                        True,
                        f"Critical field '{field_result.field_name}' not found"
                    )
            
            # Check confidence
            if field_result.confidence and ConfidenceScorer.is_low_confidence(field_result.confidence):
                return (
                    RecordStatus.VERIFICATION_REQUIRED,
                    True,
                    f"Low confidence in field '{field_result.field_name}'"
                )
        
        # All checks passed
        return (
            RecordStatus.VALIDATED,
            False,
            "All fields validated successfully"
        )
    
    def _is_critical_field(self, field_name: str) -> bool:
        """Check if field is critical"""
        critical = [
            FieldName.OWNER_NAME,
            FieldName.KHASRA_NUMBER,
            FieldName.AREA,
            FieldName.VILLAGE,
            FieldName.DISTRICT
        ]
        return field_name in critical

# Test
if __name__ == "__main__":
    print("Testing LandRecordValidator:")
    
    # Test data
    extracted = {
        "owner_name": {"value": "Ramesh Kumar", "confidence": 0.98},
        "khasra_number": {"value": "125/2", "confidence": 0.96},
        "area": {"value": "2.50 Acre", "confidence": 0.91},
        "village": {"value": "Rampur", "confidence": 0.98},
        "district": {"value": "Meerut", "confidence": 0.99},
    }
    
    reference = {
        "owner_name": "Ramesh Kumar",
        "khasra_number": "125/2",
        "area": "2.50 Acre",
        "village": "Rampur",
        "district": "Meerut"
    }
    
    # Validate
    validator = LandRecordValidator()
    result = validator.validate_record(extracted, reference, record_id="TEST001", ocr_confidence=0.92)
    
    print(f"Status: {result.record_status}")
    print(f"Requires verification: {result.requires_verification}")
    print(f"Overall confidence: {result.overall_confidence:.2%}")
    
    print("\nField Results:")
    for field in result.fields:
        print(f"  {field.field_name}: {field.validation_status} (conf: {field.confidence:.2%})")
    
    print("\n✓ Validator works")