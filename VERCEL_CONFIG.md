# ✅ Checklist de configuración para Vercel

Tu proyecto **The Hangover** está listo para desplegar en Vercel. Aquí está el estado de todos los archivos:

## 📋 Archivos modificados/creados

| Archivo | Estado | Cambios |
|---------|--------|---------|
| `vercel.json` | ✅ Creado | Configuración oficial de Vercel |
| `.gitignore` | ✅ Creado | Archivos a ignorar en Git |
| `server.js` | ✅ Actualizado | Ahora soporta puerto dinámico |
| `script.js` | ✅ Actualizado | URL de API dinámica (localhost/Vercel) |
| `admin.html` | ✅ Actualizado | URL de API dinámica |
| `package.json` | ✅ Actualizado | Engine especificado (Node 18.x) |
| `README_VERCEL.md` | ✅ Creado | Guía completa de despliegue |
| `VERCEL_SETUP.md` | ✅ Creado | Tutorial paso a paso |

---

## 🎯 Cambios principales

### 1. **server.js**
```javascript
// ANTES
const PORT = 3000;
const ADMIN_PASSWORD = 'rHqfuam06C##@V';

// AHORA
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'rHqfuam06C##@V';

// Y exporta para Vercel
module.exports = app;
```

### 2. **script.js**
```javascript
// ANTES
fetch('http://localhost:3000/api/suggest-question', ...)

// AHORA
const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000' 
    : window.location.origin;

fetch(`${API_BASE_URL}/api/suggest-question`, ...)
```

### 3. **admin.html**
Mismo cambio que `script.js` para URLs dinámicas.

### 4. **vercel.json**
```json
{
  "version": 2,
  "builds": [{"src": "server.js", "use": "@vercel/node"}],
  "routes": [...],
  "env": {"ADMIN_PASSWORD": "rHqfuam06C##@V"}
}
```

---

## 🚀 Pasos siguientes

### Opción A: Rápido (5 minutos)
1. Lee `VERCEL_SETUP.md`
2. Sigue los pasos paso a paso
3. ¡Listo!

### Opción B: Más información
1. Lee `README_VERCEL.md` para más detalles
2. Luego sigue `VERCEL_SETUP.md`

---

## 📌 Información importante

### URL del juego después de desplegar:
```
https://the-hangover.vercel.app
```

### URL del panel admin:
```
https://the-hangover.vercel.app/admin.html
Contraseña: rHqfuam06C##@V
```

### Para cambios futuros:
```powershell
git add .
git commit -m "Descripción del cambio"
git push origin main
```

---

## ⚠️ Limitación conocida

**Los archivos JSON no persisten en Vercel** (almacenamiento temporal).

Esto significa:
- ✅ Las 399 preguntas originales se mostrarán
- ❌ Las preguntas nuevas que apruebes desaparecerán al reiniciar

**Solución**: Implementar una base de datos (Firebase, MongoDB, Supabase).
Ver `README_VERCEL.md` para opciones.

---

## 🆘 Necesitas ayuda?

- **¿Cómo subir a GitHub?** → Lee `VERCEL_SETUP.md` paso 1-2
- **¿Cómo desplegar en Vercel?** → Lee `VERCEL_SETUP.md` paso 3
- **¿Por qué no persisten los datos?** → Lee `README_VERCEL.md` sección "Limitaciones"
- **¿Base de datos?** → Lee `README_VERCEL.md` sección "Soluciones recomendadas"

---

**¡Tu proyecto está listo! Ahora solo necesitas seguir los pasos en `VERCEL_SETUP.md` 🚀**
