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
 * Interface for tab content structure
 */
export interface TabContent {
  /** The main text content of the tab */
  text: string;
  /** The title of the page */
  title: string;
  /** The URL of the page */
  url: string;
}

/**
 * Interface for content state management
 */
export interface ContentState {
  /** Loading state indicator */
  isLoading: boolean;
  /** Error message if any */
  error: string | null;
  /** Current content data */
  content: TabContent | null;
}
