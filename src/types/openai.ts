export interface OpenAIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Choice[];
  usage: Usage;
}

export interface Choice {
  index: number;
  message: {
    role: 'assistant' | 'user' | 'system';
    content: string;
  };
  finish_reason: 'stop' | 'length' | 'content_filter' | null;
}

export interface Usage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

export interface OpenAIError {
  error: {
    message: string;
    type: string;
    param: string | null;
    code: string;
  };
}

export interface ChatMessage {
  role: 'assistant' | 'user' | 'system';
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  model: string;
  temperature?: number;
  max_tokens?: number;
} 