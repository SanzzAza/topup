#!/usr/bin/env python3
"""
Simple test script for Sora 2 API endpoints
"""

import requests
import json
import sys
import time

def test_health():
    """Test health check endpoint"""
    try:
        response = requests.get('http://localhost:5000/api/health', timeout=5)
        if response.status_code == 200:
            print("✅ Health check passed")
            return True
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Health check failed: {e}")
        return False

def test_generate_video():
    """Test video generation endpoint"""
    try:
        payload = {
            'prompt': 'A beautiful sunset over the ocean',
            'settings': {
                'duration': '5',
                'quality': '1080p',
                'style': 'realistic',
                'fps': '30'
            }
        }
        
        response = requests.post(
            'http://localhost:5000/api/generate',
            json=payload,
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                print("✅ Video generation test passed")
                print(f"   Video ID: {data['video']['id']}")
                return True
            else:
                print("❌ Video generation test failed: Invalid response")
                return False
        else:
            print(f"❌ Video generation test failed: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Video generation test failed: {e}")
        return False

def test_get_videos():
    """Test get videos endpoint"""
    try:
        response = requests.get('http://localhost:5000/api/videos', timeout=5)
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                print(f"✅ Get videos test passed ({len(data['videos'])} videos)")
                return True
            else:
                print("❌ Get videos test failed: Invalid response")
                return False
        else:
            print(f"❌ Get videos test failed: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Get videos test failed: {e}")
        return False

def main():
    """Run all tests"""
    print("🧪 Testing Sora 2 API Endpoints")
    print("=" * 40)
    print("")
    
    # Check if server is running
    print("Checking if server is running...")
    for i in range(3):
        if test_health():
            break
        if i < 2:
            print("⏳ Waiting for server to start...")
            time.sleep(2)
        else:
            print("❌ Server is not running. Please start it with: python3 app.py")
            sys.exit(1)
    
    print("")
    
    # Run tests
    tests = [
        ("Health Check", test_health),
        ("Generate Video", test_generate_video),
        ("Get Videos", test_get_videos)
    ]
    
    passed = 0
    failed = 0
    
    for test_name, test_func in tests:
        print(f"Running: {test_name}")
        if test_func():
            passed += 1
        else:
            failed += 1
        print("")
    
    # Print summary
    print("=" * 40)
    print(f"Tests passed: {passed}/{len(tests)}")
    print(f"Tests failed: {failed}/{len(tests)}")
    
    if failed == 0:
        print("✅ All tests passed!")
        sys.exit(0)
    else:
        print("❌ Some tests failed")
        sys.exit(1)

if __name__ == '__main__':
    main()
