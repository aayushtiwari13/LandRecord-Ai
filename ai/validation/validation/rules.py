# ai/validation/validation/rules.py

from typing import Optional, Tuple

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

class ValidationStatus:
    """Validation statuses"""
    MATCH = "MATCH"
    MISMATCH = "MISMATCH"
    NOT_FOUND = "NOT_FOUND"
    NOT_VALIDATED = "NOT_VALIDATED"

class ValidationRules:
    """Rules for comparing extracted vs reference values"""
    
    @staticmethod
    def compare_values(
        field_name: str,
        extracted: Optional[str],
        reference: Optional[str]
    ) -> Tuple[str, Optional[str]]:
        """
        Compare two values and return validation status + reason.
        """
        
        # If no reference data
        if reference is None:
            return (ValidationStatus.NOT_VALIDATED, "No reference data available")
        
        # If extracted is missing
        if extracted is None:
            return (ValidationStatus.NOT_FOUND, "Field not extracted")
        
        # Exact match (after normalization)
        if extracted == reference:
            return (ValidationStatus.MATCH, "Values match")
        
        # Mismatch
        return (ValidationStatus.MISMATCH, f"Extracted '{extracted}' differs from reference '{reference}'")
    
    @staticmethod
    def is_critical_field(field_name: str) -> bool:
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
    print("Testing ValidationRules:")
    status, reason = ValidationRules.compare_values(
        FieldName.OWNER_NAME,
        "ramesh kumar",
        "ramesh kumar"
    )
    print(f"Status: {status}, Reason: {reason}")
    print("✓ ValidationRules works")