import React from "react";
import { Container, Row, Col, ProgressBar, ListGroup } from "react-bootstrap";
import Card from "../components/Card";
import Button from "../components/Button";
import { useAuth } from "../hooks/useAuth";

const Resultados = ({ location }) => {
  const { user } = useAuth();
  
  const results = location?.state?.results || {
    correctAnswers: 0,
    totalQuestions: 10,
    category: "N/A",
    difficulty: "N/A",
    timeSpent: 0,
  };

  const percentage = results.totalQuestions > 0 
    ? Math.round((results.correctAnswers / results.totalQuestions) * 100) 
    : 0;

  return (
    <Container className="py-5">
      <Row className="mb-4 text-center">
        <Col lg={8} className="mx-auto">
          <h1 className="mb-4">📊 Tus Resultados</h1>
          <Card title="Resumen del Desempeño">
            <h2 className="display-4 text-primary">{percentage}%</h2>
            <ProgressBar 
              now={percentage} 
              variant={percentage >= 80 ? "success" : percentage >= 60 ? "warning" : "danger"} 
              className="my-3" 
            />
            <p className="lead">{results.correctAnswers} de {results.totalQuestions} correctas</p>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col lg={8} className="mx-auto">
          <Card title="Estadísticas Detalladas">
            <ListGroup variant="flush">
              <ListGroup.Item><strong>Usuario:</strong> {user?.username || "Invitado"}</ListGroup.Item>
              <ListGroup.Item><strong>Categoría:</strong> {results.category}</ListGroup.Item>
              <ListGroup.Item><strong>Dificultad:</strong> {results.difficulty}</ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg={8} className="mx-auto">
          <div className="d-grid gap-2">
            <Button variant="primary" href="/">🏠 Volver al Inicio</Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Resultados;