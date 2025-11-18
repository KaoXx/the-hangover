# 🔥 Opción: Usar Firebase para almacenamiento persistente

## ¿Por qué Firebase?

- ✅ Base de datos en la nube (gratis hasta cierto límite)
- ✅ No necesitas servidor propio
- ✅ Escala automáticamente
- ✅ Muy fácil de integrar

## Pasos para integrar Firebase

### 1. Crear un proyecto en Firebase

1. Ve a [firebase.google.com](https://firebase.google.com)
2. Haz clic en "Ir a la consola"
3. Haz clic en "Crear proyecto"
4. Rellena:
   - **Nombre del proyecto**: `the-hangover` (o similar)
   - Desactiva Google Analytics (opcional)
5. Espera a que se cree

### 2. Obtener credenciales

1. En el sidebar, ve a "Project Settings" (engranaje)
2. Ve a la pestaña "Service Accounts"
3. Haz clic en "Generate New Private Key"
4. Se descargará un archivo JSON
5. Copia el contenido (lo usaremos en Vercel)

### 3. Crear base de datos Realtime

1. En el sidebar, ve a "Realtime Database"
2. Haz clic en "Create Database"
3. Elige "Europe" como ubicación
4. Elige "Start in test mode"
5. Haz clic en "Enable"

### 4. Modificar server.js

Reemplaza el código de lectura/escritura de archivos JSON con Firebase:

```javascript
const admin = require('firebase-admin');

// Inicializar Firebase
const serviceAccount = require('./firebase-key.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://the-hangover-xxxxx.firebaseio.com"
});

const db = admin.database();

// En lugar de readFile(QUESTIONS_FILE):
async function getQuestions() {
    const snapshot = await db.ref('questions').get();
    return snapshot.val() || { "Verdad": [], "Reto": [], ... };
}

// En lugar de writeFile():
async function saveQuestions(data) {
    await db.ref('questions').set(data);
}
```

### 5. Agregar firebase-admin a package.json

```bash
npm install firebase-admin
```

### 6. Subir clave a Vercel

1. En Vercel, ve a Project Settings
2. Environment Variables
3. Crea una variable `FIREBASE_KEY` con el contenido del JSON
4. En server.js, usa: `JSON.parse(process.env.FIREBASE_KEY)`

---

## Alternativa más simple: Firestore

Si prefieres algo más simple, puedes usar Firestore (también de Google):

```javascript
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Consultar datos
const querySnapshot = await getDocs(collection(db, "questions"));
```

---

## Otra opción: MongoDB Atlas

Si prefieres MongoDB:

```bash
npm install mongoose
```

```javascript
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI);

const questionSchema = new Schema({
    category: String,
    text: String,
    approved: Boolean,
    timestamp: Date
});

const Question = mongoose.model('Question', questionSchema);
```

---

## 🎯 Mi recomendación

Para tu caso, **Firebase Realtime Database es la mejor opción**:
- ✅ Más fácil de implementar que MongoDB
- ✅ Buena documentación
- ✅ Gratis para proyectos pequeños
- ✅ Tiempo real

---

**Una vez implementado Firebase, las preguntas aprobadas se guardarán permanentemente en Vercel. 🔥**
