#!/bin/bash
# Deployment verification script
# This script tests the build process and server functionality

echo "🔧 Starting deployment verification..."

# Clean any existing builds
echo "🧹 Cleaning previous builds..."
rm -rf dist/
rm -rf backend/dist/

# Install dependencies
echo "📦 Installing dependencies..."
npm install
cd backend && npm install
cd ..

# Run build
echo "🏗️  Building application..."
npm run build:production

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

# Verify build outputs
echo "✅ Verifying build outputs..."

if [ ! -f "dist/index.html" ]; then
    echo "❌ Frontend build failed - index.html not found"
    exit 1
fi

if [ ! -f "backend/dist/index.js" ]; then
    echo "❌ Backend build failed - index.js not found"
    exit 1
fi

echo "✅ Build verification complete"

# Test server startup
echo "🚀 Testing server startup..."
NODE_ENV=production PORT=3333 timeout 10s node backend/dist/index.js &
SERVER_PID=$!

# Wait for server to start
sleep 3

# Test health check
echo "🏥 Testing health check..."
HEALTH_RESPONSE=$(curl -s http://localhost:3333/api/health)
if [[ $HEALTH_RESPONSE == *"OK"* ]]; then
    echo "✅ Health check passed"
else
    echo "❌ Health check failed: $HEALTH_RESPONSE"
    kill $SERVER_PID 2>/dev/null
    exit 1
fi

# Test static file serving
echo "📄 Testing static file serving..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3333/)
if [ "$HTTP_STATUS" = "200" ]; then
    echo "✅ Static file serving works"
else
    echo "❌ Static file serving failed with status: $HTTP_STATUS"
    kill $SERVER_PID 2>/dev/null
    exit 1
fi

# Clean up
kill $SERVER_PID 2>/dev/null
wait $SERVER_PID 2>/dev/null

echo "🎉 All tests passed! Ready for deployment."
echo ""
echo "To deploy on Render:"
echo "1. Push your changes to GitHub"
echo "2. Render will automatically run: npm install && npm run build:production"
echo "3. Then start the server with: node backend/dist/index.js"
echo "4. Check the health endpoint: /api/health"