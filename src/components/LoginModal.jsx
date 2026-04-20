<<<<<<< HEAD
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
      await login(username, accessCode); // ✅ Añade 'await' aquí
      handleClose();
    } catch (err) {
      // El error se maneja en el contexto
      console.error("Error en login:", err);
=======
import React, { useContext, useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";

export default function LoginModal({ show, onHide }) {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: "", username: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.username && formData.email) {
      login(formData);
      onHide();
      setFormData({ email: "", username: "" });
>>>>>>> Reynold
    }
  };

  return (
<<<<<<< HEAD
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
=======
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Bienvenido a Trivia Blitz ⚡</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Usuario</Form.Label>
            <Form.Control
              type="text"
              name="username"
              placeholder="Ingresa tu nombre de usuario"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Correo Electrónico</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="tu@correo.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Button variant="warning" type="submit" className="w-100">
            Comenzar
          </Button>
>>>>>>> Reynold
        </Form>
      </Modal.Body>
    </Modal>
  );
<<<<<<< HEAD
};

export default LoginModal;
=======
}
>>>>>>> Reynold
