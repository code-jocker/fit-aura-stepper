@echo off
REM MBABAZI CLOSET - Complete Setup Script for Windows

echo.
echo 🇷🇼 MBABAZI CLOSET - Project Setup
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

echo ✅ Node.js is installed: 
node --version
echo.

REM Install Backend Dependencies
echo 📦 Installing Backend Dependencies...
cd backend
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)

echo ✅ Backend dependencies installed successfully

REM Copy environment file
if not exist .env (
    copy .env.example .env
    echo ⚠️  Created .env file - Please edit it with your configuration
)

cd ..

REM Install Frontend Dependencies
echo.
echo 📦 Installing Frontend Dependencies...
cd frontend
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)

echo ✅ Frontend dependencies installed successfully

cd ..

echo.
echo 🎉 Setup Complete!
echo.
echo 📝 Next Steps:
echo 1. Edit backend\.env with your MongoDB URI and JWT secret
echo 2. Start backend: cd backend ^& npm run dev
echo 3. Start frontend: cd frontend ^& npm start
echo 4. Visit http://localhost:3000
echo.
echo 📚 For more information, see QUICKSTART.md
echo.
pause
