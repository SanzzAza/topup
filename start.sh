#!/bin/bash

# Sora 2 - AI Video Generation Website
# Quick start script

echo "╔══════════════════════════════════════╗"
echo "║   Sora 2 - AI Video Generation      ║"
echo "╚══════════════════════════════════════╝"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Error: Python 3 is not installed"
    echo "Please install Python 3.8 or higher"
    exit 1
fi

echo "✅ Python $(python3 --version) detected"

# Check if dependencies are installed
if ! python3 -c "import flask" &> /dev/null; then
    echo "📦 Installing dependencies..."
    pip install -r requirements.txt
else
    echo "✅ Dependencies already installed"
fi

echo ""
echo "🚀 Starting Sora 2 server..."
echo "📍 Open http://localhost:5000 in your browser"
echo ""
echo "Press CTRL+C to stop the server"
echo ""

# Start the Flask application
python3 app.py
