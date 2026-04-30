import React, { useEffect, useRef, useState } from "react";

/**
 * PuntajeDisplay — marcador de puntos animado
 *
 * Props:
 *   puntos          (number) — puntaje actual
 *   numeroPregunta  (number) — pregunta actual (1-based)
 *   totalPreguntas  (number) — total de preguntas
 */
const PuntajeDisplay = ({ puntos = 0, numeroPregunta = 1, totalPreguntas = 10 }) => {
  const [displayPuntos, setDisplayPuntos] = useState(puntos);
  const [delta, setDelta] = useState(null);
  const animRef = useRef(null);

  useEffect(() => {
    const diff = puntos - displayPuntos;
    if (diff !== 0) {
      setDelta(diff > 0 ? `+${diff}` : `${diff}`);
      // Animate counter
      const start = displayPuntos;
      const end = puntos;
      const duration = 500;
      const startTime = performance.now();

      const animate = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplayPuntos(Math.round(start + (end - start) * eased));
        if (progress < 1) {
          animRef.current = requestAnimationFrame(animate);
        } else {
          setDelta(null);
        }
      };
      animRef.current = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animRef.current);
    }
  }, [puntos]);

  const styles = {
    wrapper: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "2px",
    },
    scoreContainer: {
      position: "relative",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
    },
    score: {
      fontSize: "2rem",
      fontWeight: 900,
      color: "#0d6efd",
      fontVariantNumeric: "tabular-nums",
      lineHeight: 1,
      letterSpacing: "-0.02em",
    },
    delta: {
      position: "absolute",
      top: "-18px",
      right: "-28px",
      fontSize: "0.85rem",
      fontWeight: 700,
      color: delta && delta.startsWith("+") ? "#28a745" : "#dc3545",
      animation: "floatUp 0.8s ease-out forwards",
      pointerEvents: "none",
      whiteSpace: "nowrap",
    },
    label: {
      fontSize: "0.65rem",
      fontWeight: 600,
      color: "#6c757d",
      textTransform: "uppercase",
      letterSpacing: "0.1em",
    },
    progress: {
      fontSize: "0.72rem",
      color: "#6c757d",
      marginTop: "1px",
    },
  };

  return (
    <>
      <style>{`
        @keyframes floatUp {
          0%   { opacity: 1; transform: translateY(0) scale(1); }
          80%  { opacity: 1; }
          100% { opacity: 0; transform: translateY(-22px) scale(0.85); }
        }
      `}</style>
      <div style={styles.wrapper}>
        <div style={styles.scoreContainer}>
          <span style={styles.score}>⭐ {displayPuntos}</span>
          {delta && <span style={styles.delta}>{delta}</span>}
        </div>
        <span style={styles.label}>Puntaje</span>
        <span style={styles.progress}>
          Pregunta {numeroPregunta} / {totalPreguntas}
        </span>
      </div>
    </>
  );
};

export default PuntajeDisplay;