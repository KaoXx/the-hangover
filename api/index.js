const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Variables
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'rHqfuam06C##@V';
const QUESTIONS_FILE = path.join(__dirname, '../questions.json');
const PENDING_FILE = path.join(__dirname, '../pending_questions.json');

// Helpers para leer/escribir archivos
function readFile(filename) {
    try {
        const data = fs.readFileSync(filename, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.log(`Archivo ${filename} no encontrado, usando valores por defecto`);
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
app.post('/suggest-question', (req, res) => {
    try {
        const { category, text } = req.body;

        if (!category || !text) {
            return res.status(400).json({ error: 'Categoría y texto requeridos' });
        }

        let pending = readFile(PENDING_FILE);
        
        if (!pending.pending) {
            pending.pending = [];
        }

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
app.post('/admin-login', (req, res) => {
    const { password } = req.body;

    if (password === ADMIN_PASSWORD) {
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
app.post('/admin/pending-questions', (req, res) => {
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
app.post('/admin/approve-question', (req, res) => {
    try {
        const { token, questionId } = req.body;

        if (token !== Buffer.from(ADMIN_PASSWORD).toString('base64')) {
            return res.status(401).json({ error: 'No autorizado' });
        }

        let pending = readFile(PENDING_FILE);
        let questions = readFile(QUESTIONS_FILE);

        const question = pending.pending?.find(q => q.id === parseInt(questionId) || q.id === questionId);
        
        if (!question) {
            console.error('Pregunta no encontrada. ID:', questionId, 'Pendientes:', pending.pending);
            return res.status(404).json({ error: 'Pregunta no encontrada' });
        }

        if (!questions[question.category]) {
            questions[question.category] = [];
        }

        questions[question.category].push(question.text);

        pending.pending = pending.pending.filter(q => q.id !== parseInt(questionId) && q.id !== questionId);

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
app.post('/admin/reject-question', (req, res) => {
    try {
        const { token, questionId } = req.body;

        if (token !== Buffer.from(ADMIN_PASSWORD).toString('base64')) {
            return res.status(401).json({ error: 'No autorizado' });
        }

        let pending = readFile(PENDING_FILE);

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

// API para obtener preguntas
app.get('/questions', (req, res) => {
    const questions = readFile(QUESTIONS_FILE);
    res.json(questions);
});

module.exports = app;
