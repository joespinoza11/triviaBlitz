import React, { useEffect, useState } from "react";

/**
 * PreguntaCard — muestra la pregunta actual
 *
 * Props:
 *   pregunta  (string)  — texto de la pregunta
 *   categoria (string)  — categoría de la pregunta
 *   numeroPregunta (number) — número de pregunta actual
 */

const CATEGORY_ICONS = {
  ciencia: "🔬",
  historia: "📚",
  deporte: "⚽",
  peliculas: "🎬",
  geografia: "🌍",
  musica: "🎵",
};

const PreguntaCard = ({ pregunta = "Cargando pregunta...", categoria = "", numeroPregunta = 1 }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(false);
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, [pregunta]);

  const icon = CATEGORY_ICONS[categoria?.toLowerCase()] || "❓";

  const styles = {
    card: {
      background: "#fff",
      borderRadius: "16px",
      padding: "1.5rem",
      boxShadow: "0 4px 20px rgba(13,110,253,0.1), 0 1px 4px rgba(0,0,0,0.06)",
      border: "1px solid #e2e8f0",
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(10px)",
      transition: "opacity 0.3s ease, transform 0.3s ease",
      minHeight: "120px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    },
    categoryBadge: {
      display: "inline-flex",
      alignItems: "center",
      gap: "5px",
      background: "#f0f4ff",
      color: "#0d6efd",
      fontSize: "0.72rem",
      fontWeight: 700,
      padding: "3px 10px",
      borderRadius: "999px",
      marginBottom: "0.75rem",
      textTransform: "uppercase",
      letterSpacing: "0.08em",
      width: "fit-content",
    },
    questionNumber: {
      color: "#adb5bd",
      fontSize: "0.75rem",
      fontWeight: 600,
      marginBottom: "4px",
      letterSpacing: "0.05em",
    },
    questionText: {
      fontSize: "1.15rem",
      fontWeight: 700,
      color: "#1a202c",
      lineHeight: 1.5,
      margin: 0,
    },
  };

  return (
    <div style={styles.card}>
      <div style={styles.categoryBadge}>
        <span>{icon}</span>
        <span>{categoria || "Trivia"}</span>
      </div>
      <p style={styles.questionNumber}>Pregunta #{numeroPregunta}</p>
      <p style={styles.questionText}>{pregunta}</p>
    </div>
  );
};

export default PreguntaCard;
