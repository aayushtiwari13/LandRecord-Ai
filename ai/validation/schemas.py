# ai/validation/schemas.py

from typing import Dict, List, Optional
from dataclasses import dataclass, asdict
from enum import Enum

# ==================== ENUMS ====================

class ValidationStatus(str, Enum):
    """Field-level validation status"""
    MATCH = "MATCH"
    MISMATCH = "MISMATCH"
    NOT_FOUND = "NOT_FOUND"
    NOT_VALIDATED = "NOT_VALIDATED"

class RecordStatus(str, Enum):
    """Overall record status"""
    VALIDATED = "VALIDATED"
    VERIFICATION_REQUIRED = "VERIFICATION_REQUIRED"
    NOT_VALIDATED = "NOT_VALIDATED"
    PROCESSING = "PROCESSING"
    FAILED = "FAILED"

class FieldName(str, Enum):
    """Standard field names"""
    OWNER_NAME = "owner_name"
    KHASRA_NUMBER = "khasra_number"
    KHATA_NUMBER = "khata_number"
    AREA = "area"
    VILLAGE = "village"
    TEHSIL = "tehsil"
    DISTRICT = "district"
    CLASSIFICATION = "classification"

# ==================== DATA CLASSES ====================

@dataclass
class ExtractedField:
    """Single field from M6 (NLP extraction)"""
    value: Optional[str] = None
    confidence: Optional[float] = None

@dataclass
class ExtractedFields:
    """Complete M6 output"""
    fields: Dict
    ocr_confidence: Optional[float] = None

@dataclass
class ReferenceRecord:
    """Reference data from M3 (database)"""
    owner_name: Optional[str] = None
    khasra_number: Optional[str] = None
    khata_number: Optional[str] = None
    area: Optional[str] = None
    village: Optional[str] = None
    tehsil: Optional[str] = None
    district: Optional[str] = None
    classification: Optional[str] = None

@dataclass
class FieldResult:
    """Validation result for single field"""
    field_name: str
    extracted_value: Optional[str]
    reference_value: Optional[str]
    validation_status: ValidationStatus
    confidence: Optional[float] = None
    reason: Optional[str] = None

@dataclass
class ValidationResult:
    """Complete M4 output"""
    record_status: RecordStatus
    fields: List[FieldResult]
    record_id: Optional[str] = None
    overall_confidence: Optional[float] = None
    requires_verification: bool = False
    reason: Optional[str] = None

    def to_dict(self):
        return asdict(self)

# ==================== THRESHOLDS ====================

class Thresholds:
    """Configurable thresholds"""
    HIGH_CONFIDENCE = 0.85
    MEDIUM_CONFIDENCE = 0.65
    LOW_CONFIDENCE = 0.0
    
    CRITICAL_FIELDS = [
        FieldName.OWNER_NAME,
        FieldName.KHASRA_NUMBER,
        FieldName.AREA,
        FieldName.VILLAGE,
        FieldName.DISTRICT
    ]