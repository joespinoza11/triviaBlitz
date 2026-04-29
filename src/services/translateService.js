export const traducirTexto = async (texto) => {
    try {
        const response = await fetch("https://libretranslate.com/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                q: texto,
                source: "en",
                target: "es",
                format: "text"
            })
        });
        if (!response.ok) throw new Error("Error al traducir");

        const data = await response.json();
        return data.translatedText;
    } catch (error) {
        console.error("Error en translateService:", error);
        return texto;
    }
};