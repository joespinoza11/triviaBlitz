import React, { useContext } from "react";
import { Container, Table, Alert } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";

export default function Resultados() {
  const { user } = useContext(AuthContext);

  return (
    <Container className="py-5">
      <h1 className="mb-4">📊 Tus Resultados</h1>

      {user ? (
        <>
          <p className="mb-4">
            Jugador: <strong>{user.username}</strong>
          </p>
          <Table striped bordered hover responsive>
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Fecha</th>
                <th>Puntuación</th>
                <th>Preguntas Correctas</th>
                <th>Racha Actual</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="5" className="text-center text-muted">
                  Aún no hay resultados. ¡Comienza tu primer juego!
                </td>
              </tr>
            </tbody>
          </Table>
        </>
      ) : (
        <Alert variant="warning">
          Por favor, inicia sesión para ver tus resultados.
        </Alert>
      )}
    </Container>
  );
}
