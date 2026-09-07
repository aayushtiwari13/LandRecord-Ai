# test_model.py
from transformers import pipeline

print("Loading your trained model...")
nlp = pipeline("token-classification", model="./my_trained_model")

print("✓ Model loaded!\n")
print("Testing your model:\n")

# Test texts
test_texts = [
    "Rajesh Kumar Singh owns survey 123-456 in Kanpur village",
    "Plot area is 2.5 hectares in Agra district",
    "Amit Patel registered on 22-05-2018",
]

for text in test_texts:
    print(f"Text: {text}")
    results = nlp(text)
    for entity in results:
        print(f"  → {entity['word']}: {entity['entity']}")
    print()

print("="*70)
print("✓ Your NLP model is working!")
print("="*70)