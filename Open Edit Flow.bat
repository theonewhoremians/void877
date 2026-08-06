@echo off
setlocal
cd /d "%~dp0"

if not exist "node_modules\vite" (
  echo The app files are not installed yet.
  echo Installing them now. This may take a few minutes the first time.
  call npm.cmd install --package-lock=false
  if errorlevel 1 (
    echo.
    echo Installation could not finish. Check your internet connection and try again.
    pause
    exit /b 1
  )
)

where npm.cmd >nul 2>nul
if %errorlevel%==0 (
  start "Edit Flow" /b cmd /c "npm.cmd run dev -- --open"
  exit /b 0
)

echo Node.js/npm is required to open Edit Flow.
echo Install Node.js, then run this file again.
pause
