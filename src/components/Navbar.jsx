import React, { useState } from "react";
import {
  Navbar as BootstrapNavbar,
  Nav,
  Container,
  Dropdown,
} from "react-bootstrap";
import { useAuth } from "../hooks/useAuth";
import { useRecompensas } from "../context/RecompensasContext";
import Button from "./Button";
import "bootstrap/dist/css/bootstrap.min.css";

const Navbar = ({ onLoginClick }) => {
  const { user, logout } = useAuth();
  const { TIENDA, avatarActivo } = useRecompensas();
  const [expanded, setExpanded] = useState(false);

  // Obtener el emoji del avatar activo
  const currentAvatar = TIENDA.find(a => a.id === avatarActivo);
  const profileEmoji = currentAvatar ? currentAvatar.icono : "👤";

  const handleLogout = () => {
    logout();
    setExpanded(false);
  };

  return (
    <BootstrapNavbar bg="primary" expand="lg" sticky="top" className="shadow-sm">
      <Container>
        <BootstrapNavbar.Brand href="/" className="fw-bold text-white">
          Trivia Blitz
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle
          aria-controls="basic-navbar-nav"
          onClick={() => setExpanded(!expanded)}
        />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {user ? (
              <>
                <Nav.Item className="d-flex align-items-center me-3">
                  <span className="text-white">
                    {profileEmoji} {user.username}
                  </span>
                </Nav.Item>
                <Dropdown>
                  <Dropdown.Toggle variant="light" id="dropdown-user" className="no-arrow">
                    Opciones
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item href="/">Inicio</Dropdown.Item>
                    <Dropdown.Item href="/tienda">Tienda</Dropdown.Item>
                    <Dropdown.Item href="/resultados">Resultados</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout} className="text-danger">
                      Cerrar Sesión
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            ) : (
              <Button
                variant="light"
                onClick={() => {
                  onLoginClick();
                  setExpanded(false);
                }}
              >
                Iniciar Sesión
              </Button>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;