const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// ============= CONFIGURACIÓN =============
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname), {
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.js')) res.setHeader('Content-Type', 'application/javascript');
        else if (filePath.endsWith('.css')) res.setHeader('Content-Type', 'text/css');
    }
}));

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'rHqfuam06C##@V';
const QUESTIONS_FILE = path.join(__dirname, 'questions.json');
const PENDING_FILE = path.join(__dirname, 'pending_questions.json');

// ============= ALMACENAMIENTO EN MEMORIA =============
let pendingQuestionsMemory = [];

// Cargar preguntas pendientes del archivo al iniciar
function loadPendingQuestions() {
    try {
        if (fs.existsSync(PENDING_FILE)) {
            const data = fs.readFileSync(PENDING_FILE, 'utf8');
            const parsed = JSON.parse(data);
            pendingQuestionsMemory = parsed.pending || [];
            console.log(`✅ Cargadas ${pendingQuestionsMemory.length} preguntas pendientes`);
        }
    } catch (error) {
        console.error('Error cargando preguntas pendientes:', error);
        pendingQuestionsMemory = [];
    }
}

// Guardar preguntas pendientes al archivo
function savePendingQuestions() {
    try {
        fs.writeFileSync(PENDING_FILE, JSON.stringify({ pending: pendingQuestionsMemory }, null, 2), 'utf8');
    } catch (error) {
        console.error('Error guardando preguntas pendientes:', error);
    }
}

// Leer preguntas aprobadas
function readApprovedQuestions() {
    try {
        if (fs.existsSync(QUESTIONS_FILE)) {
            return JSON.parse(fs.readFileSync(QUESTIONS_FILE, 'utf8'));
        }
    } catch (error) {
        console.error('Error leyendo preguntas aprobadas:', error);
    }
    return { "Verdad": [], "Reto": [], "Moneda": [], "Prenda": [], "Tragos": [], "Hot": [] };
}

// Guardar preguntas aprobadas
function saveApprovedQuestions(data) {
    try {
        fs.writeFileSync(QUESTIONS_FILE, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error('Error guardando preguntas aprobadas:', error);
    }
}

// ============= RUTAS HTML =============
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/index.html', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/admin.html', (req, res) => res.sendFile(path.join(__dirname, 'admin.html')));

// ============= API: OBTENER PREGUNTAS APROBADAS =============
app.get('/api/questions', (req, res) => {
    const questions = readApprovedQuestions();
    res.json(questions);
});

// ============= API: SUGERIR PREGUNTA =============
app.post('/api/suggest-question', (req, res) => {
    try {
        const { category, text } = req.body;
        if (!category || !text) {
            return res.status(400).json({ error: 'Categoría y texto requeridos' });
        }

        const newQuestion = { id: Date.now(), category, text, timestamp: new Date().toISOString(), status: 'pending' };
        pendingQuestionsMemory.push(newQuestion);
        savePendingQuestions();

        console.log('✅ Pregunta sugerida:', newQuestion.text.substring(0, 50));
        res.json({ success: true, message: 'Pregunta enviada para moderación', id: newQuestion.id });
    } catch (error) {
        console.error('❌ Error sugerencia:', error);
        res.status(500).json({ error: 'Error al guardar' });
    }
});

// ============= API: LOGIN ADMIN =============
app.post('/api/admin-login', (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
        res.json({ success: true, token: Buffer.from(ADMIN_PASSWORD).toString('base64'), message: 'Autenticación exitosa' });
    } else {
        res.status(401).json({ success: false, error: 'Contraseña incorrecta' });
    }
});

// ============= API: OBTENER PREGUNTAS PENDIENTES =============
app.post('/api/admin/pending-questions', (req, res) => {
    try {
        const { token } = req.body;
        if (token !== Buffer.from(ADMIN_PASSWORD).toString('base64')) {
            return res.status(401).json({ error: 'No autorizado' });
        }

        console.log(`📋 Admin solicita preguntas pendientes: ${pendingQuestionsMemory.length}`);
        res.json(pendingQuestionsMemory);
    } catch (error) {
        console.error('❌ Error obteniendo pendientes:', error);
        res.status(500).json({ error: 'Error al obtener preguntas' });
    }
});

// ============= API: APROBAR PREGUNTA =============
app.post('/api/admin/approve-question', (req, res) => {
    try {
        const { token, questionId } = req.body;
        if (token !== Buffer.from(ADMIN_PASSWORD).toString('base64')) {
            return res.status(401).json({ error: 'No autorizado' });
        }

        const index = pendingQuestionsMemory.findIndex(q => q.id === parseInt(questionId) || q.id === questionId);
        if (index === -1) {
            return res.status(404).json({ error: 'Pregunta no encontrada' });
        }

        const question = pendingQuestionsMemory[index];
        const approvedQuestions = readApprovedQuestions();

        if (!approvedQuestions[question.category]) {
            approvedQuestions[question.category] = [];
        }

        approvedQuestions[question.category].push(question.text);
        saveApprovedQuestions(approvedQuestions);

        pendingQuestionsMemory.splice(index, 1);
        savePendingQuestions();

        console.log(`✅ Pregunta aprobada: "${question.text.substring(0, 50)}..."`);
        res.json({ success: true, message: 'Pregunta aprobada' });
    } catch (error) {
        console.error('❌ Error aprobando:', error);
        res.status(500).json({ error: 'Error al aprobar: ' + error.message });
    }
});

// ============= API: RECHAZAR PREGUNTA =============
app.post('/api/admin/reject-question', (req, res) => {
    try {
        const { token, questionId } = req.body;
        if (token !== Buffer.from(ADMIN_PASSWORD).toString('base64')) {
            return res.status(401).json({ error: 'No autorizado' });
        }

        const index = pendingQuestionsMemory.findIndex(q => q.id === parseInt(questionId) || q.id === questionId);
        if (index === -1) {
            return res.status(404).json({ error: 'Pregunta no encontrada' });
        }

        const question = pendingQuestionsMemory[index];
        pendingQuestionsMemory.splice(index, 1);
        savePendingQuestions();

        console.log(`❌ Pregunta rechazada: "${question.text.substring(0, 50)}..."`);
        res.json({ success: true, message: 'Pregunta rechazada' });
    } catch (error) {
        console.error('❌ Error rechazando:', error);
        res.status(500).json({ error: 'Error al rechazar' });
    }
});

// ============= CATCH-ALL =============
app.use((req, res) => {
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'Endpoint no encontrado' });
    }
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ============= INICIAR SERVIDOR =============
loadPendingQuestions();

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`\n🎮 The Hangover ejecutándose en http://localhost:${PORT}`);
        console.log(`📊 Panel admin: http://localhost:${PORT}/admin.html\n`);
    });
}

module.exports = app;
