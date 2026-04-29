import React, { useState } from "react";

/**
 * OpcionesGrid — grilla 2×2 de opciones de respuesta
 *
 * Props:
 *   opciones               ([{ id, texto }])      — lista de 4 opciones
 *   respuestaSeleccionada  (string | null)         — id de la opción elegida
 *   respuestaCorrecta      (string | null)         — id de la opción correcta
 *   onResponder            (id: string) => void    — callback al seleccionar
 *   deshabilitado          (boolean)               — bloquea interacción
 */

const LETRAS = ["A", "B", "C", "D"];

const OpcionesGrid = ({
  opciones = [],
  respuestaSeleccionada = null,
  respuestaCorrecta = null,
  onResponder = () => {},
  deshabilitado = false,
}) => {
  const [hovered, setHovered] = useState(null);

  const getEstado = (opcion) => {
    if (!respuestaSeleccionada) return "idle";
    if (opcion.id === respuestaCorrecta) return "correcta";
    if (opcion.id === respuestaSeleccionada && opcion.id !== respuestaCorrecta) return "incorrecta";
    return "opaca";
  };

  const getStyles = (opcion, index) => {
    const estado = getEstado(opcion);
    const isHovered = hovered === opcion.id && !deshabilitado && !respuestaSeleccionada;

    const base = {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      width: "100%",
      padding: "14px 16px",
      borderRadius: "12px",
      border: "2px solid",
      cursor: deshabilitado || respuestaSeleccionada ? "default" : "pointer",
      textAlign: "left",
      fontWeight: 600,
      fontSize: "0.95rem",
      lineHeight: 1.3,
      transition: "all 0.18s ease",
      outline: "none",
      background: "#fff",
    };

    if (estado === "correcta") {
      return { ...base, borderColor: "#28a745", background: "#d1f0da", color: "#155724", transform: "scale(1.02)" };
    }
    if (estado === "incorrecta") {
      return { ...base, borderColor: "#dc3545", background: "#f8d7da", color: "#842029", animation: "shake 0.4s ease" };
    }
    if (estado === "opaca") {
      return { ...base, borderColor: "#dee2e6", background: "#f8f9fa", color: "#adb5bd", opacity: 0.6 };
    }
    // idle
    if (isHovered) {
      return { ...base, borderColor: "#0d6efd", background: "#e7f1ff", color: "#0a58ca", transform: "translateY(-2px)", boxShadow: "0 4px 12px rgba(13,110,253,0.15)" };
    }
    return { ...base, borderColor: "#dee2e6", color: "#1a202c" };
  };

  const getLetraBadge = (opcion, index) => {
    const estado = getEstado(opcion);
    const colors = {
      correcta: { bg: "#28a745", color: "#fff" },
      incorrecta: { bg: "#dc3545", color: "#fff" },
      opaca: { bg: "#dee2e6", color: "#adb5bd" },
      idle: { bg: "#0d6efd", color: "#fff" },
    };
    const c = colors[estado] || colors.idle;
    return {
      minWidth: "28px",
      height: "28px",
      borderRadius: "8px",
      background: c.bg,
      color: c.color,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: 800,
      fontSize: "0.8rem",
      flexShrink: 0,
      transition: "background 0.2s",
    };
  };

  return (
    <>
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-6px); }
          40%, 80% { transform: translateX(6px); }
        }
        @keyframes correctBounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }
      `}</style>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px",
        }}
      >
        {opciones.map((opcion, index) => (
          <button
            key={opcion.id || index}
            style={getStyles(opcion, index)}
            onClick={() => !deshabilitado && !respuestaSeleccionada && onResponder(opcion.id)}
            onMouseEnter={() => setHovered(opcion.id)}
            onMouseLeave={() => setHovered(null)}
            disabled={deshabilitado || !!respuestaSeleccionada}
          >
            <span style={getLetraBadge(opcion, index)}>{LETRAS[index]}</span>
            <span>{opcion.texto}</span>
            {getEstado(opcion) === "correcta" && <span style={{ marginLeft: "auto" }}>✓</span>}
            {getEstado(opcion) === "incorrecta" && <span style={{ marginLeft: "auto" }}>✗</span>}
          </button>
        ))}
      </div>
    </>
  );
};

export default OpcionesGrid;
