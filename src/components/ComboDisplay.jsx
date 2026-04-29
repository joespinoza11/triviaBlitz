import React, { useEffect, useRef, useState } from "react";

/**
 * ComboDisplay — muestra el multiplicador de combo actual
 *
 * Props:
 *   combo  (number) — multiplicador actual (1, 2, 3, ...)
 */
const ComboDisplay = ({ combo = 1 }) => {
  const [burst, setBurst] = useState(false);
  const prevCombo = useRef(combo);

  useEffect(() => {
    if (combo > prevCombo.current) {
      setBurst(true);
      const t = setTimeout(() => setBurst(false), 600);
      prevCombo.current = combo;
      return () => clearTimeout(t);
    }
    prevCombo.current = combo;
  }, [combo]);

  const getComboStyle = () => {
    if (combo >= 5) return { bg: "linear-gradient(135deg, #ff6b35, #f7931e)", glow: "#ff6b35" };
    if (combo >= 3) return { bg: "linear-gradient(135deg, #a855f7, #ec4899)", glow: "#a855f7" };
    if (combo >= 2) return { bg: "linear-gradient(135deg, #3b82f6, #06b6d4)", glow: "#3b82f6" };
    return { bg: "linear-gradient(135deg, #6c757d, #adb5bd)", glow: "transparent" };
  };

  const { bg, glow } = getComboStyle();
  const activo = combo >= 2;

  const styles = {
    wrapper: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "2px",
    },
    badge: {
      display: "inline-flex",
      alignItems: "center",
      gap: "4px",
      padding: "6px 14px",
      borderRadius: "999px",
      background: bg,
      color: "#fff",
      fontWeight: 900,
      fontSize: activo ? "1.1rem" : "0.95rem",
      boxShadow: activo ? `0 0 16px ${glow}80, 0 2px 8px rgba(0,0,0,0.2)` : "0 1px 4px rgba(0,0,0,0.15)",
      transform: burst ? "scale(1.25)" : "scale(1)",
      transition: "transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s, background 0.3s",
      cursor: "default",
      userSelect: "none",
      letterSpacing: "0.03em",
    },
    label: {
      fontSize: "0.65rem",
      fontWeight: 600,
      color: "#6c757d",
      textTransform: "uppercase",
      letterSpacing: "0.1em",
    },
    flames: {
      fontSize: "0.9rem",
      animation: activo ? "flicker 0.8s ease-in-out infinite alternate" : "none",
    },
  };

  return (
    <>
      <style>{`
        @keyframes flicker {
          from { opacity: 1; transform: scaleY(1); }
          to   { opacity: 0.7; transform: scaleY(1.08); }
        }
      `}</style>
      <div style={styles.wrapper}>
        <div style={styles.badge}>
          {combo >= 2 && <span style={styles.flames}>🔥</span>}
          <span>×{combo}</span>
        </div>
        <span style={styles.label}>Combo</span>
      </div>
    </>
  );
};

export default ComboDisplay;
