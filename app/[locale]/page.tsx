import { Snippet } from "@heroui/snippet";
import { Code } from "@heroui/code";
import { button as buttonStyles } from "@heroui/theme";
import { Link } from "@heroui/link";
import { Metadata } from "next";
import { getMessages, getTranslations } from '@/i18n/server';
import { Locale } from '@/config/i18n';

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
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
  const t = await getTranslations(validLocale, 'app');
  const nav = await getTranslations(validLocale, 'nav');
  const common = await getTranslations(validLocale, 'common');
  
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-xl text-center justify-center">
        <span className={title({ size: "lg" })}>{t('title')}</span>
        <br />
        <div className={subtitle({ class: "mt-4" })}>
          {t('description')}
        </div>
      </div>

      <div className="flex gap-3">
        <Link
          isExternal
          className={buttonStyles({
            color: "primary",
            radius: "full",
            variant: "shadow",
          })}
          href={siteConfig.links.docs}
        >
          {nav('docs')}
        </Link>
        <Link
          isExternal
          className={buttonStyles({ variant: "bordered", radius: "full" })}
          href={siteConfig.links.github}
        >
          <GithubIcon size={20} />
          {common('github')}
        </Link>
      </div>

      <div className="mt-8">
        <Snippet hideCopyButton hideSymbol variant="bordered">
          <span>
            {t('startEditing')} <Code color="primary">app/[locale]/page.tsx</Code>
          </span>
        </Snippet>
      </div>
    </section>
  );
} 