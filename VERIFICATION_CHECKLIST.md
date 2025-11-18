# ✅ Checklist de verificación - Antes de desplegar

## 📋 Verificaciones técnicas

- [ ] `vercel.json` existe y tiene configuración correcta
- [ ] `package.json` tiene `"engines": { "node": "18.x" }`
- [ ] `server.js` usa `process.env.PORT || 3000`
- [ ] `server.js` usa `process.env.ADMIN_PASSWORD || 'rHqfuam06C##@V'`
- [ ] `server.js` exporta `module.exports = app`
- [ ] `script.js` define `API_BASE_URL` dinámicamente
- [ ] `admin.html` define `API_BASE_URL` dinámicamente
- [ ] `.gitignore` existe y contiene `node_modules/`
- [ ] `questions.json` tiene contenido (399 preguntas)
- [ ] `pending_questions.json` existe aunque esté vacío

## 📦 Dependencias

- [ ] `express` en package.json
- [ ] `body-parser` en package.json
- [ ] `cors` en package.json
- [ ] `npm install` ejecutado localmente (package-lock.json existe)

## 📚 Documentación

- [ ] `START_HERE.md` existe
- [ ] `VERCEL_SETUP.md` existe
- [ ] `README_VERCEL.md` existe
- [ ] `VERCEL_CONFIG.md` existe
- [ ] `FIREBASE_SETUP.md` existe
- [ ] `QUICK_START.md` existe

## 🔧 Configuración de Vercel

En `vercel.json`:
- [ ] `version` es `2`
- [ ] `builds` apunta a `server.js`
- [ ] `routes` redirige `/api/*` y `/*` a `server.js`
- [ ] `env` contiene `ADMIN_PASSWORD`

## 🔑 Credenciales

- [ ] Contraseña admin: `rHqfuam06C##@V` (guardada en lugar seguro)
- [ ] Esta contraseña está en `vercel.json` como variable de entorno

## 🌐 URLs dinámicas

En `script.js`:
```javascript
const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000' 
    : window.location.origin;
```
- [ ] Verificado

En `admin.html`:
```javascript
const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000' 
    : window.location.origin;
```
- [ ] Verificado

## 🧪 Pruebas locales

- [ ] El juego funciona en `http://localhost:3000`
- [ ] El panel admin funciona en `http://localhost:3000/admin.html`
- [ ] La contraseña admin funciona
- [ ] Puedo enviar una pregunta desde el modal
- [ ] Puedo ver preguntas pendientes en admin
- [ ] Puedo aprobar una pregunta
- [ ] La pregunta aprobada aparece en `questions.json`

## 📤 Antes de hacer push a GitHub

- [ ] Cambios confirmados con `git add .`
- [ ] Commit creado con `git commit -m "..."`
- [ ] Remote agregado: `git remote add origin https://github.com/usuario/the-hangover.git`
- [ ] Rama renombrada a `main`: `git branch -M main`
- [ ] Código subido: `git push -u origin main`

## 🚀 En Vercel

- [ ] Cuenta Vercel creada
- [ ] Proyecto importado desde GitHub
- [ ] Variable `ADMIN_PASSWORD` agregada en Environment Variables
- [ ] Botón "Deploy" presionado
- [ ] Despliegue completado (estado: "Ready")

## 🎯 Verificación final

- [ ] Accedo a `https://tu-dominio.vercel.app` ✅
- [ ] El juego carga completamente ✅
- [ ] La ruleta gira suavemente ✅
- [ ] Veo las 6 categorías ✅
- [ ] Panel admin en `/admin.html` ✅
- [ ] Puedo logearme con la contraseña ✅
- [ ] Puedo enviar una pregunta de prueba ✅
- [ ] Puedo ver la pregunta pendiente ✅
- [ ] Puedo aprobar la pregunta ✅

## ⚠️ Limitaciones conocidas

- [ ] Entiendo que los datos NO persisten entre reinicios
- [ ] Sé que debo usar Firebase para persistencia
- [ ] He leído `FIREBASE_SETUP.md` (opcional)

## ✨ ¡Listo!

Si todo está marcado, ¡tu proyecto está 100% listo para Vercel! 🎉

---

**Notas importantes:**

1. En Vercel, `pending_questions.json` será temporal (se resetea cada deploy)
2. Las preguntas en `questions.json` también son temporales (¡implementa Firebase!)
3. El servidor se ejecutará en el puerto que Vercel asigne (automático)
4. Las URLs de API se detectan automáticamente según el dominio

---

**¿Necesitas ayuda?** Abre `START_HERE.md`
