import { NextRequest } from 'next/server';
import { streamObject, LanguageModel, CoreMessage } from 'ai';
import { getModelClient, LLMModelConfig } from '@/lib/ai/providers';
import { fragmentSchema } from '@/lib/ai/schema';
import { toPrompt } from '@/lib/ai/prompt';
import templates, { Templates } from '@/lib/ai/templates';
import { getModelById, AIModel } from '@/lib/ai/models';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const {
      messages,
      template = templates,
      model = { id: 'gpt-4o-mini', name: 'GPT-4o Mini', provider: 'OpenAI', providerId: 'openai' },
      config = {},
    }: {
      messages: CoreMessage[];
      template?: Templates;
      model?: AIModel;
      config?: LLMModelConfig;
    } = await req.json();

    // Validate required fields
    if (!messages || messages.length === 0) {
      return new Response('Messages are required', { status: 400 });
    }

    // Create model client  
    const modelClient = getModelClient(model, config);

    // Generate the system prompt
    const systemPrompt = toPrompt(template);

    // Prepare stream options with explicit typing
    const streamOptions = {
      model: modelClient as LanguageModel,
      schema: fragmentSchema,
      system: systemPrompt,
      messages,
      maxRetries: 0,
      ...(config.temperature !== undefined && { temperature: config.temperature }),
      ...(config.topP !== undefined && { topP: config.topP }),
      ...(config.maxTokens !== undefined && { maxTokens: config.maxTokens }),
      ...(config.frequencyPenalty !== undefined && { frequencyPenalty: config.frequencyPenalty }),
      ...(config.presencePenalty !== undefined && { presencePenalty: config.presencePenalty }),
    };
    
    const stream = await streamObject(streamOptions);

    return stream.toTextStreamResponse();

  } catch (error: any) {
    console.error('Chat API error:', error);

    const isRateLimitError = 
      error && (error.statusCode === 429 || error.message.includes('limit'));
    const isOverloadedError = 
      error && (error.statusCode === 529 || error.statusCode === 503);
    const isAccessDeniedError = 
      error && (error.statusCode === 403 || error.statusCode === 401);

    if (isRateLimitError) {
      return new Response(
        'The provider is currently unavailable due to request limit. Try using your own API key.',
        { status: 429 }
      );
    }

    if (isOverloadedError) {
      return new Response(
        'The provider is currently unavailable. Please try again later.',
        { status: 529 }
      );
    }

    if (isAccessDeniedError) {
      return new Response(
        'Access denied. Please make sure your API key is valid.',
        { status: 403 }
      );
    }

    return new Response(
      'An unexpected error has occurred. Please try again later.',
      { status: 500 }
    );
  }
} 