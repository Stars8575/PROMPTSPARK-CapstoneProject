const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Every provider exposes the SAME shape: runPrompt({ content, model }) -> { output, usage, model }
// This is what lets us add OpenAI/Anthropic/Hugging Face later without touching route code.
async function runPrompt({ content, model }) {
  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: model || 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content }]
    })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || 'Groq API request failed');
  }

  return {
    output: data.choices[0].message.content,
    usage: {
      promptTokens: data.usage.prompt_tokens,
      completionTokens: data.usage.completion_tokens,
      totalTokens: data.usage.total_tokens
    },
    model: data.model
  };
}

module.exports = { runPrompt };