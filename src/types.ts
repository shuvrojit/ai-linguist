export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatCompletionRequest {
  messages: Message[];
  temperature: number;
  top_p: number;
  max_tokens: number;
  model: string;
}

export interface ChatCompletionResponse {
  choices: { message: Message }[];
}
