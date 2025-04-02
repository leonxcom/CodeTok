import { AuthForm } from "@/components/auth/AuthForm";
import { Locale } from "../../../../i18n/config";

export const metadata = {
  title: "CodeTok - 认证",
  description: "登录或注册 CodeTok 账户",
};

interface AuthPageProps {
  params: {
    locale: Locale;
  };
}

export default async function AuthPage({ params }: AuthPageProps) {
  // 确保参数是完全解析的
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  
  return (
    <div className="container max-w-7xl mx-auto py-10">
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">
              {locale === "zh-cn" ? "欢迎来到 CodeTok" : "Welcome to CodeTok"}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              {locale === "zh-cn" ? "请登录或注册以开始使用" : "Please sign in or register to get started"}
            </p>
          </div>
          <AuthForm />
        </div>
      </div>
    </div>
  );
} 