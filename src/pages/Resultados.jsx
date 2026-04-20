<<<<<<< HEAD
import React from "react";
import {Container, Row, Col, ProgressBar, ListGroup} from "react-bootstrap";
import Card from "../components/Card";
import Button from "../components/Button";
import {useAuth} from "../hooks/useAuth";

const Resultados = ({ location }) => {
  // Datos de ejemplo - estos vendrían de props o state en producción
  const results = location?.state?.results || {
    correctAnswers: 7,
    totalQuestions: 10,
    category: "Ciencia",
    difficulty: "Medio",
    timeSpent: 300,
  };

  const percentage = Math.round(
    (results.correctAnswers / results.totalQuestions) * 100,
  );
  const { user } = useAuth();

  const getPerformanceMessage = () => {
    if (percentage === 100) return "🏆 ¡Perfecto! Eres un maestro de la trivia";
    if (percentage >= 80) return "🥇 ¡Excelente desempeño!";
    if (percentage >= 60) return "🥈 ¡Muy bien! Puedes hacerlo mejor";
    if (percentage >= 40) return "🥉 Buen intento, sigue practicando";
    return "💪 No te desanimes, vuelve a intentarlo";
  };

  const handleShare = async () => {
    const text = `¡Obtuve ${percentage}% en Trivia Blitz! 🎯 Categoría: ${results.category} | Dificultad: ${results.difficulty}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Trivia Blitz",
          text: text,
        });
      } catch (err) {
        console.log("Error al compartir:", err);
      }
    } else {
      // Fallback: copiar al portapapeles
      navigator.clipboard.writeText(text).then(() => {
        alert("¡Resultado copiado al portapapeles!");
      });
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col lg={8} className="mx-auto">
          <Card title="¡Quiz Finalizado!" className="text-center">
            <h2 className="display-4 text-primary mb-2">{percentage}%</h2>
            <p className="lead text-muted">
              {results.correctAnswers} de {results.totalQuestions} preguntas
              correctas
            </p>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col lg={8} className="mx-auto">
          <Card>
            <div className="mb-3">
              <h6>Desempeño</h6>
              <ProgressBar
                now={percentage}
                label={`${percentage}%`}
                variant={
                  percentage >= 80
                    ? "success"
                    : percentage >= 60
                      ? "warning"
                      : "danger"
                }
                className="mb-3"
              />
            </div>

            <h5>{getPerformanceMessage()}</h5>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col lg={8} className="mx-auto">
          <Card title="Estadísticas">
            <ListGroup variant="flush">
              <ListGroup.Item>
                <strong>Usuario:</strong> {user?.username || "Anónimo"}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Categoría:</strong> {results.category}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Dificultad:</strong> {results.difficulty}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Tiempo:</strong> {formatTime(results.timeSpent)}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Aciertos:</strong> {results.correctAnswers}/
                {results.totalQuestions}
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg={8} className="mx-auto">
          <div className="d-grid gap-2">
            <Button variant="primary" size="lg" onClick={handleShare}>
              📤 Compartir Resultado
            </Button>
            <Button variant="info" size="lg" href="/">
              🏠 Volver al Inicio
            </Button>
            <Button variant="outline-secondary" size="lg" href="/">
              🔄 Intentar Otro Quiz
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Resultados;
=======
import React, { useContext } from "react";
import { Container, Table, Alert } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";

export default function Resultados() {
  const { user } = useContext(AuthContext);

  return (
    <Container className="py-5">
      <h1 className="mb-4">📊 Tus Resultados</h1>

      {user ? (
        <>
          <p className="mb-4">
            Jugador: <strong>{user.username}</strong>
          </p>
          <Table striped bordered hover responsive>
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Fecha</th>
                <th>Puntuación</th>
                <th>Preguntas Correctas</th>
                <th>Racha Actual</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="5" className="text-center text-muted">
                  Aún no hay resultados. ¡Comienza tu primer juego!
                </td>
              </tr>
            </tbody>
          </Table>
        </>
      ) : (
        <Alert variant="warning">
          Por favor, inicia sesión para ver tus resultados.
        </Alert>
      )}
    </Container>
  );
}
>>>>>>> Reynold
