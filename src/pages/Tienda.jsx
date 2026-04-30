import React, { useState } from "react";
import { Container, Row, Col, Alert, Badge } from "react-bootstrap";
import Card from "../components/Card";
import Button from "../components/Button";
import { useRecompensas } from "../context/RecompensasContext";

export default function Tienda() {
    const { monedas, inventario, desbloqueados, TIENDA, comprar, temaActivo, activarTema } = useRecompensas();
    const [mensaje, setMensaje] = useState(null);

    const handleComprar = (itemId) => {
        const resultado = comprar(itemId);
        setMensaje(resultado);
        setTimeout(() => setMensaje(null), 2500);
    };

    const handleActivarTema = (itemId) => {
        activarTema(itemId);
        setMensaje({ ok: true, mensaje: `¡Tema activado!` });
        setTimeout(() => setMensaje(null), 2000);
    };

    const powerups = TIENDA.filter(i => i.tipo === "powerup");
    const avatares = TIENDA.filter(i => i.tipo === "avatar");
    const temas = TIENDA.filter(i => i.tipo === "estilo");

    return (
        <Container className="py-5">
            <Row className="mb-4 text-center">
                <Col>
                    <h1 style={{ color: "var(--tb-text, #212529)" }}>🏪 Tienda</h1>
                    <h4 className="text-warning">🪙 {monedas} monedas</h4>
                </Col>
            </Row>

            {mensaje && (
                <Row className="mb-3">
                    <Col lg={10} className="mx-auto">
                        <Alert variant={mensaje.ok ? "success" : "danger"}>{mensaje.mensaje}</Alert>
                    </Col>
                </Row>
            )}

            {/* POWER-UPS */}
            <Row className="mb-4">
                <Col lg={10} className="mx-auto">
                    <Card title="⚡ Power-Ups">
                        <Row className="g-3">
                            {powerups.map(item => (
                                <Col xs={12} sm={6} md={4} key={item.id}>
                                    <div style={cardStyle}>
                                        <div style={{ fontSize: "2.2rem" }}>{item.icono}</div>
                                        <h6 className="mt-2 mb-1" style={{ color: "var(--tb-text, #212529)" }}>{item.nombre}</h6>
                                        <small style={{ color: "var(--tb-text-muted, #6c757d)" }} className="d-block mb-2">{item.descripcion}</small>
                                        {inventario[item.id] > 0 && (
                                            <Badge bg="info" className="mb-2">
                                                Tienes: {inventario[item.id]}
                                            </Badge>
                                        )}
                                        <br />
                                        <Button
                                            variant="warning"
                                            size="sm"
                                            onClick={() => handleComprar(item.id)}
                                            disabled={monedas < item.precio}
                                        >
                                            🪙 {item.precio}
                                        </Button>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </Card>
                </Col>
            </Row>

            {/* TEMAS */}
            <Row className="mb-4">
                <Col lg={10} className="mx-auto">
                    <Card title="🎨 Temas Visuales">
                        <p style={{ color: "var(--tb-text-muted, #6c757d)", fontSize: "0.9rem" }} className="mb-3">
                            Cambia la apariencia completa de la app. Puedes cambiar entre temas desbloqueados en cualquier momento.
                        </p>
                        <Row className="g-3">
                            {/* Tema por defecto */}
                            <Col xs={12} sm={6} md={3}>
                                <div style={{
                                    ...cardStyle,
                                    border: temaActivo === "default"
                                        ? "2px solid #0d6efd"
                                        : "1px solid var(--tb-border, #dee2e6)",
                                }}>
                                    <div style={{ fontSize: "2.2rem" }}>☀️</div>
                                    <h6 className="mt-2 mb-1" style={{ color: "var(--tb-text, #212529)" }}>Tema Claro</h6>
                                    <small style={{ color: "var(--tb-text-muted, #6c757d)" }} className="d-block mb-2">Tema predeterminado</small>
                                    {temaActivo === "default" ? (
                                        <Badge bg="primary">✓ Activo</Badge>
                                    ) : (
                                        <Button variant="outline-primary" size="sm" onClick={() => handleActivarTema("default")}>
                                            Activar
                                        </Button>
                                    )}
                                </div>
                            </Col>

                            {temas.map(item => {
                                const comprado = desbloqueados.includes(item.id);
                                const activo = temaActivo === item.id;
                                return (
                                    <Col xs={12} sm={6} md={3} key={item.id}>
                                        <div style={{
                                            ...cardStyle,
                                            border: activo
                                                ? "2px solid #0d6efd"
                                                : "1px solid var(--tb-border, #dee2e6)",
                                        }}>
                                            <div style={{ fontSize: "2.2rem" }}>{item.icono}</div>
                                            <h6 className="mt-2 mb-1" style={{ color: "var(--tb-text, #212529)" }}>{item.nombre}</h6>
                                            <small style={{ color: "var(--tb-text-muted, #6c757d)" }} className="d-block mb-2">{item.descripcion}</small>

                                            {activo ? (
                                                <Badge bg="primary">✓ Activo</Badge>
                                            ) : comprado ? (
                                                <Button variant="outline-success" size="sm" onClick={() => handleActivarTema(item.id)}>
                                                    Activar
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="warning"
                                                    size="sm"
                                                    onClick={() => handleComprar(item.id)}
                                                    disabled={monedas < item.precio}
                                                >
                                                    🪙 {item.precio}
                                                </Button>
                                            )}
                                        </div>
                                    </Col>
                                );
                            })}
                        </Row>
                    </Card>
                </Col>
            </Row>

            {/* AVATARES */}
            <Row className="mb-4">
                <Col lg={10} className="mx-auto">
                    <Card title="🧑 Avatares">
                        <Row className="g-3">
                            {avatares.map(item => {
                                const comprado = desbloqueados.includes(item.id);
                                return (
                                    <Col xs={12} sm={6} md={4} key={item.id}>
                                        <div style={cardStyle}>
                                            <div style={{ fontSize: "2.5rem" }}>{item.icono}</div>
                                            <h6 className="mt-2 mb-1" style={{ color: "var(--tb-text, #212529)" }}>{item.nombre}</h6>
                                            <small style={{ color: "var(--tb-text-muted, #6c757d)" }} className="d-block mb-2">{item.descripcion}</small>
                                            <Button
                                                variant={comprado ? "success" : "warning"}
                                                size="sm"
                                                onClick={() => !comprado && handleComprar(item.id)}
                                                disabled={comprado || monedas < item.precio}
                                            >
                                                {comprado ? "✅ Desbloqueado" : `🪙 ${item.precio}`}
                                            </Button>
                                        </div>
                                    </Col>
                                );
                            })}
                        </Row>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

const cardStyle = {
    border: "1px solid var(--tb-border, #dee2e6)",
    borderRadius: "12px",
    padding: "1rem",
    textAlign: "center",
    height: "100%",
    background: "var(--tb-card-bg, #ffffff)",
    transition: "border-color 0.2s, box-shadow 0.2s",
};
