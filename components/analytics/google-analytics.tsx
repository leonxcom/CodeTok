"use client";

import Script from "next/script";
import { useEffect } from "react";

// Google Analytics measurement ID
const GA_MEASUREMENT_ID = "G-F3VCL87GCP";

export default function GoogleAnalytics() {
  useEffect(() => {
    // Ensure window.dataLayer exists
    window.dataLayer = window.dataLayer || [];

    // Define gtag function
    function gtag(..._args: any[]) {
      window.dataLayer.push(arguments);
    }

    // Initialize and send pageview event
    gtag("js", new Date());
    gtag("config", GA_MEASUREMENT_ID);
  }, []);

  return (
    <>
      {/* Google Analytics script */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `,
        }}
        id="google-analytics"
        strategy="afterInteractive"
      />
    </>
  );
}

// Add global type declaration for TypeScript
declare global {
  interface Window {
    dataLayer: any[];
  }
}
