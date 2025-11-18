# 🎉 THE HANGOVER - Party Game Ruleta

Sistema de juego de ruleta para fiestas con preguntas, retos, prendas, tragos y contenido hot.

## 🚀 Instalación y Ejecución

### Requisitos
- Node.js instalado en tu sistema

### Pasos

1. **Abre una terminal en la carpeta del proyecto**

2. **Instala las dependencias:**
```bash
npm install
```

3. **Inicia el servidor:**
```bash
npm start
```

El servidor se ejecutará en `http://localhost:3000`

4. **Abre el juego en tu navegador:**
- Juego: `http://localhost:3000/index.html`
- Panel Admin: `http://localhost:3000/admin.html`

---

## 🎮 Cómo Jugar

1. Haz clic en "COMENZAR JUEGO"
2. Selecciona las categorías que quieras usar
3. Pulsa "Iniciar Ruleta" para comenzar
4. Haz clic en SPIN para girar la ruleta
5. Responde/realiza lo que salga

## ➕ Añadir Preguntas Personalizadas

1. Durante el juego, haz clic en el botón "+ Pregunta"
2. Selecciona la categoría
3. Escribe tu pregunta o reto
4. Envía para moderación

La pregunta será revisada por un administrador antes de aparecer en el juego.

---

## 🔐 Panel de Administrador

**URL:** `http://localhost:3000/admin.html`

**Contraseña:** `rHqfuam06C##@V`

### Funciones:
- Ver todas las preguntas pendientes de revisión
- Aprobar preguntas para que aparezcan en el juego
- Rechazar preguntas inapropiadas

---

## 📁 Estructura de Archivos

```
TheHangover/
├── index.html              # Página principal del juego
├── admin.html              # Panel de administrador
├── styles.css              # Estilos CSS
├── script.js               # Lógica del juego
├── server.js               # Backend Node.js
├── questions.json          # Preguntas aprobadas
├── pending_questions.json  # Preguntas en espera
├── package.json            # Dependencias
└── README.md               # Este archivo
```

---

## 🎯 Categorías Disponibles

- **❓ Verdad** - Preguntas comprometedoras
- **⚡ Reto** - Retos físicos/sensuales
- **💰 Moneda** - Acciones entre dos personas
- **👔 Prenda** - Quitarse prendas progresivamente
- **🍺 Tragos** - Desafíos con bebidas
- **🔥 Hot** - Preguntas explícitas

---

## 🔊 Características

✅ Ruleta interactiva con 6 categorías
✅ Efectos de sonido y animaciones
✅ Confeti y efectos visuales
✅ Sistema de moderación de preguntas
✅ Panel de administración
✅ Más de 300 preguntas incluidas
✅ Diseño responsivo (móvil, tablet, desktop)
✅ Interfaz en español

---

## ⚙️ Solución de Problemas

**"Error de conexión"**
- Asegúrate de que el servidor está ejecutándose (`npm start`)
- El puerto 3000 debe estar disponible

**"CORS error"**
- El servidor está configurado para permitir CORS
- Si persiste, reinicia el servidor

**Preguntas no se guardan**
- El servidor debe estar ejecutándose
- Revisa la consola del navegador (F12) para errores

---

## 📝 Licencia

MIT - Libre para usar y modificar

---

¡Que te diviertas en la fiesta! 🎉🍺
