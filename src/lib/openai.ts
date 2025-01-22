export async function createThread() {
  const response = await fetch('/api/thread', {
    method: 'POST',
  });
  
  if (!response.ok) {
    throw new Error('Failed to create thread');
  }
  
  return response.json();
}

export async function sendMessage(threadId: string, content: string) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      threadId,
      message: content,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to send message');
  }

  return response.json();
} 