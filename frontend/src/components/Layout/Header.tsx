import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const Header: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (window.innerWidth <= 768) {
        const nav = document.querySelector('.nav');
        const toggle = document.querySelector('.mobile-menu-toggle');
        const header = document.querySelector('.header');
        if (nav && !nav.contains(e.target as Node) && toggle && !toggle.contains(e.target as Node) && header && !header.contains(e.target as Node)) {
          setMobileOpen(false);
        }
      }
    };
    document.addEventListener('click', handleOutside);
    return () => document.removeEventListener('click', handleOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // replicate compact header logic (simplified)
      const header = document.querySelector('.header') as HTMLElement | null;
      const logoTitle = document.querySelector('.logo h1') as HTMLElement | null;
      const tagline = document.querySelector('.tagline') as HTMLElement | null;
      if (!header || !logoTitle || !tagline) return;
      const scrollTop = window.scrollY;
      const maxScroll = 80;
      const progress = Math.min(scrollTop / maxScroll, 1);
      const ease = 1 - Math.pow(1 - progress, 2);
      const lerp = (a:number,b:number)=> a + (b-a)*ease;
      header.style.paddingTop = header.style.paddingBottom = `${lerp(16,8)}px`;
      logoTitle.style.fontSize = `${lerp(32,24)}px`;
      logoTitle.style.marginBottom = `${lerp(4,1.6)}px`;
      tagline.style.fontSize = `${lerp(12.8,11.2)}px`;
      tagline.style.opacity = `${0.8 - 0.15*ease}`;
      header.style.boxShadow = `0 4px 20px rgba(5,19,50,${0.15+0.15*ease})`;
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <h1><Link to="/" style={{color:'inherit', textDecoration:'none'}}>Aprova.ia</Link></h1>
          <span className="tagline">Seu sucesso começa aqui</span>
        </div>
        <nav className={`nav ${mobileOpen ? 'mobile-active' : ''}`} style={{display: mobileOpen || window.innerWidth>768 ? 'block':'none'}}>
          <ul className="nav-list">
            <li><NavLink to="/" end className={({isActive})=>`nav-link ${isActive ? 'active':''}`}>Início</NavLink></li>
            <li><NavLink to="/redacoach" className={({isActive})=>`nav-link ${isActive ? 'active':''}`}>RedaCoach</NavLink></li>
            <li><NavLink to="/questoes" className={({isActive})=>`nav-link ${isActive ? 'active':''}`}>Questões & Gabaritos</NavLink></li>
            <li><a href="/#sobre" className="nav-link">Sobre</a></li>
          </ul>
        </nav>
        <div className="header-actions">
          <button className="cta-button" onClick={()=>window.location.href='/planos'}>
            <i className="fas fa-rocket"/> Começar Agora
          </button>
        </div>
        <div className="mobile-menu-toggle" onClick={(e)=>{e.stopPropagation(); setMobileOpen(o=>!o);}}>
          <i className="fas fa-bars" />
        </div>
      </div>
    </header>
  );
};

export default Header;
