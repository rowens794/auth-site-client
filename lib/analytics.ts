declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}

function extractAsinFromUrl(url: string): string | null {
  // Match patterns like /dp/B0CCSTMSQ5 or /gp/product/B0CCSTMSQ5
  const match = url.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})/i);
  return match ? match[1].toUpperCase() : null;
}

export function trackAmazonClick(href: string, pagePath: string) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  const asin = extractAsinFromUrl(href);
  const clickDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  window.gtag("event", "amazon_click", {
    page_path: pagePath,
    asin: asin,
    click_date: clickDate,
    outbound_url: href,
  });
}

export function setupAmazonClickTracking(getCurrentPath: () => string) {
  if (typeof window === "undefined") return () => {};

  const handleClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const anchor = target.closest("a");

    if (!anchor) return;

    const href = anchor.href;
    if (!href || !href.includes("amazon.com")) return;

    trackAmazonClick(href, getCurrentPath());
  };

  document.addEventListener("click", handleClick);

  return () => {
    document.removeEventListener("click", handleClick);
  };
}
