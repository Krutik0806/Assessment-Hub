"""Test special accounts (admin + faculty)"""
import requests
import json

BASE_URL = 'http://127.0.0.1:8000/api'
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
}

print("\n" + "="*60)
print("TESTING SPECIAL ACCOUNTS")
print("="*60)

# Test admin account
print("\n=== Test 1: Admin Login (Krutik) ===")
admin = {'username': 'chamthakrutik4@gmail.com', 'password': 'admin123'}
response = requests.post(f'{BASE_URL}/auth/login/', json=admin, headers=HEADERS)
print(f"Status: {response.status_code}")
if response.status_code == 200:
    data = response.json()
    print(f"✅ Logged in as: {data['user']['first_name']} ({data['user']['email']})")
    print(f"   Is Admin: {data['user']['is_admin']}")
else:
    print(f"❌ Error: {response.json()}")

# Test faculty 1
print("\n=== Test 2: Faculty Login (Kruti Sutaria) ===")
faculty1 = {'username': 'kruti.sutaria25509@paruluniversity.ac.in', 'password': '25509'}
response = requests.post(f'{BASE_URL}/auth/login/', json=faculty1, headers=HEADERS)
print(f"Status: {response.status_code}")
if response.status_code == 200:
    data = response.json()
    print(f"✅ Logged in as: {data['user']['first_name']} ({data['user']['email']})")
else:
    print(f"❌ Error: {response.json()}")

# Test faculty 2
print("\n=== Test 3: Faculty Login (Shweta Yagnik) ===")
faculty2 = {'username': 'shweta.yagnik39983@paruluniversity.ac.in', 'password': '39983'}
response = requests.post(f'{BASE_URL}/auth/login/', json=faculty2, headers=HEADERS)
print(f"Status: {response.status_code}")
if response.status_code == 200:
    data = response.json()
    print(f"✅ Logged in as: {data['user']['first_name']} ({data['user']['email']})")
else:
    print(f"❌ Error: {response.json()}")

# Test faculty 3
print("\n=== Test 4: Faculty Login (Mahipal Khoja) ===")
faculty3 = {'username': 'mahipal.khoja35948@paruluniversity.ac.in', 'password': '35948'}
response = requests.post(f'{BASE_URL}/auth/login/', json=faculty3, headers=HEADERS)
print(f"Status: {response.status_code}")
if response.status_code == 200:
    data = response.json()
    print(f"✅ Logged in as: {data['user']['first_name']} ({data['user']['email']})")
else:
    print(f"❌ Error: {response.json()}")

# Test student still works
print("\n=== Test 5: Student Login (Still Works) ===")
student = {'username': '2303031050031@paruluniversity.ac.in', 'password': '2303031050031'}
response = requests.post(f'{BASE_URL}/auth/login/', json=student, headers=HEADERS)
print(f"Status: {response.status_code}")
if response.status_code == 200:
    data = response.json()
    print(f"✅ Logged in as: {data['user']['first_name']} ({data['user']['email']})")
else:
    print(f"❌ Error: {response.json()}")

# Test wrong admin password
print("\n=== Test 6: Wrong Admin Password ===")
wrong_admin = {'username': 'chamthakrutik4@gmail.com', 'password': 'wrongpassword'}
response = requests.post(f'{BASE_URL}/auth/login/', json=wrong_admin, headers=HEADERS)
print(f"Status: {response.status_code}")
print(f"Expected 401: {'✅' if response.status_code == 401 else '❌'}")

print("\n" + "="*60)
print("TEST COMPLETE")
print("="*60 + "\n")
