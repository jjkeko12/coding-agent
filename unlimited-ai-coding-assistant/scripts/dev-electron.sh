#!/bin/bash

# CodeCraft AI - Electron Development Script
# This script runs the Electron app in development mode with hot reloading

set -e

echo "🚀 Starting CodeCraft AI in development mode..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "✅ Starting development servers..."
echo ""
echo "📱 This will open:"
echo "   - Next.js dev server on http://localhost:3000"
echo "   - Electron window with hot reloading"
echo ""
echo "Press Ctrl+C to stop"
echo ""

# Run Electron in development mode
npm run electron:dev
