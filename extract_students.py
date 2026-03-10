import pandas as pd
import json

# Read the Excel file
df = pd.read_excel('Service Now Final 100 Students (1).xlsx')

# Display first few rows and columns
print("Columns:", df.columns.tolist())
print("\nFirst 5 rows:")
print(df.head())
print("\nTotal students:", len(df))

# Create JSON for hardcoded users
students = []
for _, row in df.iterrows():
    enrollment = str(row.get('Enrolment No', '')).strip()
    email = str(row.get('Email', '')).strip()
    name = str(row.get('Name', '')).strip()
    
    if enrollment and email:
        students.append({
            'email': email,
            'enrollment': enrollment,
            'name': name
        })

# Save to JSON file
with open('backend/students_data.json', 'w') as f:
    json.dump(students, f, indent=2)

print(f"\n✅ Exported {len(students)} students to backend/students_data.json")
print("\nSample student:", students[0] if students else "No data")
