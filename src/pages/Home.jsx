import React, { useState } from "react";
import { Container, Row, Col, Form, Alert } from "react-bootstrap";
import Card from "../components/Card";
import Button from "../components/Button";
import { useAuth } from "../hooks/useAuth";
import LoginModal from "../components/LoginModal";

const Home = () => {
  const { user } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(!user);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [error, setError] = useState("");

  const categories = [
    { id: "ciencia", label: "🔬 Ciencia", icon: "🔬" },
    { id: "historia", label: "📚 Historia", icon: "📚" },
    { id: "deporte", label: "⚽ Deporte", icon: "⚽" },
    { id: "peliculas", label: "🎬 Películas", icon: "🎬" },
    { id: "geografia", label: "🌍 Geografía", icon: "🌍" },
    { id: "musica", label: "🎵 Música", icon: "🎵" },
  ];

  const difficulties = [
    { id: "facil", label: "⭐ Fácil", value: "easy" },
    { id: "medio", label: "⭐⭐ Medio", value: "medium" },
    { id: "dificil", label: "⭐⭐⭐ Difícil", value: "hard" },
  ];

  const handleStartQuiz = () => {
    setError("");
    if (!selectedCategory) {
      setError("Por favor selecciona una categoría");
      return;
    }
    if (!selectedDifficulty) {
      setError("Por favor selecciona una dificultad");
      return;
    }
    console.log("Iniciando quiz:", { selectedCategory, selectedDifficulty });
  };

  return (
    <>
      <LoginModal
        show={showLoginModal}
        onHide={() => setShowLoginModal(false)}
      />

      <Container className="py-5">
        <Row className="mb-5">
          <Col lg={8} className="mx-auto text-center">
            <h1 className="mb-3">🎮 ¡Bienvenido a Trivia Blitz!</h1>
            <Card title="Comenzar Desafío" className="mb-4">
              <p className="text-muted mb-0">
                Pon a prueba tus conocimientos eligiendo una categoría y dificultad
              </p>
            </Card>
          </Col>
        </Row>

        {error && (
          <Row className="mb-4">
            <Col lg={8} className="mx-auto">
              <Alert variant="danger" dismissible onClose={() => setError("")}>
                {error}
              </Alert>
            </Col>
          </Row>
        )}

        {user && (
          <Row className="mb-4">
            <Col lg={8} className="mx-auto">
              <Alert variant="info">
                ¡Hola <strong>{user.username}</strong>! ¿Listo para jugar?
              </Alert>
            </Col>
          </Row>
        )}

        <Row className="mb-5">
          <Col lg={8} className="mx-auto">
            <Card title="1. Selecciona una Categoría">
              <Row className="g-3">
                {categories.map((category) => (
                  <Col xs={6} md={4} key={category.id}>
                    <Button
                      variant={selectedCategory === category.id ? "primary" : "outline-primary"}
                      className="w-100 py-3"
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      {category.icon}
                      <br />
                      <small>{category.label}</small>
                    </Button>
                  </Col>
                ))}
              </Row>
            </Card>
          </Col>
        </Row>

        <Row className="mb-5">
          <Col lg={8} className="mx-auto">
            <Card title="2. Selecciona la Dificultad">
              <Form.Group>
                {difficulties.map((diff) => (
                  <Form.Check
                    key={diff.id}
                    type="radio"
                    id={diff.id}
                    label={diff.label}
                    name="difficulty"
                    checked={selectedDifficulty === diff.id}
                    onChange={() => setSelectedDifficulty(diff.id)}
                    className="mb-2"
                  />
                ))}
              </Form.Group>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col lg={8} className="mx-auto">
            <div className="d-grid gap-2">
              <Button variant="success" size="lg" onClick={handleStartQuiz} disabled={!user}>
                🚀 Comenzar Quiz
              </Button>
              {!user && <p className="text-center text-muted mt-2">Inicia sesión para jugar</p>}
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Home;