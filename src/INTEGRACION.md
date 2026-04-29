# Persona 3 — Archivos entregados

## Archivos

| Archivo | Ubicación en el proyecto |
|---|---|
| `Juego.jsx` | `src/pages/Juego.jsx` |
| `Timer.jsx` | `src/components/Timer.jsx` |
| `ComboDisplay.jsx` | `src/components/ComboDisplay.jsx` |
| `PreguntaCard.jsx` | `src/components/PreguntaCard.jsx` |
| `OpcionesGrid.jsx` | `src/components/OpcionesGrid.jsx` |
| `PuntajeDisplay.jsx` | `src/components/PuntajeDisplay.jsx` |

---

## Lo que Persona 1 necesita agregar en App.jsx

```jsx
import Juego from './pages/Juego';

// Dentro de <Routes>:
<Route path="/juego" element={<Juego />} />
```

Y en `Home.jsx`, el botón "Comenzar Quiz" debe navegar a `/juego`:
```jsx
import { useNavigate } from 'react-router-dom';
const navigate = useNavigate();

// En handleStartQuiz:
navigate('/juego', { state: { categoria: selectedCategory, dificultad: selectedDifficulty } });
```

---

## Lo que Persona 2 necesita exponer en JuegoContext

`Juego.jsx` consume `JuegoContext` y espera este contrato:

```js
{
  // Estado de la pregunta actual
  pregunta: { texto: string, categoria: string },
  opciones: [{ id: string, texto: string }],  // siempre 4 opciones

  // Estado del juego
  puntos: number,
  combo: number,                  // multiplicador (1, 2, 3...)
  comboMaximo: number,
  tiempoRestante: number,         // segundos restantes
  tiempoTotal: number,            // segundos totales por pregunta (ej: 30)
  numeroPregunta: number,         // 1-based
  totalPreguntas: number,
  respuestasCorrectas: number,

  // Respuesta del usuario
  respuestaSeleccionada: string | null,
  respuestaCorrecta: string | null,

  // Fin del juego
  juegoTerminado: boolean,
  categoria: string,
  dificultad: string,

  // Estado de UI
  cargando: boolean,
  error: string | null,

  // Acciones
  responderPregunta: (id: string) => void,
  reiniciarJuego: () => void,
}
```
