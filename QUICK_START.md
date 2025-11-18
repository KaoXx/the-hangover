# 🎉 The Hangover - Guía de despliegue en Vercel

```
┌─────────────────────────────────────────────────────────────┐
│       🎮 The Hangover Party Game - Ready for Vercel        │
│                                                             │
│  Juego: https://the-hangover.vercel.app                    │
│  Admin: https://the-hangover.vercel.app/admin.html         │
│  Pass:  rHqfuam06C##@V                                      │
└─────────────────────────────────────────────────────────────┘
```

## 📋 Archivos importantes

### Para desplegar:
- ✅ **vercel.json** - Configuración oficial
- ✅ **server.js** - Backend Node.js + Express
- ✅ **package.json** - Dependencias
- ✅ **.gitignore** - Archivos a ignorar en Git

### Tutoriales:
- 📖 **VERCEL_SETUP.md** ← **EMPIEZA AQUÍ** (paso a paso)
- 📖 **README_VERCEL.md** - Información detallada
- 📖 **VERCEL_CONFIG.md** - Resumen de cambios
- 📖 **FIREBASE_SETUP.md** - Base de datos persistente

### Automatización:
- 🔧 **deploy-to-vercel.ps1** - Script PowerShell automático

---

## 🚀 3 formas de desplegar

### **Opción 1: Automático (Recomendado)**
```powershell
# Abre PowerShell en tu carpeta
cd c:\Users\admin\Desktop\TheHangover
.\deploy-to-vercel.ps1
```
Sigue las instrucciones y ¡listo!

### **Opción 2: Manual paso a paso**
Sigue el archivo **VERCEL_SETUP.md**

### **Opción 3: Interfaz gráfica**
1. Abre [github.com/new](https://github.com/new)
2. Crea repositorio manualmente
3. Copia archivos con drag & drop
4. Abre [vercel.com](https://vercel.com) e importa

---

## ⏱️ Tiempo estimado

| Paso | Tiempo |
|------|--------|
| Crear cuenta GitHub | 2 min |
| Subir código | 2 min |
| Crear cuenta Vercel | 2 min |
| Desplegar | 3 min |
| **TOTAL** | **~10 minutos** |

---

## 🎯 Checklist rápido

- [ ] Lee **VERCEL_SETUP.md**
- [ ] Crea cuenta en [github.com](https://github.com)
- [ ] Crea repositorio `the-hangover`
- [ ] Sube código con Git
- [ ] Crea cuenta en [vercel.com](https://vercel.com)
- [ ] Importa repositorio
- [ ] Agrega variable `ADMIN_PASSWORD`
- [ ] Haz clic en "Deploy"
- [ ] Abre `https://the-hangover.vercel.app`
- [ ] ¡Disfruta! 🎉

---

## ⚠️ Lo que debes saber

### ✅ Esto funcionará:
- El juego con sus 399 preguntas
- La ruleta girando
- El panel admin
- Envío de preguntas nuevas
- Aprobación/rechazo de preguntas

### ❌ Esto NO persistirá:
- Las preguntas nuevas que apruebes desaparecerán al reiniciar Vercel
- Esto es porque Vercel usa almacenamiento temporal

### ✅ Solución:
Implementar Firebase (ver **FIREBASE_SETUP.md**)

---

## 📞 URLs importantes

| Recurso | URL |
|---------|-----|
| GitHub | [github.com](https://github.com) |
| Vercel | [vercel.com](https://vercel.com) |
| Firebase | [firebase.google.com](https://firebase.google.com) |
| Node.js | [nodejs.org](https://nodejs.org) |

---

## 🆘 Ayuda rápida

**P: ¿Qué es GitHub?**
R: Servidor para guardar tu código online y que Vercel lo despliegue.

**P: ¿Qué es Vercel?**
R: Servicio que ejecuta tu juego en internet para que todos accedan.

**P: ¿Necesito instalar algo?**
R: Solo Git. Ya tienes Node.js instalado.

**P: ¿Es gratis?**
R: Sí, tanto GitHub como Vercel (planes gratuitos).

**P: ¿Las preguntas se guardarán?**
R: En Vercel no. Pero puedes usar Firebase para que sí (gratis también).

**P: ¿Cuánto tarda en desplegar?**
R: Unos 3-5 minutos después de hacer push a GitHub.

---

## 🎓 Aprenderás:

- Git y GitHub (control de versiones)
- Vercel (despliegue en la nube)
- Node.js + Express (backend)
- Variables de entorno
- APIs REST
- Arquitectura web moderna

---

## 📚 Siguientes pasos (opcional)

1. **Agregar base de datos persistente** (Firebase) → Ver FIREBASE_SETUP.md
2. **Mejorar seguridad** (JWT tokens)
3. **Agregar estadísticas** (cuáles preguntas es más votadas)
4. **Interfaz mejorada** (más estilos, animaciones)
5. **Validación de contenido** (automática antes de aprobar)

---

## 🎊 ¿Listo?

**Próximo paso:** Abre y sigue **VERCEL_SETUP.md**

¡Tu juego estará online en 10 minutos! 🚀

---

**Hecho con ❤️ para The Hangover**
