import React, { useContext } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";

export default function Home() {
  const { user } = useContext(AuthContext);

  return (
    <Container className="py-5">
      <Row className="mb-5">
        <Col lg={8} className="mx-auto text-center">
          <h1 className="mb-3">🎮 ¡Bienvenido a Trivia Blitz!</h1>
          {user && (
            <p className="lead">
              Hola <strong>{user.username}</strong>, ¿listo para el desafío?
            </p>
          )}
        </Col>
      </Row>

      <Row className="g-4">
        <Col md={6}>
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center">
              <h5 className="card-title">🏆 Jugar Trivia</h5>
              <p className="card-text">
                Responde preguntas y acumula puntos. ¡Forma combos para
                puntuación bonificada!
              </p>
              <Button variant="warning" href="#juego">
                Comenzar Juego
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center">
              <h5 className="card-title">📊 Mis Resultados</h5>
              <p className="card-text">
                Consulta tu historial de juegos, puntuaciones y estadísticas.
              </p>
              <Button variant="info" href="/resultados">
                Ver Resultados
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
