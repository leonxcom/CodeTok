import { UserProfile } from "@/components/user-profile";
import { Locale } from "../../../../i18n/config";

export const metadata = {
  title: "我的资料 | CodeTok",
  description: "查看和管理您的CodeTok账户信息",
};

interface ProfilePageProps {
  params: {
    locale: Locale;
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  // 确保参数是完全解析的
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  
  return (
    <div className="container max-w-7xl mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {locale === "zh-cn" ? "个人资料" : "My Profile"}
        </h1>
        <p className="text-muted-foreground">
          {locale === "zh-cn" ? "查看和管理您的账户信息" : "View and manage your account information"}
        </p>
      </div>

      <UserProfile locale={locale} />
    </div>
  );
} 