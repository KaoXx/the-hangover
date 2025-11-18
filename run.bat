@echo off
REM Script para instalar y ejecutar The Hangover

echo.
echo ====================================
echo   THE HANGOVER - Party Game Setup
echo ====================================
echo.

REM Verificar si Node.js está instalado
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js no está instalado
    echo Descárgalo de: https://nodejs.org/
    pause
    exit /b 1
)

echo ✓ Node.js detectado

REM Instalar dependencias si no existen
if not exist "node_modules\" (
    echo.
    echo Instalando dependencias...
    call npm install
    echo ✓ Dependencias instaladas
) else (
    echo ✓ Dependencias ya están instaladas
)

echo.
echo ====================================
echo   Iniciando servidor...
echo ====================================
echo.
echo 🎮 Juego: http://localhost:3000/index.html
echo 🔐 Admin: http://localhost:3000/admin.html
echo.
echo Presiona Ctrl+C para detener el servidor
echo.

call npm start
