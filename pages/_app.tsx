import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Script from "next/script";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const ga4Id = pageProps.site?.analyticsIds?.ga4;
  const ga4IdRef = useRef(ga4Id);

  // Keep ref updated
  useEffect(() => {
    ga4IdRef.current = ga4Id;
  }, [ga4Id]);

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      const id = ga4IdRef.current;
      if (!id || typeof window.gtag !== "function") return;

      window.gtag("event", "page_view", {
        page_path: url,
        page_title: document.title,
        send_to: id,
      });
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      {ga4Id && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${ga4Id}', { send_page_view: true });
            `}
          </Script>
        </>
      )}
      <Component {...pageProps} />
    </>
  );
}
