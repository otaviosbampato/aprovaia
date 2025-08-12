// Questões & Gabaritos - Funcionalidades específicas
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('questoes.html')) {
        initializeQuestoes();
    }
});

// Sample questions database
const questionsDatabase = [
    {
        id: 1,
        exam: 'ENEM',
        subject: 'matematica',
        year: 2023,
        difficulty: 'medio',
        text: 'Em uma escola, o número de estudantes matriculados no ensino médio é 20% maior que o número de estudantes matriculados no ensino fundamental. Se há 480 estudantes no ensino fundamental, quantos estudantes há no ensino médio?',
        options: [
            'A) 576 estudantes',
            'B) 600 estudantes', 
            'C) 480 estudantes',
            'D) 96 estudantes',
            'E) 384 estudantes'
        ],
        correct: 0,
        explanation: 'Se o ensino fundamental tem 480 estudantes e o ensino médio tem 20% a mais, então: 480 + (20% de 480) = 480 + 96 = 576 estudantes.'
    },
    {
        id: 2,
        exam: 'ENEM',
        subject: 'fisica',
        year: 2023,
        difficulty: 'dificil',
        text: 'Um corpo de massa 2 kg está em movimento retilíneo uniforme com velocidade de 10 m/s. Qual é a energia cinética deste corpo?',
        options: [
            'A) 20 J',
            'B) 40 J',
            'C) 100 J',
            'D) 200 J',
            'E) 400 J'
        ],
        correct: 2,
        explanation: 'A energia cinética é calculada pela fórmula Ec = (1/2)mv². Substituindo: Ec = (1/2) × 2 × 10² = 1 × 100 = 100 J.'
    },
    {
        id: 3,
        exam: 'FUVEST',
        subject: 'quimica',
        year: 2022,
        difficulty: 'medio',
        text: 'Quantos mols de água (H₂O) são formados na combustão completa de 1 mol de metano (CH₄)?',
        options: [
            'A) 1 mol',
            'B) 2 mols',
            'C) 3 mols', 
            'D) 4 mols',
            'E) 5 mols'
        ],
        correct: 1,
        explanation: 'A equação balanceada da combustão do metano é: CH₄ + 2O₂ → CO₂ + 2H₂O. Portanto, 1 mol de metano produz 2 mols de água.'
    },
    {
        id: 4,
        exam: 'ENEM',
        subject: 'biologia',
        year: 2023,
        difficulty: 'facil',
        text: 'Qual é a principal função dos glóbulos vermelhos no sangue humano?',
        options: [
            'A) Defesa contra infecções',
            'B) Coagulação do sangue',
            'C) Transporte de oxigênio',
            'D) Produção de hormônios',
            'E) Digestão de nutrientes'
        ],
        correct: 2,
        explanation: 'Os glóbulos vermelhos (hemácias) contêm hemoglobina, proteína responsável pelo transporte de oxigênio dos pulmões para os tecidos do corpo.'
    },
    {
        id: 5,
        exam: 'UNICAMP',
        subject: 'historia',
        year: 2023,
        difficulty: 'medio',
        text: 'A Proclamação da República no Brasil ocorreu em que ano?',
        options: [
            'A) 1888',
            'B) 1889',
            'C) 1890',
            'D) 1891',
            'E) 1892'
        ],
        correct: 1,
        explanation: 'A Proclamação da República brasileira ocorreu em 15 de novembro de 1889, liderada pelo Marechal Deodoro da Fonseca.'
    },
    {
        id: 6,
        exam: 'ENEM',
        subject: 'portugues',
        year: 2023,
        difficulty: 'medio',
        text: 'Assinale a alternativa em que todas as palavras estão grafadas corretamente:',
        options: [
            'A) Excessão, ansioso, pretensioso',
            'B) Exceção, ancioso, pretencioso', 
            'C) Exceção, ansioso, pretensioso',
            'D) Excessão, ancioso, pretencioso',
            'E) Exceção, ansioso, pretencioso'
        ],
        correct: 2,
        explanation: 'A grafia correta é: exceção (com "ç"), ansioso (com "s") e pretensioso (com "s").'
    },
    {
        id: 7,
        exam: 'ENEM',
        subject: 'geografia',
        year: 2022,
        difficulty: 'facil',
        text: 'Qual é o maior país da América do Sul em extensão territorial?',
        options: [
            'A) Argentina',
            'B) Peru',
            'C) Colômbia',
            'D) Brasil',
            'E) Venezuela'
        ],
        correct: 3,
        explanation: 'O Brasil é o maior país da América do Sul, ocupando aproximadamente 47% do território sul-americano.'
    },
    {
        id: 8,
        exam: 'FUVEST',
        subject: 'filosofia',
        year: 2023,
        difficulty: 'dificil',
        text: 'Segundo Aristóteles, qual é o objetivo último da ética?',
        options: [
            'A) A justiça',
            'B) A felicidade (eudaimonia)',
            'C) O prazer',
            'D) A virtude',
            'E) A sabedoria'
        ],
        correct: 1,
        explanation: 'Para Aristóteles, o fim último da ética é a eudaimonia (felicidade), que é alcançada através da prática das virtudes.'
    }
];

let currentQuestions = [...questionsDatabase];
let currentPage = 1;
let itemsPerPage = 5;
let currentFilters = {};
let currentView = 'list';

function initializeQuestoes() {
    initializeFilters();
    initializeViewToggles();
    initializeModal();
    loadQuestions();
}

// ===== FILTERS =====
function initializeFilters() {
    const applyFiltersBtn = document.getElementById('applyFilters');
    const clearFiltersBtn = document.getElementById('clearFilters');
    const randomQuizBtn = document.getElementById('randomQuiz');

    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', applyFilters);
    }

    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearFilters);
    }

    if (randomQuizBtn) {
        randomQuizBtn.addEventListener('click', startRandomQuiz);
    }

    // Add change listeners to filters
    const filterSelects = document.querySelectorAll('.filter-select');
    filterSelects.forEach(select => {
        select.addEventListener('change', function() {
            // Auto-apply filters when changed
            setTimeout(applyFilters, 100);
        });
    });
}

function applyFilters() {
    const examFilter = document.getElementById('examFilter').value;
    const subjectFilter = document.getElementById('subjectFilter').value;
    const yearFilter = document.getElementById('yearFilter').value;
    const difficultyFilter = document.getElementById('difficultyFilter').value;

    currentFilters = {
        exam: examFilter,
        subject: subjectFilter,
        year: yearFilter,
        difficulty: difficultyFilter
    };

    // Filter questions
    currentQuestions = questionsDatabase.filter(question => {
        if (currentFilters.exam && question.exam.toLowerCase() !== currentFilters.exam.toLowerCase()) {
            return false;
        }
        if (currentFilters.subject && question.subject !== currentFilters.subject) {
            return false;
        }
        if (currentFilters.year && question.year.toString() !== currentFilters.year) {
            return false;
        }
        if (currentFilters.difficulty && question.difficulty !== currentFilters.difficulty) {
            return false;
        }
        return true;
    });

    currentPage = 1;
    loadQuestions();
    trackEvent('Questions', 'Filter Applied', JSON.stringify(currentFilters));
}

function clearFilters() {
    document.getElementById('examFilter').value = '';
    document.getElementById('subjectFilter').value = '';
    document.getElementById('yearFilter').value = '';
    document.getElementById('difficultyFilter').value = '';
    
    currentFilters = {};
    currentQuestions = [...questionsDatabase];
    currentPage = 1;
    loadQuestions();
    trackEvent('Questions', 'Filters Cleared', '');
}

function startRandomQuiz() {
    // Get 5 random questions
    const shuffled = [...questionsDatabase].sort(() => 0.5 - Math.random());
    const randomQuestions = shuffled.slice(0, 5);
    
    if (randomQuestions.length > 0) {
        openQuestionModal(randomQuestions[0], randomQuestions);
        trackEvent('Questions', 'Random Quiz Started', '');
    }
}

// ===== VIEW TOGGLES =====
function initializeViewToggles() {
    const viewToggles = document.querySelectorAll('.view-toggle');
    
    viewToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const view = this.getAttribute('data-view');
            
            // Update active state
            viewToggles.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Update view
            currentView = view;
            updateQuestionsView();
        });
    });
}

function updateQuestionsView() {
    const container = document.getElementById('questionsContainer');
    container.className = `questions-container ${currentView}-view`;
}

// ===== LOAD QUESTIONS =====
function loadQuestions() {
    const container = document.getElementById('questionsContainer');
    const countElement = document.getElementById('questionsCount');
    
    // Show loading
    showQuestionsLoading();
    
    setTimeout(() => {
        if (currentQuestions.length === 0) {
            showEmptyState();
            updateQuestionsCount(0);
            return;
        }

        // Calculate pagination
        const totalPages = Math.ceil(currentQuestions.length / itemsPerPage);
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const questionsToShow = currentQuestions.slice(start, end);
        
        // Render questions
        container.innerHTML = questionsToShow.map(question => renderQuestionCard(question)).join('');
        
        // Add click listeners
        addQuestionClickListeners();
        
        // Update count and pagination
        updateQuestionsCount(currentQuestions.length, start + 1, Math.min(end, currentQuestions.length));
        renderPagination(totalPages);
        updateQuestionsView();
        
    }, 500); // Simulate loading time
}

function showQuestionsLoading() {
    const container = document.getElementById('questionsContainer');
    container.innerHTML = `
        <div class="questions-loading">
            <i class="fas fa-spinner fa-spin"></i>
            <h3>Carregando questões...</h3>
            <p>Aguarde enquanto buscamos as melhores questões para você.</p>
        </div>
    `;
}

function showEmptyState() {
    const container = document.getElementById('questionsContainer');
    container.innerHTML = `
        <div class="questions-empty">
            <i class="fas fa-search"></i>
            <h3>Nenhuma questão encontrada</h3>
            <p>Tente ajustar os filtros para encontrar questões.</p>
            <button class="btn-primary" onclick="clearFilters()">
                <i class="fas fa-eraser"></i>
                Limpar Filtros
            </button>
        </div>
    `;
}

function renderQuestionCard(question) {
    const subjectNames = {
        matematica: 'Matemática',
        fisica: 'Física',
        quimica: 'Química', 
        biologia: 'Biologia',
        portugues: 'Português',
        literatura: 'Literatura',
        historia: 'História',
        geografia: 'Geografia',
        filosofia: 'Filosofia',
        sociologia: 'Sociologia',
        ingles: 'Inglês',
        espanhol: 'Espanhol'
    };

    const difficultyNames = {
        facil: 'Fácil',
        medio: 'Médio',
        dificil: 'Difícil'
    };

    return `
        <div class="question-card" data-question-id="${question.id}">
            <div class="question-header">
                <div class="question-info">
                    <span class="question-exam">${question.exam}</span>
                    <span class="question-subject">${subjectNames[question.subject] || question.subject}</span>
                    <span class="question-year">${question.year}</span>
                    <span class="question-difficulty ${question.difficulty}">${difficultyNames[question.difficulty]}</span>
                </div>
                <div class="question-id">#${question.id}</div>
            </div>
            <div class="question-body">
                <div class="question-text">${question.text}</div>
                <div class="question-preview">
                    <small><i class="fas fa-eye"></i> Clique para ver as alternativas e resposta</small>
                </div>
            </div>
        </div>
    `;
}

function addQuestionClickListeners() {
    const questionCards = document.querySelectorAll('.question-card');
    questionCards.forEach(card => {
        card.addEventListener('click', function() {
            const questionId = parseInt(this.getAttribute('data-question-id'));
            const question = questionsDatabase.find(q => q.id === questionId);
            if (question) {
                openQuestionModal(question);
            }
        });
    });
}

function updateQuestionsCount(total, start = 0, end = 0) {
    const countElement = document.getElementById('questionsCount');
    if (total === 0) {
        countElement.textContent = 'Nenhuma questão encontrada';
    } else if (start && end) {
        countElement.textContent = `Mostrando ${start}-${end} de ${total} questões`;
    } else {
        countElement.textContent = `${total} questões encontradas`;
    }
}

// ===== PAGINATION =====
function renderPagination(totalPages) {
    const paginationContainer = document.getElementById('pagination');
    
    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }

    let paginationHTML = '';
    
    // Previous button
    paginationHTML += `
        <button class="pagination-btn" ${currentPage === 1 ? 'disabled' : ''} onclick="changePage(${currentPage - 1})">
            <i class="fas fa-chevron-left"></i>
        </button>
    `;
    
    // Page numbers
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    if (startPage > 1) {
        paginationHTML += `<button class="pagination-btn" onclick="changePage(1)">1</button>`;
        if (startPage > 2) {
            paginationHTML += `<span class="pagination-info">...</span>`;
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <button class="pagination-btn ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">
                ${i}
            </button>
        `;
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationHTML += `<span class="pagination-info">...</span>`;
        }
        paginationHTML += `<button class="pagination-btn" onclick="changePage(${totalPages})">${totalPages}</button>`;
    }
    
    // Next button
    paginationHTML += `
        <button class="pagination-btn" ${currentPage === totalPages ? 'disabled' : ''} onclick="changePage(${currentPage + 1})">
            <i class="fas fa-chevron-right"></i>
        </button>
    `;
    
    paginationContainer.innerHTML = paginationHTML;
}

function changePage(page) {
    currentPage = page;
    loadQuestions();
    
    // Scroll to top of questions
    document.querySelector('.questions-section').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
}

// ===== MODAL =====
function initializeModal() {
    const modal = document.getElementById('questionModal');
    const closeBtn = document.getElementById('closeModal');
    const showAnswerBtn = document.getElementById('showAnswer');
    const nextQuestionBtn = document.getElementById('nextQuestion');

    if (closeBtn) {
        closeBtn.addEventListener('click', closeQuestionModal);
    }

    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeQuestionModal();
            }
        });
    }

    if (showAnswerBtn) {
        showAnswerBtn.addEventListener('click', showAnswer);
    }

    if (nextQuestionBtn) {
        nextQuestionBtn.addEventListener('click', nextQuestion);
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (modal.style.display === 'flex') {
            if (e.key === 'Escape') {
                closeQuestionModal();
            } else if (e.key === 'Enter') {
                const answerSection = document.getElementById('answerSection');
                if (answerSection.style.display === 'none') {
                    showAnswer();
                } else {
                    nextQuestion();
                }
            }
        }
    });
}

let currentModalQuestion = null;
let currentQuestionSet = null;
let currentQuestionIndex = 0;

function openQuestionModal(question, questionSet = null) {
    currentModalQuestion = question;
    currentQuestionSet = questionSet || [question];
    currentQuestionIndex = currentQuestionSet.findIndex(q => q.id === question.id);
    
    const modal = document.getElementById('questionModal');
    const title = document.getElementById('modalQuestionTitle');
    const content = document.getElementById('modalQuestionContent');
    const options = document.getElementById('modalQuestionOptions');
    const answerSection = document.getElementById('answerSection');
    const showAnswerBtn = document.getElementById('showAnswer');
    const nextQuestionBtn = document.getElementById('nextQuestion');

    // Reset modal state
    answerSection.style.display = 'none';
    showAnswerBtn.style.display = 'inline-flex';
    
    // Update content
    const subjectNames = {
        matematica: 'Matemática',
        fisica: 'Física',
        quimica: 'Química', 
        biologia: 'Biologia',
        portugues: 'Português',
        literatura: 'Literatura',
        historia: 'História',
        geografia: 'Geografia',
        filosofia: 'Filosofia',
        sociologia: 'Sociologia',
        ingles: 'Inglês',
        espanhol: 'Espanhol'
    };

    title.textContent = `${question.exam} ${question.year} - ${subjectNames[question.subject]} - Questão #${question.id}`;
    content.innerHTML = `<p>${question.text}</p>`;
    
    // Render options
    options.innerHTML = question.options.map((option, index) => `
        <div class="option-item" data-option="${index}">
            <span class="option-letter">${String.fromCharCode(65 + index)})</span>
            <span class="option-text">${option.substring(3)}</span>
        </div>
    `).join('');

    // Add option click listeners
    const optionItems = options.querySelectorAll('.option-item');
    optionItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove previous selection
            optionItems.forEach(opt => opt.classList.remove('selected'));
            // Add selection to clicked option
            this.classList.add('selected');
        });
    });

    // Update next button
    if (currentQuestionIndex < currentQuestionSet.length - 1) {
        nextQuestionBtn.innerHTML = '<i class="fas fa-arrow-right"></i> Próxima Questão';
    } else {
        nextQuestionBtn.innerHTML = '<i class="fas fa-check"></i> Finalizar';
    }

    modal.style.display = 'flex';
    trackEvent('Questions', 'Question Opened', `${question.exam} ${question.year} #${question.id}`);
}

function closeQuestionModal() {
    const modal = document.getElementById('questionModal');
    modal.style.display = 'none';
    currentModalQuestion = null;
    currentQuestionSet = null;
    currentQuestionIndex = 0;
}

function showAnswer() {
    const answerSection = document.getElementById('answerSection');
    const showAnswerBtn = document.getElementById('showAnswer');
    const correctAnswerText = document.getElementById('correctAnswerText');
    const answerExplanation = document.getElementById('answerExplanation');
    const options = document.querySelectorAll('.option-item');

    // Show correct answer
    options.forEach((option, index) => {
        if (index === currentModalQuestion.correct) {
            option.classList.add('correct');
        } else if (option.classList.contains('selected')) {
            option.classList.add('incorrect');
        }
    });

    // Update answer section
    const correctOption = currentModalQuestion.options[currentModalQuestion.correct];
    correctAnswerText.textContent = correctOption;
    answerExplanation.innerHTML = `<p>${currentModalQuestion.explanation}</p>`;

    // Show answer section and hide show answer button
    answerSection.style.display = 'block';
    showAnswerBtn.style.display = 'none';

    trackEvent('Questions', 'Answer Shown', `#${currentModalQuestion.id}`);
}

function nextQuestion() {
    if (currentQuestionIndex < currentQuestionSet.length - 1) {
        const nextQuestionObj = currentQuestionSet[currentQuestionIndex + 1];
        openQuestionModal(nextQuestionObj, currentQuestionSet);
    } else {
        // Quiz finished
        closeQuestionModal();
        showNotification('Quiz finalizado! Parabéns por praticar.', 'success');
    }
}

// ===== UTILITY FUNCTIONS =====
function showNotification(message, type = 'info') {
    // Reuse notification function from redacoach.js
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${getNotificationIcon(type)}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: var(--shadow-medium);
        display: flex;
        align-items: center;
        gap: 0.5rem;
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    return icons[type] || icons.info;
}

function getNotificationColor(type) {
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        warning: '#fd7e14',
        info: 'var(--oxford-blue)'
    };
    return colors[type] || colors.info;
}

// Make functions globally available
window.changePage = changePage;
window.clearFilters = clearFilters;
