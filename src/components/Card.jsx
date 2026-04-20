import React from "react";
import {Card as BootstrapCard} from "react-bootstrap";

const Card = ({
  children,
  title = "",
  className = "",
  bodyClassName = "",
  ...props
}) => {
  return (
    <BootstrapCard className={`shadow-sm ${className}`} {...props}>
      {title && (
        <BootstrapCard.Header className="bg-primary text-white">
          {title}
        </BootstrapCard.Header>
      )}
      <BootstrapCard.Body className={bodyClassName}>
        {children}
      </BootstrapCard.Body>
    </BootstrapCard>
  );
};

export default Card;
