#!/bin/bash

# CodeCraft AI - macOS Build Script
# This script builds the CodeCraft AI desktop app for macOS

set -e

echo "🚀 Building CodeCraft AI for macOS..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✅ npm version: $(npm --version)"
echo ""

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Build Next.js app
echo "🔨 Building Next.js application..."
npm run build
echo ""

# Compile Electron TypeScript
echo "⚡ Compiling Electron files..."
cd electron
npx tsc -p tsconfig.json
cd ..
echo ""

# Build macOS app
echo "🍎 Building macOS application..."
npm run electron:build:mac:dmg
echo ""

# Check if build was successful
if [ -d "dist" ]; then
    echo "✅ Build completed successfully!"
    echo ""
    echo "📦 Your app is ready in the 'dist' folder:"
    ls -lh dist/
    echo ""
    echo "🎉 To install:"
    echo "   1. Double-click the .dmg file"
    echo "   2. Drag CodeCraft AI to Applications"
    echo ""
else
    echo "❌ Build failed. Check the error messages above."
    exit 1
fi
