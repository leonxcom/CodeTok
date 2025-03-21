'use client';

import Script from 'next/script';
import { useEffect } from 'react';

// Google Analytics measurement ID
const GA_MEASUREMENT_ID = 'G-F3VCL87GCP';

export default function GoogleAnalytics() {
  useEffect(() => {
    // 确保window.dataLayer存在
    window.dataLayer = window.dataLayer || [];
    
    // 定义gtag函数
    function gtag(...args: any[]) {
      window.dataLayer.push(arguments);
    }
    
    // 初始化并发送pageview事件
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID);
  }, []);

  return (
    <>
      {/* Google Analytics 脚本 */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `,
        }}
      />
    </>
  );
}

// 添加全局类型声明，使TypeScript认识window.dataLayer
declare global {
  interface Window {
    dataLayer: any[];
  }
} 