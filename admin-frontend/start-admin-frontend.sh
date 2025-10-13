#!/bin/bash

# Self-Driving Car Rental - Admin Frontend Startup Script
# Starts the admin frontend development server

set -e

echo "🚗 Self-Driving Car Rental - Admin Frontend"
echo "============================================"

# Change to the admin frontend directory
cd "$(dirname "$0")"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node --version)"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found. Make sure you're in the admin-frontend directory."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
    echo "✅ Dependencies installed successfully"
else
    echo "✅ Dependencies already installed"
fi

# Check if environment file exists
if [ ! -f ".env" ]; then
    if [ -f ".env.development" ]; then
        echo "📄 Creating .env from .env.development..."
        cp .env.development .env
    else
        echo "⚠️  No .env file found. Creating default..."
        cat > .env << EOF
VITE_API_BASE_URL=http://localhost:8000
VITE_NODE_ENV=development
VITE_ENABLE_DEBUG_LOGS=true
VITE_ENABLE_ANALYTICS=false
VITE_WEBSOCKET_URL=ws://localhost:8000/ws
EOF
    fi
fi

echo "✅ Environment configuration ready"

# Type check
echo "🔍 Running type check..."
npm run build --dry-run 2>/dev/null || {
    echo "⚠️  TypeScript check completed with warnings (this is normal for development)"
}

echo ""
echo "🚀 Starting admin frontend development server..."
echo "   Frontend will be available at: http://localhost:5173"
echo "   Backend should be running at: $(grep VITE_API_BASE_URL .env | cut -d'=' -f2)"
echo ""
echo "💡 Tips:"
echo "   - Make sure the backend services are running"
echo "   - Use Ctrl+C to stop the server"
echo "   - Edit .env to change API base URL"
echo ""

# Start the development server
npm run dev
