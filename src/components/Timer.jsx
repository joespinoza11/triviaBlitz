import React, { useEffect, useState } from "react";

const Timer = ({ tiempoRestante = 30, tiempoTotal = 30 }) => {
  const [, forceUpdate] = useState(0);

  const porcentaje = Math.max(0, Math.min(100, (tiempoRestante / tiempoTotal) * 100));

  const getColor = () => {
    if (porcentaje > 60) return "var(--tb-correct, #28a745)";
    if (porcentaje > 30) return "#ffc107";
    return "var(--tb-incorrect, #dc3545)";
  };

  const esUrgente = tiempoRestante <= 5 && tiempoRestante > 0;

  const styles = {
    wrapper: { marginBottom: "0.5rem" },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "6px",
    },
    label: {
      fontSize: "0.78rem",
      fontWeight: 600,
      color: "var(--tb-text-muted, #6c757d)",
      textTransform: "uppercase",
      letterSpacing: "0.08em",
    },
    countdown: {
      fontSize: "1.3rem",
      fontWeight: 800,
      color: getColor(),
      fontVariantNumeric: "tabular-nums",
      transition: "color 0.4s",
      animation: esUrgente ? "timerPulse 0.5s ease-in-out" : "none",
    },
    track: {
      height: "12px",
      borderRadius: "999px",
      backgroundColor: "var(--tb-timer-track, #e9ecef)",
      overflow: "hidden",
      boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)",
    },
    bar: {
      height: "100%",
      width: `${porcentaje}%`,
      borderRadius: "999px",
      backgroundColor: getColor(),
      transition: "width 1s linear, background-color 0.4s ease",
      boxShadow: esUrgente ? `0 0 8px ${getColor()}` : "none",
    },
  };

  return (
    <>
      <style>{`
        @keyframes timerPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
      `}</style>
      <div style={styles.wrapper}>
        <div style={styles.header}>
          <span style={styles.label}>⏱ Tiempo</span>
          <span style={styles.countdown}>{tiempoRestante}s</span>
        </div>
        <div style={styles.track}>
          <div style={styles.bar} />
        </div>
      </div>
    </>
  );
};

export default Timer;
