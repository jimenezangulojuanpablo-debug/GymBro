import OpenAI from "openai";

// Crear instancia de OpenAI usando la API Key de Vercel
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Función handler para Vercel
export default async function handler(req, res) {
  if (req.method === "POST") {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ response: "No se recibió ningún
mensaje." });
    }

    try {
      // Crear prompt personalizado para GymBro
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: `Eres GymBro, un asistente IA experto en fitness,
nutrición y entrenamiento.
            Responde de manera clara, motivadora y con pasos prácticos.
            Usuario pregunta: ${message}`
          }
        ]
      });

      // Devolver la respuesta del bot
      res.status(200).json({ response: completion.choices[0].message.content });
    } catch (err) {
      console.error("Error OpenAI:", err.message);
      res.status(500).json({ response: "Error con OpenAI: " + err.message });
    }
  } else {
    res.status(405).json({ response: "Método no permitido" });
  }
}

