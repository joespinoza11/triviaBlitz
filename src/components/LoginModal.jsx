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
    }
  };

  return (
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
        </Form>
      </Modal.Body>
    </Modal>
  );
}
