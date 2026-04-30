import { createContext, useContext, useState, useCallback } from "react";

export const RecompensasContext = createContext();

const TIENDA = [
    { id: "cincuenta", nombre: "50/50", descripcion: "Elimina 2 opciones incorrectas", precio: 30, icono: "⚡", tipo: "powerup" },
    { id: "tiempo", nombre: "+10 segundos", descripcion: "Agrega 10s al timer", precio: 40, icono: "⏰", tipo: "powerup" },
    { id: "saltar", nombre: "Saltar pregunta", descripcion: "Pasa a la siguiente pregunta", precio: 50, icono: "⏭", tipo: "powerup" },
    { id: "avatar_pro", nombre: "Avatar Pro", descripcion: "Desbloquea avatar especial", precio: 100, icono: "👑", tipo: "avatar" },
    { id: "tema_oscuro", nombre: "Tema Oscuro", descripcion: "Activa el tema oscuro", precio: 80, icono: "🌙", tipo: "estilo" },
];

export function RecompensasProvider({ children }) {
    const [monedas, setMonedas] = useState(() => {
        return parseInt(localStorage.getItem("triviaMonedas") || "0");
    });

    const [inventario, setInventario] = useState(() => {
        const saved = localStorage.getItem("triviaInventario");
        return saved ? JSON.parse(saved) : { cincuenta: 0, tiempo: 0, saltar: 0 };
    });

    const [desbloqueados, setDesbloqueados] = useState(() => {
        const saved = localStorage.getItem("triviaDesbloqueados");
        return saved ? JSON.parse(saved) : [];
    });

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

    const comprar = useCallback((itemId) => {
        const item = TIENDA.find(i => i.id === itemId);
        if (!item) return { ok: false, mensaje: "Item no encontrado" };
        if (monedas < item.precio) return { ok: false, mensaje: "Monedas insuficientes" };

        if (item.tipo !== "powerup" && desbloqueados.includes(itemId)) {
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
        }

        return { ok: true, mensaje: `¡Compraste ${item.nombre}!` };
    }, [monedas, desbloqueados]);

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
            comprar, usarPowerUp
        }}>
            {children}
        </RecompensasContext.Provider>
    );
}

export function useRecompensas() {
    return useContext(RecompensasContext);
}