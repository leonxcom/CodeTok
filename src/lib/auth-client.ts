import { createAuthClient } from "better-auth/react";

/**
 * 创建Better Auth客户端实例
 * 这将提供与认证服务器交互的React hooks和函数
 */
export const authClient = createAuthClient({
  baseURL: process.env.NODE_ENV === 'production' 
    ? process.env.NEXT_PUBLIC_BASE_URL 
    : "http://localhost:3000"
});

// 从authClient导出所有需要的函数和hooks
export const { 
  signIn, 
  signUp, 
  signOut, 
  useSession,
  getSession 
} = authClient; 