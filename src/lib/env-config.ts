/**
 * 动态环境配置工具
 * 自动检测运行时端口和BASE_URL
 */

// 获取当前运行的端口
export function getCurrentPort(): number {
  // 服务端：从环境变量或默认值获取
  if (typeof window === 'undefined') {
    return parseInt(process.env.PORT || '3000', 10);
  }
  
  // 客户端：从window.location获取
  if (typeof window !== 'undefined' && window.location) {
    return parseInt(window.location.port || '80', 10);
  }
  
  return 3000;
}

// 获取当前运行的主机
export function getCurrentHost(): string {
  // 服务端：从环境变量或默认值获取
  if (typeof window === 'undefined') {
    return process.env.HOST || 'localhost';
  }
  
  // 客户端：从window.location获取
  if (typeof window !== 'undefined' && window.location) {
    return window.location.hostname;
  }
  
  return 'localhost';
}

// 获取当前的协议
export function getCurrentProtocol(): string {
  // 服务端：根据环境判断
  if (typeof window === 'undefined') {
    return process.env.NODE_ENV === 'production' ? 'https' : 'http';
  }
  
  // 客户端：从window.location获取
  if (typeof window !== 'undefined' && window.location) {
    return window.location.protocol.replace(':', '');
  }
  
  return 'http';
}

// 获取完整的BASE_URL
export function getBaseURL(): string {
  // 优先使用环境变量中的配置
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }
  
  const protocol = getCurrentProtocol();
  const host = getCurrentHost();
  const port = getCurrentPort();
  
  // 如果是标准端口，不显示端口号
  if ((protocol === 'http' && port === 80) || (protocol === 'https' && port === 443)) {
    return `${protocol}://${host}`;
  }
  
  return `${protocol}://${host}:${port}`;
}

// 获取内部API调用的BASE_URL（服务端使用）
export function getInternalAPIBaseURL(): string {
  // 服务端环境：使用localhost
  if (typeof window === 'undefined') {
    const port = getCurrentPort();
    return `http://localhost:${port}`;
  }
  
  // 客户端环境：使用相对路径
  return '';
}

// 创建完整的API URL
export function createAPIURL(endpoint: string): string {
  const baseURL = getInternalAPIBaseURL();
  
  // 确保endpoint以/开头
  if (!endpoint.startsWith('/')) {
    endpoint = '/' + endpoint;
  }
  
  // 确保endpoint以/api开头
  if (!endpoint.startsWith('/api/')) {
    endpoint = '/api' + endpoint;
  }
  
  return baseURL + endpoint;
}

// 检测当前运行环境的配置
export function getEnvironmentInfo() {
  return {
    isServer: typeof window === 'undefined',
    isClient: typeof window !== 'undefined',
    protocol: getCurrentProtocol(),
    host: getCurrentHost(),
    port: getCurrentPort(),
    baseURL: getBaseURL(),
    internalBaseURL: getInternalAPIBaseURL(),
    nodeEnv: process.env.NODE_ENV || 'development',
  };
}

// 调试信息输出
export function logEnvironmentInfo() {
  const info = getEnvironmentInfo();
  console.log('🔧 Environment Info:', info);
  return info;
}

// 验证环境配置
export function validateEnvironment(): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  try {
    const baseURL = getBaseURL();
    if (!baseURL) {
      errors.push('BASE_URL could not be determined');
    }
    
    const port = getCurrentPort();
    if (isNaN(port) || port <= 0 || port > 65535) {
      errors.push(`Invalid port: ${port}`);
    }
    
    const host = getCurrentHost();
    if (!host) {
      errors.push('Host could not be determined');
    }
    
  } catch (error) {
    errors.push(`Environment validation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
} 