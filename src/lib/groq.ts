import { TaskType } from "@/game/types";

/**
 * Fetches a dynamic task title from Groq AI based on the task type.
 * Falls back to null if the API key is missing or the request fails.
 */
export async function generateTaskTitle(type: TaskType): Promise<string | null> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  
  if (!apiKey) {
    return null;
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "You are a witty SaaS operations manager. Generate a short, funny, and realistic task title for a game called 'Stack Panic'. The task type is provided. Keep it under 60 characters. Return only the title text, no quotes or prefix.",
          },
          {
            role: "user",
            content: `Generate a title for a task of type: ${type.replace("_", " ")}`,
          },
        ],
        temperature: 0.8,
        max_tokens: 30,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.statusText}`);
    }

    const data = await response.json();
    const title = data.choices[0]?.message?.content?.trim();
    
    // Basic sanitization: remove quotes if the AI included them
    return title ? title.replace(/^["']|["']$/g, "") : null;
  } catch (error) {
    // We log the error but don't crash the game - the caller will use a fallback
    console.error("Failed to generate AI task title:", error);
    return null;
  }
}
