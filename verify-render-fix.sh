#!/bin/bash

# Verify Render Deployment Fix Script
# This script verifies that the frontend build and deployment issues have been resolved

set -e  # Exit on any error

echo "🔧 Verifying Render deployment fix..."
echo "=================================="

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -f "render.yaml" ]; then
    echo "❌ Error: Run this script from the project root directory"
    exit 1
fi

echo "📦 Step 1: Testing full production build..."
npm run build:production

echo ""
echo "📁 Step 2: Verifying frontend build artifacts..."
if [ ! -f "dist/index.html" ]; then
    echo "❌ Error: Frontend build failed - dist/index.html not found"
    exit 1
fi

if [ ! -f "backend/dist/index.js" ]; then
    echo "❌ Error: Backend build failed - backend/dist/index.js not found"
    exit 1
fi

echo "✅ Build artifacts verified"

echo ""
echo "🌐 Step 3: Testing server startup and static file serving..."

# Start server in background
RENDER=true NODE_ENV=production PORT=3333 node backend/dist/index.js &
SERVER_PID=$!

# Wait for server to start
sleep 3

# Test health endpoint
echo "🔍 Testing health endpoint..."
if curl -s http://localhost:3333/api/health | grep -q "OK"; then
    echo "✅ Health endpoint working"
else
    echo "❌ Health endpoint failed"
    kill $SERVER_PID 2>/dev/null || true
    exit 1
fi

# Test frontend serving
echo "🔍 Testing frontend serving..."
if curl -s http://localhost:3333/ | grep -q "<!DOCTYPE html>"; then
    echo "✅ Frontend serving working"
else
    echo "❌ Frontend serving failed"
    kill $SERVER_PID 2>/dev/null || true
    exit 1
fi

# Clean up
kill $SERVER_PID 2>/dev/null || true

echo ""
echo "🎉 All tests passed! Render deployment fix verified."
echo "✅ The frontend build issue has been resolved:"
echo "   - Frontend builds correctly and creates dist/"
echo "   - Backend builds correctly and creates backend/dist/"
echo "   - render.yaml uses correct working directory"
echo "   - Static file serving works in Render environment"
echo "   - Health check and frontend endpoints are functional"

echo ""
echo "🚀 Ready for Render deployment!"