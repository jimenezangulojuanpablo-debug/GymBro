import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  /* =========================
     CORS – válido para Web + APK
     ========================= */
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ response: "Método no permitido." });
  }

  const { message } = req.body || {};

  if (!message || message.trim() === "" || message.length > 1000) {
    return res.status(400).json({
      response: "Mensaje inválido o muy largo.",
    });
  }

  /* =========================
     Prompt del entrenador
     ========================= */
  const systemPrompt = `
Eres GymBro PRO, un asesor profesional de entrenamiento físico.
Hablas como un entrenador real, cercano y directo, no como un profesor.

Reglas clave:
- SOLO hablas de fitness, entrenamiento, hipertrofia, fuerza y salud metabólica.
- No respondas temas fuera del fitness.
- Usa un tono humano, cercano y motivador, sin exagerar.
- Puedes usar emojis de forma moderada (💪🔥✅).
- Respuestas de 4 a 6 líneas como máximo.
- Si necesitas dar pasos, sepáralos en líneas distintas con números.
- Termina con una pregunta corta para seguir ayudando.

Formato:
- Párrafos cortos.
- Nada de Markdown.
- Nada de asteriscos.
- Estilo WhatsApp claro y ordenado.

Usuario dice: "${message}"
`;

  try {
    const completion = await client.responses.create({
      model: "gpt-4.1-mini",
      input: systemPrompt,
    });

    const output =
      completion.output_text ??
      completion.output?.[0]?.content?.[0]?.text ??
      "GymBro no pudo responder. Intenta de nuevo.";

    return res.status(200).json({ response: output });

  } catch (error) {
    console.error("❌ Error OpenAI:", error);

    return res.status(500).json({
      response:
        "Hubo un problema al generar la respuesta. Intenta nuevamente.",
    });
  }
}
