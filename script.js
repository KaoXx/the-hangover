// Variables globales
let categories = ['Verdad', 'Reto', 'Moneda', 'Prenda', 'Tragos', 'Hot'];
let customOptions = [];
let isSpinning = false;
let currentRotation = 0;
let questionsData = {}; // Almacenará las preguntas cargadas

// Detectar URL base
const API_BASE = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000' 
    : window.location.origin;

// Detectar dispositivo móvil
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const isTouchDevice = () => {
    return (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
};

// Optimizaciones para móviles
if (isMobile || isTouchDevice()) {
    document.body.style.touchAction = 'manipulation';
}

// Audio elements
const spinSound = new Audio();
const resultSound = new Audio();

// Crear sonidos con Web Audio API
function createSpinSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const duration = 5;
        const now = audioContext.currentTime;
        
        // Crear oscilador para sonido de giro
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        
        oscillator.connect(gain);
        gain.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(200, now);
        oscillator.frequency.exponentialRampToValueAtTime(100, now + duration);
        
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
        
        oscillator.start(now);
        oscillator.stop(now + duration);
    } catch (e) {
        console.log('Audio no disponible');
    }
}

function createResultSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const now = audioContext.currentTime;
        
        // Crear dos notas para el sonido de resultado
        const notes = [400, 600, 800];
        
        notes.forEach((freq, index) => {
            const oscillator = audioContext.createOscillator();
            const gain = audioContext.createGain();
            
            oscillator.connect(gain);
            gain.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(freq, now);
            gain.gain.setValueAtTime(0.1, now + index * 0.1);
            gain.gain.exponentialRampToValueAtTime(0, now + index * 0.1 + 0.2);
            
            oscillator.start(now + index * 0.1);
            oscillator.stop(now + index * 0.1 + 0.2);
        });
    } catch (e) {
        console.log('Audio no disponible');
    }
}

// ===== EFECTOS DE CONFETI Y ANIMACIONES =====
function createConfetti() {
    try {
        const confettiContainer = document.createElement('div');
        confettiContainer.className = 'confetti-container';
        document.body.appendChild(confettiContainer);

        const confettiPieces = 120; // Cantidad de confeti (aumentada de 50)
        const emojis = ['🎉', '🎊', '🎈', '🎁', '⭐', '✨', '🌟', '💫', '🔥', '🍺'];

        for (let i = 0; i < confettiPieces; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            
            // Posición aleatoria en el ancho de la pantalla
            const randomX = Math.random() * window.innerWidth;
            const randomDelay = Math.random() * 0.5;
            const randomDuration = Math.random() * 1.5 + 2.5; // 2.5-4 segundos
            const randomRotation = Math.random() * 720 - 360;
            
            confetti.style.left = randomX + 'px';
            confetti.style.top = '-30px';
            confetti.style.setProperty('--rotation', randomRotation + 'deg');
            confetti.style.animation = `fall ${randomDuration}s linear ${randomDelay}s forwards`;
            
            confettiContainer.appendChild(confetti);
        }

        // Limpiar confeti después de que termine
        setTimeout(() => {
            if (confettiContainer && confettiContainer.parentNode) {
                confettiContainer.remove();
            }
        }, 5000);
    } catch (e) {
        console.log('Error en confeti:', e);
    }
}

function createCelebrationEffect() {
    try {
        // Crear efecto de destello en el resultado
        const resultDisplay = document.getElementById('currentResult');
        if (resultDisplay) {
            resultDisplay.classList.add('celebrate-pulse');
            
            // Crear lluvia de chispas
            setTimeout(() => {
                createSparkles();
            }, 100);
            
            // Remover la clase después de la animación
            setTimeout(() => {
                resultDisplay.classList.remove('celebrate-pulse');
            }, 1000);
        }
    } catch (e) {
        console.log('Error en celebration:', e);
    }
}

function createSparkles() {
    try {
        const resultDisplay = document.getElementById('currentResult');
        const rect = resultDisplay.getBoundingClientRect();
        
        const sparkleCount = 20;
        
        for (let i = 0; i < sparkleCount; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            
            // Posición aleatoria alrededor del elemento resultado
            const angle = (Math.PI * 2 * i) / sparkleCount;
            const distance = 50 + Math.random() * 50;
            const startX = rect.left + rect.width / 2 + Math.cos(angle) * distance;
            const startY = rect.top + rect.height / 2 + Math.sin(angle) * distance;
            
            sparkle.style.left = startX + 'px';
            sparkle.style.top = startY + 'px';
            
            document.body.appendChild(sparkle);
            
            // Animar la chispa
            setTimeout(() => {
                sparkle.style.animation = `sparkleFloat 1.5s ease-out forwards`;
            }, 10);
            
            // Limpiar después
            setTimeout(() => {
                if (sparkle && sparkle.parentNode) {
                    sparkle.remove();
                }
            }, 1500);
        }
    } catch (e) {
        console.log('Error en sparkles:', e);
    }
}

// Mapeo de iconos para cada categoría
const categoryIcons = {
    'Verdad': '❓',
    'Reto': '⚡',
    'Moneda': '💰',
    'Prenda': '👔',
    'Tragos': '🍺',
    'Hot': '🔥'
};

const colors = [
    '#FF6B35', // Naranja
    '#004E89', // Azul oscuro
    '#F77F00', // Naranja oscuro
    '#06D6A0', // Verde
    '#EF476F', // Rosa
    '#FFD60A'  // Amarillo
];

// ===== NAVEGACIÓN DE PANTALLAS =====
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// Cargar preguntas desde el archivo JSON
async function loadQuestions() {
    try {
        const response = await fetch(`${API_BASE}/api/questions`);
        questionsData = await response.json();
        console.log('Preguntas cargadas correctamente:', questionsData);
    } catch (error) {
        console.error('Error cargando las preguntas:', error);
        // Preguntas por defecto si no se puede cargar el archivo
        questionsData = {
            'Verdad': ['¿Cuál es tu secreto?'],
            'Reto': ['Haz algo divertido'],
            'Moneda': ['Lanza una moneda'],
            'Prenda': ['Quítate algo'],
            'Tragos': ['¡A beber!'],
            'Hot': ['¡Momento sexy!']
        };
    }
}

function goToStart() {
    showScreen('startScreen');
}

function goToSetup() {
    showScreen('setupScreen');
    updateCustomList();
}

function startGame() {
    const selectedCategories = Array.from(
        document.querySelectorAll('.category-label input:checked')
    ).map(input => input.value);

    if (selectedCategories.length === 0 && customOptions.length === 0) {
        alert('Debes seleccionar al menos una categoría o opción personalizada');
        return;
    }

    // Crear array combinado con iconos
    const allCategories = [
        ...selectedCategories.map(cat => ({ name: cat, icon: categoryIcons[cat] || '❓' })),
        ...customOptions
    ];

    // Guardar solo los nombres para la ruleta
    categories = allCategories.map(cat => cat.name);
    
    showScreen('gameScreen');
    drawWheel();
}

// ===== OPCIONES PERSONALIZADAS =====
function addCustomOption() {
    const input = document.getElementById('customInput');
    const value = input.value.trim();

    if (value === '') {
        alert('Ingresa un texto para la opción personalizada');
        return;
    }

    const optionExists = customOptions.some(opt => opt.name === value);
    if (optionExists) {
        alert('Esta opción ya existe');
        return;
    }

    // Agregar un icono genérico por defecto (puedes cambiar este)
    const defaultIcon = '✨';
    customOptions.push({ name: value, icon: defaultIcon });
    
    input.value = '';
    updateCustomList();
}

function removeCustomOption(option) {
    customOptions = customOptions.filter(opt => opt.name !== option);
    updateCustomList();
}

function updateCustomList() {
    const customList = document.getElementById('customList');
    customList.innerHTML = '';

    customOptions.forEach(optObj => {
        const tag = document.createElement('div');
        tag.className = 'custom-tag';
        tag.innerHTML = `
            ${optObj.icon} ${optObj.name}
            <button onclick="removeCustomOption('${optObj.name}')" type="button">✕</button>
        `;
        customList.appendChild(tag);
    });
}

// Permitir agregar opción con Enter
document.addEventListener('DOMContentLoaded', () => {
    const customInput = document.getElementById('customInput');
    if (customInput) {
        customInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addCustomOption();
            }
        });
    }
});

// ===== DIBUJAR LA RULETA =====
function drawWheel() {
    const canvas = document.getElementById('wheelCanvas');
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = canvas.width / 2 - 20;

    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar sombra exterior
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 10, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fill();

    // Dibujar secciones - comenzando desde la PARTE SUPERIOR (270° en radianes = 3π/2)
    const sliceAngle = (2 * Math.PI) / categories.length;
    const startAngleOffset = -Math.PI / 2; // Comienza en TOP (-90° = -π/2)

    categories.forEach((category, index) => {
        const startAngle = startAngleOffset + index * sliceAngle;
        const endAngle = startAngle + sliceAngle;

        // Dibujar sección con degradado
        const gradient = ctx.createLinearGradient(
            centerX + radius * Math.cos(startAngle),
            centerY + radius * Math.sin(startAngle),
            centerX + radius * Math.cos(endAngle),
            centerY + radius * Math.sin(endAngle)
        );
        
        const baseColor = colors[index % colors.length];
        gradient.addColorStop(0, baseColor);
        gradient.addColorStop(1, adjustColor(baseColor, -20));

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.lineTo(centerX, centerY);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Borde brillante
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Icono
        const angle = startAngle + sliceAngle / 2;
        const iconRadius = radius * 0.68;
        const iconX = centerX + iconRadius * Math.cos(angle);
        const iconY = centerY + iconRadius * Math.sin(angle);

        ctx.save();
        ctx.translate(iconX, iconY);

        ctx.fillStyle = '#fff';
        ctx.font = 'bold 56px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Sombra del texto
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillText(categoryIcons[category] || '❓', 2, 2);

        ctx.fillStyle = '#fff';
        ctx.fillText(categoryIcons[category] || '❓', 0, 0);

        ctx.restore();
    });

    // Círculo central brillante
    const centralGradient = ctx.createRadialGradient(centerX - 15, centerY - 15, 0, centerX, centerY, 30);
    centralGradient.addColorStop(0, '#FFE5B4');
    centralGradient.addColorStop(1, '#FF6B35');

    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
    ctx.fillStyle = centralGradient;
    ctx.fill();

    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Punto central
    ctx.beginPath();
    ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI);
    ctx.fillStyle = '#FF6B35';
    ctx.fill();
}

// Función auxiliar para ajustar color
function adjustColor(color, percent) {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
        (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
        (B < 255 ? B < 1 ? 0 : B : 255))
        .toString(16).slice(1);
}

// ===== GIRAR LA RULETA =====
function spinWheel() {
    if (isSpinning) return;

    isSpinning = true;
    const spinButton = document.getElementById('spinButton');
    const canvas = document.getElementById('wheelCanvas');
    spinButton.disabled = true;

    // Reproducir sonido de giro
    createSpinSound();

    // Agregar efecto de brillo a la ruleta
    const wheelWrapper = canvas.parentElement;
    wheelWrapper.classList.add('wheel-glow');

    // Velocidad aleatoria - ajustada para móviles
    const spins = Math.floor(Math.random() * 8) + 8; // 8-16 giros completos
    const extraRotation = Math.random() * 360;
    const totalRotation = spins * 360 + extraRotation;

    // Duración adaptada al dispositivo (más rápido en móviles para mejor UX)
    const duration = isMobile ? 3500 : 5000; // 3.5s en móvil, 5s en desktop
    const startTime = Date.now();
    const startRotation = currentRotation;

    const animate = () => {
        const now = Date.now();
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing: deceleration cúbica (más profesional)
        const easeProgress = 1 - Math.pow(1 - progress, 4);

        currentRotation = startRotation + totalRotation * easeProgress;

        // Usar will-change para mejor rendimiento
        canvas.style.transform = `rotate(${currentRotation}deg)`;

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            isSpinning = false;
            spinButton.disabled = false;
            wheelWrapper.classList.remove('wheel-glow');
            showResult();
        }
    };

    animate();
}

// ===== MOSTRAR RESULTADO =====
function showResult() {
    try {
        // Reproducir sonido de resultado
        createResultSound();
        
        // Crear confeti
        createConfetti();
        
        // Crear efecto de celebración
        createCelebrationEffect();
        
        // Normalizar la rotación a 0-360
        let normalizedRotation = currentRotation % 360;
        if (normalizedRotation < 0) normalizedRotation += 360;
        
        const sliceAngle = 360 / categories.length;
        
        // La ruleta ahora comienza en TOP (debido al offset de -π/2 en drawWheel)
        const selectedIndex = Math.floor((360 - normalizedRotation) / sliceAngle) % categories.length;
        
        const selectedCategory = categories[selectedIndex];
        const selectedIcon = categoryIcons[selectedCategory] || '❓';
        
        // Obtener una pregunta aleatoria de la categoría
        let question = '¡Momento increíble!';
        if (questionsData[selectedCategory] && questionsData[selectedCategory].length > 0) {
            const questions = questionsData[selectedCategory];
            question = questions[Math.floor(Math.random() * questions.length)];
        }

        const resultDisplay = document.getElementById('currentResult');
        if (resultDisplay) {
            resultDisplay.innerHTML = `
                <div>
                    <h2>¡Resultado!</h2>
                    <div class="result-category">${selectedIcon}</div>
                    <div class="result-text"><strong>${selectedCategory}</strong></div>
                    <div class="result-question">${question}</div>
                </div>
            `;
        }
    } catch (e) {
        console.error('Error en showResult:', e);
    }
}

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
    loadQuestions(); // Cargar preguntas al iniciar
    showScreen('startScreen');
});

// ===== FUNCIONES PARA AÑADIR PREGUNTAS PERSONALIZADAS =====
function openAddQuestionModal() {
    const modal = document.getElementById('addQuestionModal');
    if (modal) {
        modal.classList.add('active');
    }
}

function closeAddQuestionModal() {
    const modal = document.getElementById('addQuestionModal');
    if (modal) {
        modal.classList.remove('active');
        // Limpiar inputs
        document.getElementById('questionText').value = '';
        document.getElementById('questionCategory').value = 'Verdad';
    }
}

function saveCustomQuestion() {
    const category = document.getElementById('questionCategory').value;
    const questionText = document.getElementById('questionText').value.trim();

    if (!questionText) {
        alert('Por favor, escribe una pregunta o reto');
        return;
    }

    // Enviar pregunta al servidor para moderación
    fetch(`${API_BASE}/api/suggest-question`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            category: category,
            text: questionText
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('✅ ¡Pregunta enviada para moderación!\n\nUn administrador la revisará y la añadirá si es apropiada.');
            closeAddQuestionModal();
        } else {
            alert('❌ Error: ' + data.error);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error de conexión. ¿Está el servidor ejecutándose?\n\nPara ejecutar el servidor:\nnode server.js');
    });
}

function saveQuestionsToStorage() {
    // Guardar las preguntas en localStorage del navegador
    localStorage.setItem('customQuestions', JSON.stringify(questionsData));
    console.log('Preguntas guardadas en localStorage:', questionsData);
}

function loadQuestionsFromStorage() {
    // Cargar preguntas personalizadas desde localStorage
    const saved = localStorage.getItem('customQuestions');
    if (saved) {
        try {
            const customData = JSON.parse(saved);
            // Merge con las preguntas existentes
            Object.keys(customData).forEach(category => {
                if (questionsData[category]) {
                    // Añadir solo las nuevas (evitar duplicados)
                    const existing = new Set(questionsData[category]);
                    customData[category].forEach(question => {
                        if (!existing.has(question)) {
                            questionsData[category].push(question);
                        }
                    });
                } else {
                    questionsData[category] = customData[category];
                }
            });
            console.log('Preguntas personalizadas cargadas desde localStorage');
        } catch (e) {
            console.error('Error al cargar preguntas personalizadas:', e);
        }
    }
}

// Cerrar modal al hacer clic fuera de él
window.onclick = function(event) {
    const modal = document.getElementById('addQuestionModal');
    if (event.target == modal) {
        closeAddQuestionModal();
    }
}
