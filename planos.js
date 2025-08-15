// Planos JavaScript
let selectedPlan = 'premium';

function openLogin() {
    const modal = document.getElementById('loginModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function openSignup(plan = 'premium') {
    selectedPlan = plan;
    const modal = document.getElementById('signupModal');
    const selectedPlanElement = document.getElementById('selectedPlan');
    
    // Atualiza o plano selecionado
    const planNames = {
        'basico': 'Básico - R$ 29/mês',
        'premium': 'Premium - R$ 59/mês',
        'elite': 'Elite - R$ 99/mês'
    };
    
    selectedPlanElement.textContent = planNames[plan];
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modals = document.querySelectorAll('.auth-modal');
    modals.forEach(modal => {
        modal.classList.remove('active');
    });
    document.body.style.overflow = 'auto';
}

function switchToSignup() {
    closeModal();
    setTimeout(() => openSignup(selectedPlan), 300);
}

function switchToLogin() {
    closeModal();
    setTimeout(() => openLogin(), 300);
}

// Fechar modal ao clicar fora
document.addEventListener('click', function(e) {
    const modals = document.querySelectorAll('.auth-modal');
    modals.forEach(modal => {
        if (e.target === modal) {
            closeModal();
        }
    });
});

// Fechar modal com ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Formulário de Login
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Aqui você implementaria a lógica de login
    console.log('Tentativa de login');
    
    // Simulação de login bem-sucedido
    setTimeout(() => {
        alert('Login realizado com sucesso!');
        closeModal();
        // Redirecionar para dashboard ou área do usuário
        // window.location.href = 'dashboard.html';
    }, 1000);
});

// Formulário de Cadastro
document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Aqui você implementaria a lógica de cadastro
    console.log('Tentativa de cadastro para o plano:', selectedPlan);
    
    // Simulação de cadastro bem-sucedido
    setTimeout(() => {
        alert('Conta criada com sucesso! Redirecionando para o pagamento...');
        closeModal();
        // Redirecionar para página de pagamento
        // window.location.href = 'pagamento.html?plano=' + selectedPlan;
    }, 1000);
});

// Animações de entrada dos cards
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.plan-card');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
});

// Smooth scroll para âncoras
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Analytics tracking (placeholder)
function trackPlanSelection(plan) {
    console.log('Plan selected:', plan);
    // Aqui você implementaria o tracking de analytics
    // gtag('event', 'plan_selected', { plan_name: plan });
}

function trackModalOpen(type) {
    console.log('Modal opened:', type);
    // Aqui você implementaria o tracking de analytics
    // gtag('event', 'modal_opened', { modal_type: type });
}

// Adicionar tracking aos botões
document.querySelectorAll('.plan-button').forEach(button => {
    button.addEventListener('click', function() {
        const planCard = this.closest('.plan-card');
        const planName = planCard.querySelector('.plan-name').textContent.toLowerCase();
        trackPlanSelection(planName);
    });
});
