\## 📥 Download Pre-trained Model



The trained model is available on Hugging Face Hub:



\*\*Model Link\*\*: https://huggingface.co/nbhateja007/land-records-nlp-hindi-english



\### Quick Usage with Hugging Face Model



```python

from transformers import pipeline



\# Model auto-downloads from Hugging Face

nlp = pipeline("token-classification", 

&#x20;              model="nbhateja007/land-records-nlp-hindi-english")



\# Extract entities

result = nlp("Rajesh Kumar Singh owns survey 123-456 in Kanpur")

print(result)

```



\### Using with NLP Extractor



```python

from ai.nlp.nlp\_model.nlp\_extractor import LandRecordExtractor



\# Uses Hugging Face model automatically

extractor = LandRecordExtractor(

&#x20;   model\_path="nbhateja007/land-records-nlp-hindi-english"

)



result = extractor.extract("राजेश कुमार सिंह कानपुर में हैं")

print(result)

```

