# Load Testing Guide

## Quick Start

### Test 1: Simple Load Test (Quick Check)
```bash
cd backend
python load_test.py
```

This tests if your server can handle 150 concurrent API requests.

### Test 2: Full Exam Simulation (Realistic Test)
```bash
cd backend
python load_test_exam.py
```

This simulates 150 students taking a real exam with:
- Getting questions
- Answering (simulated time)
- Tab switch violations
- Final submission

## Configuration

### Before Running Tests:

**Edit the test file** to match your setup:

#### For Local Testing:
```python
BASE_URL = "http://localhost:8000"
NUM_USERS = 150
```

#### For Production Testing (Render):
```python
BASE_URL = "https://assessment-hub-backend.onrender.com"
NUM_USERS = 150
```

## Understanding Results

### Success Rate:
- **99%+** = ⭐⭐⭐ EXCELLENT - Production ready!
- **95%+** = ⭐⭐ GOOD - Works well
- **85%+** = ⭐ FAIR - May need optimization
- **<85%** = ❌ POOR - Needs fixes

### Response Time:
- **<2s** = Excellent user experience
- **2-5s** = Acceptable for exams  
- **5-10s** = Slow, users will notice
- **>10s** = Too slow, needs optimization

## Example Output:

```
📊 LOAD TEST RESULTS
==========================================
Total Time: 12.34 seconds
Total Requests: 150
✓ Successful: 149 (99.3%)
✗ Failed: 1 (0.7%)
⏱ Timeouts: 0 (0.0%)

⏱️ Response Times:
  Average: 1.85s
  Fastest: 0.82s
  Slowest: 3.21s

🎯 Performance Grade:
  ⭐⭐⭐ EXCELLENT - Production Ready!
```

## What to Test:

### 1. Local Server (Before Deploy):
```bash
# Terminal 1: Start server
cd backend
python manage.py runserver

# Terminal 2: Run test
python load_test.py
```

### 2. Render Server (After Deploy):
```bash
# Just run the test (edit BASE_URL first!)
python load_test.py
```

### 3. Stress Test (Find Maximum):
Gradually increase NUM_USERS:
- Start: 50 users
- Then: 100 users  
- Then: 150 users
- Then: 200 users
- Then: 300 users

Stop when success rate drops below 95%.

## Tips:

1. **Test locally first** - Make sure your code works
2. **Test production** - Check real-world performance
3. **Test during off-peak** - Don't disrupt real users
4. **Check Render logs** - Look for errors during load test
5. **Monitor Supabase** - Check database connections

## Troubleshooting:

### High Failure Rate:
- Check if server is running
- Verify BASE_URL is correct
- Check Render logs for errors
- Database might be overloaded

### Slow Response Times:
- Server needs more workers (already optimized to 4)
- Consider upgrading Render tier
- Check database query performance

### Timeouts:
- Server overwhelmed
- Network issues
- Need to increase server capacity
