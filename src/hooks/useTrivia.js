import { useState } from "react";
import { obtenerPreguntas } from "../services/triviaService";
import { traducirTexto } from "../services/translateService";
import { useJuego } from "../Context/JuegoContext";

export function useTrivia() {
    const { configuracion, setPreguntaActual, setRespuestas } = useJuego();
    const [preguntas, setPreguntas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const cargarPreguntas = async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await obtenerPreguntas(
                configuracion.categoria,
                configuracion.dificultad
            );

            const preguntasTraducidas = await Promise.all(
                data.map(async (p) => ({
                    ...p,
                    question: {
                        text: await traducirTexto(p.question.text)
                    },
                    correctAnswer: await traducirTexto(p.correctAnswer),
                    incorrectAnswers: await Promise.all(
                        p.incorrectAnswers.map(r => traducirTexto(r))
                    )
                }))
            );

            setPreguntas(preguntasTraducidas);
            setPreguntaActual(0);
            setRespuestas([]);
        } catch (err) {
            setError("No se pudieron cargar las preguntas");
        } finally {
            setLoading(false);
        }
    };

    return { preguntas, loading, error, cargarPreguntas };
}