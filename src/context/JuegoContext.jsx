import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { obtenerPreguntas } from "../services/triviaService";
import { traducirTexto } from "../services/translateService";

// Export named so Juego.jsx puede hacer: import { JuegoContext } from ...
export const JuegoContext = createContext();

const TIEMPO_POR_PREGUNTA = 30;
const PUNTOS_BASE = 100;

// Mapeo de categorías del Home → categorías de la API
const CATEGORIA_MAP = {
  ciencia:   "science",
  historia:  "history",
  deporte:   "sport_and_leisure",
  peliculas: "film_and_tv",
  geografia: "geography",
  musica:    "music",
};

// Mapeo de dificultades del Home → dificultades de la API
const DIFICULTAD_MAP = {
  facil:   "easy",
  medio:   "medium",
  dificil: "hard",
};

function mezclar(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export function JuegoProvider({ children }) {
  // ── Configuración ──────────────────────────────────────────
  const [configuracion, setConfiguracion] = useState({ categoria: "", dificultad: "" });

  // ── Preguntas ──────────────────────────────────────────────
  const [preguntas, setPreguntas] = useState([]);
  const [indice, setIndice]       = useState(0);          // 0-based
  const [opcionesActuales, setOpcionesActuales] = useState([]);

  // ── Estado UI ──────────────────────────────────────────────
  const [cargando, setCargando] = useState(false);
  const [error, setError]       = useState(null);

  // ── Estado del juego ───────────────────────────────────────
  const [puntos, setPuntos]                         = useState(0);
  const [combo, setCombo]                           = useState(1);
  const [comboMaximo, setComboMaximo]               = useState(1);
  const [respuestasCorrectas, setRespuestasCorrectas] = useState(0);
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState(null);
  const [respuestaCorrecta, setRespuestaCorrecta]   = useState(null);
  const [juegoTerminado, setJuegoTerminado]         = useState(false);

  // ── Timer ──────────────────────────────────────────────────
  const [tiempoRestante, setTiempoRestante] = useState(TIEMPO_POR_PREGUNTA);
  const timerRef   = useRef(null);
  const avanzarRef = useRef(null); // ref para evitar stale closures en setTimeout

  // ── Derivados ──────────────────────────────────────────────
  const totalPreguntas  = preguntas.length || 10;
  const numeroPregunta  = indice + 1;
  const preguntaRaw     = preguntas[indice] || null;

  const pregunta = preguntaRaw
    ? { texto: preguntaRaw.question?.text || "", categoria: configuracion.categoria }
    : null;

  // ── Al cambiar de pregunta: mezclar opciones y resetear estado ──
  useEffect(() => {
    if (!preguntaRaw) return;
    const correcta    = preguntaRaw.correctAnswer;
    const incorrectas = preguntaRaw.incorrectAnswers || [];
    const mezcladas   = mezclar([correcta, ...incorrectas]);
    setOpcionesActuales(mezcladas.map(t => ({ id: t, texto: t })));
    setRespuestaCorrecta(correcta);
    setRespuestaSeleccionada(null);
    setTiempoRestante(TIEMPO_POR_PREGUNTA);
  }, [indice, preguntas]);

  // ── Función para avanzar (via ref para evitar stale closures) ──
  avanzarRef.current = () => {
    setIndice(prev => {
      const siguiente = prev + 1;
      if (siguiente >= preguntas.length) {
        setJuegoTerminado(true);
        return prev;
      }
      return siguiente;
    });
  };

  // ── Timer countdown ────────────────────────────────────────
  useEffect(() => {
    // No correr el timer si no hay preguntas, el juego terminó,
    // ya respondió, o está cargando
    if (!preguntas.length || juegoTerminado || respuestaSeleccionada !== null || cargando) {
      clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTiempoRestante(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          // Tiempo agotado: reset combo y avanzar
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

  // ── Responder pregunta ─────────────────────────────────────
  const responderPregunta = useCallback((id) => {
    if (respuestaSeleccionada || juegoTerminado) return;
    clearInterval(timerRef.current);

    setRespuestaSeleccionada(id);
    const esCorrecta = id === respuestaCorrecta;

    if (esCorrecta) {
      setCombo(prevCombo => {
        const nuevoCombo = prevCombo + 1;
        const multiplicador = nuevoCombo >= 5 ? 3 : nuevoCombo >= 3 ? 2 : 1;
        setPuntos(prev => prev + PUNTOS_BASE * multiplicador);
        setComboMaximo(max => Math.max(max, nuevoCombo));
        return nuevoCombo;
      });
      setRespuestasCorrectas(prev => prev + 1);
    } else {
      setCombo(1);
    }

    setTimeout(() => avanzarRef.current(), 1500);
  }, [respuestaSeleccionada, respuestaCorrecta, juegoTerminado]);

  // ── Iniciar juego (llamado desde Juego.jsx con location.state) ──
  const iniciarJuego = useCallback(async ({ categoria, dificultad }) => {
    clearInterval(timerRef.current);
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
      const categoriaAPI  = CATEGORIA_MAP[categoria]  || categoria;
      const dificultadAPI = DIFICULTAD_MAP[dificultad] || dificultad;

      const data = await obtenerPreguntas(categoriaAPI, dificultadAPI, 10);
      if (!data || data.length === 0) throw new Error("No se encontraron preguntas para esta selección");

      // Traducir al español
      const traducidas = await Promise.all(
        data.map(async (p) => ({
          ...p,
          question: { text: await traducirTexto(p.question.text) },
          correctAnswer:    await traducirTexto(p.correctAnswer),
          incorrectAnswers: await Promise.all(p.incorrectAnswers.map(r => traducirTexto(r))),
        }))
      );

      setPreguntas(traducidas);
    } catch (err) {
      setError(err.message || "No se pudieron cargar las preguntas. Intenta de nuevo.");
    } finally {
      setCargando(false);
    }
  }, []);

  // ── Reiniciar juego ────────────────────────────────────────
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
    <JuegoContext.Provider value={{
      // ── Lo que Juego.jsx necesita ──
      pregunta,
      opciones:              opcionesActuales,
      puntos,
      combo,
      comboMaximo,
      tiempoRestante,
      tiempoTotal:           TIEMPO_POR_PREGUNTA,
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

      // ── Lo que Resultados necesita (enviado vía navigate state) ──
      respuestasCorrectas,
      categoria:  configuracion.categoria,
      dificultad: configuracion.dificultad,

      // ── Compatibilidad con useTrivia.js de Persona 2 ──
      configuracion,
      setConfiguracion,
      setPreguntaActual: setIndice,
      setRespuestas:     () => {},
      puntaje:           puntos,
    }}>
      {children}
    </JuegoContext.Provider>
  );
}

// Hook para compatibilidad con useTrivia.js
export function useJuego() {
  return useContext(JuegoContext);
}
