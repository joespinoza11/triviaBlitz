import React, { useState } from "react";
import {
  Navbar as BootstrapNavbar,
  Nav,
  Container,
  Dropdown,
} from "react-bootstrap";
import { useAuth } from "../hooks/useAuth";
import Button from "./Button";
import "bootstrap/dist/css/bootstrap.min.css";

const Navbar = ({ onLoginClick }) => {
  const { user, logout } = useAuth();
  const [expanded, setExpanded] = useState(false);

  const handleLogout = () => {
    logout();
    setExpanded(false);
  };

  return (
    <BootstrapNavbar
      bg="primary"
      expand="lg"
      sticky="top"
      className="shadow-sm"
    >
      <Container>
        <BootstrapNavbar.Brand href="/" className="fw-bold text-white">
          🎯 Trivia Blitz
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle
          aria-controls="basic-navbar-nav"
          onClick={() => setExpanded(expanded ? false : true)}
        />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {user ? (
              <>
                <Nav.Item className="d-flex align-items-center me-3">
                  <span className="text-white">👤 {user.username}</span>
                </Nav.Item>
                <Dropdown>
                  <Dropdown.Toggle
                    variant="light"
                    id="dropdown-user"
                    className="no-arrow"
                  >
                    Opciones
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item href="/">Inicio</Dropdown.Item>
                    <Dropdown.Item href="/resultados">Resultados</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item
                      onClick={handleLogout}
                      className="text-danger"
                    >
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