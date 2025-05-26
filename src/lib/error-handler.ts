/**
 * 统一错误处理系统
 */

export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  metadata?: Record<string, any>;
}

export interface ErrorInfo {
  message: string;
  code?: string;
  type: 'validation' | 'network' | 'system' | 'user' | 'ai' | 'file' | 'unknown';
  severity: 'low' | 'medium' | 'high' | 'critical';
  context?: ErrorContext;
  originalError?: Error;
  timestamp: string;
  stack?: string;
}

export class CodeTokError extends Error {
  public readonly code?: string;
  public readonly type: ErrorInfo['type'];
  public readonly severity: ErrorInfo['severity'];
  public readonly context?: ErrorContext;
  public readonly timestamp: string;

  constructor(
    message: string,
    type: ErrorInfo['type'] = 'unknown',
    severity: ErrorInfo['severity'] = 'medium',
    code?: string,
    context?: ErrorContext
  ) {
    super(message);
    this.name = 'CodeTokError';
    this.code = code;
    this.type = type;
    this.severity = severity;
    this.context = context;
    this.timestamp = new Date().toISOString();
  }

  toErrorInfo(): ErrorInfo {
    return {
      message: this.message,
      code: this.code,
      type: this.type,
      severity: this.severity,
      context: this.context,
      originalError: this,
      timestamp: this.timestamp,
      stack: this.stack,
    };
  }
}

// 错误类型工厂函数
export const ErrorTypes = {
  validation: (message: string, context?: ErrorContext) =>
    new CodeTokError(message, 'validation', 'medium', 'VALIDATION_ERROR', context),

  network: (message: string, context?: ErrorContext) =>
    new CodeTokError(message, 'network', 'high', 'NETWORK_ERROR', context),

  system: (message: string, context?: ErrorContext) =>
    new CodeTokError(message, 'system', 'critical', 'SYSTEM_ERROR', context),

  ai: (message: string, context?: ErrorContext) =>
    new CodeTokError(message, 'ai', 'medium', 'AI_ERROR', context),

  file: (message: string, context?: ErrorContext) =>
    new CodeTokError(message, 'file', 'medium', 'FILE_ERROR', context),

  user: (message: string, context?: ErrorContext) =>
    new CodeTokError(message, 'user', 'low', 'USER_ERROR', context),
};

// 错误日志记录
export function logError(error: Error | CodeTokError, context?: ErrorContext): void {
  const errorInfo: ErrorInfo = error instanceof CodeTokError 
    ? error.toErrorInfo()
    : {
        message: error.message,
        type: 'unknown',
        severity: 'medium',
        context,
        originalError: error,
        timestamp: new Date().toISOString(),
        stack: error.stack,
      };

  // 根据严重程度选择日志级别
  switch (errorInfo.severity) {
    case 'critical':
      console.error('🚨 CRITICAL ERROR:', errorInfo);
      break;
    case 'high':
      console.error('❌ HIGH ERROR:', errorInfo);
      break;
    case 'medium':
      console.warn('⚠️ MEDIUM ERROR:', errorInfo);
      break;
    case 'low':
      console.info('ℹ️ LOW ERROR:', errorInfo);
      break;
  }

  // 在开发环境中显示详细堆栈
  if (process.env.NODE_ENV === 'development' && errorInfo.stack) {
    console.debug('Stack trace:', errorInfo.stack);
  }
}

// 安全的错误消息转换（移除敏感信息）
export function sanitizeErrorMessage(error: Error | CodeTokError): string {
  const message = error.message;

  // 移除可能的敏感信息
  const sanitized = message
    .replace(/api[_-]?key[s]?[:\s]*[a-zA-Z0-9\-_]+/gi, 'API_KEY_HIDDEN')
    .replace(/token[s]?[:\s]*[a-zA-Z0-9\-_]+/gi, 'TOKEN_HIDDEN')
    .replace(/password[s]?[:\s]*[^\s]+/gi, 'PASSWORD_HIDDEN')
    .replace(/secret[s]?[:\s]*[a-zA-Z0-9\-_]+/gi, 'SECRET_HIDDEN');

  return sanitized;
}

// 用户友好的错误消息
export function getUserFriendlyMessage(error: Error | CodeTokError): string {
  if (error instanceof CodeTokError) {
    switch (error.type) {
      case 'validation':
        return `输入验证失败：${sanitizeErrorMessage(error)}`;
      case 'network':
        return '网络连接失败，请检查网络连接后重试';
      case 'system':
        return '系统出现了问题，我们正在努力修复';
      case 'ai':
        return 'AI服务暂时不可用，请稍后重试';
      case 'file':
        return '文件操作失败，请检查文件权限';
      case 'user':
        return sanitizeErrorMessage(error);
      default:
        return '出现了未知错误，请重试';
    }
  }

  return '出现了未知错误，请重试';
}

// 错误重试逻辑
export async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000,
  context?: ErrorContext
): Promise<T> {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      logError(lastError, { 
        ...context, 
        action: `retry_attempt_${attempt}`,
        metadata: { maxRetries, delayMs }
      });

      if (attempt === maxRetries) {
        break;
      }

      // 指数退避
      const delay = delayMs * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw new CodeTokError(
    `操作失败，已重试${maxRetries}次：${lastError!.message}`,
    'system',
    'high',
    'RETRY_EXHAUSTED',
    context
  );
}

// 包装异步函数以添加错误处理
export function withErrorHandling<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  context?: ErrorContext
) {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error) {
      const wrappedError = error instanceof CodeTokError 
        ? error 
        : new CodeTokError(
            error instanceof Error ? error.message : String(error),
            'unknown',
            'medium',
            undefined,
            context
          );
      
      logError(wrappedError, context);
      throw wrappedError;
    }
  };
}

// Next.js API错误响应帮助函数
export function createErrorResponse(
  error: Error | CodeTokError,
  statusCode: number = 500
) {
  const errorInfo = error instanceof CodeTokError ? error.toErrorInfo() : {
    message: error.message,
    type: 'unknown' as const,
    severity: 'medium' as const,
    timestamp: new Date().toISOString(),
  };

  return Response.json(
    {
      error: true,
      message: getUserFriendlyMessage(error),
      code: errorInfo.code,
      type: errorInfo.type,
      timestamp: errorInfo.timestamp,
      // 只在开发环境返回详细信息
      ...(process.env.NODE_ENV === 'development' && {
        details: sanitizeErrorMessage(error),
        stack: errorInfo.stack,
      }),
    },
    { status: statusCode }
  );
} 