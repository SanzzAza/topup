#!/bin/bash

# Sora 2 Video Generation Website Startup Script

echo "🚀 Starting Sora 2 Video Generation Website..."

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing root dependencies..."
    npm install
fi

if [ ! -d "client/node_modules" ]; then
    echo "📦 Installing client dependencies..."
    cd client && npm install && cd ..
fi

if [ ! -d "server/node_modules" ]; then
    echo "📦 Installing server dependencies..."
    cd server && npm install && cd ..
fi

# Set up environment file if it doesn't exist
if [ ! -f "server/.env" ]; then
    echo "⚙️ Setting up environment file..."
    cp server/.env.example server/.env
    echo "✅ Please edit server/.env with your API keys"
fi

echo "🎬 Starting Sora 2 application..."
echo "📱 Frontend will be available at: http://localhost:3000"
echo "🔧 Backend API will be available at: http://localhost:8080"
echo ""
echo "Press Ctrl+C to stop the application"

# Start both client and server
npm run dev