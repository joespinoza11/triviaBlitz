import { createContext, useContext, useState, useCallback, useEffect } from "react";
 
export const RecompensasContext = createContext();
 
const TIENDA = [
    // Power-ups
    { id: "cincuenta", nombre: "50/50", descripcion: "Elimina 2 opciones incorrectas", precio: 30, icono: "⚡", tipo: "powerup" },
    { id: "tiempo", nombre: "+10 segundos", descripcion: "Agrega 10s al timer", precio: 40, icono: "⏰", tipo: "powerup" },
    { id: "saltar", nombre: "Saltar pregunta", descripcion: "Pasa a la siguiente pregunta", precio: 50, icono: "⏭", tipo: "powerup" },
   
    // Avatares
    { id: "avatar_pro", nombre: "Avatar Pro", descripcion: "Desbloquea avatar especial 👑", precio: 100, icono: "👑", tipo: "avatar" },
    { id: "avatar_fire", nombre: "Avatar Fuego", descripcion: "Para los jugadores más hot 🔥", precio: 120, icono: "🔥", tipo: "avatar" },
    { id: "avatar_alien", nombre: "Avatar Alien", descripcion: "Fuera de este mundo 👽", precio: 150, icono: "👽", tipo: "avatar" },
 
    // Estilos / Temas
    { id: "tema_oscuro", nombre: "Tema Oscuro", descripcion: "Activa el modo oscuro en toda la app", precio: 80, icono: "🌙", tipo: "estilo" },
    { id: "tema_neon", nombre: "Tema Neón", descripcion: "Colores vibrantes al estilo arcade", precio: 120, icono: "🎮", tipo: "estilo" },
    { id: "tema_nature", nombre: "Tema Naturaleza", descripcion: "Paleta verde relajante", precio: 100, icono: "🌿", tipo: "estilo" },
];
 
const TEMAS_CSS = {
    default: {
        "--tb-bg": "#f8f9fa",
        "--tb-surface": "#ffffff",
        "--tb-surface2": "#f1f3f5",
        "--tb-text": "#212529",
        "--tb-text-muted": "#6c757d",
        "--tb-border": "#dee2e6",
        "--tb-primary": "#0d6efd",
        "--tb-primary-hover": "#0b5ed7",
        "--tb-accent": "#0d6efd",
        "--tb-card-bg": "#ffffff",
        "--tb-card-shadow": "0 2px 12px rgba(0,0,0,0.07)",
        "--tb-navbar-bg": "#0b5ed7",
        "--tb-footer-bg": "#212529",
        "--tb-footer-text": "#ffffff",
        "--tb-input-bg": "#ffffff",
        "--tb-input-border": "#ced4da",
        "--tb-badge-bg": "#0d6efd",
        "--tb-correct": "#198754",
        "--tb-incorrect": "#dc3545",
        "--tb-timer-track": "#dee2e6",
    },
    tema_oscuro: {
        "--tb-bg": "#0f1117",
        "--tb-surface": "#1a1d27",
        "--tb-surface2": "#252836",
        "--tb-text": "#e2e8f0",
        "--tb-text-muted": "#94a3b8",
        "--tb-border": "#2d3748",
        "--tb-primary": "#6366f1",
        "--tb-primary-hover": "#4f46e5",
        "--tb-accent": "#818cf8",
        "--tb-card-bg": "#1a1d27",
        "--tb-card-shadow": "0 2px 20px rgba(0,0,0,0.4)",
        "--tb-navbar-bg": "#13151f",
        "--tb-footer-bg": "#0a0c12",
        "--tb-footer-text": "#94a3b8",
        "--tb-input-bg": "#252836",
        "--tb-input-border": "#374151",
        "--tb-badge-bg": "#6366f1",
        "--tb-correct": "#22c55e",
        "--tb-incorrect": "#ef4444",
        "--tb-timer-track": "#2d3748",
    },
    tema_neon: {
        "--tb-bg": "#0d0221",
        "--tb-surface": "#120b2e",
        "--tb-surface2": "#1a0f3d",
        "--tb-text": "#f0e6ff",
        "--tb-text-muted": "#c084fc",
        "--tb-border": "#7c3aed",
        "--tb-primary": "#a855f7",
        "--tb-primary-hover": "#9333ea",
        "--tb-accent": "#f0abfc",
        "--tb-card-bg": "#120b2e",
        "--tb-card-shadow": "0 0 20px rgba(168,85,247,0.3)",
        "--tb-navbar-bg": "#0a0118",
        "--tb-footer-bg": "#070012",
        "--tb-footer-text": "#c084fc",
        "--tb-input-bg": "#1a0f3d",
        "--tb-input-border": "#7c3aed",
        "--tb-badge-bg": "#a855f7",
        "--tb-correct": "#4ade80",
        "--tb-incorrect": "#f87171",
        "--tb-timer-track": "#2d1b69",
    },
    tema_nature: {
        "--tb-bg": "#f0fdf4",
        "--tb-surface": "#ffffff",
        "--tb-surface2": "#dcfce7",
        "--tb-text": "#14532d",
        "--tb-text-muted": "#4d7c5f",
        "--tb-border": "#bbf7d0",
        "--tb-primary": "#16a34a",
        "--tb-primary-hover": "#15803d",
        "--tb-accent": "#22c55e",
        "--tb-card-bg": "#ffffff",
        "--tb-card-shadow": "0 2px 12px rgba(22,163,74,0.1)",
        "--tb-navbar-bg": "#f0fdf4",
        "--tb-footer-bg": "#052e16",
        "--tb-footer-text": "#bbf7d0",
        "--tb-input-bg": "#ffffff",
        "--tb-input-border": "#86efac",
        "--tb-badge-bg": "#16a34a",
        "--tb-correct": "#15803d",
        "--tb-incorrect": "#dc2626",
        "--tb-timer-track": "#bbf7d0",
    },
};
 
const TEMA_KEY = "triviaTema";
const AVATAR_KEY = "triviaAvatar";
 
function aplicarTema(temaId) {
    const vars = TEMAS_CSS[temaId] || TEMAS_CSS.default;
    const root = document.documentElement;
    Object.entries(vars).forEach(([key, val]) => root.style.setProperty(key, val));
    document.body.dataset.tema = temaId || "default";
}
 
aplicarTema(localStorage.getItem(TEMA_KEY) || "default");
 
export function RecompensasProvider({ children }) {
    const [monedas, setMonedas] = useState(() => {
        return parseInt(localStorage.getItem("triviaMonedas") || "0");
    });
 
    const [inventario, setInventario] = useState(() => {
        const saved = localStorage.getItem("triviaInventario");
        return saved ? JSON.parse(saved) : { cincuenta: 0, tiempo: 0, saltar: 0, doble_puntos: 0, comodin: 0 };
    });
 
    const [desbloqueados, setDesbloqueados] = useState(() => {
        const saved = localStorage.getItem("triviaDesbloqueados");
        return saved ? JSON.parse(saved) : [];
    });
 
    const [temaActivo, setTemaActivo] = useState(() => {
        return localStorage.getItem(TEMA_KEY) || "default";
    });

    const [avatarActivo, setAvatarActivo] = useState(() => {
        return localStorage.getItem(AVATAR_KEY) || "default";
    });
 
    useEffect(() => {
        aplicarTema(temaActivo);
    }, [temaActivo]);
 
    const agregarMonedas = useCallback((cantidad) => {
        setMonedas(prev => {
            const nuevo = prev + cantidad;
            localStorage.setItem("triviaMonedas", nuevo);
            return nuevo;
        });
    }, []);
 
    const calcularMonedas = useCallback((comboMaximo, correctas, total) => {
        let base = 10;
        if (comboMaximo >= 6) base = 100;
        else if (comboMaximo >= 4) base = 50;
        else if (comboMaximo >= 2) base = 25;
        const bonus = Math.floor((correctas / total) * 20);
        return base + bonus;
    }, []);
 
    const activarTema = useCallback((temaId) => {
        setTemaActivo(temaId);
        localStorage.setItem(TEMA_KEY, temaId);
        aplicarTema(temaId);
    }, []);

    const activarAvatar = useCallback((avatarId) => {
        setAvatarActivo(avatarId);
        localStorage.setItem(AVATAR_KEY, avatarId);
    }, []);
 
    const comprar = useCallback((itemId) => {
        const item = TIENDA.find(i => i.id === itemId);
        if (!item) return { ok: false, mensaje: "Item no encontrado" };
        if (monedas < item.precio) return { ok: false, mensaje: "Monedas insuficientes" };
 
        if (item.tipo !== "powerup" && desbloqueados.includes(itemId)) {
            if (item.tipo === "estilo") {
                activarTema(itemId);
                return { ok: true, mensaje: `¡Tema "${item.nombre}" activado!` };
            }
            if (item.tipo === "avatar") {
                activarAvatar(itemId);
                return { ok: true, mensaje: `¡Avatar "${item.nombre}" activado!` };
            }
            return { ok: false, mensaje: "Ya lo tienes" };
        }
 
        setMonedas(prev => {
            const nuevo = prev - item.precio;
            localStorage.setItem("triviaMonedas", nuevo);
            return nuevo;
        });
 
        if (item.tipo === "powerup") {
            setInventario(prev => {
                const nuevo = { ...prev, [itemId]: (prev[itemId] || 0) + 1 };
                localStorage.setItem("triviaInventario", JSON.stringify(nuevo));
                return nuevo;
            });
        } else {
            setDesbloqueados(prev => {
                const nuevo = [...prev, itemId];
                localStorage.setItem("triviaDesbloqueados", JSON.stringify(nuevo));
                return nuevo;
            });
            if (item.tipo === "estilo") activarTema(itemId);
            if (item.tipo === "avatar") activarAvatar(itemId);
        }
 
        return { ok: true, mensaje: `¡Compraste ${item.nombre}!` };
    }, [monedas, desbloqueados, activarTema, activarAvatar]);
 
    const usarPowerUp = useCallback((tipo) => {
        if (!inventario[tipo] || inventario[tipo] <= 0) return false;
        setInventario(prev => {
            const nuevo = { ...prev, [tipo]: prev[tipo] - 1 };
            localStorage.setItem("triviaInventario", JSON.stringify(nuevo));
            return nuevo;
        });
        return true;
    }, [inventario]);
 
    return (
        <RecompensasContext.Provider value={{
            monedas, inventario, desbloqueados,
            TIENDA, agregarMonedas, calcularMonedas,
            comprar, usarPowerUp,
            temaActivo, activarTema,
            avatarActivo, activarAvatar,
        }}>
            {children}
        </RecompensasContext.Provider>
    );
}
 
export function useRecompensas() {
    return useContext(RecompensasContext);
}