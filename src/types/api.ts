// Auth API Response Types
export interface AuthResponse {
  user: User | null;
  session: Session | null;
  error: Error | null;
}

export interface User {
  id: string;
  email?: string;
  user_metadata: {
    name?: string;
    avatar_url?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface Session {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  user: User;
}

// Analytics API Response Types
export interface AnalyticsData {
  pageViews: PageView[];
  visitors: Visitor[];
  events: Event[];
}

export interface PageView {
  id: string;
  path: string;
  timestamp: string;
  visitorId: string;
  duration: number;
}

export interface Visitor {
  id: string;
  firstSeen: string;
  lastSeen: string;
  visits: number;
  country?: string;
  city?: string;
}

export interface Event {
  id: string;
  name: string;
  timestamp: string;
  visitorId: string;
  properties: Record<string, unknown>;
}

// Notion API Response Types
export interface NotionResponse<T> {
  object: string;
  results: T[];
  next_cursor: string | null;
  has_more: boolean;
}

export interface NotionError {
  status: number;
  code: string;
  message: string;
}

// Chat API Response Types
export interface ChatResponse {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: string;
}

export interface ChatError {
  code: string;
  message: string;
  details?: unknown;
} 