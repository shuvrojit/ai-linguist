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

/**
 * Base interface for API responses
 * @template T - The type of data being returned
 */
export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};

/**
 * Interface for page content metadata
 */
export interface PageContent {
  /** The main text content */
  text: string;
  /** The title of the page */
  title: string;
  /** The URL of the page */
  url: string;
  /** Base URL of the website */
  baseurl: string;
  /** HTML content of the page */
  html: string;
  /** Optional media URLs */
  media?: string[];
}
