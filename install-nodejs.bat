@echo off
REM Script para instalar Node.js en Windows

echo.
echo ====================================
echo   Instalando Node.js...
echo ====================================
echo.

REM Descargar Node.js
echo Descargando Node.js v18.18.0...
powershell -Command "& {$ProgressPreference = 'SilentlyContinue'; Invoke-WebRequest -Uri 'https://nodejs.org/dist/v18.18.0/node-v18.18.0-x64.msi' -OutFile '%TEMP%\node-installer.msi'}"

if exist "%TEMP%\node-installer.msi" (
    echo ✓ Descarga completada
    echo.
    echo Instalando... Por favor espera, esto puede tomar 2-3 minutos
    REM Instalar Node.js
    msiexec.exe /i "%TEMP%\node-installer.msi" /qn /norestart
    
    REM Esperar a que termine la instalación
    timeout /t 30 /nobreak
    
    REM Limpiar archivo temporal
    del "%TEMP%\node-installer.msi"
    
    echo.
    echo ====================================
    echo   Verificando instalación...
    echo ====================================
    echo.
    
    REM Actualizar variables de entorno
    setx PATH "%PATH%;C:\Program Files\nodejs"
    
    REM Esperar un poco más
    timeout /t 5 /nobreak
    
    REM Verificar
    node --version
    npm --version
    
    if %ERRORLEVEL% EQU 0 (
        echo.
        echo ✓ ¡Node.js instalado correctamente!
        echo.
        echo Ahora puedes ejecutar: npm install
        echo Y luego: npm start
    ) else (
        echo.
        echo ⚠ Node.js se instaló, pero necesitas reiniciar la terminal
        echo Por favor cierra esta ventana y abre una nueva PowerShell
    )
) else (
    echo.
    echo ✗ Error: No se pudo descargar Node.js
)

pause
