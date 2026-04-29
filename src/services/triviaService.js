export const obtenerPreguntas = async (categoria, dificultad, cantidad = 10) => {
    try {
        const url = 'https://the-trivia-api.com/v2/questions?categories=${categoria}&difficulty=${dificultad}&limit=${cantidad}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Erro al obtener preguntas");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error en triviaservice:", error);
    }
};