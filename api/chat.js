export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ response: "Método no permitido" });
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ response: "No se recibió ningún mensaje." });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o", // también puedes usar "gpt-3.5-turbo" si no tienes acceso a gpt-4o
        messages: [
          {
            role: "user",
            content: `Eres GymBro, un asistente IA experto en fitness, nutrición y entrenamiento. Responde de manera clara, motivadora y con pasos prácticos. Usuario pregunta: ${message}`
          }
        ]
      })
    });

    const data = await response.json();

    if (data.error) {
      console.error("OpenAI API error:", data.error.message);
      return res.status(500).json({ response: "Error con OpenAI: " + data.error.message });
    }

    res.status(200).json({ response: data.choices[0].message.content });

  } catch (err) {
    console.error("Error en servidor:", err.message);
    res.status(500).json({ response: "Error inesperado: " + err.message });
  }
}
