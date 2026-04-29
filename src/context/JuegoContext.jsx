import { createContext, useContext, useState } from "react";

const JuegoContext = createContext();

export function JuegoProvider({ children }) {
    const [puntaje, setPuntaje] = useState(0);
    const [combo, setCombo] = useState(0);
    const [vidas, setVidas] = useState(3);
    const [preguntaActual, setPreguntaActual] = useState(0);
    const [respuestas, setRespuestas] = useState([]);
    const [usuario, setUsuario] = useState(null);
    const [configuracion, setConfiguracion] = useState({
        categoria: "",
        dificultad: ""
    });

    const sumarPuntos = (base) => {
        const multiplicador = combo >= 5 ? 3 : combo >= 3 ? 2 : 1;
        setPuntaje(prev => prev + (base * multiplicador));
    };

    const reiniciarJuego = () => {
        setPuntaje(0);
        setCombo(0);
        setVidas(3);
        setPreguntaActual(0);
        setRespuestas([]);
    };

    return (
        <JuegoContext.Provider value={{
            puntaje, setPuntaje,
            combo, setCombo,
            vidas, setVidas,
            preguntaActual, setPreguntaActual,
            respuestas, setRespuestas,
            usuario, setUsuario,
            configuracion, setConfiguracion,
            sumarPuntos,
            reiniciarJuego
        }}>
            {children}
        </JuegoContext.Provider>
    );
}

export function useJuego() {
  return useContext(JuegoContext);
}