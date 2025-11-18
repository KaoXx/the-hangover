# 🚀 VERCEL - INSTRUCCIONES SIMPLES

## Paso 1: Crear GitHub (5 minutos)

### 1.1 Crea cuenta
- Ve a [github.com](https://github.com)
- Haz Sign Up

### 1.2 Crea repositorio
- Haz clic en **+** (arriba a la derecha)
- Selecciona **New repository**
- Rellena:
  - Name: `the-hangover`
  - NO marques "Initialize this repository"
- Haz clic en **Create repository**

### 1.3 Sube tu código
GitHub te mostrará 3 comandos. Abre PowerShell en tu carpeta y ejecuta:

```powershell
cd c:\Users\admin\Desktop\TheHangover
git remote add origin https://github.com/TU_USUARIO/the-hangover.git
git branch -M main
git push -u origin main
```

**Nota**: Si GitHub pide autenticación, acepta.

---

## Paso 2: Desplegar en Vercel (5 minutos)

### 2.1 Crea cuenta
- Ve a [vercel.com](https://vercel.com)
- Haz **Sign Up**
- Elige **Continue with GitHub**

### 2.2 Importa el proyecto
- Haz clic en **New Project**
- Selecciona `the-hangover` de tu lista
- Haz clic en **Import**

### 2.3 Configura variables
- Vercel te pide Environment Variables
- Agrega:
  - **Clave**: `ADMIN_PASSWORD`
  - **Valor**: `rHqfuam06C##@V`
- Haz clic en **Deploy**

### 2.4 ¡Espera!
- Vercel está desplegando...
- Cuando veas "Deployment successful" ✅
- Tu URL aparecerá arriba (ej: `the-hangover.vercel.app`)

---

## Paso 3: Acceder (¡listo!)

### Juego:
```
https://the-hangover.vercel.app
```

### Panel Admin:
```
https://the-hangover.vercel.app/admin.html
Contraseña: rHqfuam06C##@V
```

---

## Si necesitas cambios

```powershell
# Hacer cambios en los archivos

git add .
git commit -m "Descripción del cambio"
git push origin main
```

**Vercel se actualiza automáticamente en 1-2 minutos.**

---

## ⚠️ Importante

Las preguntas nuevas que apruebes **NO se guardarán** entre despliegues.

**Solución para el futuro**: Agregar Firebase (ver FIREBASE_SETUP.md)

---

**¡Listo en 10 minutos! 🎉**
