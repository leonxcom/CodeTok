import { createAnthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createMistral } from '@ai-sdk/mistral';
import { createOpenAI } from '@ai-sdk/openai';
import { createFireworks } from '@ai-sdk/fireworks';

export interface LLMModelConfig {
  model?: string;
  apiKey?: string;
  baseURL?: string;
  temperature?: number;
  topP?: number;
  topK?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  maxTokens?: number;
}

export function getModelClient(model: { id: string; providerId: string }, config: LLMModelConfig) {
  const { id: modelNameString, providerId } = model;
  const { apiKey, baseURL } = config;

  const providerConfigs = {
    anthropic: () => createAnthropic({ apiKey: apiKey || process.env.ANTHROPIC_API_KEY, baseURL })(modelNameString),
    openai: () => createOpenAI({ apiKey: apiKey || process.env.OPENAI_API_KEY, baseURL })(modelNameString),
    google: () => createGoogleGenerativeAI({ apiKey: apiKey || process.env.GOOGLE_AI_API_KEY, baseURL })(modelNameString),
    mistral: () => createMistral({ apiKey: apiKey || process.env.MISTRAL_API_KEY, baseURL })(modelNameString),
    groq: () =>
      createOpenAI({
        apiKey: apiKey || process.env.GROQ_API_KEY,
        baseURL: baseURL || 'https://api.groq.com/openai/v1',
      })(modelNameString),
    togetherai: () =>
      createOpenAI({
        apiKey: apiKey || process.env.TOGETHER_API_KEY,
        baseURL: baseURL || 'https://api.together.xyz/v1',
      })(modelNameString),
    fireworks: () =>
      createFireworks({
        apiKey: apiKey || process.env.FIREWORKS_API_KEY,
        baseURL: baseURL || 'https://api.fireworks.ai/inference/v1',
      })(modelNameString),
    xai: () =>
      createOpenAI({
        apiKey: apiKey || process.env.XAI_API_KEY,
        baseURL: baseURL || 'https://api.x.ai/v1',
      })(modelNameString),
    deepseek: () =>
      createOpenAI({
        apiKey: apiKey || process.env.DEEPSEEK_API_KEY,
        baseURL: baseURL || 'https://api.deepseek.com/v1',
      })(modelNameString),
    openrouter: () =>
      createOpenAI({
        apiKey: apiKey || process.env.OPENROUTER_API_KEY,
        baseURL: baseURL || 'https://openrouter.ai/api/v1',
      })(modelNameString),
  };

  const createClient = providerConfigs[providerId as keyof typeof providerConfigs];

  if (!createClient) {
    throw new Error(`Unsupported provider: ${providerId}`);
  }

  return createClient();
}

// Default structured output mode for different providers
export function getDefaultMode(providerId: string): 'json' | 'tool' {
  switch (providerId) {
    case 'anthropic':
    case 'fireworks':
    case 'groq':
    case 'together':
    case 'deepseek':
    case 'openrouter':
      return 'json';
    default:
      return 'tool';
  }
} 