import { generateText, streamText } from 'ai';
import { getModelClient } from './providers';
import { getModelById } from './models';

export interface CodeGenerationRequest {
  prompt: string;
  modelId?: string;
  providerId?: string;
  language?: 'python' | 'javascript' | 'typescript' | 'html' | 'css' | 'react' | 'vue';
  style?: 'simple' | 'advanced' | 'beginner' | 'professional';
}

export interface CodeGenerationResult {
  code: string;
  language: string;
  description: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export class CodeGenerator {
  private static instance: CodeGenerator;

  static getInstance(): CodeGenerator {
    if (!CodeGenerator.instance) {
      CodeGenerator.instance = new CodeGenerator();
    }
    return CodeGenerator.instance;
  }

  async generateCode(request: CodeGenerationRequest): Promise<CodeGenerationResult> {
    const modelId = request.modelId || process.env.NEXT_PUBLIC_DEFAULT_AI_MODEL || 'gpt-4o-mini';
    const model = getModelById(modelId);
    
    if (!model) {
      throw new Error(`Model ${modelId} not found`);
    }

    const aiModel = getModelClient(model, {});
    
    const systemPrompt = this.buildSystemPrompt(request);
    const userPrompt = this.buildUserPrompt(request);

    try {
      const result = await generateText({
        model: aiModel,
        system: systemPrompt,
        prompt: userPrompt,
        temperature: 0.7,
        maxTokens: 4000,
      });

      const parsedResult = this.parseCodeResponse(result.text);

      return {
        ...parsedResult,
        usage: {
          promptTokens: result.usage?.promptTokens || 0,
          completionTokens: result.usage?.completionTokens || 0,
          totalTokens: result.usage?.totalTokens || 0,
        }
      };
    } catch (error) {
      console.error('Code generation failed:', error);
      throw new Error('Failed to generate code');
    }
  }

  async *streamCodeGeneration(request: CodeGenerationRequest) {
    const modelId = request.modelId || process.env.NEXT_PUBLIC_DEFAULT_AI_MODEL || 'gpt-4o-mini';
    const model = getModelById(modelId);
    
    if (!model) {
      throw new Error(`Model ${modelId} not found`);
    }

    const aiModel = getModelClient(model, {});
    
    const systemPrompt = this.buildSystemPrompt(request);
    const userPrompt = this.buildUserPrompt(request);

    try {
      const result = await streamText({
        model: aiModel,
        system: systemPrompt,
        prompt: userPrompt,
        temperature: 0.7,
        maxTokens: 4000,
      });

      for await (const chunk of result.textStream) {
        yield chunk;
      }
    } catch (error) {
      console.error('Code streaming failed:', error);
      throw new Error('Failed to stream code generation');
    }
  }

  private buildSystemPrompt(request: CodeGenerationRequest): string {
    const language = request.language || 'javascript';
    const style = request.style || 'professional';

    return `You are an expert software developer specialized in creating ${language} applications.

INSTRUCTIONS:
- Generate clean, well-documented, and functional code
- Use ${style} coding style and best practices
- Include comments explaining key functionality
- Ensure the code is production-ready and follows modern standards
- If creating a web application, make it responsive and user-friendly

RESPONSE FORMAT:
Please respond with the following structure:
\`\`\`${language}
[Your code here]
\`\`\`

Description: [Brief description of what the code does]

Make sure the code is complete and can run without additional dependencies unless absolutely necessary.`;
  }

  private buildUserPrompt(request: CodeGenerationRequest): string {
    let prompt = `Create a ${request.language || 'JavaScript'} application based on this description:\n\n${request.prompt}`;

    if (request.style) {
      prompt += `\n\nStyle preference: ${request.style}`;
    }

    prompt += '\n\nPlease provide complete, working code with appropriate structure and documentation.';

    return prompt;
  }

  private parseCodeResponse(response: string): Omit<CodeGenerationResult, 'usage'> {
    // Extract code block
    const codeMatch = response.match(/```(\w+)?\n([\s\S]*?)\n```/);
    const code = codeMatch ? codeMatch[2].trim() : response.trim();
    
    // Extract language
    const language = codeMatch?.[1] || 'javascript';
    
    // Extract description
    const descriptionMatch = response.match(/Description:\s*(.*?)(?:\n|$)/);
    const description = descriptionMatch ? descriptionMatch[1].trim() : 'Generated code';

    return {
      code,
      language,
      description
    };
  }

  // Analyze user requirements and suggest the best language/framework
  analyzeRequirements(prompt: string): {
    suggestedLanguage: string;
    suggestedFramework?: string;
    complexity: 'simple' | 'medium' | 'complex';
    estimatedTime: string;
  } {
    const lowerPrompt = prompt.toLowerCase();

    // Language detection
    let suggestedLanguage = 'javascript';
    let suggestedFramework: string | undefined;

    if (lowerPrompt.includes('data analysis') || lowerPrompt.includes('machine learning') || lowerPrompt.includes('pandas') || lowerPrompt.includes('numpy')) {
      suggestedLanguage = 'python';
    } else if (lowerPrompt.includes('react') || lowerPrompt.includes('component')) {
      suggestedLanguage = 'javascript';
      suggestedFramework = 'React';
    } else if (lowerPrompt.includes('vue')) {
      suggestedLanguage = 'javascript';
      suggestedFramework = 'Vue.js';
    } else if (lowerPrompt.includes('web') || lowerPrompt.includes('website') || lowerPrompt.includes('html')) {
      suggestedLanguage = 'html';
    }

    // Complexity estimation
    let complexity: 'simple' | 'medium' | 'complex' = 'simple';
    if (lowerPrompt.includes('database') || lowerPrompt.includes('api') || lowerPrompt.includes('backend')) {
      complexity = 'complex';
    } else if (lowerPrompt.includes('interactive') || lowerPrompt.includes('dashboard') || lowerPrompt.includes('chart')) {
      complexity = 'medium';
    }

    // Time estimation
    const estimatedTime = complexity === 'simple' ? '30 seconds' : 
                         complexity === 'medium' ? '1-2 minutes' : '2-5 minutes';

    return {
      suggestedLanguage,
      suggestedFramework,
      complexity,
      estimatedTime
    };
  }
}

// Singleton instance
export const codeGenerator = CodeGenerator.getInstance(); 