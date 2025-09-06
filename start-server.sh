#!/bin/bash

# Portfolio Site Server Startup Script
# This script ensures we're in the correct directory and starts the server

echo "🎯 PORTFOLIO SITE SERVER STARTUP"
echo "=================================="

# Check if we're in the correct directory
CURRENT_DIR=$(pwd)
CORRECT_DIR="/Users/dougfraize/Documents/Dev/Portfolio Site"

if [ "$CURRENT_DIR" != "$CORRECT_DIR" ]; then
    echo "⚠️  Wrong directory detected!"
    echo "Current: $CURRENT_DIR"
    echo "Expected: $CORRECT_DIR"
    echo ""
    echo "🔄 Navigating to correct directory..."
    cd "$CORRECT_DIR"
    
    if [ $? -eq 0 ]; then
        echo "✅ Successfully navigated to Portfolio Site directory"
    else
        echo "❌ Failed to navigate to Portfolio Site directory"
        exit 1
    fi
else
    echo "✅ Already in correct directory"
fi

# Verify required files exist
echo ""
echo "📁 Checking for required files..."
if [ -f "package.json" ] && [ -f "index.html" ]; then
    echo "✅ All required files found"
else
    echo "❌ Missing required files (package.json or index.html)"
    echo "Current directory contents:"
    ls -la
    exit 1
fi

# Kill any existing live-server processes
echo ""
echo "🔄 Stopping any existing servers..."
pkill -f live-server 2>/dev/null

# Start the server
echo ""
echo "🚀 Starting development server..."
echo "📱 Server will be available at: http://localhost:3000"
echo "🔄 Press Ctrl+C to stop the server"
echo ""

npm run dev 