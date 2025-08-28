import React, { useState } from 'react';

const Planos: React.FC = () => {
  const [modal,setModal]=useState<'login'|'signup'|null>(null);
  const [selectedPlan,setSelectedPlan]=useState<'basico'|'premium'|'elite'>('premium');

  const planNames = { basico:'Básico - R$ 29/mês', premium:'Premium - R$ 59/mês', elite:'Elite - R$ 99/mês' };

  const openSignup=(p: 'basico'|'premium'|'elite')=>{ setSelectedPlan(p); setModal('signup'); };
  // login handled via modal state toggles directly

  return (
    <main className="main-content">
      <section className="plans-section">
        <div className="section-container">
          <h2 className="section-title"><i className="fas fa-crown"/> Escolha seu Plano</h2>
          <p className="plans-subtitle">Comece sua jornada rumo à aprovação com o plano ideal para você</p>
          <div className="plans-grid">
            <div className="plan-card">
              <div className="plan-header"><h3 className="plan-name">Básico</h3><div className="plan-price"><span className="currency">R$</span><span className="amount">29</span><span className="period">/mês</span></div></div>
              <div className="plan-features">
                <div className="feature"><i className="fas fa-check"/> <span>Acesso a 10.000 questões</span></div>
                <div className="feature"><i className="fas fa-check"/> <span>Correção de 5 redações/mês</span></div>
                <div className="feature"><i className="fas fa-check"/> <span>Simulados mensais</span></div>
                <div className="feature"><i className="fas fa-check"/> <span>Relatórios de desempenho</span></div>
              </div>
              <button className="plan-button" onClick={()=>openSignup('basico')}>Começar Agora</button>
            </div>
            <div className="plan-card featured">
              <div className="plan-badge">Mais Popular</div>
              <div className="plan-header"><h3 className="plan-name">Premium</h3><div className="plan-price"><span className="currency">R$</span><span className="amount">59</span><span className="period">/mês</span></div></div>
              <div className="plan-features">
                <div className="feature"><i className="fas fa-check"/> <span>Acesso a 50.000+ questões</span></div>
                <div className="feature"><i className="fas fa-check"/> <span>Correções ilimitadas</span></div>
                <div className="feature"><i className="fas fa-check"/> <span>IA Personalizada</span></div>
                <div className="feature"><i className="fas fa-check"/> <span>Simulados semanais</span></div>
                <div className="feature"><i className="fas fa-check"/> <span>Mentoria online</span></div>
                <div className="feature"><i className="fas fa-check"/> <span>Suporte prioritário</span></div>
              </div>
              <button className="plan-button featured" onClick={()=>openSignup('premium')}>Começar Agora</button>
            </div>
            <div className="plan-card">
              <div className="plan-header"><h3 className="plan-name">Elite</h3><div className="plan-price"><span className="currency">R$</span><span className="amount">99</span><span className="period">/mês</span></div></div>
              <div className="plan-features">
                <div className="feature"><i className="fas fa-check"/> <span>Tudo do Premium</span></div>
                <div className="feature"><i className="fas fa-check"/> <span>Aulas ao vivo</span></div>
                <div className="feature"><i className="fas fa-check"/> <span>Consultoria 1:1</span></div>
                <div className="feature"><i className="fas fa-check"/> <span>Material exclusivo</span></div>
                <div className="feature"><i className="fas fa-check"/> <span>Garantia de aprovação</span></div>
              </div>
              <button className="plan-button" onClick={()=>openSignup('elite')}>Começar Agora</button>
            </div>
          </div>
          <div className="plans-guarantee"><i className="fas fa-shield-alt"/> <p>Garantia de 7 dias. Cancele quando quiser, sem compromisso.</p></div>
        </div>
      </section>

      {modal && (
        <div className="auth-modal active" onClick={e=>{ if(e.target===e.currentTarget) setModal(null); }}>
          <div className="auth-container">
            <div className="auth-logo"><h1>Aprova.ia</h1><span className="auth-tagline">Seu sucesso começa aqui</span></div>
            <div className="auth-modal-content">
              <button className="auth-close" onClick={()=>setModal(null)}>&times;</button>
              {modal==='login' && (
                <>
                  <h2 className="auth-title">Entrar na sua conta</h2>
                  <form className="auth-form" onSubmit={(e)=>{e.preventDefault(); alert('Login realizado com sucesso!'); setModal(null);}}>
                    <div className="input-group"><i className="fas fa-envelope"/><input type="email" placeholder="Seu e-mail" required/></div>
                    <div className="input-group"><i className="fas fa-lock"/><input type="password" placeholder="Sua senha" required/></div>
                    <div className="auth-options">
                      <label className="checkbox-container"><input type="checkbox"/><span className="checkmark"/>Lembrar de mim</label>
                      <a href="#" className="forgot-password">Esqueci minha senha</a>
                    </div>
                    <button type="submit" className="auth-button">Entrar</button>
                  </form>
                  <div className="auth-divider"><span>ou</span></div>
                  <button className="google-button"><i className="fab fa-google"/> Continuar com Google</button>
                  <p className="auth-switch">Não tem uma conta? <a href="#" onClick={(e)=>{e.preventDefault(); setModal('signup');}}>Cadastre-se</a></p>
                </>
              )}
              {modal==='signup' && (
                <>
                  <h2 className="auth-title">Criar sua conta</h2>
                  <form className="auth-form" onSubmit={(e)=>{e.preventDefault(); alert('Conta criada!'); setModal(null);}}>
                    <div className="input-group"><i className="fas fa-user"/><input type="text" placeholder="Seu nome completo" required/></div>
                    <div className="input-group"><i className="fas fa-envelope"/><input type="email" placeholder="Seu e-mail" required/></div>
                    <div className="input-group"><i className="fas fa-lock"/><input type="password" placeholder="Crie uma senha" required/></div>
                    <div className="input-group"><i className="fas fa-lock"/><input type="password" placeholder="Confirme sua senha" required/></div>
                    <div className="plan-selection"><label>Plano selecionado:</label><div className="selected-plan">{planNames[selectedPlan]}</div></div>
                    <div className="auth-options"><label className="checkbox-container"><input type="checkbox" required/><span className="checkmark"/>Aceito os <a href="#">termos de uso</a> e <a href="#">política de privacidade</a></label></div>
                    <button type="submit" className="auth-button">Criar Conta</button>
                  </form>
                  <div className="auth-divider"><span>ou</span></div>
                  <button className="google-button"><i className="fab fa-google"/> Continuar com Google</button>
                  <p className="auth-switch">Já tem uma conta? <a href="#" onClick={(e)=>{e.preventDefault(); setModal('login');}}>Faça login</a></p>
                </>
              )}
            </div>
            <div className="auth-footer"><p>&copy; 2025 Aprova.ia. Todos os direitos reservados.</p><div className="auth-footer-logo">Aprova.ia</div></div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Planos;
