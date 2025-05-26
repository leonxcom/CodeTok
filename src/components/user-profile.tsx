"use client";

import { useSession, signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Locale } from "../../i18n/config";

interface UserProfileProps {
  locale: Locale;
}

export function UserProfile({ locale }: UserProfileProps) {
  const { data: session, isPending, error } = useSession();
  
  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-muted-foreground">
          {locale === "zh-cn" ? "加载中..." : "Loading..."}
        </p>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <h2 className="text-2xl font-bold">
          {locale === "zh-cn" ? "您尚未登录" : "You are not logged in"}
        </h2>
        <p className="text-muted-foreground">
          {locale === "zh-cn" ? "请登录或注册以查看您的个人资料" : "Please log in or register to view your profile"}
        </p>
        <Button
          className="mt-4"
          asChild
        >
          <a href={`/${locale}/auth`}>
            {locale === "zh-cn" ? "去登录" : "Go to Login"}
          </a>
        </Button>
      </div>
    );
  }

  // 获取用户显示名
  const userDisplayName = session.user?.name || session.user?.email?.split("@")[0] || "User";

  return (
    <div className="max-w-md mx-auto p-6 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex flex-col items-center space-y-4">
        <div className="h-24 w-24 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
          <span className="text-2xl font-bold text-white">
            {session.user?.email?.[0].toUpperCase() || "U"}
          </span>
        </div>
        
        <h2 className="text-2xl font-bold mt-4">
          {userDisplayName}
        </h2>

        <div className="w-full space-y-2">
          <div className="flex justify-between py-2 border-b border-border">
            <span className="text-muted-foreground">
              {locale === "zh-cn" ? "电子邮箱" : "Email"}
            </span>
            <span className="font-medium">{session.user?.email}</span>
          </div>
          
          <div className="flex justify-between py-2 border-b border-border">
            <span className="text-muted-foreground">
              {locale === "zh-cn" ? "用户ID" : "User ID"}
            </span>
            <span className="font-medium">{session.user?.id.substring(0, 8)}...</span>
          </div>
          
          <div className="flex justify-between py-2 border-b border-border">
            <span className="text-muted-foreground">
              {locale === "zh-cn" ? "账户状态" : "Account Status"}
            </span>
            <span className="font-medium text-green-500">
              {locale === "zh-cn" ? "已激活" : "Active"}
            </span>
          </div>
        </div>

        <Button 
          variant="destructive" 
          className="mt-6 w-full"
          onClick={handleSignOut}
        >
          {locale === "zh-cn" ? "退出登录" : "Sign Out"}
        </Button>
      </div>
    </div>
  );
} 