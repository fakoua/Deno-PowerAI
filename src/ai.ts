export const getChatResponse = async (
  req: ChatCompletionRequest,
  params?: {
    headers?: Record<string, string>;
  },
): Promise<string | null> => {
  const newReq = {
    ...req,
    messages: [...req.messages],
  };

  const response = await fetch(OPENAI_CHAT_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
      ...(params?.headers ?? {}),
    },
    body: JSON.stringify({ ...newReq, stream: false }),
  });
  try {
    const data = await response.json() as ChatCompletionResponse;
    const content = data?.choices?.[0]?.message?.content;
    if (!content) {
      console.error("Invalid response from OpenAI", data);
      return null;
    }
    return content;
  } catch (e) {
    console.error("Failed to reply", e);
    return null;
  }
};

export interface ChatCompletionRequest {
  model: "gpt-3.5-turbo" | "gpt-4" | "gpt-4-1106-preview" | string;
  messages: Message[];
  temperature?: number;
  top_p?: number;
  n?: number;
  stream?: boolean;
  stop?: string | string[];
  max_tokens?: number;
  presence_penalty?: number;
  frequency_penalty?: number;
  logit_bias?: Record<string, number>;
  user?: string;
}

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
const OPENAI_CHAT_URL = "https://api.openai.com/v1/chat/completions";

type Role = "system" | "user" | "assistant";

interface Message {
  role: Role;
  content: string;
}

interface Choice {
  index: number;
  message: Message;
  finish_reason: "stop" | "length" | "content_filter" | "null";
}

interface ChatCompletionResponse {
  id: string;
  object: "chat.completion";
  created: number;
  choices: Choice[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}
