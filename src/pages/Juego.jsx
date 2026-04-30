import React, { useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Row, Col, Alert, Spinner } from "react-bootstrap";

import { JuegoContext } from "../context/JuegoContext";
import { useAuth } from "../hooks/useAuth";

import Timer from "../components/Timer";
import ComboDisplay from "../components/ComboDisplay";
import PreguntaCard from "../components/PreguntaCard";
import OpcionesGrid from "../components/OpcionesGrid";
import PuntajeDisplay from "../components/PuntajeDisplay";
import Button from "../components/Button";

const Juego = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { user }  = useAuth();
  const juegoCtx  = useContext(JuegoContext);

  // Redirect si no hay usuario
  useEffect(() => {
    if (!user) navigate("/");
  }, [user, navigate]);

  useEffect(() => {
    if (!juegoCtx?.iniciarJuego) return;
    const { categoria, dificultad } = location.state || {};
    if (categoria && dificultad) {
      juegoCtx.iniciarJuego({ categoria, dificultad });
    }
  }, []); 

  useEffect(() => {
    if (juegoCtx?.juegoTerminado) {
      navigate("/resultados", {
        state: {
          results: {
            correctAnswers: juegoCtx.respuestasCorrectas ?? 0,
            totalQuestions: juegoCtx.totalPreguntas ?? 10,
            category:       juegoCtx.categoria ?? "N/A",
            difficulty:     juegoCtx.dificultad ?? "N/A",
            puntosFinal:    juegoCtx.puntos ?? 0,
            comboMaximo:    juegoCtx.comboMaximo ?? 1,
          },
        },
      });
    }
  }, [juegoCtx?.juegoTerminado]);

  // ─── Estado de carga ─────────────────────────────────────
  if (!juegoCtx || juegoCtx.cargando) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" style={{ width: "3rem", height: "3rem" }} />
        <p className="mt-3 text-muted fw-semibold">Cargando preguntas...</p>
      </Container>
    );
  }

  // ─── Error ───────────────────────────────────────────────
  if (juegoCtx.error) {
    return (
      <Container className="py-5">
        <Row>
          <Col lg={8} className="mx-auto">
            <Alert variant="danger">
              <Alert.Heading>¡Ocurrió un error!</Alert.Heading>
              <p>{juegoCtx.error}</p>
              <Button variant="danger" onClick={() => navigate("/")}>
                🏠 Volver al Inicio
              </Button>
            </Alert>
          </Col>
        </Row>
      </Container>
    );
  }

  const {
    pregunta,
    opciones = [],
    puntos = 0,
    combo = 1,
    tiempoRestante = 30,
    tiempoTotal = 30,
    numeroPregunta = 1,
    totalPreguntas = 10,
    respuestaSeleccionada = null,
    respuestaCorrecta = null,
    responderPregunta = () => {},
  } = juegoCtx;

  return (
    <Container className="py-4">
      {/* ── HUD superior ── */}
      <Row className="mb-3">
        <Col lg={8} className="mx-auto">
          <div style={styles.hud}>
            <PuntajeDisplay
              puntos={puntos}
              numeroPregunta={numeroPregunta}
              totalPreguntas={totalPreguntas}
            />
            <ComboDisplay combo={combo} />
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => navigate("/")}
              style={{ alignSelf: "flex-start" }}
            >
              ✕ Salir
            </Button>
          </div>
        </Col>
      </Row>

      {/* ── Timer ── */}
      <Row className="mb-3">
        <Col lg={8} className="mx-auto">
          <Timer tiempoRestante={tiempoRestante} tiempoTotal={tiempoTotal} />
        </Col>
      </Row>

      {/* ── Pregunta ── */}
      <Row className="mb-4">
        <Col lg={8} className="mx-auto">
          <PreguntaCard
            pregunta={pregunta?.texto}
            categoria={pregunta?.categoria}
            numeroPregunta={numeroPregunta}
          />
        </Col>
      </Row>

      {/* ── Opciones ── */}
      <Row className="mb-4">
        <Col lg={8} className="mx-auto">
          <OpcionesGrid
            opciones={opciones}
            respuestaSeleccionada={respuestaSeleccionada}
            respuestaCorrecta={respuestaCorrecta}
            onResponder={responderPregunta}
            deshabilitado={tiempoRestante === 0}
          />
        </Col>
      </Row>

      {/* ── Feedback ── */}
      {respuestaSeleccionada && respuestaSeleccionada !== "__tiempo_agotado__" && (
        <Row className="mb-3">
          <Col lg={8} className="mx-auto">
            <Alert
              variant={respuestaSeleccionada === respuestaCorrecta ? "success" : "danger"}
              style={{ textAlign: "center", fontWeight: 600, borderRadius: "12px" }}
            >
              {respuestaSeleccionada === respuestaCorrecta
                ? `✅ ¡Correcto! ${combo >= 2 ? `Combo ×${combo} 🔥` : ""}`
                : "❌ Incorrecto. ¡Sigue intentando!"}
            </Alert>
          </Col>
        </Row>
      )}

      {tiempoRestante === 0 && (
        <Row className="mb-3">
          <Col lg={8} className="mx-auto">
            <Alert variant="warning" style={{ textAlign: "center", fontWeight: 600, borderRadius: "12px" }}>
              ⏱ ¡Tiempo agotado!
            </Alert>
          </Col>
        </Row>
      )}

      {/* ── Progreso ── */}
      <Row>
        <Col lg={8} className="mx-auto">
          <div style={styles.progressDots}>
            {Array.from({ length: totalPreguntas }).map((_, i) => (
              <div
                key={i}
                style={{
                  ...styles.dot,
                  background:
                    i < numeroPregunta - 1 ? "#28a745"
                    : i === numeroPregunta - 1 ? "#0d6efd"
                    : "#dee2e6",
                  transform: i === numeroPregunta - 1 ? "scale(1.3)" : "scale(1)",
                }}
              />
            ))}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

const styles = {
  hud: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "#fff",
    borderRadius: "14px",
    padding: "12px 20px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
    border: "1px solid #e2e8f0",
  },
  progressDots: {
    display: "flex",
    justifyContent: "center",
    gap: "6px",
    flexWrap: "wrap",
    paddingTop: "4px",
  },
  dot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    transition: "all 0.3s ease",
  },
};

export default Juego;
