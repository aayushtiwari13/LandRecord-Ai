# 🤖 NLP Model - Land Record Field Extraction

## What Does This Do?

This model reads land record text (in Hindi or English) and **extracts important information** like:
- Owner name
- Khasra number (plot ID)
- Area (how much land)
- Village name
- District name

## Example

**Input (Raw Text):**
Rajesh Kumar Singh owns survey 125/2 in Kanpur, 2.50 Acre of agricultural land


**Output (Extracted Fields):**

Owner: Rajesh Kumar Singh
Khasra: 125/2
Area: 2.50 Acre
Village: Kanpur
Type: Agricultural


---

## 🚀 How to Use This Model

### Option 1: Download Pre-trained Model (EASIEST)

The trained model is ready to download from Hugging Face:

**Link:** https://huggingface.co/nbhateja007/land-records-nlp-hindi-english

Simply download and use it!

### Option 2: Train Your Own Model

If you want to train from scratch:

```bash
cd ai/nlp/training_scripts
python train_model.py
```

This will create the model in: `ai/nlp/nlp_model/my_trained_model/`

---

## 📥 Files in This Folder

- `nlp_model/` - The trained model files (config, tokenizer)
- `training_scripts/` - Python files to train the model
- `training_data_ready.json` - Example training data

---

## 🔧 Technical Details

- **Model Type:** BERT (Transformer-based NER)
- **Languages:** Hindi + English (bilingual)
- **Framework:** Hugging Face Transformers
- **Model Size:** 676 MB

---

## 📖 How to Integrate With Backend

The backend team can use this model like:

```python
from transformers import pipeline

# Download model from Hugging Face automatically
nlp = pipeline(
    "token-classification",
    model="nbhateja007/land-records-nlp-hindi-english"
)

# Extract entities
text = "Rajesh Kumar owns khasra 125/2 in Kanpur"
result = nlp(text)

print(result)
```

---

## 🎯 What's Next?

1. **For OCR Team:** Use this model after OCR outputs text
2. **For Backend Team:** Integrate this into the pipeline
3. **For AI Team (M4):** Use extracted fields for validation

---

## ❓ Questions?

Ask the NLP developer (Naman) for help!

Model Status: ✅ Ready to use