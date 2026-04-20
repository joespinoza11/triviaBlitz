import React from "react";
import { Button as BootstrapButton } from "react-bootstrap";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  onClick,
  disabled = false,
  className = "",
  type = "button",
  ...props
}) => {
  return (
    <BootstrapButton
      variant={variant}
      size={size}
      onClick={onClick}
      disabled={disabled}
      className={className}
      type={type}
      {...props}
    >
      {children}
    </BootstrapButton>
  );
};

export default Button;
