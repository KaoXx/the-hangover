const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

// ============= CONFIGURACIÓN SUPABASE =============
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://virmicqlkvygmqkjoekf.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpcm1pY3Fsa3Z5Z21xa2pvZWtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0MzQzMzcsImV4cCI6MjA3OTAxMDMzN30.LabkJdHzLk-cZcLLdA--yCwFMeXfq6faRnfrWVublvQ';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpcm1pY3Fsa3Z5Z21xa2pvZWtmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzQzNDMzNywiZXhwIjoyMDc5MDEwMzM3fQ.PkHil53rcQ_1NjL8yBufF3BU2tPBqRDAh3nPYFKqr5o';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// ============= CONFIGURACIÓN EXPRESS =============
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

// ============= CARGAR PREGUNTAS APROBADAS AL INICIAR =============
async function loadInitialData() {
    try {
        // Verificar si la tabla tiene datos
        const { data: existingQuestions } = await supabase
            .from('approved_questions')
            .select('*')
            .limit(1);

        if (!existingQuestions || existingQuestions.length === 0) {
            // Cargar desde el archivo JSON local
            const localData = JSON.parse(fs.readFileSync(QUESTIONS_FILE, 'utf8'));
            
            for (const [category, questions] of Object.entries(localData)) {
                for (const text of questions) {
                    await supabaseAdmin
                        .from('approved_questions')
                        .insert([{ category, text }]);
                }
            }
            console.log(`✅ Datos iniciales cargados en Supabase`);
        } else {
            console.log(`✅ Supabase ya tiene preguntas`);
        }
    } catch (error) {
        console.error('❌ Error cargando datos iniciales:', error.message);
    }
}

// ============= RUTAS HTML =============
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/index.html', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/admin.html', (req, res) => res.sendFile(path.join(__dirname, 'admin.html')));

// ============= API: OBTENER PREGUNTAS APROBADAS =============
app.get('/api/questions', async (req, res) => {
    try {
        const { data: questions, error } = await supabase
            .from('approved_questions')
            .select('*');

        if (error) throw error;

        // Agrupar por categoría
        const grouped = {
            'Verdad': [],
            'Reto': [],
            'Moneda': [],
            'Prenda': [],
            'Tragos': [],
            'Hot': []
        };

        questions.forEach(q => {
            if (grouped[q.category]) {
                grouped[q.category].push(q.text);
            }
        });

        res.json(grouped);
    } catch (error) {
        console.error('❌ Error obteniendo preguntas:', error);
        res.status(500).json({ error: 'Error al obtener preguntas' });
    }
});

// ============= API: SUGERIR PREGUNTA =============
app.post('/api/suggest-question', async (req, res) => {
    try {
        const { category, text } = req.body;
        if (!category || !text) {
            return res.status(400).json({ error: 'Categoría y texto requeridos' });
        }

        const { error } = await supabase
            .from('pending_questions')
            .insert([{
                category,
                text,
                status: 'pending'
            }]);

        if (error) throw error;

        console.log('✅ Pregunta sugerida:', text.substring(0, 50));
        res.json({ success: true, message: 'Pregunta enviada para moderación' });
    } catch (error) {
        console.error('❌ Error sugerencia:', error);
        res.status(500).json({ error: 'Error al guardar' });
    }
});

// ============= API: LOGIN ADMIN =============
app.post('/api/admin-login', (req, res) => {
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

// ============= API: OBTENER PREGUNTAS PENDIENTES =============
app.post('/api/admin/pending-questions', async (req, res) => {
    try {
        const { token } = req.body;
        if (token !== Buffer.from(ADMIN_PASSWORD).toString('base64')) {
            return res.status(401).json({ error: 'No autorizado' });
        }

        const { data: pending, error } = await supabase
            .from('pending_questions')
            .select('*')
            .eq('status', 'pending')
            .order('timestamp', { ascending: true });

        if (error) throw error;

        console.log(`📋 Admin solicita ${pending.length} preguntas pendientes`);
        res.json(pending);
    } catch (error) {
        console.error('❌ Error obteniendo pendientes:', error);
        res.status(500).json({ error: 'Error al obtener preguntas' });
    }
});

// ============= API: APROBAR PREGUNTA =============
app.post('/api/admin/approve-question', async (req, res) => {
    try {
        const { token, questionId } = req.body;
        if (token !== Buffer.from(ADMIN_PASSWORD).toString('base64')) {
            return res.status(401).json({ error: 'No autorizado' });
        }

        // Obtener la pregunta
        const { data: question, error: fetchError } = await supabase
            .from('pending_questions')
            .select('*')
            .eq('id', questionId)
            .single();

        if (fetchError || !question) {
            return res.status(404).json({ error: 'Pregunta no encontrada' });
        }

        // Agregar a preguntas aprobadas
        const { error: insertError } = await supabase
            .from('approved_questions')
            .insert([{
                category: question.category,
                text: question.text
            }]);

        if (insertError) throw insertError;

        // Marcar como aprobada
        const { error: updateError } = await supabase
            .from('pending_questions')
            .update({ status: 'approved' })
            .eq('id', questionId);

        if (updateError) throw updateError;

        console.log(`✅ Pregunta aprobada: "${question.text.substring(0, 50)}..."`);
        res.json({ success: true, message: 'Pregunta aprobada' });
    } catch (error) {
        console.error('❌ Error aprobando:', error);
        res.status(500).json({ error: 'Error al aprobar: ' + error.message });
    }
});

// ============= API: RECHAZAR PREGUNTA =============
app.post('/api/admin/reject-question', async (req, res) => {
    try {
        const { token, questionId } = req.body;
        if (token !== Buffer.from(ADMIN_PASSWORD).toString('base64')) {
            return res.status(401).json({ error: 'No autorizado' });
        }

        const { data: question, error: fetchError } = await supabase
            .from('pending_questions')
            .select('*')
            .eq('id', questionId)
            .single();

        if (fetchError || !question) {
            return res.status(404).json({ error: 'Pregunta no encontrada' });
        }

        // Marcar como rechazada
        const { error: updateError } = await supabase
            .from('pending_questions')
            .update({ status: 'rejected' })
            .eq('id', questionId);

        if (updateError) throw updateError;

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
if (require.main === module) {
    loadInitialData().then(() => {
        app.listen(PORT, () => {
            console.log(`\n🎮 The Hangover ejecutándose en http://localhost:${PORT}`);
            console.log(`📊 Panel admin: http://localhost:${PORT}/admin.html\n`);
        });
    });
}

module.exports = app;
