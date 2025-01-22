if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

if (!process.env.OPENAI_ASSISTANT_ID) {
  throw new Error('Missing OPENAI_ASSISTANT_ID environment variable');
}

export const config = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    assistantId: process.env.OPENAI_ASSISTANT_ID,
  },
} as const; 