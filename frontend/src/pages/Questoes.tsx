import React, { useEffect, useMemo, useState } from 'react';

interface Question { id:number; exam:string; subject:string; year:number; difficulty:string; text:string; options:string[]; correct:number; explanation:string; }

const questionsDatabase: Question[] = [
  { id:1, exam:'ENEM', subject:'matematica', year:2023, difficulty:'medio', text:'Em uma escola, o número de estudantes matriculados no ensino médio é 20% maior que o número de estudantes matriculados no ensino fundamental. Se há 480 estudantes no ensino fundamental, quantos estudantes há no ensino médio?', options:['A) 576 estudantes','B) 600 estudantes','C) 480 estudantes','D) 96 estudantes','E) 384 estudantes'], correct:0, explanation:'Se o ensino fundamental tem 480 estudantes e o ensino médio tem 20% a mais, então: 480 + (20% de 480) = 480 + 96 = 576 estudantes.'},
  { id:2, exam:'ENEM', subject:'fisica', year:2023, difficulty:'dificil', text:'Um corpo de massa 2 kg está em movimento retilíneo uniforme com velocidade de 10 m/s. Qual é a energia cinética deste corpo?', options:['A) 20 J','B) 40 J','C) 100 J','D) 200 J','E) 400 J'], correct:2, explanation:'A energia cinética é calculada pela fórmula Ec = (1/2)mv². Substituindo: Ec = (1/2) × 2 × 10² = 1 × 100 = 100 J.'},
  { id:3, exam:'FUVEST', subject:'quimica', year:2022, difficulty:'medio', text:'Quantos mols de água (H₂O) são formados na combustão completa de 1 mol de metano (CH₄)?', options:['A) 1 mol','B) 2 mols','C) 3 mols','D) 4 mols','E) 5 mols'], correct:1, explanation:'A equação balanceada da combustão do metano é: CH₄ + 2O₂ → CO₂ + 2H₂O. Portanto, 1 mol de metano produz 2 mols de água.'},
  { id:4, exam:'ENEM', subject:'biologia', year:2023, difficulty:'facil', text:'Qual é a principal função dos glóbulos vermelhos no sangue humano?', options:['A) Defesa contra infecções','B) Coagulação do sangue','C) Transporte de oxigênio','D) Produção de hormônios','E) Digestão de nutrientes'], correct:2, explanation:'Os glóbulos vermelhos (hemácias) contêm hemoglobina, proteína responsável pelo transporte de oxigênio dos pulmões para os tecidos do corpo.'},
  { id:5, exam:'UNICAMP', subject:'historia', year:2023, difficulty:'medio', text:'A Proclamação da República no Brasil ocorreu em que ano?', options:['A) 1888','B) 1889','C) 1890','D) 1891','E) 1892'], correct:1, explanation:'A Proclamação da República brasileira ocorreu em 15 de novembro de 1889, liderada pelo Marechal Deodoro da Fonseca.'},
  { id:6, exam:'ENEM', subject:'portugues', year:2023, difficulty:'medio', text:'Assinale a alternativa em que todas as palavras estão grafadas corretamente:', options:['A) Excessão, ansioso, pretensioso','B) Exceção, ancioso, pretencioso','C) Exceção, ansioso, pretensioso','D) Excessão, ancioso, pretencioso','E) Exceção, ansioso, pretencioso'], correct:2, explanation:'A grafia correta é: exceção (com "ç"), ansioso (com "s") e pretensioso (com "s").'},
  { id:7, exam:'ENEM', subject:'geografia', year:2022, difficulty:'facil', text:'Qual é o maior país da América do Sul em extensão territorial?', options:['A) Argentina','B) Peru','C) Colômbia','D) Brasil','E) Venezuela'], correct:3, explanation:'O Brasil é o maior país da América do Sul, ocupando aproximadamente 47% do território sul-americano.'},
  { id:8, exam:'FUVEST', subject:'filosofia', year:2023, difficulty:'dificil', text:'Segundo Aristóteles, qual é o objetivo último da ética?', options:['A) A justiça','B) A felicidade (eudaimonia)','C) O prazer','D) A virtude','E) A sabedoria'], correct:1, explanation:'Para Aristóteles, o fim último da ética é a eudaimonia (felicidade), que é alcançada através da prática das virtudes.'},
];

const subjectNames:Record<string,string>={ matematica:'Matemática', fisica:'Física', quimica:'Química', biologia:'Biologia', portugues:'Português', literatura:'Literatura', historia:'História', geografia:'Geografia', filosofia:'Filosofia', sociologia:'Sociologia', ingles:'Inglês', espanhol:'Espanhol' };
const difficultyNames:Record<string,string>={ facil:'Fácil', medio:'Médio', dificil:'Difícil' };

const Questoes: React.FC = () => {
  const [filters,setFilters]=useState({exam:'',subject:'',year:'',difficulty:''});
  const [view,setView]=useState<'list'|'grid'>('list');
  const [page,setPage]=useState(1);
  const perPage=5;

  const filtered = useMemo(()=> questionsDatabase.filter(q=> (
    (!filters.exam|| q.exam.toLowerCase()===filters.exam) &&
    (!filters.subject|| q.subject===filters.subject) &&
    (!filters.year|| q.year.toString()===filters.year) &&
    (!filters.difficulty|| q.difficulty===filters.difficulty)
  )), [filters]);

  useEffect(()=>{ setPage(1); },[filters]);

  const totalPages = Math.ceil(filtered.length / perPage) || 1;
  const slice = filtered.slice((page-1)*perPage, page*perPage);

  const [modal,setModal]=useState<{open:boolean; index:number; set: Question[]}>({open:false,index:0,set:[]});
  const [selectedOption,setSelectedOption]=useState<number|null>(null);
  const currentQuestion = modal.set[modal.index];

  const openModal = (q:Question, set:Question[]= [q])=> { setModal({open:true,index:set.findIndex(s=>s.id===q.id), set}); setSelectedOption(null); };
  const closeModal = ()=> { setModal(m=>({...m,open:false})); setSelectedOption(null); };
  const [showAns,setShowAns]=useState(false);
  useEffect(()=>{ if(modal.open) setShowAns(false); },[modal.open,modal.index]);

  const randomQuiz=()=>{
    const shuffled=[...questionsDatabase].sort(()=>0.5-Math.random()).slice(0,5);
    openModal(shuffled[0], shuffled);
  };

  return (
    <main className="main-content">
      <section className="questoes-hero">
        <div className="section-container"><div className="hero-content"><div className="hero-icon"><i className="fas fa-question-circle"/></div><h1 className="hero-title">Questões & Gabaritos</h1><p className="hero-subtitle">Pratique com milhares de questões de ENEM e vestibulares com gabaritos comentados e explicações detalhadas</p><div className="hero-stats"><div className="stat-item"><span className="stat-number">50.000+</span><span className="stat-label">Questões</span></div><div className="stat-item"><span className="stat-number">15</span><span className="stat-label">Matérias</span></div><div className="stat-item"><span className="stat-number">2024</span><span className="stat-label">Atualizadas</span></div></div></div></div>
      </section>
      <section className="filters-section">
        <div className="section-container">
          <div className="filters-container">
            <h2 className="filters-title"><i className="fas fa-filter"/> Filtrar Questões</h2>
            <div className="filters-grid">
              <div className="filter-group"><label>Exame</label><select className="filter-select" value={filters.exam} onChange={e=>setFilters(f=>({...f,exam:e.target.value}))}><option value="">Todos os exames</option><option value="enem">ENEM</option><option value="fuvest">FUVEST</option><option value="unicamp">UNICAMP</option><option value="ufrgs">UFRGS</option><option value="ufpr">UFPR</option><option value="ufsc">UFSC</option><option value="outros">Outros vestibulares</option></select></div>
              <div className="filter-group"><label>Matéria</label><select className="filter-select" value={filters.subject} onChange={e=>setFilters(f=>({...f,subject:e.target.value}))}><option value="">Todas as matérias</option><option value="matematica">Matemática</option><option value="fisica">Física</option><option value="quimica">Química</option><option value="biologia">Biologia</option><option value="portugues">Português</option><option value="literatura">Literatura</option><option value="historia">História</option><option value="geografia">Geografia</option><option value="filosofia">Filosofia</option><option value="sociologia">Sociologia</option><option value="ingles">Inglês</option><option value="espanhol">Espanhol</option></select></div>
              <div className="filter-group"><label>Ano</label><select className="filter-select" value={filters.year} onChange={e=>setFilters(f=>({...f,year:e.target.value}))}><option value="">Todos os anos</option><option value="2024">2024</option><option value="2023">2023</option><option value="2022">2022</option><option value="2021">2021</option><option value="2020">2020</option><option value="2019">2019</option><option value="2018">2018</option><option value="older">Anteriores</option></select></div>
              <div className="filter-group"><label>Dificuldade</label><select className="filter-select" value={filters.difficulty} onChange={e=>setFilters(f=>({...f,difficulty:e.target.value}))}><option value="">Todas</option><option value="facil">Fácil</option><option value="medio">Médio</option><option value="dificil">Difícil</option></select></div>
            </div>
            <div className="filters-actions">
              <button className="btn-secondary" onClick={()=>setFilters({exam:'',subject:'',year:'',difficulty:''})}><i className="fas fa-eraser"/> Limpar Filtros</button>
              <button className="btn-primary" onClick={()=>{/* trigger re-filter intentionally noop */}}><i className="fas fa-search"/> Buscar Questões</button>
              <button className="btn-primary" onClick={randomQuiz}><i className="fas fa-random"/> Quiz Aleatório</button>
            </div>
          </div>
        </div>
      </section>
      <section className="questions-section">
        <div className="section-container">
          <div className="questions-header">
            <h2 className="section-title"><i className="fas fa-list"/> Questões Encontradas</h2>
            <div className="questions-info"><span id="questionsCount">{filtered.length===0? 'Nenhuma questão encontrada': `Mostrando ${(page-1)*perPage+1}-${Math.min(page*perPage, filtered.length)} de ${filtered.length} questões`}</span>
              <div className="view-toggles">
                <button className={`view-toggle ${view==='list'?'active':''}`} onClick={()=>setView('list')}><i className="fas fa-list"/></button>
                <button className={`view-toggle ${view==='grid'?'active':''}`} onClick={()=>setView('grid')}><i className="fas fa-th"/></button>
              </div>
            </div>
          </div>
          <div className={`questions-container ${view}-view`}>
            {filtered.length===0 && (<div className="questions-empty"><i className="fas fa-search"/><h3>Nenhuma questão encontrada</h3><p>Tente ajustar os filtros para encontrar questões.</p><button className="btn-primary" onClick={()=>setFilters({exam:'',subject:'',year:'',difficulty:''})}><i className="fas fa-eraser"/> Limpar Filtros</button></div>)}
            {slice.map(q=> (
              <div key={q.id} className="question-card" onClick={()=>openModal(q)}>
                <div className="question-header">
                  <div className="question-info">
                    <span className="question-exam">{q.exam}</span>
                    <span className="question-subject">{subjectNames[q.subject]||q.subject}</span>
                    <span className="question-year">{q.year}</span>
                    <span className={`question-difficulty ${q.difficulty}`}>{difficultyNames[q.difficulty]}</span>
                  </div>
                  <div className="question-id">#{q.id}</div>
                </div>
                <div className="question-body">
                  <div className="question-text">{q.text}</div>
                  <div className="question-preview"><small><i className="fas fa-eye"/> Clique para ver as alternativas e resposta</small></div>
                </div>
              </div>
            ))}
          </div>
          {totalPages>1 && (
            <div className="pagination-container"><div className="pagination">
              <button className="pagination-btn" disabled={page===1} onClick={()=>setPage(p=>p-1)}><i className="fas fa-chevron-left"/></button>
              {Array.from({length: totalPages}, (_,i)=>i+1).slice(Math.max(0,page-3), Math.min(totalPages, page+2)).map(p=> (
                <button key={p} className={`pagination-btn ${p===page?'active':''}`} onClick={()=>setPage(p)}>{p}</button>
              ))}
              <button className="pagination-btn" disabled={page===totalPages} onClick={()=>setPage(p=>p+1)}><i className="fas fa-chevron-right"/></button>
            </div></div>
          )}
        </div>
      </section>
      <section className="study-tips-section">
        <div className="section-container">
          <h2 className="section-title"><i className="fas fa-graduation-cap"/> Dicas de Estudo</h2>
          <div className="tips-grid">
            <div className="tip-card"><div className="tip-icon"><i className="fas fa-clock"/></div><h3>Pratique Diariamente</h3><p>Resolva pelo menos 10 questões por dia para manter o ritmo de estudos e fixar o conteúdo.</p></div>
            <div className="tip-card"><div className="tip-icon"><i className="fas fa-chart-line"/></div><h3>Acompanhe seu Progresso</h3><p>Monitore seu desempenho por matéria e identifique pontos que precisam de mais atenção.</p></div>
            <div className="tip-card"><div className="tip-icon"><i className="fas fa-book-open"/></div><h3>Leia as Explicações</h3><p>Sempre leia a explicação das questões, mesmo quando acertar. Isso reforça o aprendizado.</p></div>
            <div className="tip-card"><div className="tip-icon"><i className="fas fa-target"/></div><h3>Foque nas Dificuldades</h3><p>Dedique mais tempo às matérias em que tem mais dificuldade para equilibrar seu conhecimento.</p></div>
          </div>
        </div>
      </section>

      {modal.open && currentQuestion && (
        <div className="modal-overlay" onClick={e=>{ if(e.target===e.currentTarget) closeModal(); }}>
          <div className="modal-content">
            <div className="modal-header"><h3>{`${currentQuestion.exam} ${currentQuestion.year} - ${subjectNames[currentQuestion.subject]} - Questão #${currentQuestion.id}`}</h3><button className="modal-close" onClick={closeModal}><i className="fas fa-times"/></button></div>
            <div className="modal-body">
              <div className="question-content"><p>{currentQuestion.text}</p></div>
              <div className="question-options">
                {currentQuestion.options.map((op,i)=> {
                  const isCorrect = i===currentQuestion.correct;
                  let cls = 'option-item';
                  if(selectedOption===i && !showAns) cls+=' selected';
                  if(showAns){
                    if(isCorrect) cls+=' correct';
                    else if(selectedOption===i) cls+=' incorrect';
                  }
                  return (
                    <div key={i} className={cls} onClick={()=>!showAns && setSelectedOption(i)}>
                      <span className="option-letter">{String.fromCharCode(65+i)})</span>
                      <span className="option-text">{op.substring(3)}</span>
                    </div>
                  );
                })}
              </div>
              <div className="question-actions">
                {!showAns && <button className="btn-secondary" disabled={selectedOption===null} onClick={()=>setShowAns(true)}><i className="fas fa-eye"/> Ver Resposta</button>}
                <button className="btn-primary" onClick={()=>{
                  if(modal.index < modal.set.length-1){ setModal(m=>({...m,index:m.index+1})); }
                  else { closeModal(); alert('Quiz finalizado! Parabéns por praticar.'); }
                }}>
                  <i className="fas fa-arrow-right"/> {modal.index < modal.set.length-1 ? 'Próxima Questão':'Finalizar'}
                </button>
              </div>
              {showAns && (
                <div className="answer-section">
                  <div className="correct-answer"><h4><i className="fas fa-check-circle"/> Resposta Correta</h4><p>{currentQuestion.options[currentQuestion.correct]}</p>{selectedOption!==null && selectedOption!==currentQuestion.correct && (<p>Sua resposta: {currentQuestion.options[selectedOption]}</p>)}</div>
                  <div className="answer-explanation"><h4><i className="fas fa-lightbulb"/> Explicação</h4><div><p>{currentQuestion.explanation}</p></div></div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Questoes;
