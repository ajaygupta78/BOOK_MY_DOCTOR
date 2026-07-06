"""
BOOK MY DOCTOR - Application Launcher
Run this script from the BOOK_MY_DOCTOR/ project root directory:
    python run.py
"""
import sys
import os

# Ensure the project root is in the Python path so 'backend' package is importable
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from backend.app import app

if __name__ == '__main__':
    print("=" * 60)
    print("  BOOK MY DOCTOR - Flask REST API Server")
    print("  Running on: http://localhost:5000")
    print("  React frontend should run on: http://localhost:3000")
    print("=" * 60)
    app.run(host='0.0.0.0', port=5000, debug=True)
