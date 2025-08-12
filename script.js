// Aprovaia - Script Principal
document.addEventListener('DOMContentLoaded', function() {
    initializeChatbot();
    initializeNavigation();
    initializeMobileMenu();
    initializeScrollEffects();
});

// ===== CHATBOT FUNCTIONALITY =====
let messageCounter = 0;

function initializeChatbot() {
    const chatForm = document.getElementById('chatForm');
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');

    if (chatForm) {
        chatForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const message = chatInput.value.trim();
            if (message) {
                sendMessage(message);
                chatInput.value = '';
            }
        });
    }

    // Auto-resize textarea
    if (chatInput) {
        chatInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });
    }
}

function sendMessage(message) {
    const chatMessages = document.getElementById('chatMessages');
    const sendBtn = document.querySelector('.send-btn');
    
    // Disable send button
    sendBtn.disabled = true;
    
    // Add user message
    addMessage(message, 'user');
    
    // Scroll to bottom
    setTimeout(() => {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 100);
    
    // Simulate bot response after a delay
    setTimeout(() => {
        const botResponse = generateBotResponse(message);
        addMessage(botResponse, 'bot');
        sendBtn.disabled = false;
        
        setTimeout(() => {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 100);
    }, 1000 + Math.random() * 1000); // 1-2 seconds delay
}

function sendSuggestion(suggestion) {
    const chatInput = document.getElementById('chatInput');
    chatInput.value = suggestion;
    sendMessage(suggestion);
}

function addMessage(content, type) {
    const chatMessages = document.getElementById('chatMessages');
    const messageId = `message-${++messageCounter}`;
    
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}-message`;
    messageElement.id = messageId;
    
    const currentTime = new Date().toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    messageElement.innerHTML = `
        <div class="message-avatar">
            <i class="fas ${type === 'bot' ? 'fa-robot' : 'fa-user'}"></i>
        </div>
        <div class="message-content">
            <p>${content}</p>
            <span class="message-time">${currentTime}</span>
        </div>
    `;
    
    chatMessages.appendChild(messageElement);
    
    // Add entrance animation
    setTimeout(() => {
        messageElement.style.opacity = '1';
        messageElement.style.transform = 'translateY(0)';
    }, 10);
}

function generateBotResponse(userMessage) {
    const responses = {
        // Respostas para matemática
        'matemática': [
            'Para matemática no ENEM, foque em: álgebra, geometria, estatística e funções. Pratique exercícios diariamente! 📊',
            'Dica importante: revise fórmulas básicas e pratique interpretação de gráficos. A matemática do ENEM é muito contextualizada! 📈',
            'Recomendo estudar por tópicos: comece com o que tem mais dificuldade e use simulados para praticar! 🎯'
        ],
        'redação': [
            'Para uma boa redação: tenha repertório cultural, pratique a estrutura dissertativa e sempre proponha soluções viáveis! ✍️',
            'Dicas de redação: leia muito, pratique conectivos, e sempre releia seu texto verificando a gramática! 📝',
            'Estrutura ideal: introdução com tese, 2 parágrafos de desenvolvimento e conclusão com proposta de intervenção! 🎯'
        ],
        'cronograma': [
            'Um bom cronograma deve incluir: revisão teórica, exercícios práticos, simulados e descanso. Balance é essencial! 📅',
            'Dica: estude 4-6 horas por dia, com intervalos de 15 min a cada 1h30. Use a técnica Pomodoro! ⏰',
            'Organize por matérias: alterne entre exatas e humanas para manter o cérebro ativo! 🧠'
        ],
        'default': [
            'Interessante! Me conte mais sobre suas dúvidas específicas para eu poder te ajudar melhor! 🤔',
            'Posso te ajudar com dicas de estudo, explicações de matérias ou orientações para o ENEM. O que você gostaria de saber? 📚',
            'Estou aqui para te ajudar! Pode perguntar sobre qualquer matéria ou estratégia de estudo! 🎓',
            'Ótima pergunta! Para te dar uma resposta mais específica, você pode me contar qual matéria ou tema te interessa? 💡',
            'Vou te ajudar com isso! Além desta dúvida, há alguma matéria específica que você está estudando? 📖'
        ]
    };
    
    const lowerMessage = userMessage.toLowerCase();
    
    // Busca por palavras-chave
    for (const [key, responseArray] of Object.entries(responses)) {
        if (key !== 'default' && lowerMessage.includes(key)) {
            return responseArray[Math.floor(Math.random() * responseArray.length)];
        }
    }
    
    // Respostas específicas para certas palavras
    if (lowerMessage.includes('olá') || lowerMessage.includes('oi')) {
        return 'Olá! Como posso te ajudar nos seus estudos hoje? 😊';
    }
    
    if (lowerMessage.includes('obrigad')) {
        return 'De nada! Estou sempre aqui para te ajudar. Boa sorte nos estudos! 🌟';
    }
    
    if (lowerMessage.includes('física')) {
        return 'Física no ENEM: foque em mecânica, eletricidade e ondas. Use fórmulas básicas e interprete bem os enunciados! ⚡';
    }
    
    if (lowerMessage.includes('química')) {
        return 'Química ENEM: estude química orgânica, estequiometria e físico-química. Pratique balanceamento de equações! 🧪';
    }
    
    if (lowerMessage.includes('biologia')) {
        return 'Biologia: foque em ecologia, genética e evolução. Conecte os conceitos com atualidades ambientais! 🌱';
    }
    
    if (lowerMessage.includes('história')) {
        return 'História: estude Brasil Colônia, República e História Contemporânea. Relacione fatos históricos com atualidades! 📜';
    }
    
    if (lowerMessage.includes('geografia')) {
        return 'Geografia: climatologia, geopolítica e geografia urbana são essenciais. Acompanhe questões ambientais atuais! 🌍';
    }
    
    if (lowerMessage.includes('português') || lowerMessage.includes('literatura')) {
        return 'Português: gramática contextualizada, interpretação textual e literatura brasileira. Leia muito! 📚';
    }
    
    if (lowerMessage.includes('inglês') || lowerMessage.includes('espanhol')) {
        return 'Língua estrangeira: foque em interpretação de texto, vocabulário básico e conectivos. Pratique leitura! 🌐';
    }
    
    if (lowerMessage.includes('filosofia') || lowerMessage.includes('sociologia')) {
        return 'Filosofia/Sociologia: estude pensadores clássicos, teorias sociais e conecte com temas contemporâneos! 🤔';
    }
    
    if (lowerMessage.includes('ansiedade') || lowerMessage.includes('nervoso')) {
        return 'É normal sentir ansiedade! Pratique respiração, mantenha uma rotina saudável e confie no seu preparo! 💪';
    }
    
    if (lowerMessage.includes('simulado')) {
        return 'Simulados são essenciais! Faça pelo menos um por semana, cronometrando o tempo e revisando os erros! ⏱️';
    }
    
    // Resposta padrão
    return responses.default[Math.floor(Math.random() * responses.default.length)];
}

// ===== NAVIGATION =====
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Handle internal links
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    document.querySelector('.scroll-container').scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// ===== MOBILE MENU =====
function initializeMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');
    
    if (mobileToggle && nav) {
        mobileToggle.addEventListener('click', function() {
            nav.style.display = nav.style.display === 'block' ? 'none' : 'block';
            nav.classList.toggle('mobile-active');
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!nav.contains(e.target) && !mobileToggle.contains(e.target)) {
                nav.style.display = 'none';
                nav.classList.remove('mobile-active');
            }
        });
    }
}

// ===== SCROLL EFFECTS =====
function initializeScrollEffects() {
    const scrollContainer = document.querySelector('.scroll-container');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    if (scrollContainer && sections.length > 0) {
        scrollContainer.addEventListener('scroll', function() {
            const scrollTop = scrollContainer.scrollTop;
            const headerHeight = document.querySelector('.header').offsetHeight;
            
            // Update active navigation
            sections.forEach(section => {
                const sectionTop = section.offsetTop - headerHeight - 50;
                const sectionBottom = sectionTop + section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollTop >= sectionTop && scrollTop < sectionBottom) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
            
            // Add scroll effects to elements
            const windowHeight = scrollContainer.clientHeight;
            const elements = document.querySelectorAll('.feature-card, .about-content, .hero-stats');
            
            elements.forEach(element => {
                const elementTop = element.offsetTop;
                const elementVisible = elementTop - scrollTop - windowHeight + 100;
                
                if (elementVisible < 0) {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }
            });
        });
    }
}

// ===== UTILITY FUNCTIONS =====

// Função para formatar tempo
function formatTime(date) {
    return date.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

// Função para detectar dispositivo móvel
function isMobile() {
    return window.innerWidth <= 768;
}

// Função para debounce
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== EVENT LISTENERS GLOBAIS =====

// Redimensionamento da janela
window.addEventListener('resize', debounce(function() {
    // Ajustar layout móvel se necessário
    const nav = document.querySelector('.nav');
    if (window.innerWidth > 768 && nav) {
        nav.style.display = '';
        nav.classList.remove('mobile-active');
    }
}, 250));

// Atalhos de teclado
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K para focar no chat
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const chatInput = document.getElementById('chatInput');
        if (chatInput) {
            chatInput.focus();
        }
    }
    
    // Escape para limpar chat input
    if (e.key === 'Escape') {
        const chatInput = document.getElementById('chatInput');
        if (chatInput && document.activeElement === chatInput) {
            chatInput.blur();
        }
    }
});

// ===== LOADING STATES =====
function showLoading(element) {
    element.classList.add('loading');
    element.style.pointerEvents = 'none';
}

function hideLoading(element) {
    element.classList.remove('loading');
    element.style.pointerEvents = 'auto';
}

// ===== ANALYTICS (placeholder) =====
function trackEvent(category, action, label) {
    // Placeholder para implementação de analytics
    console.log(`Analytics: ${category} - ${action} - ${label}`);
}

// Track navigation clicks
document.addEventListener('click', function(e) {
    if (e.target.matches('.nav-link')) {
        trackEvent('Navigation', 'Click', e.target.textContent);
    }
    
    if (e.target.matches('.feature-card') || e.target.closest('.feature-card')) {
        const card = e.target.closest('.feature-card') || e.target;
        const title = card.querySelector('.feature-title')?.textContent || 'Unknown';
        trackEvent('Feature', 'Click', title);
    }
});

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // Em produção, enviar erro para serviço de monitoramento
});

// ===== PERFORMANCE MONITORING =====
window.addEventListener('load', function() {
    // Monitorar performance de carregamento
    const loadTime = performance.now();
    console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
    
    // Track analytics
    trackEvent('Performance', 'Load Time', Math.round(loadTime));
});

// ===== EXPORTS (para testes) =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        generateBotResponse,
        formatTime,
        isMobile,
        debounce
    };
}
