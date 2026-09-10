# ai/validation/api_response.py

# ai/validation/api_response.py

import json
import sys
import os
from typing import Dict, Optional

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from validation.validator import LandRecordValidator
def validate_and_respond(
    extracted_fields_dict: Dict,
    reference_record_dict: Dict,
    record_id: Optional[str] = None,
    ocr_confidence: Optional[float] = None
) -> Dict:
    """
    Main entry point for M2 (Backend) to call M4.
    
    This is what the backend API will call!
    
    Args:
        extracted_fields_dict: M6 output (from NLP)
        reference_record_dict: M3 reference data (from Database)
        record_id: Optional record ID
        ocr_confidence: Overall OCR confidence
    
    Returns:
        JSON-serializable dict with validation result
    """
    
    try:
        # Validate using M4
        validator = LandRecordValidator()
        result = validator.validate_record(
            extracted=extracted_fields_dict,
            reference=reference_record_dict,
            record_id=record_id,
            ocr_confidence=ocr_confidence
        )
        
        # Convert to JSON-serializable dict
        response = {
            "record_id": result.record_id,
            "status": result.record_status,
            "requires_verification": result.requires_verification,
            "overall_confidence": round(result.overall_confidence, 4) if result.overall_confidence else None,
            "reason": result.reason,
            "fields": [
                {
                    "field_name": f.field_name,
                    "extracted_value": f.extracted_value,
                    "reference_value": f.reference_value,
                    "validation": f.validation_status,
                    "confidence": round(f.confidence, 4) if f.confidence else None,
                    "reason": f.reason
                }
                for f in result.fields
            ]
        }
        
        return response
    
    except Exception as e:
        return {
            "status": "FAILED",
            "reason": str(e),
            "requires_verification": True
        }

# Test
if __name__ == "__main__":
    print("Testing API Response:")
    
    # Example M6 (NLP) output
    m6_output = {
        "owner_name": {"value": "Ramesh Kumar", "confidence": 0.98},
        "khasra_number": {"value": "125/2", "confidence": 0.96},
        "area": {"value": "25 Acre", "confidence": 0.63},
    }
    
    # Example M3 (Database) reference
    m3_reference = {
        "owner_name": "Ramesh Kumar",
        "khasra_number": "125/2",
        "area": "2.50 Acre",
    }
    
    # Call M4 via API
    response = validate_and_respond(
        extracted_fields_dict=m6_output,
        reference_record_dict=m3_reference,
        record_id="TEST001",
        ocr_confidence=0.92
    )
    
    print(json.dumps(response, indent=2))
    print("\n✓ API Response works")