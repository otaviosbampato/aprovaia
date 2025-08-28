import React from 'react';
import Chatbot from '../components/Chat/Chatbot';

const Home: React.FC = () => {
  return (
    <main className="main-content">
      <div className="scroll-container">
        <section className="hero-section" id="home">
          <div className="hero-content">
            <h2 className="hero-title">Prepare-se para o ENEM e Vestibulares</h2>
            <p className="hero-subtitle">Estude com inteligência artificial, corrija redações e pratique com milhares de questões</p>
            <p className="hero-universities">FUVEST, UNICAMP, PAS-UFLA, CMMG, UIT, PUC, e muitas outras.</p>
            <div className="hero-stats">
              <div className="stat"><span className="stat-number">50k+</span><span className="stat-label">Questões</span></div>
              <div className="stat"><span className="stat-number">10k+</span><span className="stat-label">Redações Corrigidas</span></div>
              <div className="stat"><span className="stat-number">95%</span><span className="stat-label">Taxa de Aprovação</span></div>
            </div>
          </div>
        </section>
        <Chatbot />
        <section className="features-section">
          <div className="section-container">
            <h3 className="section-title">Ferramentas de Estudo</h3>
            <div className="features-grid">
              <div className="feature-card" onClick={()=>window.location.href='/redacoach'}>
                <div className="feature-icon"><i className="fas fa-edit"/></div>
                <h4 className="feature-title">RedaCoach</h4>
                <p className="feature-description">Correção automática de redações com feedback detalhado e notas por competência</p>
                <div className="feature-arrow"><i className="fas fa-arrow-right"/></div>
              </div>
              <div className="feature-card" onClick={()=>window.location.href='/questoes'}>
                <div className="feature-icon"><i className="fas fa-question-circle"/></div>
                <h4 className="feature-title">Questões & Gabaritos</h4>
                <p className="feature-description">Banco com milhares de questões de ENEM e vestibulares com gabaritos comentados</p>
                <div className="feature-arrow"><i className="fas fa-arrow-right"/></div>
              </div>
              <div className="feature-card chatbot-card">
                <div className="feature-icon"><i className="fas fa-brain"/></div>
                <h4 className="feature-title">Assistente IA</h4>
                <p className="feature-description">Inteligência artificial para tirar dúvidas e orientar seus estudos</p>
                <div className="feature-arrow"><i className="fas fa-arrow-up"/></div>
              </div>
            </div>
          </div>
        </section>
        <section className="about-section" id="sobre">
          <div className="section-container">
            <h3 className="section-title">Sobre o Aprova.ia</h3>
            <div className="about-content">
              <div className="about-text">
                <p>O Aprova.ia é uma plataforma completa para preparação para o ENEM e vestibulares, oferecendo ferramentas modernas e inteligentes para potencializar seus estudos.</p>
                <div className="about-features">
                  <div className="about-feature"><i className="fas fa-check-circle"/><span>Correção automática de redações</span></div>
                  <div className="about-feature"><i className="fas fa-check-circle"/><span>Banco atualizado de questões</span></div>
                  <div className="about-feature"><i className="fas fa-check-circle"/><span>Assistente IA personalizado</span></div>
                  <div className="about-feature"><i className="fas fa-check-circle"/><span>Acompanhamento de progresso</span></div>
                </div>
              </div>
              <div className="about-image">
                <img src="/enem.png" alt="ENEM 2024 - Prepare-se com Aprova.ia" className="enem-image" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Home;
