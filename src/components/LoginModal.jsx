import React, { useState } from "react";
import { Modal, Form, Alert } from "react-bootstrap";
import Button from "./Button";
import { useAuth } from "../hooks/useAuth";

const LoginModal = ({ show, onHide }) => {
  const [username, setUsername] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const { login, loading, error, clearError } = useAuth();

  const handleClose = () => {
    setUsername("");
    setAccessCode("");
    clearError();
    onHide();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, accessCode);
      handleClose();
    } catch (err) {
      console.error("Error en login:", err);
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton={!loading}>
        <Modal.Title>🎮 Bienvenido a Trivia Blitz</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && (
          <Alert variant="danger" onClose={clearError} dismissible>
            {error}
          </Alert>
        )}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Nombre de Usuario</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingresa tu nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Código de Acceso</Form.Label>
            <Form.Control
              type="password"
              placeholder="Ingresa el código de acceso"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              disabled={loading}
              required
            />
          </Form.Group>

          <div className="d-grid gap-2">
            <Button
              type="submit"
              disabled={loading || !username || !accessCode}
            >
              {loading ? "Ingresando..." : "Ingresar"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default LoginModal;