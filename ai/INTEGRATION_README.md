\# 🔗 M6 + M4 Integration Pipeline



\## How It Works



\### Complete Flow:



OCR Text (from M5)

↓

M6 (NLP Extraction)

Extracts: owner\_name, khasra, area, etc.

↓

M4 (AI/ML Validation)

Compares with reference data

Checks confidence

Identifies mismatches

↓

Final Decision (VALIDATED or VERIFICATION\_REQUIRED)

↓

Database \& Frontend





\---



\## 📁 Files



\- `integration\_pipeline.py` - Main pipeline connecting M6 and M4

\- `nlp/` - M6 NLP extraction module

\- `validation/` - M4 AI/ML validation module



\---



\## 🚀 Usage Example



```python

from integration\_pipeline import LandRecordPipeline



\# Initialize pipeline

pipeline = LandRecordPipeline()



\# Process a record

ocr\_text = "Ramesh Kumar owns khasra 125/2 in Rampur, 2.50 Acre"

reference = {

&#x20;   "owner\_name": "Ramesh Kumar",

&#x20;   "khasra\_number": "125/2",

&#x20;   "area": "2.50 Acre",

&#x20;   "village": "Rampur",

&#x20;   "district": "Meerut"

}



result = pipeline.process\_record(

&#x20;   ocr\_text=ocr\_text,

&#x20;   reference\_data=reference,

&#x20;   ocr\_confidence=0.92,

&#x20;   record\_id="REC001"

)



print(result\["status"])  # VALIDATED or VERIFICATION\_REQUIRED

```



\---



\## 📊 Output Structure



```json

{

&#x20; "record\_id": "REC001",

&#x20; "status": "VALIDATED",

&#x20; "requires\_verification": false,

&#x20; "overall\_confidence": 0.956,

&#x20; "reason": "All fields validated successfully",

&#x20; "fields": \[

&#x20;   {

&#x20;     "field\_name": "owner\_name",

&#x20;     "extracted\_value": "Ramesh Kumar",

&#x20;     "reference\_value": "Ramesh Kumar",

&#x20;     "validation": "MATCH",

&#x20;     "confidence": 0.953

&#x20;   },

&#x20;   ...

&#x20; ]

}

```



\---



\## 🧪 Test



```bash

python ai/integration\_pipeline.py

```



\---



\## 🔌 Integration with M2 (Backend)



Backend can call:



```python

from integration\_pipeline import LandRecordPipeline



pipeline = LandRecordPipeline()

result = pipeline.process\_record(ocr\_text, reference\_data)



\# Send result to database and frontend

```



\---



\## 📈 Pipeline Benefits



✅ M6 extracts fields

✅ M4 validates them

✅ System catches OCR errors before database

✅ Human review for uncertain records

✅ Complete audit trail



\---

