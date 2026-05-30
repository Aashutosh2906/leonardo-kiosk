import { LEONARDO_SYSTEM_PROMPT, pickMockResponse } from "@/config/leonardo";

export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

export interface LeonardoResponse {
  reply: string;
  mocked?: boolean;
}

export async function askLeonardo(
  messages: ChatTurn[],
  opts: { devMode: boolean }
): Promise<LeonardoResponse> {
  if (opts.devMode) {
    await new Promise((r) => setTimeout(r, 900 + Math.random() * 700));
    const userCount = messages.filter((m) => m.role === "user").length;
    return { reply: pickMockResponse(userCount), mocked: true };
  }

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages,
        systemPrompt: LEONARDO_SYSTEM_PROMPT,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData?.error || "Leonardo is momentarily silent.";
      throw new Error(errorMessage);
    }

    const data = await response.json();
    if (!data?.reply) {
      throw new Error("Leonardo's quill paused without writing.");
    }

    return { reply: data.reply as string };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Leonardo is momentarily silent.";
    throw new Error(message);
  }
}
