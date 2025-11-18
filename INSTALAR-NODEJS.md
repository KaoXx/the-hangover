# 📥 INSTALAR NODE.JS

## Opción 1: INSTALACIÓN AUTOMÁTICA (Recomendado)

### En Windows:

1. **Haz clic derecho en `install-nodejs.bat`**
2. Selecciona **"Ejecutar como administrador"**
3. Presiona cualquier tecla cuando pida
4. **Espera 2-3 minutos** a que termine

O alternativamente:

1. Abre PowerShell **como administrador**
2. Ve a la carpeta del proyecto:
```powershell
cd C:\Users\admin\Desktop\TheHangover
```
3. Ejecuta:
```powershell
.\install-nodejs.ps1
```
4. Presiona `Y` si te pide confirmación

---

## Opción 2: INSTALACIÓN MANUAL

Si la automática no funciona:

1. Ve a: https://nodejs.org/
2. Descarga **LTS (18.x o superior)**
3. Ejecuta el instalador `.msi`
4. Sigue los pasos por defecto
5. **Reinicia tu máquina**

---

## ✅ Verificar que Node.js está instalado

Abre PowerShell y escribe:
```powershell
node --version
npm --version
```

Deberías ver versiones como:
```
v18.18.0
9.6.7
```

---

## 🚀 Una vez instalado Node.js

En la carpeta del proyecto (`c:\Users\admin\Desktop\TheHangover`):

1. Instalar dependencias:
```powershell
npm install
```

2. Iniciar el servidor:
```powershell
npm start
```

3. Abrir en navegador:
- **Juego**: http://localhost:3000/index.html
- **Admin**: http://localhost:3000/admin.html

---

## ⚠️ Si algo falla

1. **Cierra PowerShell completamente** y abre una nueva
2. Navega a la carpeta del proyecto
3. Intenta de nuevo

El Node.js puede necesitar una nueva terminal para reconocer el PATH.

---

¿Necesitas ayuda? Pon en pausa cuando tengas dudas.
