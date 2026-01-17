@echo off
echo "🚀 Starting Attendance Platform (Refactored)..."
echo "📋 Step 1: Cleaning existing processes..."
call scripts\clean-dev.bat
echo "📋 Step 2: Building all services..."
pnpm run build
echo "📋 Step 3: Starting services in parallel mode..."
pnpm run dev
echo "🎉 Attendance Platform started successfully!"
echo "📊 Services:"
echo "   - API Gateway: http://localhost:3002"
echo "   - Auth Service: http://localhost:3003"
echo "   - Attendance Service: http://localhost:3001"
echo ""
echo "📋 Health Check: http://localhost:3002/health"
echo ""
echo "🛑 To stop: Press Ctrl+C in terminal"