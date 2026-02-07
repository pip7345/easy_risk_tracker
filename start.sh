#!/bin/bash

echo "========================================"
echo "Crypto Bros Platform - Setup & Start"
echo "========================================"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "[1/3] Installing dependencies..."
    npm install
    echo ""
else
    echo "[1/3] Dependencies already installed"
    echo ""
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "[2/3] Creating .env file from template..."
    cp .env.example .env
    echo ""
    echo "IMPORTANT: Please edit .env and add your API keys!"
    echo ""
else
    echo "[2/3] Environment file already exists"
    echo ""
fi

echo "[3/3] Starting development servers..."
echo ""
echo "This will start:"
echo "  - Frontend: http://localhost:5173"
echo "  - API:      http://localhost:3000"
echo "  - Docs:     http://localhost:3001/docs/"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

npm run dev
