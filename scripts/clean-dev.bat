@echo off
echo "🧹 Cleaning up development environment..."
taskkill //F //IM node.exe 2>nul
ping -n 3 127.0.0.1 >nul
tasklist | findstr node.exe >nul
if %errorlevel% equ 0 (
    echo "⚠️  Some Node processes are still running"
) else (
    echo "✅ All Node processes terminated"
)
echo "✅ Development environment cleaned"