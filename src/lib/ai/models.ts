export interface AIModel {
  id: string;
  name: string;
  provider: string;
  providerId: string;
  description?: string;
}

export interface AIProvider {
  id: string;
  name: string;
  models: AIModel[];
}

export const AI_MODELS: AIModel[] = [
  // OpenAI Models
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    providerId: "openai",
    description: "Most capable GPT-4 model"
  },
  {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    provider: "OpenAI", 
    providerId: "openai",
    description: "Faster and more affordable GPT-4"
  },
  {
    id: "gpt-3.5-turbo",
    name: "GPT-3.5 Turbo",
    provider: "OpenAI",
    providerId: "openai",
    description: "Fast and efficient model"
  },

  // Anthropic Models
  {
    id: "claude-3-5-sonnet-20241022",
    name: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    providerId: "anthropic",
    description: "Most intelligent Claude model"
  },
  {
    id: "claude-3-5-haiku-20241022", 
    name: "Claude 3.5 Haiku",
    provider: "Anthropic",
    providerId: "anthropic",
    description: "Fastest Claude model"
  },

  // Google Models
  {
    id: "gemini-1.5-pro",
    name: "Gemini 1.5 Pro",
    provider: "Google",
    providerId: "google",
    description: "Advanced reasoning and long context"
  },
  {
    id: "gemini-1.5-flash",
    name: "Gemini 1.5 Flash", 
    provider: "Google",
    providerId: "google",
    description: "Fast and versatile performance"
  },

  // Groq Models
  {
    id: "llama-3.1-70b-versatile",
    name: "Llama 3.1 70B",
    provider: "Groq",
    providerId: "groq",
    description: "Large language model"
  },
  {
    id: "llama-3.1-8b-instant",
    name: "Llama 3.1 8B",
    provider: "Groq", 
    providerId: "groq",
    description: "Fast inference model"
  },

  // DeepSeek Models
  {
    id: "deepseek-reasoner",
    name: "DeepSeek R1",
    provider: "DeepSeek",
    providerId: "deepseek",
    description: "DeepSeek's latest reasoning model with enhanced problem-solving capabilities"
  },
  {
    id: "deepseek-chat",
    name: "DeepSeek Chat",
    provider: "DeepSeek",
    providerId: "deepseek",
    description: "DeepSeek's conversational AI model"
  },
  {
    id: "deepseek-coder",
    name: "DeepSeek Coder",
    provider: "DeepSeek",
    providerId: "deepseek", 
    description: "Specialized model for code generation"
  },

  // OpenRouter Models
  {
    id: "deepseek/deepseek-r1",
    name: "DeepSeek R1 (OpenRouter)",
    provider: "OpenRouter",
    providerId: "openrouter",
    description: "DeepSeek R1 via OpenRouter - faster and more reliable"
  },
  {
    id: "deepseek/deepseek-chat",
    name: "DeepSeek Chat (OpenRouter)",
    provider: "OpenRouter",
    providerId: "openrouter",
    description: "DeepSeek Chat via OpenRouter - optimized for speed"
  },
  {
    id: "openai/gpt-4o",
    name: "GPT-4o (OpenRouter)",
    provider: "OpenRouter",
    providerId: "openrouter",
    description: "OpenAI's most capable model via OpenRouter"
  },
  {
    id: "openai/gpt-4o-mini",
    name: "GPT-4o Mini (OpenRouter)",
    provider: "OpenRouter",
    providerId: "openrouter",
    description: "OpenAI's fast and affordable model via OpenRouter"
  },
  {
    id: "anthropic/claude-3.5-sonnet",
    name: "Claude 3.5 Sonnet (OpenRouter)",
    provider: "OpenRouter",
    providerId: "openrouter",
    description: "Anthropic's most intelligent model via OpenRouter"
  },
  {
    id: "google/gemini-pro-1.5",
    name: "Gemini Pro 1.5 (OpenRouter)",
    provider: "OpenRouter",
    providerId: "openrouter",
    description: "Google's advanced model via OpenRouter"
  }
];

export const AI_PROVIDERS: AIProvider[] = [
  {
    id: "openai",
    name: "OpenAI",
    models: AI_MODELS.filter(m => m.providerId === "openai")
  },
  {
    id: "anthropic", 
    name: "Anthropic",
    models: AI_MODELS.filter(m => m.providerId === "anthropic")
  },
  {
    id: "google",
    name: "Google",
    models: AI_MODELS.filter(m => m.providerId === "google")
  },
  {
    id: "groq",
    name: "Groq",
    models: AI_MODELS.filter(m => m.providerId === "groq")
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    models: AI_MODELS.filter(m => m.providerId === "deepseek")
  },
  {
    id: "openrouter",
    name: "OpenRouter",
    models: AI_MODELS.filter(m => m.providerId === "openrouter")
  }
];

export function getModelById(id: string): AIModel | undefined {
  return AI_MODELS.find(model => model.id === id);
}

export function getProviderById(id: string): AIProvider | undefined {
  return AI_PROVIDERS.find(provider => provider.id === id);
} 