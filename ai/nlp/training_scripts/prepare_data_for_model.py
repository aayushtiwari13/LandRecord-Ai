# prepare_data_for_model.py
import json

# RECORD 1
text_1 = """Landowner: Rajesh Kumar Singh, Father Name: Ram Bahadur Singh, Survey Number: 123-456-A, Khasra Number: 789, Khata Number: 12-45, Village: Kanpur, District: Agra, Plot Area: 2.5 hectares, Ownership: Rajesh Kumar Singh 50%, Priya Singh 50%, Registration Date: 15-03-2020, Registration Number: RO/AGR/2020/45678"""

entities_1 = [
    {"text": "Rajesh Kumar Singh", "type": "PERSON"},
    {"text": "Ram Bahadur Singh", "type": "PERSON"},
    {"text": "123-456-A", "type": "ORDINAL"},
    {"text": "Kanpur", "type": "LOCATION"},
    {"text": "Agra", "type": "LOCATION"},
    {"text": "2.5 hectares", "type": "QUANTITY"},
    {"text": "15-03-2020", "type": "DATE"},
]

# RECORD 2
text_2 = """Landowner: Amit Patel, Survey Number: 456-789-B, Khasra Number: 234, Village: Baldeo, District: Mathura, Measured Area: 1.75 hectares, Registration Date: 22-05-2018, Registering Officer: Sh. Vinay Kumar Gupta"""

entities_2 = [
    {"text": "Amit Patel", "type": "PERSON"},
    {"text": "456-789-B", "type": "ORDINAL"},
    {"text": "234", "type": "ORDINAL"},
    {"text": "Baldeo", "type": "LOCATION"},
    {"text": "Mathura", "type": "LOCATION"},
    {"text": "1.75 hectares", "type": "QUANTITY"},
    {"text": "22-05-2018", "type": "DATE"},
    {"text": "Vinay Kumar Gupta", "type": "PERSON"},
]

# RECORD 3
text_3 = """Original Landowner: Deepak Sharma, Heirs: Neha Sharma, Vikram Sharma, Pradeep Sharma, Village: Jai Vihar, District: Gwalior, Total Area: 5.0 hectares, Partition Date: 10-01-2021"""

entities_3 = [
    {"text": "Deepak Sharma", "type": "PERSON"},
    {"text": "Neha Sharma", "type": "PERSON"},
    {"text": "Vikram Sharma", "type": "PERSON"},
    {"text": "Pradeep Sharma", "type": "PERSON"},
    {"text": "Jai Vihar", "type": "LOCATION"},
    {"text": "Gwalior", "type": "LOCATION"},
    {"text": "5.0 hectares", "type": "QUANTITY"},
    {"text": "10-01-2021", "type": "DATE"},
]

# RECORD 4
text_4 = """Seller: Vasudev Vaidya, Buyer: Shreya Vaidya, Survey Number: 789-123-D, Village: Handewadi, District: Pune, State: Maharashtra, Sale Price: Rs. 45,00,000, Transaction Date: 05-07-2022"""

entities_4 = [
    {"text": "Vasudev Vaidya", "type": "PERSON"},
    {"text": "Shreya Vaidya", "type": "PERSON"},
    {"text": "789-123-D", "type": "ORDINAL"},
    {"text": "Handewadi", "type": "LOCATION"},
    {"text": "Pune", "type": "LOCATION"},
    {"text": "Maharashtra", "type": "LOCATION"},
    {"text": "45,00,000", "type": "QUANTITY"},
    {"text": "05-07-2022", "type": "DATE"},
]

# RECORD 5
text_5 = """Affected Landowner: Surjeet Singh, Survey Number: 234-567-E, Village: Bamnauli, District: Hisar, State: Haryana, Total Land Holding: 4.0 hectares, Area Acquired: 2.5 hectares, Acquisition Percentage: 62.5%, Notification Date: 12-08-2021"""

entities_5 = [
    {"text": "Surjeet Singh", "type": "PERSON"},
    {"text": "234-567-E", "type": "ORDINAL"},
    {"text": "Bamnauli", "type": "LOCATION"},
    {"text": "Hisar", "type": "LOCATION"},
    {"text": "Haryana", "type": "LOCATION"},
    {"text": "4.0 hectares", "type": "QUANTITY"},
    {"text": "2.5 hectares", "type": "QUANTITY"},
    {"text": "62.5%", "type": "QUANTITY"},
    {"text": "12-08-2021", "type": "DATE"},
]

# Combine all records
all_records = [
    {"text": text_1, "entities": entities_1},
    {"text": text_2, "entities": entities_2},
    {"text": text_3, "entities": entities_3},
    {"text": text_4, "entities": entities_4},
    {"text": text_5, "entities": entities_5},
]

# Save to JSON file
with open("training_data_ready.json", "w") as f:
    json.dump(all_records, f, indent=2)

print("✓ Training data prepared!")
print(f"✓ File created: training_data_ready.json")
print(f"✓ Total records: {len(all_records)}")
total_entities = sum(len(r["entities"]) for r in all_records)
print(f"✓ Total entities: {total_entities}")