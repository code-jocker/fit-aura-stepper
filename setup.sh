#!/bin/bash

# mbabazi-closet - Complete Setup Script
# This script helps you quickly set up the entire project

echo "🇷🇼 mbabazi-closet - Project Setup"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js is installed: $(node --version)"
echo ""

# Install Backend Dependencies
echo "📦 Installing Backend Dependencies..."
cd backend
npm install

if [ $? -eq 0 ]; then
    echo "✅ Backend dependencies installed successfully"
else
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

# Copy environment file
if [ ! -f .env ]; then
    cp .env.example .env
    echo "⚠️  Created .env file - Please edit it with your configuration"
fi

cd ..

# Install Frontend Dependencies
echo ""
echo "📦 Installing Frontend Dependencies..."
cd frontend
npm install

if [ $? -eq 0 ]; then
    echo "✅ Frontend dependencies installed successfully"
else
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

cd ..

echo ""
echo "🎉 Setup Complete!"
echo ""
echo "📝 Next Steps:"
echo "1. Edit backend/.env with your MongoDB URI and JWT secret"
echo "2. Start backend: cd backend && npm run dev"
echo "3. Start frontend: cd frontend && npm start"
echo "4. Visit http://localhost:3000"
echo ""
echo "📚 For more information, see QUICKSTART.md"
