'use client';

import { useTranslations } from 'next-intl';

export default function PricingPage() {
  const navT = useTranslations('nav');
  const pageT = useTranslations('pages.pricing');
  
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-6">{navT('pricing')}</h1>
      <p className="text-lg">{pageT('content')}</p>
    </div>
  );
} 