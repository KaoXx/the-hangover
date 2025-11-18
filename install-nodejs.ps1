# Script PowerShell para instalar Node.js
# Ejecutar como administrador

Write-Host ""
Write-Host "===================================="
Write-Host "   Instalando Node.js v18.18.0"
Write-Host "===================================="
Write-Host ""

# URL de descarga
$nodeUrl = "https://nodejs.org/dist/v18.18.0/node-v18.18.0-x64.msi"
$installerPath = "$env:TEMP\node-installer.msi"

# Descargar
Write-Host "📥 Descargando Node.js..."
$ProgressPreference = 'SilentlyContinue'
Invoke-WebRequest -Uri $nodeUrl -OutFile $installerPath -ErrorAction Stop

Write-Host "✓ Descarga completada"
Write-Host ""
Write-Host "⚙️  Instalando... Por favor espera 2-3 minutos"
Write-Host ""

# Instalar
Start-Process -FilePath "msiexec.exe" -ArgumentList "/i `"$installerPath`" /qn /norestart" -Wait

# Limpiar
Remove-Item $installerPath -Force

# Actualizar PATH
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# Esperar a que Node.js esté disponible
Write-Host "⏳ Esperando que Node.js se registre en el sistema..."
Start-Sleep -Seconds 10

# Verificar
Write-Host ""
Write-Host "===================================="
Write-Host "   Verificando instalación"
Write-Host "===================================="
Write-Host ""

try {
    $nodeVersion = & node --version
    $npmVersion = & npm --version
    Write-Host "✓ Node.js: $nodeVersion"
    Write-Host "✓ npm: $npmVersion"
    Write-Host ""
    Write-Host "¡Node.js instalado correctamente!"
    Write-Host ""
    Write-Host "Próximos pasos:"
    Write-Host "1. npm install"
    Write-Host "2. npm start"
} catch {
    Write-Host "⚠️  Node.js se instaló pero necesitas reiniciar PowerShell"
    Write-Host "Por favor, cierra y abre una nueva ventana de PowerShell"
}

Write-Host ""
Write-Host "Presiona una tecla para continuar..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
