import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { obtenerPreguntas } from "../services/triviaService";
import { traducirTexto } from "../services/translateService";

export const JuegoContext = createContext();

const TIEMPOS_DIFICULTAD = {
  facil: 30,
  medio: 15,
  dificil: 10,
};

const PUNTOS_BASE = 100;

const CATEGORIA_MAP = {
  ciencia: "science",
  historia: "history",
  deporte: "sport_and_leisure",
  peliculas: "film_and_tv",
  geografia: "geography",
  musica: "music",
};

const DIFICULTAD_MAP = {
  facil: "easy",
  medio: "medium",
  dificil: "hard",
};

function mezclar(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export function JuegoProvider({ children }) {
  const [configuracion, setConfiguracion] = useState({ categoria: "", dificultad: "" });
  
  const [tiempoMaximo, setTiempoMaximo] = useState(30); 

  const [preguntas, setPreguntas] = useState([]);
  const [indice, setIndice] = useState(0);
  const [opcionesActuales, setOpcionesActuales] = useState([]);

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const [puntos, setPuntos] = useState(0);
  const [combo, setCombo] = useState(1);
  const [comboMaximo, setComboMaximo] = useState(1);
  const [respuestasCorrectas, setRespuestasCorrectas] = useState(0);
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState(null);
  const [respuestaCorrecta, setRespuestaCorrecta] = useState(null);
  const [juegoTerminado, setJuegoTerminado] = useState(false);

  // 3. Inicializamos el tiempo restante con el valor por defecto
  const [tiempoRestante, setTiempoRestante] = useState(30);
  const timerRef = useRef(null);
  const avanzarRef = useRef(null);

  const totalPreguntas = preguntas.length || 10;
  const numeroPregunta = indice + 1;
  const preguntaRaw = preguntas[indice] || null;

  const pregunta = preguntaRaw
    ? { texto: preguntaRaw.question?.text || "", categoria: configuracion.categoria }
    : null;

  const agregarTiempo = useCallback((segundos) => {
    setTiempoRestante((prev) => prev + segundos);
  }, []);

  useEffect(() => {
    if (!preguntaRaw) return;
    const correcta = preguntaRaw.correctAnswer;
    const incorrectas = preguntaRaw.incorrectAnswers || [];
    const mezcladas = mezclar([correcta, ...incorrectas]);
    setOpcionesActuales(mezcladas.map((t) => ({ id: t, texto: t })));
    setRespuestaCorrecta(correcta);
    setRespuestaSeleccionada(null);
    setTiempoRestante(tiempoMaximo); 
  }, [indice, preguntas, tiempoMaximo]);

  avanzarRef.current = () => {
    setIndice((prev) => {
      const siguiente = prev + 1;
      if (siguiente >= preguntas.length) {
        setJuegoTerminado(true);
        return prev;
      }
      return siguiente;
    });
  };

  useEffect(() => {
    if (!preguntas.length || juegoTerminado || respuestaSeleccionada !== null || cargando) {
      clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTiempoRestante((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setCombo(1);
          setRespuestaSeleccionada("__tiempo_agotado__");
          setTimeout(() => avanzarRef.current(), 1800);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [indice, preguntas, juegoTerminado, respuestaSeleccionada, cargando]);

  const responderPregunta = useCallback(
    (id) => {
      if (respuestaSeleccionada || juegoTerminado) return;
      clearInterval(timerRef.current);

      setRespuestaSeleccionada(id);
      const esCorrecta = id === respuestaCorrecta;

      if (esCorrecta) {
        setCombo((prevCombo) => {
          const nuevoCombo = prevCombo + 1;
          const multiplicador = nuevoCombo >= 5 ? 3 : nuevoCombo >= 3 ? 2 : 1;
          setPuntos((prev) => prev + PUNTOS_BASE * multiplicador);
          setComboMaximo((max) => Math.max(max, nuevoCombo));
          return nuevoCombo;
        });
        setRespuestasCorrectas((prev) => prev + 1);
      } else {
        setCombo(1);
      }

      setTimeout(() => avanzarRef.current(), 1500);
    },
    [respuestaSeleccionada, respuestaCorrecta, juegoTerminado]
  );

  const iniciarJuego = useCallback(async ({ categoria, dificultad }) => {
    clearInterval(timerRef.current);
    
    // 5. Establecer el tiempo máximo según la dificultad al iniciar[cite: 6]
    const tiempoConfigurado = TIEMPOS_DIFICULTAD[dificultad] || 30;
    setTiempoMaximo(tiempoConfigurado);
    setTiempoRestante(tiempoConfigurado);

    setCargando(true);
    setError(null);
    setJuegoTerminado(false);
    setPuntos(0);
    setCombo(1);
    setComboMaximo(1);
    setRespuestasCorrectas(0);
    setIndice(0);
    setPreguntas([]);
    setOpcionesActuales([]);
    setConfiguracion({ categoria, dificultad });

    try {
      const categoriaAPI = CATEGORIA_MAP[categoria] || categoria;
      const dificultadAPI = DIFICULTAD_MAP[dificultad] || dificultad;

      const data = await obtenerPreguntas(categoriaAPI, dificultadAPI, 10);
      if (!data || data.length === 0) throw new Error("No se encontraron preguntas para esta selección");

      const traducidas = await Promise.all(
        data.map(async (p) => ({
          ...p,
          question: { text: await traducirTexto(p.question.text) },
          correctAnswer: await traducirTexto(p.correctAnswer),
          incorrectAnswers: await Promise.all(p.incorrectAnswers.map((r) => traducirTexto(r))),
        }))
      );

      setPreguntas(traducidas);
    } catch (err) {
      setError(err.message || "No se pudieron cargar las preguntas. Intenta de nuevo.");
    } finally {
      setCargando(false);
    }
  }, []);

  const reiniciarJuego = useCallback(() => {
    clearInterval(timerRef.current);
    setJuegoTerminado(false);
    setPuntos(0);
    setCombo(1);
    setComboMaximo(1);
    setRespuestasCorrectas(0);
    setIndice(0);
    setPreguntas([]);
    setOpcionesActuales([]);
    setError(null);
  }, []);

  return (
    <JuegoContext.Provider
      value={{
        pregunta,
        opciones: opcionesActuales,
        puntos,
        combo,
        comboMaximo,
        tiempoRestante,
        // 6. Pasamos el tiempo dinámico a través del Provider[cite: 6]
        tiempoTotal: tiempoMaximo, 
        numeroPregunta,
        totalPreguntas,
        respuestaSeleccionada,
        respuestaCorrecta,
        juegoTerminado,
        cargando,
        error,
        responderPregunta,
        reiniciarJuego,
        iniciarJuego,
        agregarTiempo, 
        respuestasCorrectas,
        categoria: configuracion.categoria,
        dificultad: configuracion.dificultad,
        configuracion,
        setConfiguracion,
        setPreguntaActual: setIndice,
        setRespuestas: () => {},
        puntaje: puntos,
      }}
    >
      {children}
    </JuegoContext.Provider>
  );
}

export function useJuego() {
  return useContext(JuegoContext);
}