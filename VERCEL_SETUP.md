# 📤 Paso a paso: Subir a GitHub y desplegar en Vercel

## Parte 1: Configurar Git en tu máquina

### 1.1 Abre PowerShell como Administrador

Press `Win + X` y selecciona "Windows PowerShell (Admin)" o abre PowerShell normalmente.

### 1.2 Navega a tu carpeta del proyecto

```powershell
cd c:\Users\admin\Desktop\TheHangover
```

### 1.3 Configura Git (primera vez solo)

```powershell
git config --global user.name "Tu Nombre"
git config --global user.email "tu.email@example.com"
```

### 1.4 Inicializa el repositorio local

```powershell
git init
```

### 1.5 Agrega todos los archivos

```powershell
git add .
```

### 1.6 Crea tu primer commit

```powershell
git commit -m "Initial commit - The Hangover Party Game"
```

---

## Parte 2: Crear repositorio en GitHub

### 2.1 Abre GitHub

Ve a [github.com](https://github.com) y asegúrate de estar logueado.

### 2.2 Crea un nuevo repositorio

1. Haz clic en el icono **+** arriba a la derecha
2. Selecciona "New repository"
3. Rellena:
   - **Repository name**: `the-hangover` (o el nombre que prefieras)
   - **Description**: `Party Game Ruleta - The Hangover`
   - **Public** o **Private** (según prefieras)
   - **NO** marques "Initialize this repository with a README"
4. Haz clic en "Create repository"

### 2.3 GitHub te mostrará comandos. Ejecuta estos en PowerShell:

```powershell
# Agregar el origen remoto (copia EXACTAMENTE la URL que te muestra GitHub)
git remote add origin https://github.com/TU_USUARIO/the-hangover.git

# Cambiar el nombre de la rama a 'main'
git branch -M main

# Subir los archivos
git push -u origin main
```

**Nota**: Si te pide que autentiques, GitHub te abrirá el navegador o te pedirá un token.

---

## Parte 3: Desplegar en Vercel

### 3.1 Crea cuenta en Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Haz clic en "Sign Up"
3. Elige "Continue with GitHub"
4. Autoriza Vercel

### 3.2 Importa tu proyecto

1. En el dashboard de Vercel, haz clic en "New Project"
2. Vercel te mostrará tus repositorios de GitHub
3. Busca y selecciona `the-hangover`
4. Haz clic en "Import"

### 3.3 Configura las variables de entorno

1. Vercel debería detectar que es un proyecto Node.js
2. En la sección "Environment Variables", agrega:
   
   | Clave | Valor |
   |-------|-------|
   | `ADMIN_PASSWORD` | `rHqfuam06C##@V` |

3. Haz clic en "Deploy"

### 3.4 ¡Espera el despliegue!

Vercel compilará tu proyecto. Cuando termine:
- Verás un mensaje "Deployment successful! 🎉"
- Tu URL será algo como: `https://the-hangover.vercel.app`

---

## Parte 4: Acceder a tu juego

### 4.1 El juego está en:
```
https://the-hangover.vercel.app
```

### 4.2 Panel de admin en:
```
https://the-hangover.vercel.app/admin.html
Contraseña: rHqfuam06C##@V
```

---

## Parte 5: Hacer cambios en el futuro

Cada vez que quieras actualizar el juego:

```powershell
# Desde PowerShell en c:\Users\admin\Desktop\TheHangover

git add .
git commit -m "Descripción de los cambios"
git push origin main
```

¡Vercel se actualiza automáticamente! ✨

---

## ⚠️ Importante: Almacenamiento de preguntas

**En Vercel, los archivos JSON (como `pending_questions.json`) NO persisten** entre despliegues.

Esto significa:
- ✅ Las preguntas originales en `questions.json` se mostrarán
- ❌ Las preguntas nuevas que apruebes **se perderán al reiniciar Vercel**

### Solución a largo plazo:

Implementar una base de datos como:
- **Firebase** (recomendado)
- **MongoDB Atlas**
- **Supabase**

Ver `README_VERCEL.md` para más detalles.

---

## 🆘 Errores comunes

### Error: "Permission denied (publickey)"
- GitHub está pidiendo autenticación
- Usa HTTPS en lugar de SSH:
  ```powershell
  git remote set-url origin https://github.com/TU_USUARIO/the-hangover.git
  ```

### Error: "fatal: not a git repository"
- Olvidaste `git init` en tu carpeta
- Ejecuta: `git init`

### El juego en Vercel no muestra preguntas
- Revisa que `questions.json` tenga el contenido correcto
- En Vercel, abre la consola del navegador (F12) y busca errores

---

## ✅ Checklist final

- [ ] Git configurado con `git config --global`
- [ ] Repositorio creado en GitHub
- [ ] Código subido con `git push`
- [ ] Cuenta Vercel creada
- [ ] Proyecto importado en Vercel
- [ ] Variable `ADMIN_PASSWORD` configurada
- [ ] Despliegue completado
- [ ] Accediste al juego en Vercel
- [ ] Panel admin funciona

**¡Listo para jugar! 🎉**
