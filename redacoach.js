// RedaCoach - Funcionalidades específicas
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('redacoach.html')) {
        initializeRedaCoach();
    }
});

function initializeRedaCoach() {
    initializeUploadMethods();
    initializeTextAnalysis();
    initializeFileUpload();
    initializeWordCounter();
}

// ===== MÉTODOS DE UPLOAD =====
function initializeUploadMethods() {
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    const uploadMethods = document.querySelectorAll('.upload-method');

    toggleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const method = this.getAttribute('data-method');
            
            // Update toggle buttons
            toggleBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Update upload methods
            uploadMethods.forEach(m => {
                m.classList.remove('active');
                if (m.getAttribute('data-method') === method) {
                    m.classList.add('active');
                }
            });
        });
    });
}

// ===== ANÁLISE DE TEXTO =====
function initializeTextAnalysis() {
    const analyzeBtn = document.getElementById('analyzeText');
    const clearBtn = document.getElementById('clearText');
    const essayText = document.getElementById('essayText');
    const essayTheme = document.getElementById('essayTheme');

    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', function() {
            const text = essayText.value.trim();
            const theme = essayTheme.value.trim();
            
            if (!text) {
                showNotification('Por favor, digite sua redação antes de analisar.', 'warning');
                return;
            }
            
            if (text.split(' ').length < 200) {
                showNotification('Sua redação deve ter pelo menos 200 palavras.', 'warning');
                return;
            }
            
            if (!theme) {
                showNotification('Por favor, informe o tema da redação.', 'warning');
                return;
            }
            
            startAnalysis(text, theme);
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            if (confirm('Tem certeza que deseja limpar o texto?')) {
                essayText.value = '';
                essayTheme.value = '';
                updateWordCount();
            }
        });
    }
}

// ===== UPLOAD DE ARQUIVO =====
function initializeFileUpload() {
    const fileDropZone = document.getElementById('fileDropZone');
    const fileInput = document.getElementById('fileInput');
    const fileInfo = document.getElementById('fileInfo');
    const fileActions = document.querySelector('.file-actions');
    const removeFileBtn = document.getElementById('removeFile');
    const changeFileBtn = document.getElementById('changeFile');
    const analyzeFileBtn = document.getElementById('analyzeFile');

    // Click to select file
    if (fileDropZone) {
        fileDropZone.addEventListener('click', () => fileInput.click());
    }

    // Drag and drop
    if (fileDropZone) {
        fileDropZone.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('dragover');
        });

        fileDropZone.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
        });

        fileDropZone.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleFileSelection(files[0]);
            }
        });
    }

    // File input change
    if (fileInput) {
        fileInput.addEventListener('change', function() {
            if (this.files.length > 0) {
                handleFileSelection(this.files[0]);
            }
        });
    }

    // Remove file
    if (removeFileBtn) {
        removeFileBtn.addEventListener('click', function() {
            clearFileSelection();
        });
    }

    // Change file
    if (changeFileBtn) {
        changeFileBtn.addEventListener('click', function() {
            fileInput.click();
        });
    }

    // Analyze file
    if (analyzeFileBtn) {
        analyzeFileBtn.addEventListener('click', function() {
            const file = fileInput.files[0];
            if (file) {
                startFileAnalysis(file);
            }
        });
    }
}

function handleFileSelection(file) {
    const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/jpg',
        'image/png'
    ];

    if (!allowedTypes.includes(file.type)) {
        showNotification('Formato de arquivo não suportado. Use PDF, DOC, DOCX, JPG ou PNG.', 'error');
        return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB
        showNotification('Arquivo muito grande. O tamanho máximo é 10MB.', 'error');
        return;
    }

    // Update UI
    const fileInfo = document.getElementById('fileInfo');
    const fileActions = document.querySelector('.file-actions');
    const fileDropZone = document.getElementById('fileDropZone');

    document.querySelector('.file-name').textContent = file.name;
    document.querySelector('.file-size').textContent = formatFileSize(file.size);

    fileDropZone.style.display = 'none';
    fileInfo.style.display = 'flex';
    fileActions.style.display = 'flex';
}

function clearFileSelection() {
    const fileInfo = document.getElementById('fileInfo');
    const fileActions = document.querySelector('.file-actions');
    const fileDropZone = document.getElementById('fileDropZone');
    const fileInput = document.getElementById('fileInput');

    fileInput.value = '';
    fileDropZone.style.display = 'block';
    fileInfo.style.display = 'none';
    fileActions.style.display = 'none';
}

// ===== CONTADOR DE PALAVRAS =====
function initializeWordCounter() {
    const essayText = document.getElementById('essayText');
    if (essayText) {
        essayText.addEventListener('input', updateWordCount);
        updateWordCount(); // Initial count
    }
}

function updateWordCount() {
    const essayText = document.getElementById('essayText');
    const wordCountElement = document.getElementById('wordCount');
    
    if (essayText && wordCountElement) {
        const text = essayText.value.trim();
        const wordCount = text ? text.split(/\s+/).length : 0;
        wordCountElement.textContent = wordCount;
        
        // Update color based on word count
        if (wordCount < 200) {
            wordCountElement.style.color = '#dc3545';
        } else if (wordCount > 400) {
            wordCountElement.style.color = '#fd7e14';
        } else {
            wordCountElement.style.color = 'var(--lime)';
        }
    }
}

// ===== ANÁLISE =====
function startAnalysis(text, theme) {
    const analyzeBtn = document.getElementById('analyzeText');
    
    // Show loading state
    analyzeBtn.classList.add('analyzing');
    analyzeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analisando...';
    
    // Show results section
    showResultsSection();
    
    // Simulate analysis process
    setTimeout(() => {
        performAnalysis(text, theme);
        analyzeBtn.classList.remove('analyzing');
        analyzeBtn.innerHTML = '<i class="fas fa-search"></i> Analisar Redação';
    }, 3000);
}

function startFileAnalysis(file) {
    const analyzeBtn = document.getElementById('analyzeFile');
    
    // Show loading state
    analyzeBtn.classList.add('analyzing');
    analyzeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
    
    // Show results section
    showResultsSection();
    
    // Simulate file processing and analysis
    setTimeout(() => {
        // Simulate extracted text from file
        const simulatedText = generateSampleEssay();
        performAnalysis(simulatedText, 'Tema extraído do arquivo');
        analyzeBtn.classList.remove('analyzing');
        analyzeBtn.innerHTML = '<i class="fas fa-search"></i> Analisar Arquivo';
    }, 5000);
}

function showResultsSection() {
    const resultsSection = document.getElementById('resultsSection');
    if (resultsSection) {
        resultsSection.style.display = 'block';
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function performAnalysis(text, theme) {
    const wordCount = text.split(' ').length;
    
    // Generate realistic scores based on text analysis
    const scores = generateRealisticScores(text, wordCount);
    
    // Update overall score
    updateOverallScore(scores.overall);
    
    // Update competency scores
    updateCompetencyScores(scores.competencies);
    
    // Generate detailed feedback
    generateDetailedFeedback(text, theme, scores);
    
    // Initialize results actions
    initializeResultsActions();
}

function generateRealisticScores(text, wordCount) {
    // Base score calculation
    let baseScore = 600;
    
    // Word count factor
    if (wordCount >= 200 && wordCount <= 400) {
        baseScore += 100;
    } else if (wordCount > 400) {
        baseScore += 50;
    } else {
        baseScore -= 100;
    }
    
    // Complexity factor (paragraphs, sentences)
    const paragraphs = text.split('\n\n').filter(p => p.trim().length > 0).length;
    if (paragraphs >= 4 && paragraphs <= 5) {
        baseScore += 80;
    }
    
    // Random variation
    baseScore += Math.random() * 150 - 75;
    
    const overall = Math.max(200, Math.min(1000, Math.round(baseScore)));
    
    // Individual competency scores
    const competencies = [
        Math.max(40, Math.min(200, Math.round(overall * 0.2 + (Math.random() * 40 - 20)))),
        Math.max(40, Math.min(200, Math.round(overall * 0.2 + (Math.random() * 40 - 20)))),
        Math.max(40, Math.min(200, Math.round(overall * 0.2 + (Math.random() * 40 - 20)))),
        Math.max(40, Math.min(200, Math.round(overall * 0.2 + (Math.random() * 40 - 20)))),
        Math.max(40, Math.min(200, Math.round(overall * 0.2 + (Math.random() * 40 - 20))))
    ];
    
    return { overall, competencies };
}

function updateOverallScore(score) {
    const scoreElement = document.getElementById('overallScore');
    const descriptionElement = document.getElementById('scoreDescription');
    const scoreCircle = document.querySelector('.score-circle');
    
    if (scoreElement) {
        // Animate score counting
        animateNumber(scoreElement, 0, score, 2000);
        
        // Update circle
        const percentage = (score / 1000) * 360;
        scoreCircle.style.setProperty('--score-angle', `${percentage}deg`);
        scoreCircle.style.animation = 'scoreGrow 2s ease-out forwards';
    }
    
    if (descriptionElement) {
        let description = '';
        if (score >= 900) {
            description = 'Excelente! Sua redação demonstra domínio excepcional da escrita formal.';
        } else if (score >= 800) {
            description = 'Muito bom! Sua redação atende bem aos critérios de avaliação.';
        } else if (score >= 700) {
            description = 'Bom trabalho! Há alguns pontos para melhorar.';
        } else if (score >= 600) {
            description = 'Sua redação está no caminho certo, mas precisa de melhorias.';
        } else {
            description = 'É necessário mais prática para atingir a nota desejada.';
        }
        descriptionElement.textContent = description;
    }
}

function updateCompetencyScores(scores) {
    const competencyTitles = [
        'Demonstra domínio da modalidade escrita formal da língua portuguesa',
        'Compreende a proposta de redação e aplica conceitos das várias áreas de conhecimento',
        'Seleciona, relaciona, organiza e interpreta informações, fatos, opiniões e argumentos',
        'Demonstra conhecimento dos mecanismos linguísticos necessários para a construção da argumentação',
        'Elabora proposta de intervenção para o problema abordado'
    ];
    
    scores.forEach((score, index) => {
        const scoreElement = document.getElementById(`comp${index + 1}Score`);
        const descriptionElement = document.getElementById(`comp${index + 1}Description`);
        const suggestionsElement = document.getElementById(`comp${index + 1}Suggestions`);
        
        if (scoreElement) {
            animateNumber(scoreElement, 0, score, 1500 + index * 200);
        }
        
        if (descriptionElement) {
            descriptionElement.textContent = competencyTitles[index];
        }
        
        if (suggestionsElement) {
            const suggestions = generateCompetencySuggestions(index + 1, score);
            if (suggestions) {
                suggestionsElement.innerHTML = `<strong>Sugestão:</strong> ${suggestions}`;
                suggestionsElement.classList.add('has-content');
            }
        }
    });
}

function generateCompetencySuggestions(competency, score) {
    const suggestions = {
        1: [
            'Revise regras de concordância e regência verbal.',
            'Pratique o uso correto da crase e pontuação.',
            'Evite gírias e expressões informais.',
            'Use sinônimos para evitar repetições.'
        ],
        2: [
            'Leia mais sobre o tema para ampliar conhecimento.',
            'Desenvolva melhor sua tese na introdução.',
            'Use exemplos e dados para fundamentar argumentos.',
            'Mantenha-se dentro do tema proposto.'
        ],
        3: [
            'Selecione argumentos mais relevantes e atuais.',
            'Use dados estatísticos e exemplos concretos.',
            'Organize melhor as ideias em cada parágrafo.',
            'Relacione causa e consequência dos problemas.'
        ],
        4: [
            'Use mais conectivos para ligar as ideias.',
            'Organize melhor a progressão textual.',
            'Evite contradições entre os argumentos.',
            'Mantenha coerência entre introdução e conclusão.'
        ],
        5: [
            'Detalhe melhor sua proposta de solução.',
            'Inclua agente, ação, meio/modo e finalidade.',
            'Proponha soluções viáveis e específicas.',
            'Conecte a proposta com os argumentos desenvolvidos.'
        ]
    };
    
    if (score < 160) {
        return suggestions[competency][Math.floor(Math.random() * suggestions[competency].length)];
    }
    return null;
}

function generateDetailedFeedback(text, theme, scores) {
    const feedbackElement = document.getElementById('detailedFeedback');
    
    setTimeout(() => {
        const feedback = `
            <div class="feedback-section">
                <h4><i class="fas fa-thumbs-up"></i> Pontos Positivos</h4>
                <ul>
                    <li>Sua redação demonstra boa compreensão do tema "${theme}"</li>
                    <li>A estrutura básica da dissertação está presente</li>
                    <li>Uso adequado da modalidade escrita formal</li>
                    <li>Argumentação coerente e organizada</li>
                </ul>
            </div>
            
            <div class="feedback-section">
                <h4><i class="fas fa-tools"></i> Áreas para Melhorar</h4>
                <ul>
                    <li>Desenvolva melhor os argumentos com exemplos específicos</li>
                    <li>Use mais conectivos para melhorar a coesão textual</li>
                    <li>Inclua dados estatísticos ou referências históricas</li>
                    <li>Detalhe mais a proposta de intervenção</li>
                </ul>
            </div>
            
            <div class="feedback-section">
                <h4><i class="fas fa-lightbulb"></i> Dicas Específicas</h4>
                <ul>
                    <li>Na introdução, apresente sua tese de forma mais clara</li>
                    <li>No desenvolvimento, use exemplos da atualidade</li>
                    <li>Na conclusão, proponha soluções mais detalhadas</li>
                    <li>Revise a gramática, especialmente concordâncias</li>
                </ul>
            </div>
            
            <div class="feedback-section">
                <h4><i class="fas fa-star"></i> Próximos Passos</h4>
                <ul>
                    <li>Pratique mais redações com temas similares</li>
                    <li>Leia artigos sobre o tema para ampliar repertório</li>
                    <li>Estude modelos de redação nota 1000</li>
                    <li>Revise as 5 competências do ENEM</li>
                </ul>
            </div>
        `;
        
        feedbackElement.innerHTML = feedback;
    }, 2000);
}

function initializeResultsActions() {
    const downloadBtn = document.getElementById('downloadReport');
    const newAnalysisBtn = document.getElementById('newAnalysis');
    
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            // Simulate download
            showNotification('Relatório baixado com sucesso!', 'success');
        });
    }
    
    if (newAnalysisBtn) {
        newAnalysisBtn.addEventListener('click', function() {
            if (confirm('Deseja fazer uma nova análise? Os resultados atuais serão perdidos.')) {
                location.reload();
            }
        });
    }
}

// ===== UTILITY FUNCTIONS =====
function animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const currentValue = Math.round(start + (end - start) * progress);
        element.textContent = currentValue;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${getNotificationIcon(type)}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add styles
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
    
    // Add notification to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
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

function generateSampleEssay() {
    return `A educação no Brasil enfrenta diversos desafios que comprometem o desenvolvimento pleno dos cidadãos. Entre os principais obstáculos estão a desigualdade de acesso, a qualidade do ensino e a falta de investimentos adequados.

Em primeiro lugar, a desigualdade de acesso à educação é uma realidade que perpetua as diferenças sociais. Estudantes de famílias de baixa renda frequentemente abandonam os estudos para trabalhar, enquanto outros não têm acesso a escolas de qualidade em suas regiões.

Além disso, a qualidade do ensino brasileiro apresenta deficiências significativas. Muitas escolas carecem de infraestrutura adequada, professores qualificados e materiais didáticos atualizados, comprometendo o aprendizado dos alunos.

Por fim, a falta de investimentos públicos na educação agrava todos esses problemas. O Brasil investe menos em educação como porcentagem do PIB comparado a outros países desenvolvidos, limitando as possibilidades de melhoria.

Portanto, é fundamental que o governo federal amplie os investimentos em educação, criando programas de bolsas para estudantes carentes e melhorando a infraestrutura escolar. Somente assim será possível garantir uma educação de qualidade para todos os brasileiros.`;
}

// Add CSS animation for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);
