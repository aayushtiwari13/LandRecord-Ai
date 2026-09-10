# ai/validation/tests/test_scenarios.py

import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

from validation.validation.validator import LandRecordValidator

def test_scenario_1_perfect_match():
    """Scenario 1: All fields match, high confidence -> VALIDATED"""
    print("\n" + "="*70)
    print("SCENARIO 1: Perfect Match")
    print("="*70)
    
    extracted = {
        "owner_name": {"value": "Ramesh Kumar", "confidence": 0.98},
        "khasra_number": {"value": "125/2", "confidence": 0.96},
        "khata_number": {"value": "451", "confidence": 0.95},
        "area": {"value": "2.50 Acre", "confidence": 0.91},
        "village": {"value": "Rampur", "confidence": 0.98},
        "district": {"value": "Meerut", "confidence": 0.99},
    }
    
    reference = {
        "owner_name": "Ramesh Kumar",
        "khasra_number": "125/2",
        "khata_number": "451",
        "area": "2.50 Acre",
        "village": "Rampur",
        "district": "Meerut"
    }
    
    validator = LandRecordValidator()
    result = validator.validate_record(extracted, reference, record_id="SC1_001", ocr_confidence=0.94)
    
    print(f"\nRecord Status: {result.record_status}")
    print(f"Requires Verification: {result.requires_verification}")
    print(f"Overall Confidence: {result.overall_confidence:.2%}")
    
    print("\nField Results:")
    for field in result.fields:
        print(f"  - {field.field_name}: {field.validation_status} (conf: {field.confidence:.2%})")
    
    assert result.record_status == "VALIDATED"
    assert result.requires_verification == False
    print("\nSCENARIO 1 PASSED!")

def test_scenario_2_low_confidence():
    """Scenario 2: Fields match but LOW confidence -> VERIFICATION_REQUIRED"""
    print("\n" + "="*70)
    print("SCENARIO 2: Low Confidence")
    print("="*70)
    
    extracted = {
        "owner_name": {"value": "Ramesh Kumar", "confidence": 0.98},
        "khasra_number": {"value": "125/2", "confidence": 0.96},
        "area": {"value": "2.50 Acre", "confidence": 0.63},
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
    
    validator = LandRecordValidator()
    result = validator.validate_record(extracted, reference, record_id="SC2_001", ocr_confidence=0.70)
    
    print(f"\nRecord Status: {result.record_status}")
    print(f"Requires Verification: {result.requires_verification}")
    print(f"Overall Confidence: {result.overall_confidence:.2%}")
    print(f"Reason: {result.reason}")
    
    print("\nField Results:")
    for field in result.fields:
        print(f"  - {field.field_name}: {field.validation_status} (conf: {field.confidence:.2%})")
    
    assert result.record_status == "VERIFICATION_REQUIRED"
    assert result.requires_verification == True
    print("\nSCENARIO 2 PASSED!")

def test_scenario_3_mismatch():
    """Scenario 3: Critical field MISMATCH -> VERIFICATION_REQUIRED"""
    print("\n" + "="*70)
    print("SCENARIO 3: Mismatch (Area 25 vs 2.50)")
    print("="*70)
    
    extracted = {
        "owner_name": {"value": "Ramesh Kumar", "confidence": 0.98},
        "khasra_number": {"value": "125/2", "confidence": 0.96},
        "area": {"value": "25 Acre", "confidence": 0.93},
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
    
    validator = LandRecordValidator()
    result = validator.validate_record(extracted, reference, record_id="SC3_001", ocr_confidence=0.92)
    
    print(f"\nRecord Status: {result.record_status}")
    print(f"Requires Verification: {result.requires_verification}")
    print(f"Reason: {result.reason}")
    
    print("\nField Results:")
    for field in result.fields:
        if field.validation_status == "MISMATCH":
            print(f"  - {field.field_name}: {field.validation_status} (PROBLEM!)")
            print(f"    Extracted: {field.extracted_value}")
            print(f"    Reference: {field.reference_value}")
        else:
            print(f"  - {field.field_name}: {field.validation_status}")
    
    assert result.record_status == "VERIFICATION_REQUIRED"
    assert result.requires_verification == True
    print("\nSCENARIO 3 PASSED!")

if __name__ == "__main__":
    try:
        test_scenario_1_perfect_match()
        test_scenario_2_low_confidence()
        test_scenario_3_mismatch()
        
        print("\n" + "="*70)
        print("ALL SCENARIOS PASSED!")
        print("="*70)
    except AssertionError as e:
        print(f"\nTest failed: {e}")