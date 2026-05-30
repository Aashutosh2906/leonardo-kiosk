import type { VercelRequest, VercelResponse } from '@vercel/functions';

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface GroqRequest {
  messages: ChatMessage[];
  model: string;
  temperature: number;
  max_tokens?: number;
}

interface GroqResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages, systemPrompt } = req.body;

    if (!Array.isArray(messages) || !systemPrompt) {
      return res.status(400).json({ error: "Invalid request: missing messages or systemPrompt" });
    }

    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      console.error("GROQ_API_KEY not configured");
      return res.status(500).json({ error: "Server configuration error" });
    }

    const groqRequest: GroqRequest = {
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
      model: "mixtral-8x7b-32768",
      temperature: 0.85,
      max_tokens: 1024,
    };

    const groqResponse = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${groqApiKey}`,
      },
      body: JSON.stringify(groqRequest),
    });

    if (!groqResponse.ok) {
      const errorData = await groqResponse.text();
      console.error(`Groq API error: ${groqResponse.status}`, errorData);

      if (groqResponse.status === 429) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        return res.status(429).json({
          error: "Leonardo is contemplating many questions at once. Try again in a moment.",
        });
      }

      if (groqResponse.status === 401 || groqResponse.status === 403) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        return res.status(500).json({
          error: "The quill's ink has run dry. Please check your API configuration.",
        });
      }

      res.setHeader("Access-Control-Allow-Origin", "*");
      return res.status(500).json({ error: "Leonardo is momentarily silent." });
    }

    const data: GroqResponse = await groqResponse.json();
    const reply = data?.choices?.[0]?.message?.content ?? "";

    if (!reply) {
      res.setHeader("Access-Control-Allow-Origin", "*");
      return res.status(500).json({ error: "Leonardo's quill paused without writing." });
    }

    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(200).json({ reply });
  } catch (error) {
    console.error("Chat error:", error);
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(500).json({
      error: "An unexpected error occurred. Leonardo apologizes for the silence.",
    });
  }
}
