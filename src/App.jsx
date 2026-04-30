import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import { AuthProvider } from './context/AuthContext';
import { JuegoProvider } from './context/JuegoContext';
import { RecompensasProvider } from './context/RecompensasContext';
import Navbar from './components/Navbar';
import LoginModal from './components/LoginModal';
import Home from './pages/Home';
import Juego from './pages/Juego';
import Resultados from './pages/Resultados';
import Tienda from './pages/Tienda';

function App() {
  const [showLoginModal, setShowLoginModal] = useState(() => {
    const userData = localStorage.getItem('triviaUser');
    return !userData;
  });

  return (
    <AuthProvider>
      <JuegoProvider>
        <RecompensasProvider>
          <Router>
            <div className="d-flex flex-column min-vh-100">
              <Navbar onLoginClick={() => setShowLoginModal(true)} />
              <LoginModal
                show={showLoginModal}
                onHide={() => setShowLoginModal(false)}
              />
              <main className="flex-grow-1 bg-light">
                <Routes>
                  <Route path="/"           element={<Home />} />
                  <Route path="/juego"      element={<Juego />} />
                  <Route path="/resultados" element={<Resultados />} />
                  <Route path="/tienda"     element={<Tienda />} />
                </Routes>
              </main>
              <footer className="bg-dark text-white text-center py-3 mt-5">
                <Container>
                  <p className="mb-0">© 2026 Trivia Blitz - Todos los derechos reservados</p>
                </Container>
              </footer>
            </div>
          </Router>
        </RecompensasProvider>
      </JuegoProvider>
    </AuthProvider>
  );
}

export default App;
