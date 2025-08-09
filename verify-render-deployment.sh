#!/bin/bash

# Render Deployment Verification Script
# This script helps verify that the build process works correctly for Render deployment

echo "🔍 Verifying Render deployment readiness..."
echo ""

# Check if we're in the correct directory
if [ ! -f "package.json" ] || [ ! -f "render.yaml" ]; then
    echo "❌ Error: Run this script from the project root directory"
    exit 1
fi

echo "1. ✅ Project structure verified"

# Clean any existing builds
echo "2. 🧹 Cleaning existing build artifacts..."
rm -rf dist backend/dist
echo "   ✅ Clean complete"

# Run the production build
echo "3. 🔨 Running production build..."
npm run build:production
if [ $? -ne 0 ]; then
    echo "   ❌ Build failed!"
    exit 1
fi
echo "   ✅ Build successful"

# Verify frontend build artifacts
echo "4. 📦 Verifying frontend build..."
if [ ! -f "dist/index.html" ]; then
    echo "   ❌ dist/index.html not found!"
    exit 1
fi
echo "   ✅ Frontend build verified (dist/index.html exists)"

# Verify backend build artifacts
echo "5. 🖥️  Verifying backend build..."
if [ ! -f "backend/dist/index.js" ]; then
    echo "   ❌ backend/dist/index.js not found!"
    exit 1
fi
echo "   ✅ Backend build verified (backend/dist/index.js exists)"

# Test the server startup
echo "6. 🚀 Testing server startup..."
timeout 10s npm start > /tmp/server-test.log 2>&1 &
SERVER_PID=$!
sleep 3

# Test health endpoint
curl -s http://localhost:3001/api/health > /dev/null
if [ $? -eq 0 ]; then
    echo "   ✅ Server health check passed"
else
    echo "   ❌ Server health check failed"
    kill $SERVER_PID 2>/dev/null
    echo "   Server log:"
    cat /tmp/server-test.log
    exit 1
fi

# Clean up
kill $SERVER_PID 2>/dev/null
rm -f /tmp/server-test.log

echo ""
echo "🎉 All checks passed! Ready for Render deployment."
echo ""
echo "Deploy to Render with:"
echo "  Build Command: npm install && npm run build:production"
echo "  Start Command: node backend/dist/index.js"
echo ""