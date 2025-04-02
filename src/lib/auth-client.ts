import { createAuthClient } from "better-auth/react";

/**
 * 创建Better Auth客户端实例
 * 这将提供与认证服务器交互的React hooks和函数
 */
export const authClient = createAuthClient({
  // 可选：如果认证服务器与客户端在同一域名下，可以省略baseURL
  // baseURL: "http://localhost:3000"
});

// TypeScript类型声明
interface AuthResult {
  success: boolean;
  error?: string;
  user?: any;
}

// 导出认证函数和hooks
export const { useSession, signOut } = authClient;

// 自定义登录函数
export const signIn = async (
  provider: "email-password" | "github" | "google", 
  credentials?: { email: string; password: string }
): Promise<AuthResult> => {
  try {
    if (provider === "email-password" && credentials) {
      // 使用Better Auth提供的API路由
      const response = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          provider: "credentials",
          ...credentials
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        return { success: false, error: error.message || "登录失败" };
      }
      
      // 成功登录后，触发页面刷新以重新获取会话
      window.location.reload();
      
      return { success: true };
    } else if (provider === "github" || provider === "google") {
      // 社交登录直接重定向到相应的社交登录URL
      window.location.href = `/api/auth/login/${provider}`;
      return { success: true };
    }
    
    throw new Error(`不支持的登录方式: ${provider}`);
  } catch (error) {
    return { 
      success: false,
      error: error instanceof Error ? error.message : "登录过程中发生错误" 
    };
  }
};

// 自定义注册函数
export const signUp = async (
  provider: "email-password" | "github" | "google",
  userData?: { email: string; password: string; username: string }
): Promise<AuthResult> => {
  try {
    if (provider === "email-password" && userData) {
      // 使用Better Auth提供的API路由
      const response = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          provider: "credentials",
          email: userData.email,
          password: userData.password,
          username: userData.username
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        return { success: false, error: error.message || "注册失败" };
      }
      
      return { success: true };
    } else if (provider === "github" || provider === "google") {
      // 社交注册直接重定向到相应的社交登录URL
      window.location.href = `/api/auth/login/${provider}`;
      return { success: true };
    }
    
    throw new Error(`不支持的注册方式: ${provider}`);
  } catch (error) {
    return { 
      success: false,
      error: error instanceof Error ? error.message : "注册过程中发生错误" 
    };
  }
}; 