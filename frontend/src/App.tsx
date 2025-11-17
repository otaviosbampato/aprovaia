import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import Planos from './pages/Planos';
import Questoes from './pages/Questoes';
import RedaCoach from './pages/RedaCoach';
import './styles/root-styles.css';

const App: React.FC = () => {
  return (
    <div className="app-shell">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/planos" element={<Planos />} />
        <Route path="/questoes" element={<Questoes />} />
        <Route path="/redacoach" element={<RedaCoach />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
