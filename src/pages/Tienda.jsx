import React, { useState } from "react";
import { Container, Row, Col, Alert, Badge } from "react-bootstrap";
import Card from "../components/Card";
import Button from "../components/Button";
import { useRecompensas } from "../context/RecompensasContext";

export default function Tienda() {
    const { monedas, inventario, desbloqueados, TIENDA, comprar } = useRecompensas();
    const [mensaje, setMensaje] = useState(null);

    const handleComprar = (itemId) => {
        const resultado = comprar(itemId);
        setMensaje(resultado);
        setTimeout(() => setMensaje(null), 2500);
    };

    const powerups = TIENDA.filter(i => i.tipo === "powerup");
    const extras = TIENDA.filter(i => i.tipo !== "powerup");

    return (
        <Container className="py-5">
            <Row className="mb-4 text-center">
                <Col>
                    <h1>🏪 Tienda</h1>
                    <h4 className="text-warning">🪙 {monedas} monedas</h4>
                </Col>
            </Row>

            {mensaje && (
                <Row className="mb-3">
                    <Col lg={8} className="mx-auto">
                        <Alert variant={mensaje.ok ? "success" : "danger"}>{mensaje.mensaje}</Alert>
                    </Col>
                </Row>
            )}

            <Row className="mb-4">
                <Col lg={8} className="mx-auto">
                    <Card title="⚡ Power-Ups">
                        <Row className="g-3">
                            {powerups.map(item => (
                                <Col xs={12} md={4} key={item.id}>
                                    <div className="border rounded p-3 text-center h-100">
                                        <div style={{ fontSize: "2rem" }}>{item.icono}</div>
                                        <h6 className="mt-2">{item.nombre}</h6>
                                        <small className="text-muted d-block mb-2">{item.descripcion}</small>
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

            <Row>
                <Col lg={8} className="mx-auto">
                    <Card title="🎨 Avatares y Estilos">
                        <Row className="g-3">
                            {extras.map(item => {
                                const comprado = desbloqueados.includes(item.id);
                                return (
                                    <Col xs={12} md={6} key={item.id}>
                                        <div className="border rounded p-3 text-center h-100">
                                            <div style={{ fontSize: "2rem" }}>{item.icono}</div>
                                            <h6 className="mt-2">{item.nombre}</h6>
                                            <small className="text-muted d-block mb-2">{item.descripcion}</small>
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