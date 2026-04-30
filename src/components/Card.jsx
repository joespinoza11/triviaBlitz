import React from "react";
import { Card as BootstrapCard } from "react-bootstrap";

const Card = ({
  children,
  title = "",
  className = "",
  bodyClassName = "",
  ...props
}) => {
  return (
    <BootstrapCard
      className={`shadow-sm ${className}`}
      style={{
        backgroundColor: "var(--tb-card-bg, #ffffff)",
        borderColor: "var(--tb-border, #dee2e6)",
        boxShadow: "var(--tb-card-shadow, 0 2px 12px rgba(0,0,0,0.07))",
        transition: "background-color 0.3s ease, border-color 0.3s ease",
      }}
      {...props}
    >
      {title && (
        <BootstrapCard.Header
          style={{
            backgroundColor: "var(--tb-primary, #0d6efd)",
            color: "#ffffff",
            borderColor: "var(--tb-primary, #0d6efd)",
            fontWeight: 600,
          }}
        >
          {title}
        </BootstrapCard.Header>
      )}
      <BootstrapCard.Body
        className={bodyClassName}
        style={{ color: "var(--tb-text, #212529)" }}
      >
        {children}
      </BootstrapCard.Body>
    </BootstrapCard>
  );
};

export default Card;
