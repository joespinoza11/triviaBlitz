import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import LoginModal from './components/LoginModal';
import Home from './pages/Home';
import Resultados from './pages/Resultados';

function App() {
  const [showLoginModal, setShowLoginModal] = useState(() => {
    // Inicializa basado en si hay usuario en localStorage
    const userData = localStorage.getItem('triviaUser');
    return !userData; // true si no hay usuario
  });

  return (
    <AuthProvider>
      <Router>
        <div className="d-flex flex-column min-vh-100">
          {/* Navbar */}
          <Navbar onLoginClick={() => setShowLoginModal(true)} />

          {/* Login Modal */}
          <LoginModal 
            show={showLoginModal} 
            onHide={() => setShowLoginModal(false)} 
          />

          {/* Main Content */}
          <main className="flex-grow-1 bg-light">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/resultados" element={<Resultados />} />
            </Routes>
          </main>

          {/* Footer */}
          <footer className="bg-dark text-white text-center py-3 mt-5">
            <Container>
              <p className="mb-0">© 2026 Trivia Blitz - Todos los derechos reservados</p>
            </Container>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;