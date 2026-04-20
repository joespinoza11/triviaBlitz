import React, { useContext } from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";

export default function NavbarComponent({ onLoginClick }) {
  const { user, logout } = useContext(AuthContext);

  return (
    <Navbar bg="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand href="/" className="text-warning fw-bold">
          ⚡ Trivia Blitz
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {user ? (
              <>
                <Nav.Link href="/" className="text-white">
                  Inicio
                </Nav.Link>
                <Nav.Link href="/resultados" className="text-white">
                  Resultados
                </Nav.Link>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={logout}
                  className="ms-2"
                >
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <Button variant="warning" size="sm" onClick={onLoginClick}>
                Iniciar Sesión
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
