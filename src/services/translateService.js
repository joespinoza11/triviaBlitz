const cache = new Map();
 
export const traducirTexto = async (texto) => {
  if (!texto) return texto;
  if (cache.has(texto)) return cache.get(texto);
 
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=es&dt=t&q=${encodeURIComponent(texto)}`;
    const response = await fetch(url);
 
    if (!response.ok) throw new Error("Error al traducir");
 
    const data = await response.json();
 
    const traducido = data[0]?.map(chunk => chunk[0]).join("") || texto;
 
    cache.set(texto, traducido);
    return traducido;
  } catch (error) {
    console.error("Error en translateService:", error);
    return texto;
  }
};
 