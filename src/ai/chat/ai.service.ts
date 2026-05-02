import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  private readonly AI_URL = process.env.AI_URL;
  private readonly AI_KEY = process.env.AI_KEY; // vacío para Ollama local
  private readonly AI_MODEL = process.env.AI_MODEL || 'llama3-8b-8192';

  async generateStreamingResponse(
    messages: { role: string; content: string }[],
    onChunk: (chunk: string) => void,
  ): Promise<string> {
    const systemMessage = {
      role: 'system',
      content: `Eres el asistente de IA de NexoAI, una plataforma de gestión
      empresarial para pequeños negocios en Latinoamérica. Ayudás con análisis
      de ventas, inventario y métricas. Respondé siempre en español,
      de forma concisa y práctica.`,
    };

    const isOllama =
      this.AI_URL?.includes('localhost') || this.AI_URL?.includes('11434');

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (this.AI_KEY) {
      headers['Authorization'] = `Bearer ${this.AI_KEY}`;
    }

    // Groq y Ollama usan el mismo formato OpenAI
    const body = {
      model: this.AI_MODEL,
      messages: [systemMessage, ...messages],
      stream: true,
      temperature: 0.7,
      max_tokens: 1000,
    };

    const response = await fetch(this.AI_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const err = await response.text();
      this.logger.error(`AI error ${response.status}: ${err}`);
      throw new Error(`AI API error: ${response.status}`);
    }

    const fullResponse: string[] = [];
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n').filter((l) => l.startsWith('data: '));

      for (const line of lines) {
        const jsonStr = line.replace('data: ', '').trim();
        if (!jsonStr || jsonStr === '[DONE]') continue;

        try {
          const data = JSON.parse(jsonStr);
          // Ollama usa data.message.content, Groq/OpenAI usa data.choices[0].delta.content
          const text = isOllama
            ? data.message?.content
            : data.choices?.[0]?.delta?.content;

          if (text) {
            onChunk(text);
            fullResponse.push(text);
          }
        } catch {
          // chunk incompleto, ignorar
        }
      }
    }

    return fullResponse.join('');
  }
}
