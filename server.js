const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Servir archivos estáticos con cache adecuado
app.use(express.static(path.join(__dirname), {
    maxAge: '1d',
    etag: false
}));

// Middleware para servir archivos específicos
app.get('*.js', (req, res, next) => {
    res.set('Content-Type', 'application/javascript');
    next();
});

app.get('*.css', (req, res, next) => {
    res.set('Content-Type', 'text/css');
    next();
});

// Variables
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'rHqfuam06C##@V';
const QUESTIONS_FILE = path.join(__dirname, 'questions.json');
const PENDING_FILE = path.join(__dirname, 'pending_questions.json');

// Helpers para leer/escribir archivos
function readFile(filename) {
    try {
        const data = fs.readFileSync(filename, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.log(`Archivo ${filename} no encontrado, usando valores por defecto`);
        // Retornar estructura vacía si el archivo no existe
        if (filename === QUESTIONS_FILE) {
            return { "Verdad": [], "Reto": [], "Moneda": [], "Prenda": [], "Tragos": [], "Hot": [] };
        } else if (filename === PENDING_FILE) {
            return { "pending": [] };
        }
        return {};
    }
}

function writeFile(filename, data) {
    try {
        fs.writeFileSync(filename, JSON.stringify(data, null, 2), 'utf8');
        console.log(`Archivo ${filename} actualizado`);
    } catch (error) {
        console.error(`Error escribiendo ${filename}:`, error);
    }
}

// Endpoint para enviar pregunta (usuario normal)
app.post('/api/suggest-question', (req, res) => {
    try {
        const { category, text } = req.body;

        if (!category || !text) {
            return res.status(400).json({ error: 'Categoría y texto requeridos' });
        }

        let pending = readFile(PENDING_FILE);
        
        if (!pending.pending) {
            pending.pending = [];
        }

        // Crear objeto de pregunta pendiente
        const newQuestion = {
            id: Date.now(),
            category,
            text,
            timestamp: new Date().toISOString(),
            status: 'pending'
        };

        pending.pending.push(newQuestion);
        writeFile(PENDING_FILE, pending);

        res.json({ 
            success: true, 
            message: 'Pregunta enviada para moderación',
            id: newQuestion.id
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al guardar la pregunta' });
    }
});

// Endpoint para autenticación admin
app.post('/api/admin-login', (req, res) => {
    const { password } = req.body;

    if (password === ADMIN_PASSWORD) {
        // En producción, usar JWT tokens
        res.json({ 
            success: true, 
            token: Buffer.from(ADMIN_PASSWORD).toString('base64'),
            message: 'Autenticación exitosa'
        });
    } else {
        res.status(401).json({ success: false, error: 'Contraseña incorrecta' });
    }
});

// Endpoint para obtener preguntas pendientes (admin)
app.post('/api/admin/pending-questions', (req, res) => {
    try {
        const { token } = req.body;

        if (token !== Buffer.from(ADMIN_PASSWORD).toString('base64')) {
            return res.status(401).json({ error: 'No autorizado' });
        }

        const pending = readFile(PENDING_FILE);
        res.json(pending.pending || []);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener preguntas' });
    }
});

// Endpoint para aprobar pregunta (admin)
app.post('/api/admin/approve-question', (req, res) => {
    try {
        const { token, questionId } = req.body;

        if (token !== Buffer.from(ADMIN_PASSWORD).toString('base64')) {
            return res.status(401).json({ error: 'No autorizado' });
        }

        let pending = readFile(PENDING_FILE);
        let questions = readFile(QUESTIONS_FILE);

        // Buscar la pregunta pendiente (convertir a número)
        const question = pending.pending?.find(q => q.id === parseInt(questionId) || q.id === questionId);
        
        if (!question) {
            console.error('Pregunta no encontrada. ID:', questionId, 'Pendientes:', pending.pending);
            return res.status(404).json({ error: 'Pregunta no encontrada' });
        }

        // Asegurarse de que la categoría existe
        if (!questions[question.category]) {
            questions[question.category] = [];
        }

        // Añadir a preguntas aprobadas
        questions[question.category].push(question.text);

        // Eliminar de pendientes
        pending.pending = pending.pending.filter(q => q.id !== parseInt(questionId) && q.id !== questionId);

        // Guardar cambios
        writeFile(QUESTIONS_FILE, questions);
        writeFile(PENDING_FILE, pending);

        console.log('Pregunta aprobada:', question.text, 'en', question.category);

        res.json({ 
            success: true, 
            message: 'Pregunta aprobada y añadida'
        });
    } catch (error) {
        console.error('Error al aprobar:', error);
        res.status(500).json({ error: 'Error al aprobar pregunta: ' + error.message });
    }
});

// Endpoint para rechazar pregunta (admin)
app.post('/api/admin/reject-question', (req, res) => {
    try {
        const { token, questionId } = req.body;

        if (token !== Buffer.from(ADMIN_PASSWORD).toString('base64')) {
            return res.status(401).json({ error: 'No autorizado' });
        }

        let pending = readFile(PENDING_FILE);

        // Eliminar de pendientes (convertir a número)
        pending.pending = pending.pending.filter(q => q.id !== parseInt(questionId) && q.id !== questionId);

        writeFile(PENDING_FILE, pending);

        console.log('Pregunta rechazada. ID:', questionId);

        res.json({ 
            success: true, 
            message: 'Pregunta rechazada'
        });
    } catch (error) {
        console.error('Error al rechazar:', error);
        res.status(500).json({ error: 'Error al rechazar pregunta' });
    }
});

// Ruta raíz - servir index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/admin.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Catch-all para archivos estáticos
app.use((req, res, next) => {
    const filePath = path.join(__dirname, req.path);
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        next();
    }
});

// API para obtener preguntas
app.get('/api/questions', (req, res) => {
    const questions = readFile(QUESTIONS_FILE);
    res.json(questions);
});

// Iniciar servidor (solo en desarrollo local)
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🎮 Servidor The Hangover ejecutándose en http://localhost:${PORT}`);
        console.log(`📊 Panel admin disponible en http://localhost:${PORT}/admin.html`);
    });
}

// Exportar para Vercel
module.exports = app;
