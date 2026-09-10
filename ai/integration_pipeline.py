# ai/integration_pipeline.py

"""
End-to-End Pipeline: OCR Text → M6 NLP → M4 Validation → Final Result

This shows how M6 (NLP) and M4 (AI/ML) work together!
"""

import json
import sys
import os

# Add paths
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'nlp/nlp_model'))
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'validation'))

try:
    from nlp_extractor import LandRecordExtractor
except ImportError:
    print("WARNING: M6 (NLP extractor) not found - using mock data")
    LandRecordExtractor = None

sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'validation'))
from api_response import validate_and_respond

class LandRecordPipeline:
    """Complete end-to-end pipeline: OCR → NLP → Validation"""
    
    def __init__(self, model_path: str = None):
        """
        Initialize pipeline with NLP model
        
        Args:
            model_path: Path to trained NLP model
        """
        self.nlp_extractor = None
        if LandRecordExtractor:
            try:
                self.nlp_extractor = LandRecordExtractor(model_path=model_path)
                print("✓ M6 (NLP) loaded successfully")
            except Exception as e:
                print(f"⚠ Could not load M6: {e}")
    
    def process_record(
        self,
        ocr_text: str,
        reference_data: dict,
        ocr_confidence: float = 0.90,
        record_id: str = None
    ) -> dict:
        """
        Process a land record through the complete pipeline.
        
        Args:
            ocr_text: Raw text from OCR (M5)
            reference_data: Reference record from Database (M3)
            ocr_confidence: OCR confidence score (0.0-1.0)
            record_id: Record ID for tracking
        
        Returns:
            Complete validation result with all decisions
        """
        
        print("\n" + "="*70)
        print("LAND RECORD PIPELINE")
        print("="*70)
        
        # STEP 1: M6 - NLP EXTRACTION
        print(f"\nSTEP 1: M6 (NLP) - Extract fields from OCR text")
        print(f"Input: {ocr_text}")
        
        if self.nlp_extractor:
            # Use real M6 extractor
            extracted_dict = self.nlp_extractor.extract(ocr_text)
            print(f"✓ M6 extracted fields")
        else:
            # Use mock data (for testing without model)
            extracted_dict = self._mock_extraction(ocr_text)
            print(f"⚠ Using mock extraction (model not loaded)")
        
        print(f"\nExtracted Fields:")
        for field_name, field_data in extracted_dict.items():
            if isinstance(field_data, dict):
                print(f"  - {field_name}: {field_data.get('value')} (confidence: {field_data.get('confidence', 'N/A')})")
            else:
                print(f"  - {field_name}: {field_data}")
        
        # STEP 2: M4 - VALIDATION
        print(f"\n" + "-"*70)
        print(f"STEP 2: M4 (AI/ML) - Validate extracted fields")
        print(f"Reference Data: {reference_data}")
        
        validation_result = validate_and_respond(
            extracted_fields_dict=extracted_dict,
            reference_record_dict=reference_data,
            record_id=record_id,
            ocr_confidence=ocr_confidence
        )
        
        print(f"\n✓ M4 validation complete")
        
        # STEP 3: FINAL DECISION
        print(f"\n" + "-"*70)
        print(f"FINAL DECISION")
        print(f"Status: {validation_result.get('status')}")
        print(f"Requires Verification: {validation_result.get('requires_verification')}")
        print(f"Overall Confidence: {validation_result.get('overall_confidence'):.2%}")
        print(f"Reason: {validation_result.get('reason')}")
        
        print(f"\nField-by-Field Results:")
        for field in validation_result.get('fields', []):
            status = field.get('validation')
            symbol = "✓" if status == "MATCH" else "❌" if status == "MISMATCH" else "⚠"
            print(f"  {symbol} {field.get('field_name')}: {status}")
            if status == "MISMATCH":
                print(f"     Extracted: {field.get('extracted_value')}")
                print(f"     Reference: {field.get('reference_value')}")
        
        return validation_result
    
    def _mock_extraction(self, ocr_text: str) -> dict:
        """
        Mock extraction for testing (when NLP model not available)
        In production, this would be replaced by real M6
        """
        
        # Dummy extraction - in real scenario, M6 would do this
        return {
            "owner_name": {"value": "Ramesh Kumar", "confidence": 0.98},
            "khasra_number": {"value": "125/2", "confidence": 0.96},
            "khata_number": {"value": "451", "confidence": 0.95},
            "area": {"value": "2.50 Acre", "confidence": 0.91},
            "village": {"value": "Rampur", "confidence": 0.98},
            "tehsil": {"value": "Sadar", "confidence": 0.96},
            "district": {"value": "Meerut", "confidence": 0.99},
        }

# Test the pipeline
if __name__ == "__main__":
    print("\n" + "="*70)
    print("TESTING END-TO-END PIPELINE: M6 (NLP) → M4 (Validation)")
    print("="*70)
    
    # Initialize pipeline
    pipeline = LandRecordPipeline()
    
    # TEST 1: Perfect match
    print("\n\nTEST 1: Perfect Match")
    ocr_text_1 = "Ramesh Kumar owns khasra 125/2 in Rampur, Meerut, 2.50 Acre agricultural land"
    reference_1 = {
        "owner_name": "Ramesh Kumar",
        "khasra_number": "125/2",
        "khata_number": "451",
        "area": "2.50 Acre",
        "village": "Rampur",
        "district": "Meerut"
    }
    result_1 = pipeline.process_record(ocr_text_1, reference_1, record_id="REC001")
    
    # TEST 2: Mismatch
    print("\n\nTEST 2: Mismatch (Area error)")
    ocr_text_2 = "Ramesh Kumar owns khasra 125/2 in Rampur, Meerut, 25 Acre agricultural land"
    reference_2 = {
        "owner_name": "Ramesh Kumar",
        "khasra_number": "125/2",
        "khata_number": "451",
        "area": "2.50 Acre",  # Reference is 2.50, but OCR says 25
        "village": "Rampur",
        "district": "Meerut"
    }
    result_2 = pipeline.process_record(ocr_text_2, reference_2, record_id="REC002")
    
    print("\n" + "="*70)
    print("PIPELINE TESTING COMPLETE!")
    print("="*70)