import React from 'react';

const Footer: React.FC = () => (
  <footer className="footer">
    <div className="footer-container">
      <div className="footer-content">
        <div className="footer-section">
          <h4>Aprova.ia</h4>
            <p>Preparação inteligente para ENEM e vestibulares</p>
        </div>
        <div className="footer-section">
          <h4>Links Úteis</h4>
          <ul>
            <li><a href="/redacoach">RedaCoach</a></li>
            <li><a href="/questoes">Questões</a></li>
            <li><a href="/#sobre">Sobre</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Contato</h4>
          <p>contato@aprova.ia</p>
          <div className="social-links">
            <a href="#"><i className="fab fa-instagram"/></a>
            <a href="#"><i className="fab fa-youtube"/></a>
            <a href="#"><i className="fab fa-twitter"/></a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 Aprova.ia. Todos os direitos reservados.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
