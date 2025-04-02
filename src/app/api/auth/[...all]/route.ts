import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

/**
 * 创建处理认证请求的Next.js路由处理器
 * 使用Better Auth的toNextJsHandler函数
 */
export const { POST, GET } = toNextJsHandler(auth); 
 