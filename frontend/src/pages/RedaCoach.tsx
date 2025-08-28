import React, { useEffect, useRef, useState } from 'react';

interface AnalysisResult { overall:number; competencies:number[]; descriptions:string[]; suggestions:string[][]; detailed:string; }

function simulateAnalysis(text:string){
  const words=text.trim().split(/\s+/).filter(Boolean).length;
  let base=600; if(words>=200 && words<=400) base+=100; else if(words>400) base+=50; else base-=100; base+=Math.random()*150-75; const overall=Math.max(200,Math.min(1000,Math.round(base)));
  const comps=Array.from({length:5},()=> Math.max(40, Math.min(200, Math.round(overall*0.2 + (Math.random()*40-20)))));
  return { overall, competencies:comps } as AnalysisResult;
}

const competencyTitles=[
  'Demonstra domínio da modalidade escrita formal da língua portuguesa',
  'Compreende a proposta de redação e aplica conceitos das várias áreas de conhecimento',
  'Seleciona, relaciona, organiza e interpreta informações, fatos, opiniões e argumentos',
  'Demonstra conhecimento dos mecanismos linguísticos necessários para a construção da argumentação',
  'Elabora proposta de intervenção para o problema abordado'
];

const RedaCoach: React.FC = () => {
  const [method,setMethod]=useState<'text'|'file'>('text');
  const [essay,setEssay]=useState('');
  const [theme,setTheme]=useState('');
  const [wordCount,setWordCount]=useState(0);
  const [analyzing,setAnalyzing]=useState(false);
  const [result,setResult]=useState<AnalysisResult|null>(null);
  const fileInput=useRef<HTMLInputElement|null>(null);
  const [fileInfo,setFileInfo]=useState<File|null>(null);

  useEffect(()=>{ setWordCount(essay.trim()? essay.trim().split(/\s+/).length:0); },[essay]);

  const analyze=()=>{
    if(method==='text'){
      if(!essay.trim()) return alert('Por favor, digite sua redação.');
      if(essay.trim().split(/\s+/).length < 200) return alert('Sua redação deve ter pelo menos 200 palavras.');
      if(!theme.trim()) return alert('Informe o tema.');
    }
    setAnalyzing(true);
    setTimeout(()=>{ const r=simulateAnalysis(essay||'Texto do arquivo'); setResult(r); setAnalyzing(false); }, 2000);
  };

  return (
    <main className="main-content">
      <section className="redacoach-hero">
        <div className="section-container"><div className="hero-content"><div className="hero-icon"><i className="fas fa-edit"/></div><h1 className="hero-title">RedaCoach</h1><p className="hero-subtitle">Correção automática de redações com feedback detalhado e notas por competência do ENEM</p><div className="hero-features"><div className="hero-feature"><i className="fas fa-chart-line"/><span>Avaliação por Competências</span></div><div className="hero-feature"><i className="fas fa-lightbulb"/><span>Feedback Inteligente</span></div><div className="hero-feature"><i className="fas fa-target"/><span>Sugestões de Melhoria</span></div></div></div></div>
      </section>
      <section className="upload-section">
        <div className="section-container">
          <h2 className="section-title"><i className="fas fa-cloud-upload-alt"/> Envie sua Redação</h2>
          <div className="upload-container">
            <div className="upload-methods">
              <div className={`upload-method ${method==='text'?'active':''}`} data-method="text">
                <div className="method-header"><i className="fas fa-keyboard"/><h3>Escrever Texto</h3><p>Digite ou cole sua redação diretamente</p></div>
                <div className="text-input-container">
                  <div className="essay-info">
                    <div className="essay-theme"><label htmlFor="essayTheme">Tema da Redação:</label><input id="essayTheme" className="theme-input" value={theme} onChange={e=>setTheme(e.target.value)} placeholder="Ex: A importância da educação no Brasil"/></div>
                    <div className="word-count"><span id="wordCount">{wordCount}</span> palavras</div>
                  </div>
                  <textarea id="essayText" className="essay-textarea" value={essay} onChange={e=>setEssay(e.target.value)} placeholder="Digite sua redação aqui... (mínimo 200 palavras)" rows={15}></textarea>
                  <div className="input-actions">
                    <button type="button" className="btn-secondary" onClick={()=>{ if(confirm('Limpar texto?')){ setEssay(''); setTheme(''); }}}><i className="fas fa-eraser"/> Limpar</button>
                    <button type="button" className="btn-primary" disabled={analyzing} onClick={analyze}><i className="fas fa-search"/> {analyzing? 'Analisando...':'Analisar Redação'}</button>
                  </div>
                </div>
              </div>
              <div className={`upload-method ${method==='file'?'active':''}`} data-method="file">
                <div className="method-header"><i className="fas fa-file-upload"/><h3>Enviar Arquivo</h3><p>Faça upload de um arquivo PDF, DOC ou imagem</p></div>
                <div className="file-upload-container">
                  {!fileInfo && (
                    <div className="file-drop-zone" onClick={()=>fileInput.current?.click()}>
                      <div className="drop-zone-content"><i className="fas fa-cloud-upload-alt"/><h4>Arraste e solte seu arquivo aqui</h4><p>ou clique para selecionar</p><div className="supported-formats"><span>Formatos suportados: PDF, DOC, DOCX, JPG, PNG</span></div></div>
                      <input ref={fileInput} type="file" hidden onChange={e=>{ if(e.target.files?.[0]) setFileInfo(e.target.files[0]); }}/>
                    </div>
                  )}
                  {fileInfo && (
                    <>
                      <div className="file-info"><div className="file-details"><i className="fas fa-file"/><div><span className="file-name">{fileInfo.name}</span><span className="file-size">{(fileInfo.size/1024).toFixed(1)} KB</span></div></div><button className="remove-file" onClick={()=>setFileInfo(null)}><i className="fas fa-times"/></button></div>
                      <div className="file-actions"><button className="btn-secondary" onClick={()=>fileInput.current?.click()}><i className="fas fa-exchange-alt"/> Trocar Arquivo</button><button className="btn-primary" disabled={analyzing} onClick={analyze}><i className="fas fa-search"/> {analyzing? 'Processando...':'Analisar Arquivo'}</button></div>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="method-toggle">
              <button className={`toggle-btn ${method==='text'?'active':''}`} onClick={()=>setMethod('text')}><i className="fas fa-keyboard"/> Texto</button>
              <button className={`toggle-btn ${method==='file'?'active':''}`} onClick={()=>setMethod('file')}><i className="fas fa-file"/> Arquivo</button>
            </div>
          </div>
        </div>
      </section>
      {result && (
        <section className="results-section" id="resultsSection">
          <div className="section-container">
            <h2 className="section-title"><i className="fas fa-chart-bar"/> Resultado da Análise</h2>
            <div className="results-container">
              <div className="overall-score">
                <div className="score-circle" style={{background:`conic-gradient(var(--lime) ${(result.overall/1000)*360}deg, var(--seashell-light) 0deg)`}}>
                  <div className="score-value">{result.overall}</div>
                  <div className="score-max">/1000</div>
                </div>
                <div className="score-description"><h3>Nota Geral</h3><p>{result.overall>=900? 'Excelente!':'Resultado gerado.'}</p></div>
              </div>
              <div className="competencies-grid">
                {result.competencies.map((c,i)=> (
                  <div key={i} className="competency-card">
                    <div className="competency-header"><h4>Competência {i+1}</h4><div className="competency-score">{c}</div></div>
                    <div className="competency-title">{competencyTitles[i]}</div>
                    <div className="competency-description">{competencyTitles[i]}</div>
                  </div>
                ))}
              </div>
              <div className="detailed-feedback"><h3><i className="fas fa-comments"/> Feedback Detalhado</h3><div className="feedback-content"><p>Texto simulado de feedback. Pratique estrutura, diversifique repertório e revise a coerência argumentativa.</p></div></div>
              <div className="results-actions"><button className="btn-secondary" onClick={()=>alert('Baixando relatório...')}><i className="fas fa-download"/> Baixar Relatório</button><button className="btn-primary" onClick={()=>{ setResult(null); setEssay(''); setTheme('');}}><i className="fas fa-plus"/> Nova Análise</button></div>
            </div>
          </div>
        </section>
      )}
      <section className="tips-section">
        <div className="section-container">
          <h2 className="section-title"><i className="fas fa-lightbulb"/> Dicas para uma Redação Nota 1000</h2>
          <div className="tips-grid">
            <div className="tip-card"><div className="tip-icon"><i className="fas fa-pencil-alt"/></div><h3>Estrutura</h3><p>Organize sua redação em: introdução com tese, dois parágrafos de desenvolvimento e conclusão com proposta de intervenção.</p></div>
            <div className="tip-card"><div className="tip-icon"><i className="fas fa-book"/></div><h3>Repertório</h3><p>Use referências de filósofos, dados estatísticos, fatos históricos ou exemplos da atualidade para enriquecer seus argumentos.</p></div>
            <div className="tip-card"><div className="tip-icon"><i className="fas fa-link"/></div><h3>Conectivos</h3><p>Utilize conectivos variados para dar fluidez ao texto: "além disso", "por outro lado", "dessa forma", "portanto".</p></div>
            <div className="tip-card"><div className="tip-icon"><i className="fas fa-bullseye"/></div><h3>Proposta</h3><p>Sua proposta de intervenção deve ter: ação, agente, modo/meio, finalidade e detalhamento.</p></div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default RedaCoach;
