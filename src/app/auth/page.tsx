import { AuthForm } from "@/components/auth/AuthForm";

export const metadata = {
  title: "认证 | CodeTok",
  description: "登录或注册 CodeTok 账户",
};

export default function AuthPage() {
  return (
    <div className="container max-w-7xl mx-auto py-10">
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">欢迎来到 CodeTok</h1>
            <p className="text-gray-500 dark:text-gray-400">
              请登录或注册以开始使用
            </p>
          </div>
          <AuthForm />
        </div>
      </div>
    </div>
  );
} 