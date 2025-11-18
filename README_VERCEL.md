# 🚀 Despliegue en Vercel - The Hangover Party Game

## Pasos para desplegar en Vercel

### 1. **Preparar el repositorio Git**

Primero, necesitas subir tu proyecto a GitHub:

```bash
# Abre PowerShell en tu carpeta del proyecto
cd c:\Users\admin\Desktop\TheHangover

# Inicializar git (si no lo has hecho)
git init
git add .
git commit -m "Initial commit - The Hangover Party Game"
```

Luego, en GitHub:
1. Crea un nuevo repositorio en [github.com/new](https://github.com/new)
2. Copia el nombre exacto del repositorio (ej: `the-hangover`)
3. Ejecuta en PowerShell:

```bash
git remote add origin https://github.com/TU_USUARIO/the-hangover.git
git branch -M main
git push -u origin main
```

### 2. **Registrarse en Vercel**

1. Ve a [vercel.com](https://vercel.com)
2. Haz clic en "Sign Up"
3. Elige "Continue with GitHub"
4. Autoriza Vercel en GitHub

### 3. **Desplegar el proyecto**

En el panel de Vercel:
1. Haz clic en "New Project"
2. Selecciona tu repositorio `the-hangover`
3. Vercel detectará automáticamente que es un proyecto Node.js
4. En "Environment Variables", añade:
   - Clave: `ADMIN_PASSWORD`
   - Valor: `rHqfuam06C##@V`
5. Haz clic en "Deploy"

**¡Listo!** Vercel generará una URL como: `https://the-hangover.vercel.app`

### 4. **Acceder al juego**

- **Juego**: `https://the-hangover.vercel.app`
- **Panel Admin**: `https://the-hangover.vercel.app/admin.html`
- **Contraseña**: `rHqfuam06C##@V`

---

## ⚠️ Limitaciones importantes

### Almacenamiento de preguntas en Vercel

Vercel es un entorno **sin almacenamiento persistente** (ephemeral filesystem). Esto significa:

- ✅ Las preguntas originales en `questions.json` se mostrarán
- ❌ Las preguntas aprobadas por usuarios **NO se guardarán** entre despliegues

### Soluciones recomendadas

#### **Opción 1: Firebase Realtime Database** (Recomendado)
```javascript
// Reemplaza el almacenamiento JSON con Firebase
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, onValue } from 'firebase/database';
```

#### **Opción 2: MongoDB Atlas** 
```javascript
// Usa MongoDB para almacenar preguntas pendientes
const mongodb = require('mongodb');
```

#### **Opción 3: Supabase**
```javascript
// PostgreSQL alojado con API REST simple
import { createClient } from '@supabase/supabase-js';
```

---

## 🔄 Actualizar el proyecto

Cada vez que hagas cambios localmente:

```bash
git add .
git commit -m "Descripción de cambios"
git push origin main
```

Vercel se actualiza automáticamente 🚀

---

## 🛠️ Estructura de archivos para Vercel

```
the-hangover/
├── vercel.json          ← Configuración de Vercel (IMPORTANTE)
├── server.js            ← Servidor Node.js/Express
├── package.json         ← Dependencias
├── index.html           ← Juego principal
├── admin.html           ← Panel de administración
├── script.js            ← Lógica del juego
├── styles.css           ← Estilos
├── questions.json       ← Preguntas originales
├── pending_questions.json ← Preguntas pendientes (no persistente)
└── .gitignore           ← Archivos a ignorar
```

---

## ✅ Verificación

Después de desplegar, verifica que funciona:

1. Abre `https://tu-dominio.vercel.app`
2. Intenta girar la ruleta
3. Envía una pregunta de prueba
4. Accede a `/admin.html` e intenta aprobarla
5. Verifica que la pregunta aparece en el listado

---

## 🆘 Solución de problemas

### Error: "Cannot find module 'express'"
- Asegúrate de que `package.json` tiene `express` en dependencias
- Ejecuta: `npm install` localmente y haz push

### Error: "ENOENT: no such file or directory"
- En Vercel, los archivos JSON se crean vacíos
- Agrega este código en `server.js`:

```javascript
if (!fs.existsSync(QUESTIONS_FILE)) {
    writeFile(QUESTIONS_FILE, { "Verdad": [], "Reto": [], ... });
}
```

### Las preguntas aprobadas desaparecen
- Es porque Vercel usa almacenamiento temporal
- Implementa una de las soluciones de base de datos arriba

---

## 📝 Próximos pasos

1. **Implementar base de datos persistente** (Firebase, MongoDB o Supabase)
2. **Agregar autenticación mejorada** (JWT en lugar de base64)
3. **Crear dashboard de estadísticas** (preguntas más votadas, etc.)
4. **Implementar rate limiting** en `/api/suggest-question`
5. **Agregar validación de contenido** antes de aprobar

---

**¡Disfruta tu juego en producción! 🎉**
