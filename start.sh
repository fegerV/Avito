#!/bin/bash

# Avito Clone - Startup Script

echo "🚀 Starting Avito Clone..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is available
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}⚠️  Docker not found. Starting services manually...${NC}"
    
    # Start backend
    echo -e "${GREEN}📦 Starting backend...${NC}"
    cd backend
    npm install > /dev/null 2>&1
    npm run start:dev &
    BACKEND_PID=$!
    cd ..
    
    # Start frontend
    echo -e "${GREEN}🎨 Starting frontend...${NC}"
    cd frontend
    npm install > /dev/null 2>&1
    npm run dev &
    FRONTEND_PID=$!
    cd ..
    
    echo -e "${GREEN}✅ Services started!${NC}"
    echo "Backend: http://localhost:3001"
    echo "Frontend: http://localhost:3000"
    echo ""
    echo "Press Ctrl+C to stop"
    
    # Wait for Ctrl+C
    wait $BACKEND_PID $FRONTEND_PID
else
    echo -e "${GREEN}✅ Docker found. Using Docker Compose...${NC}"
    docker-compose up
fi
