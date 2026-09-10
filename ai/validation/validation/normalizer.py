# ai/validation/validation/normalizer.py

import re
from typing import Optional

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

class Normalizer:
    """Normalize field values for comparison"""
    
    @staticmethod
    def normalize_text(value: Optional[str]) -> Optional[str]:
        """
        Normalize text: lowercase, strip whitespace
        
        Examples:
            "  Ramesh Kumar  " → "ramesh kumar"
            "RAMESH KUMAR" → "ramesh kumar"
        """
        if value is None:
            return None
        return value.strip().lower()
    
    @staticmethod
    def normalize_area(value: Optional[str]) -> Optional[str]:
        """
        Normalize area to standard format.
        
        Examples:
            "2.50 Acre" → "2.5 Acre"
            "2.5 acres" → "2.5 Acre"
        """
        if value is None:
            return None
        
        value = value.strip()
        
        # Remove extra zeros after decimal: 2.50 → 2.5
        value = re.sub(r'(\d+)\.?0+(?=\s|$)', r'\1', value)
        
        # Standardize unit
        value = re.sub(r'acres?', 'Acre', value, flags=re.IGNORECASE)
        value = re.sub(r'hectares?', 'Hectare', value, flags=re.IGNORECASE)
        
        return value.strip()
    
    @staticmethod
    def normalize_khasra(value: Optional[str]) -> Optional[str]:
        """
        Normalize Khasra number (keep as string).
        
        Examples:
            "125 / 2" → "125/2"
            "125 - A" → "125-A"
        """
        if value is None:
            return None
        
        value = value.strip()
        # Remove spaces around / and -
        value = re.sub(r'\s*\/\s*', '/', value)
        value = re.sub(r'\s*-\s*', '-', value)
        
        return value
    
    @staticmethod
    def normalize_field(field_name: str, value: Optional[str]) -> Optional[str]:
        """Normalize based on field type"""
        if value is None:
            return None
        
        if field_name in [FieldName.OWNER_NAME, FieldName.VILLAGE, FieldName.TEHSIL, FieldName.DISTRICT]:
            return Normalizer.normalize_text(value)
        
        elif field_name == FieldName.AREA:
            return Normalizer.normalize_area(value)
        
        elif field_name in [FieldName.KHASRA_NUMBER, FieldName.KHATA_NUMBER]:
            return Normalizer.normalize_khasra(value)
        
        else:
            return Normalizer.normalize_text(value)

# Test
if __name__ == "__main__":
    print("Testing Normalizer:")
    print(f"Text: '{Normalizer.normalize_text('  Ramesh Kumar  ')}'")  # ramesh kumar
    print(f"Area: '{Normalizer.normalize_area('2.50 Acre')}'")  # 2.5 Acre
    print(f"Khasra: '{Normalizer.normalize_khasra('125 / 2')}'")  # 125/2
    print("✓ Normalizer works")