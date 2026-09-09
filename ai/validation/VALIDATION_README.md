\# 🤖 M4 - AI/ML Validation \& Confidence Engine



\## What Is This?



This is the \*\*decision-making layer\*\* for land record digitization.



\*\*M4 receives:\*\*

\- Extracted fields from M6 (NLP) with confidence scores

\- Reference data from M3 (Database)



\*\*M4 returns:\*\*

\- Validation status for each field (MATCH/MISMATCH/NOT\_FOUND)

\- Overall record decision (VALIDATED or VERIFICATION\_REQUIRED)

\- Confidence scores

\- Explanations for mismatches



\---



\## 🎯 How It Works



\### Input from M6 (NLP):

```json

{

&#x20; "owner\_name": {"value": "Ramesh Kumar", "confidence": 0.98},

&#x20; "khasra\_number": {"value": "125/2", "confidence": 0.96},

&#x20; "area": {"value": "2.50 Acre", "confidence": 0.91}

}

```



\### Reference from M3 (Database):

```json

{

&#x20; "owner\_name": "Ramesh Kumar",

&#x20; "khasra\_number": "125/2",

&#x20; "area": "2.50 Acre"

}

```



\### Output from M4:

```json

{

&#x20; "status": "VALIDATED",

&#x20; "requires\_verification": false,

&#x20; "overall\_confidence": 0.95,

&#x20; "fields": \[

&#x20;   {

&#x20;     "field\_name": "owner\_name",

&#x20;     "validation": "MATCH",

&#x20;     "confidence": 0.95

&#x20;   },

&#x20;   {

&#x20;     "field\_name": "khasra\_number",

&#x20;     "validation": "MATCH",

&#x20;     "confidence": 0.95

&#x20;   },

&#x20;   {

&#x20;     "field\_name": "area",

&#x20;     "validation": "MATCH",

&#x20;     "confidence": 0.93

&#x20;   }

&#x20; ]

}

```



\---



\## 📁 Files in This Folder



\- `validation/`

&#x20; - `validator.py` - Main validation engine

&#x20; - `normalizer.py` - Cleans up data before comparing

&#x20; - `rules.py` - Comparison logic

\- `confidence/`

&#x20; - `scorer.py` - Calculates confidence scores

\- `tests/`

&#x20; - `test\_scenarios.py` - Tests all 3 demo scenarios

\- `api\_response.py` - API wrapper for backend

\- `schemas.py` - Data structures



\---



\## 🎯 Three Main Scenarios



\### Scenario 1: Perfect Match ✅

All fields match, high confidence → \*\*VALIDATED\*\* (auto-accept)



\### Scenario 2: Low Confidence ⚠️

Fields match but confidence is low → \*\*VERIFICATION\_REQUIRED\*\* (manual review)



\### Scenario 3: Mismatch ❌

Area extracted as 25 Acre, reference is 2.50 Acre → \*\*VERIFICATION\_REQUIRED\*\* (manual correction)



\---



\## 🔧 How to Use



\### From Backend (M2)



```python

from validation.api\_response import validate\_and\_respond



\# M6 output (NLP extracted fields)

extracted = {

&#x20;   "owner\_name": {"value": "Ramesh Kumar", "confidence": 0.98},

&#x20;   "khasra\_number": {"value": "125/2", "confidence": 0.96},

&#x20;   "area": {"value": "2.50 Acre", "confidence": 0.91}

}



\# M3 reference (Database record)

reference = {

&#x20;   "owner\_name": "Ramesh Kumar",

&#x20;   "khasra\_number": "125/2",

&#x20;   "area": "2.50 Acre"

}



\# Call M4

result = validate\_and\_respond(

&#x20;   extracted\_fields\_dict=extracted,

&#x20;   reference\_record\_dict=reference,

&#x20;   record\_id="REC001",

&#x20;   ocr\_confidence=0.92

)



\# Result is JSON ready to send to frontend

print(result)

```



\---



\## 🧠 How Confidence Works



Confidence = 0.3 × OCR Confidence + 0.4 × NLP Confidence + 0.3 × Pattern Confidence



\*\*Thresholds:\*\*

\- ≥ 0.85 → HIGH confidence

\- 0.65 - 0.84 → MEDIUM confidence  

\- < 0.65 → LOW confidence (triggers verification)



\---



\## 🔍 Key Features



✅ \*\*Field Normalization\*\*

\- Text: lowercase, trim whitespace

\- Area: "2.50 Acre" = "2.5 Acre"

\- Khasra: "125 / 2" = "125/2"



✅ \*\*Critical Field Detection\*\*

\- If critical field (owner\_name, khasra, area, village, district) is MISMATCH → verification required



✅ \*\*Low Confidence Detection\*\*

\- If any field has confidence < 0.65 → verification required



✅ \*\*Explainability\*\*

\- Every decision includes reason

\- Every mismatch shows extracted vs reference



\---



\## 📊 Field Validation Statuses



| Status | Meaning |

|--------|---------|

| MATCH | Extracted matches reference |

| MISMATCH | Extracted differs from reference |

| NOT\_FOUND | Field not extracted by M6 |

| NOT\_VALIDATED | No reference data available |



\---



\## 🎯 Record Status Options



| Status | Meaning |

|--------|---------|

| VALIDATED | All checks passed, auto-accept |

| VERIFICATION\_REQUIRED | Mismatch/low confidence, needs human review |

| NOT\_VALIDATED | Missing reference data |



\---



\## 🧪 Run Tests



```bash

python ai/validation/tests/test\_scenarios.py

```



Should see all 3 scenarios pass!



\---



\## 🔌 Integration Points



\- \*\*M6 (NLP):\*\* Provides extracted fields + confidence

\- \*\*M3 (Database):\*\* Provides reference records

\- \*\*M2 (Backend):\*\* Calls `validate\_and\_respond()` and gets JSON response

\- \*\*M1 (Frontend):\*\* Displays validation results and verification UI



\---



\## 📝 Notes



\- Confidence is NOT accuracy - it's extraction reliability

\- High confidence + mismatch = still requires verification

\- Human-in-the-loop is critical for uncertain records

\- System is designed to catch OCR errors before they enter database



\---



\## 👤 Developer



Naman (M4 Developer)



For questions or integration help, contact the M4 developer!

