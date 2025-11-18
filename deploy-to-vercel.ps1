# Script para configurar Git y Vercel automáticamente
# Uso: .\deploy-to-vercel.ps1

Write-Host "🚀 Bienvenido a The Hangover Vercel Deployer" -ForegroundColor Cyan
Write-Host ""

# Paso 1: Verificar si Git está instalado
Write-Host "📍 Paso 1: Verificando Git..." -ForegroundColor Yellow
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Git no está instalado. Por favor, instala Git desde https://git-scm.com/" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Git instalado: $(git --version)" -ForegroundColor Green
Write-Host ""

# Paso 2: Configurar Git (si es primera vez)
Write-Host "📍 Paso 2: Configurando Git..." -ForegroundColor Yellow
$userName = git config --global user.name
if (-not $userName) {
    Write-Host "Introduce tu nombre para Git:"
    $name = Read-Host "Nombre"
    git config --global user.name "$name"
    Write-Host "✅ Nombre configurado: $name" -ForegroundColor Green
} else {
    Write-Host "✅ Git ya configurado para usuario: $userName" -ForegroundColor Green
}
Write-Host ""

# Paso 3: Inicializar repositorio local
Write-Host "📍 Paso 3: Inicializando repositorio Git local..." -ForegroundColor Yellow
if (-not (Test-Path ".git")) {
    git init
    Write-Host "✅ Repositorio inicializado" -ForegroundColor Green
} else {
    Write-Host "✅ Repositorio ya existe" -ForegroundColor Green
}
Write-Host ""

# Paso 4: Agregar y hacer commit
Write-Host "📍 Paso 4: Creando primer commit..." -ForegroundColor Yellow
git add .
git commit -m "Initial commit - The Hangover Party Game"
Write-Host "✅ Commit creado" -ForegroundColor Green
Write-Host ""

# Paso 5: Información para GitHub
Write-Host "📍 Paso 5: Información para GitHub" -ForegroundColor Yellow
Write-Host ""
Write-Host "Para completar la configuración, necesitas:" -ForegroundColor Cyan
Write-Host "  1. Ir a https://github.com/new" -ForegroundColor White
Write-Host "  2. Crear un repositorio llamado: the-hangover" -ForegroundColor White
Write-Host "  3. Copiar la URL que te muestre GitHub" -ForegroundColor White
Write-Host ""

$repoURL = Read-Host "Introduce la URL de tu repositorio GitHub (ej: https://github.com/usuario/the-hangover.git)"

if ($repoURL -eq "") {
    Write-Host "❌ URL vacía. Abortando..." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📍 Paso 6: Configurando origen remoto..." -ForegroundColor Yellow
git remote add origin $repoURL
git branch -M main
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Código subido a GitHub exitosamente" -ForegroundColor Green
} else {
    Write-Host "⚠️ Hubo un error al subir. Verifica tu URL y credenciales." -ForegroundColor Yellow
}
Write-Host ""

# Paso 7: Información de Vercel
Write-Host "📍 Paso 7: Próximo paso - Desplegar en Vercel" -ForegroundColor Yellow
Write-Host ""
Write-Host "Ahora necesitas desplegar en Vercel:" -ForegroundColor Cyan
Write-Host "  1. Ve a https://vercel.com" -ForegroundColor White
Write-Host "  2. Haz Sign Up con GitHub" -ForegroundColor White
Write-Host "  3. Haz clic en 'New Project'" -ForegroundColor White
Write-Host "  4. Selecciona 'the-hangover'" -ForegroundColor White
Write-Host "  5. En Environment Variables, agrega:" -ForegroundColor White
Write-Host "     • Clave: ADMIN_PASSWORD" -ForegroundColor White
Write-Host "     • Valor: rHqfuam06C##@V" -ForegroundColor White
Write-Host "  6. Haz clic en 'Deploy'" -ForegroundColor White
Write-Host ""

Write-Host "✅ ¡Script completado!" -ForegroundColor Green
Write-Host ""
Write-Host "Tu juego estará en: https://the-hangover.vercel.app" -ForegroundColor Cyan
Write-Host "Panel admin: https://the-hangover.vercel.app/admin.html" -ForegroundColor Cyan
Write-Host ""
Write-Host "🎉 ¡A disfrutar!" -ForegroundColor Magenta
