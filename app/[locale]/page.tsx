import { button as buttonStyles } from "@heroui/theme";
import Link from "next/link";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { getMessages } from "@/i18n/server";
import { Locale } from "@/config/i18n";
import { siteConfig } from "@/config/site";
import { GithubIcon } from "@/components/icons";

interface Props {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { locale } = await props.params;
  const validLocale = locale as Locale;
  const messages = await getMessages(validLocale);

  return {
    title: messages.app.homeTitle,
    description: messages.app.description,
  };
}

export default async function Home(props: Props) {
  const { locale } = await props.params;
  const validLocale = locale as Locale;
  
  // 使用next-intl提供的getTranslations函数 
  const t = await getTranslations({
    locale: validLocale,
    namespace: 'app'
  });
  
  const nav = await getTranslations({
    locale: validLocale,
    namespace: 'nav'  
  });
  
  const common = await getTranslations({
    locale: validLocale,
    namespace: 'common'
  });

  return (
    <div className="flex flex-col items-center w-full">
      {/* Hero section - mountain cloud background */}
      <section className="flex flex-col items-center justify-center w-full py-20 bg-gradient-to-b from-primary/20 to-background px-4">
        <div className="max-w-5xl flex flex-col gap-8 items-center text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 tracking-tight">
            {t("title")}
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl text-foreground/80">
            {t("description")}
          </p>

          <div className="flex flex-wrap gap-4 justify-center mt-4">
            <Link
              className={buttonStyles({
                color: "primary",
                radius: "full",
                variant: "shadow",
                size: "lg",
              })}
              href={`/${locale}/docs`}
            >
              {nav("docs")}
            </Link>
            <a
              className={buttonStyles({
                variant: "bordered",
                radius: "full",
                size: "lg",
              })}
              href={siteConfig.links.github}
              rel="noopener noreferrer"
              target="_blank"
            >
              <GithubIcon size={20} />
              {common("github")}
            </a>
          </div>
        </div>

        {/* Placeholder - hero section image */}
        <div className="relative w-full max-w-5xl h-[300px] mt-12 rounded-xl overflow-hidden bg-default-100 flex items-center justify-center">
          <p className="text-default-600">Hero Area Image Placeholder</p>
        </div>

        {/* Partners */}
        <div className="flex flex-col items-center mt-16">
          <p className="text-default-500 text-sm uppercase mb-4">
            {t("partners")}
          </p>
          <div className="flex flex-wrap gap-8 justify-center">
            <div className="w-24 h-8 bg-default-200 rounded-md" />
            <div className="w-24 h-8 bg-default-200 rounded-md" />
            <div className="w-24 h-8 bg-default-200 rounded-md" />
            <div className="w-24 h-8 bg-default-200 rounded-md" />
          </div>
        </div>
      </section>

      {/* Core principles section */}
      <section className="w-full py-20 px-4 bg-default-50 dark:bg-default-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">{t("corePhilosophy")}</h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              {t("corePhilosophyDesc")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* First-principles learning */}
            <div className="bg-background dark:bg-default-100/5 p-8 rounded-xl border border-default-200 flex flex-col">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-4">
                <svg
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  <path d="M2 12h20" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">{t("firstPrinciples")}</h3>
              <p className="text-foreground/70 flex-grow">
                {t("firstPrinciplesDesc")}
              </p>
            </div>

            {/* Project-driven */}
            <div className="bg-background dark:bg-default-100/5 p-8 rounded-xl border border-default-200 flex flex-col">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-4">
                <svg
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">{t("projectDriven")}</h3>
              <p className="text-foreground/70 flex-grow">
                {t("projectDrivenDesc")}
              </p>
            </div>

            {/* AI-native */}
            <div className="bg-background dark:bg-default-100/5 p-8 rounded-xl border border-default-200 flex flex-col">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-4">
                <svg
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2a3 3 0 0 0-3 3v2H6a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V10a3 3 0 0 0-3-3h-3V5a3 3 0 0 0-3-3Z" />
                  <path d="M10 22v-8l-2-2-2 2" />
                  <path d="M18 22v-8l-2-2-2 2" />
                  <rect height="4" width="4" x="10" y="6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">{t("aiNative")}</h3>
              <p className="text-foreground/70 flex-grow">
                {t("aiNativeDesc")}
              </p>
            </div>

            {/* One-click deployment */}
            <div className="bg-background dark:bg-default-100/5 p-8 rounded-xl border border-default-200 flex flex-col">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-4">
                <svg
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M22 12H2" />
                  <path d="M5 12V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v7" />
                  <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">{t("oneClickDeploy")}</h3>
              <p className="text-foreground/70 flex-grow">
                {t("oneClickDeployDesc")}
              </p>
            </div>

            {/* Build in public */}
            <div className="bg-background dark:bg-default-100/5 p-8 rounded-xl border border-default-200 flex flex-col">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-4">
                <svg
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17 6.1H3v13h18V10" />
                  <path d="M13.5 3H17v3.1" />
                  <path d="m10 14 8-8" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">{t("buildInPublic")}</h3>
              <p className="text-foreground/70 flex-grow">
                {t("buildInPublicDesc")}
              </p>
            </div>

            {/* Fan connection */}
            <div className="bg-background dark:bg-default-100/5 p-8 rounded-xl border border-default-200 flex flex-col">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-4">
                <svg
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M16 16h4v4h-4z" />
                  <path d="M4 4h4v4H4z" />
                  <path d="M16 4h4v4h-4z" />
                  <path d="M4 16h4v4H4z" />
                  <path d="M12 9v6" />
                  <path d="M9 12h6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">{t("fanConnection")}</h3>
              <p className="text-foreground/70 flex-grow">
                {t("fanConnectionDesc")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Learning paths section */}
      <section className="w-full max-w-7xl py-20 px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{t("learningPath")}</h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            {t("learningPathDesc")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Path card 1 */}
          <div className="bg-default-50 dark:bg-default-100/5 border border-default-200 rounded-xl overflow-hidden">
            <div className="h-48 bg-primary/20 relative flex items-center justify-center">
              <p className="text-default-600">Project Image Placeholder 1</p>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">{t("path1Title")}</h3>
              <p className="text-foreground/70 mb-4">{t("path1Desc")}</p>
              <Link
                className={buttonStyles({
                  variant: "flat",
                  color: "primary",
                  size: "sm",
                })}
                href={`/${locale}/path1`}
              >
                {t("startLearning")}
              </Link>
            </div>
          </div>

          {/* Path card 2 */}
          <div className="bg-default-50 dark:bg-default-100/5 border border-default-200 rounded-xl overflow-hidden">
            <div className="h-48 bg-secondary/20 relative flex items-center justify-center">
              <p className="text-default-600">Project Image Placeholder 2</p>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">{t("path2Title")}</h3>
              <p className="text-foreground/70 mb-4">{t("path2Desc")}</p>
              <Link
                className={buttonStyles({
                  variant: "flat",
                  color: "secondary",
                  size: "sm",
                })}
                href={`/${locale}/path2`}
              >
                {t("startLearning")}
              </Link>
            </div>
          </div>

          {/* Path card 3 */}
          <div className="bg-default-50 dark:bg-default-100/5 border border-default-200 rounded-xl overflow-hidden">
            <div className="h-48 bg-success/20 relative flex items-center justify-center">
              <p className="text-default-600">Project Image Placeholder 3</p>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">{t("path3Title")}</h3>
              <p className="text-foreground/70 mb-4">{t("path3Desc")}</p>
              <Link
                className={buttonStyles({
                  variant: "flat",
                  color: "success",
                  size: "sm",
                })}
                href={`/${locale}/path3`}
              >
                {t("startLearning")}
              </Link>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-12">
          <Link
            className={buttonStyles({
              color: "primary",
              radius: "full",
              size: "lg",
            })}
            href={`/${locale}/journey`}
          >
            {t("exploreAllPaths")}
          </Link>
        </div>
      </section>

      {/* AI-native learning system */}
      <section className="w-full bg-default-50 dark:bg-default-900/50 py-20 px-4">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-4">{t("aiLearningSystem")}</h2>
            <p className="text-foreground/70 mb-6">
              {t("aiLearningSystemDesc")}
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  ✓
                </div>
                <span>{t("aiFeature1")}</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  ✓
                </div>
                <span>{t("aiFeature2")}</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  ✓
                </div>
                <span>{t("aiFeature3")}</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  ✓
                </div>
                <span>{t("aiFeature4")}</span>
              </li>
            </ul>
            <Link
              className={buttonStyles({
                color: "primary",
                radius: "full",
              })}
              href={`/${locale}/ai-learning`}
            >
              {t("learnMore")}
            </Link>
          </div>

          {/* AI visualization illustration */}
          <div className="lg:w-1/2 w-full">
            <div className="bg-default-100 rounded-xl overflow-hidden border border-default-200 h-[300px] flex items-center justify-center">
              <p className="text-default-600">AI Learning System Illustration Placeholder</p>
            </div>
          </div>
        </div>
      </section>

      {/* Coding learning section */}
      <section className="w-full max-w-7xl py-20 px-4 mx-auto">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row-reverse items-center gap-12">
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-4">
              {t("practiceYourSkills")}
            </h2>
            <p className="text-foreground/70 mb-6">{t("practiceDesc")}</p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  ✓
                </div>
                <span>{t("practicePoint1")}</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  ✓
                </div>
                <span>{t("practicePoint2")}</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  ✓
                </div>
                <span>{t("practicePoint3")}</span>
              </li>
            </ul>
            <Link
              className={buttonStyles({
                color: "primary",
                radius: "full",
              })}
              href={`/${locale}/practice`}
            >
              {t("startCoding")}
            </Link>
          </div>

          {/* Code editor example */}
          <div className="lg:w-1/2 w-full">
            <div className="bg-default-900 rounded-xl overflow-hidden border border-default-200 shadow-xl">
              <div className="bg-default-800 p-3 flex items-center gap-2 border-b border-default-700">
                <div className="w-3 h-3 rounded-full bg-danger" />
                <div className="w-3 h-3 rounded-full bg-warning" />
                <div className="w-3 h-3 rounded-full bg-success" />
                <div className="ml-2 text-xs text-default-400">index.js</div>
              </div>
              <div className="p-4 font-mono text-sm text-success">
                <div className="flex">
                  <span className="text-default-500 mr-4">1</span>
                  <span className="text-primary-500">function</span>
                  <span className="text-warning ml-2">greet</span>
                  <span>(name) {"{}"}</span>
                </div>
                <div className="flex">
                  <span className="text-default-500 mr-4">2</span>
                  <span className="ml-4">return</span>
                  <span className="text-success ml-2">
                    `Hello, ${"{"}name{"}"}`
                  </span>
                </div>
                <div className="flex">
                  <span className="text-default-500 mr-4">3</span>
                  <span>{"}"}</span>
                </div>
                <div className="flex mt-2">
                  <span className="text-default-500 mr-4">4</span>
                  <span className="text-warning">greet</span>
                  <span>(</span>
                  <span className="text-success">&quot;Nostudy.ai&quot;</span>
                  <span>)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio section */}
      <section className="w-full bg-default-50 dark:bg-default-900/50 py-20 px-4">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          {/* Portfolio showcase image */}
          <div className="lg:w-1/2 w-full h-[300px] bg-default-100 rounded-xl flex items-center justify-center">
            <p className="text-default-600">Project Portfolio Placeholder Image</p>
          </div>

          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-4">{t("buildPortfolio")}</h2>
            <p className="text-foreground/70 mb-6">{t("portfolioDesc")}</p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  1
                </div>
                <span>{t("portfolioStep1")}</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  2
                </div>
                <span>{t("portfolioStep2")}</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  3
                </div>
                <span>{t("portfolioStep3")}</span>
              </li>
            </ul>
            <Link
              className={buttonStyles({
                color: "primary",
                radius: "full",
              })}
              href={`/${locale}/portfolio`}
            >
              {t("createPortfolio")}
            </Link>
          </div>
        </div>
      </section>

      {/* Technology stack showcase */}
      <section className="w-full max-w-7xl py-20 px-4 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">{t("poweredBy")}</h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            {t("techStackDesc")}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 bg-default-100 rounded-xl flex items-center justify-center">
              <p className="text-default-600 text-xs">Next.js</p>
            </div>
            <p className="text-sm font-medium">Next.js 15</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 bg-default-100 rounded-xl flex items-center justify-center">
              <p className="text-default-600 text-xs">React</p>
            </div>
            <p className="text-sm font-medium">React 18+</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 bg-default-100 rounded-xl flex items-center justify-center">
              <p className="text-default-600 text-xs">TS</p>
            </div>
            <p className="text-sm font-medium">TypeScript</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 bg-default-100 rounded-xl flex items-center justify-center">
              <p className="text-default-600 text-xs">Tailwind</p>
            </div>
            <p className="text-sm font-medium">TailwindCSS</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 bg-default-100 rounded-xl flex items-center justify-center">
              <p className="text-default-600 text-xs">HeroUI</p>
            </div>
            <p className="text-sm font-medium">HeroUI</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 bg-default-100 rounded-xl flex items-center justify-center">
              <p className="text-default-600 text-xs">GPT</p>
            </div>
            <p className="text-sm font-medium">GPT/DeepSeek</p>
          </div>
        </div>
      </section>

      {/* Community interaction section */}
      <section className="w-full bg-default-50 dark:bg-default-900/50 py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">{t("community")}</h2>
          <p className="text-foreground/70 max-w-2xl mx-auto mb-12">
            {t("communityDesc")}
          </p>

          <div className="flex flex-wrap justify-center gap-8">
            {/* Community feature 1 */}
            <div className="w-full sm:w-[300px] bg-default-100 dark:bg-default-100/5 p-6 rounded-xl border border-default-200">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary mx-auto mb-4">
                <svg
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">
                {t("communityFeature1")}
              </h3>
              <p className="text-foreground/70">{t("communityFeature1Desc")}</p>
            </div>

            {/* Community feature 2 */}
            <div className="w-full sm:w-[300px] bg-default-100 dark:bg-default-100/5 p-6 rounded-xl border border-default-200">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary mx-auto mb-4">
                <svg
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">
                {t("communityFeature2")}
              </h3>
              <p className="text-foreground/70">{t("communityFeature2Desc")}</p>
            </div>

            {/* Community feature 3 */}
            <div className="w-full sm:w-[300px] bg-default-100 dark:bg-default-100/5 p-6 rounded-xl border border-default-200">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary mx-auto mb-4">
                <svg
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">
                {t("communityFeature3")}
              </h3>
              <p className="text-foreground/70">{t("communityFeature3Desc")}</p>
            </div>
          </div>

          <div className="mt-12">
            <Link
              className={buttonStyles({
                color: "primary",
                radius: "full",
                size: "lg",
              })}
              href={`/${locale}/community`}
            >
              {t("joinCommunity")}
            </Link>
          </div>
        </div>
      </section>

      {/* User testimonials */}
      <section className="w-full max-w-7xl py-20 px-4 mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center">
          {t("testimonials")}
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* User testimonial 1 */}
          <div className="bg-default-50 dark:bg-default-100/5 p-6 rounded-xl border border-default-200 relative">
            <div className="absolute -left-4 top-8 w-16 h-16 bg-default-100 rounded-lg flex items-center justify-center overflow-hidden">
              <div className="w-full h-full bg-default-300 flex items-center justify-center">
                <p className="text-default-600 text-xs">User Avatar 1</p>
              </div>
            </div>
            <div className="ml-10">
              <div className="inline-block bg-primary/10 text-primary text-sm px-3 py-1 rounded-full mb-2">
                {t("testimonial1Title")}
              </div>
              <p className="text-foreground/80 mb-4">
                &quot;{t("testimonial1")}&quot;
              </p>
              <p className="font-bold">{t("testimonial1Name")}</p>
              <p className="text-sm text-foreground/60">
                {t("testimonial1Role")}
              </p>
            </div>
          </div>

          {/* User testimonial 2 */}
          <div className="bg-default-50 dark:bg-default-100/5 p-6 rounded-xl border border-default-200 relative">
            <div className="absolute -left-4 top-8 w-16 h-16 bg-default-100 rounded-lg flex items-center justify-center overflow-hidden">
              <div className="w-full h-full bg-default-300 flex items-center justify-center">
                <p className="text-default-600 text-xs">User Avatar 2</p>
              </div>
            </div>
            <div className="ml-10">
              <div className="inline-block bg-success/10 text-success text-sm px-3 py-1 rounded-full mb-2">
                {t("testimonial2Title")}
              </div>
              <p className="text-foreground/80 mb-4">
                &quot;{t("testimonial2")}&quot;
              </p>
              <p className="font-bold">{t("testimonial2Name")}</p>
              <p className="text-sm text-foreground/60">
                {t("testimonial2Role")}
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 flex flex-wrap justify-center gap-12">
          <div className="text-center">
            <p className="text-4xl font-bold text-primary">1000+</p>
            <p className="text-foreground/60">{t("users")}</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-primary">24+</p>
            <p className="text-foreground/60">{t("projects")}</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-primary">98%</p>
            <p className="text-foreground/60">{t("satisfaction")}</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-primary">2,500+</p>
            <p className="text-foreground/60">{t("hours")}</p>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="w-full bg-gradient-to-b from-background to-primary/20 py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">{t("ready")}</h2>
          <p className="text-foreground/70 mb-8">{t("readyDesc")}</p>
          <Link
            className={buttonStyles({
              color: "primary",
              radius: "full",
              size: "lg",
              variant: "shadow",
            })}
            href={`/${locale}/signup`}
          >
            {t("getStartedCta")}
          </Link>
        </div>
      </section>
    </div>
  );
}
