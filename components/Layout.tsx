import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";
import { Menu, X } from "lucide-react";
import { Site } from "../lib/db";

interface LayoutProps {
  children: React.ReactNode;
  site: Site | null;
  title?: string;
  description?: string;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  site,
  title,
  description,
}) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const router = useRouter();

  // Extract branding values with fallbacks
  const primaryColor = site?.branding?.colors?.primary?.hex || "#10b981";
  const secondaryColor = site?.branding?.colors?.secondary?.hex || "#475569";
  const accentColor = site?.branding?.colors?.accent?.hex || "#f59e0b";
  const headingFont = site?.branding?.typography?.heading || "Inter";
  const bodyFont = site?.branding?.typography?.body || "Inter";
  const siteName = site?.name || "Site";
  const iconUrl = site?.branding?.iconUrl;

  // Generate meta title using template if available
  const metaTitle = React.useMemo(() => {
    if (site?.metaTemplates?.titlePattern && title) {
      return site.metaTemplates.titlePattern.replace("{{title}}", title);
    }
    return title ? `${title} | ${siteName}` : siteName;
  }, [site?.metaTemplates?.titlePattern, title, siteName]);

  const metaDesc =
    description ||
    site?.tagline ||
    "Expert reviews and trusted recommendations.";

  const ga4Id = site?.analyticsIds?.ga4;

  return (
    <div
      className="min-h-screen flex flex-col selection:bg-primary selection:text-white"
      style={{
        "--primary": primaryColor,
        "--secondary": secondaryColor,
        "--accent": accentColor,
        fontFamily: `${bodyFont}, sans-serif`,
      } as React.CSSProperties}
    >
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDesc} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Google Fonts for custom typography */}
        {headingFont !== "Inter" && (
          <link
            href={`https://fonts.googleapis.com/css2?family=${headingFont.replace(/ /g, "+")}:wght@400;500;600;700;800;900&display=swap`}
            rel="stylesheet"
          />
        )}
        {bodyFont !== "Inter" && bodyFont !== headingFont && (
          <link
            href={`https://fonts.googleapis.com/css2?family=${bodyFont.replace(/ /g, "+")}:wght@400;500;600;700&display=swap`}
            rel="stylesheet"
          />
        )}
        {/* Google Analytics */}
        {ga4Id && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${ga4Id}');
                `,
              }}
            />
          </>
        )}
      </Head>

      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 rounded-lg overflow-hidden transform group-hover:rotate-12 transition-transform">
                {iconUrl ? (
                  <img
                    src={iconUrl}
                    alt={`${siteName} icon`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {siteName.charAt(0)}
                  </div>
                )}
              </div>
              <span
                className="text-xl font-bold tracking-tighter sm:text-2xl"
                style={{ fontFamily: `${headingFont}, sans-serif` }}
              >
                {siteName}
              </span>
            </Link>

            <nav className="hidden md:flex items-center space-x-8 text-sm">
              <Link
                href="/"
                className={`hover:text-primary transition-colors ${router.pathname === "/" ? "font-bold" : "font-medium"}`}
                style={router.pathname === "/" ? { color: primaryColor } : undefined}
              >
                Home
              </Link>
              <Link
                href="/learn"
                className={`hover:text-primary transition-colors ${router.pathname === "/learn" ? "font-bold" : "font-medium"}`}
                style={router.pathname === "/learn" ? { color: primaryColor } : undefined}
              >
                Learn
              </Link>
              <Link
                href="/reviews"
                className={`hover:text-primary transition-colors ${router.pathname === "/reviews" ? "font-bold" : "font-medium"}`}
                style={router.pathname === "/reviews" ? { color: primaryColor } : undefined}
              >
                Reviews
              </Link>
              {site?.staticPages?.about && (
                <Link
                  href="/about"
                  className={`hover:text-primary transition-colors ${router.pathname === "/about" ? "font-bold" : "font-medium"}`}
                  style={router.pathname === "/about" ? { color: primaryColor } : undefined}
                >
                  About
                </Link>
              )}
            </nav>

            <div className="flex items-center space-x-4">
              <Link
                href="/subscribe"
                className="hidden sm:inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-bold hover:opacity-90 transition-colors"
                style={{ backgroundColor: primaryColor, color: "white" }}
              >
                Subscribe
              </Link>
              <button
                className="md:hidden p-2 rounded-xl bg-muted/50"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden absolute left-0 right-0 top-16 border-b border-border bg-background px-4 py-8 space-y-6 flex flex-col animate-in slide-in-from-top duration-300 shadow-lg z-50">
            <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className={`text-lg hover:text-primary ${router.pathname === "/" ? "font-black" : "font-bold"}`}
              style={router.pathname === "/" ? { color: primaryColor } : undefined}
            >
              Home
            </Link>
            <Link
              href="/learn"
              onClick={() => setIsMenuOpen(false)}
              className={`text-lg hover:text-primary ${router.pathname === "/learn" ? "font-black" : "font-bold"}`}
              style={router.pathname === "/learn" ? { color: primaryColor } : undefined}
            >
              Learn
            </Link>
            <Link
              href="/reviews"
              onClick={() => setIsMenuOpen(false)}
              className={`text-lg hover:text-primary ${router.pathname === "/reviews" ? "font-black" : "font-bold"}`}
              style={router.pathname === "/reviews" ? { color: primaryColor } : undefined}
            >
              Reviews
            </Link>
            {site?.staticPages?.about && (
              <Link
                href="/about"
                onClick={() => setIsMenuOpen(false)}
                className={`text-lg hover:text-primary ${router.pathname === "/about" ? "font-black" : "font-bold"}`}
                style={router.pathname === "/about" ? { color: primaryColor } : undefined}
              >
                About
              </Link>
            )}
            <Link
              href="/subscribe"
              onClick={() => setIsMenuOpen(false)}
              className="w-full py-4 rounded-2xl font-black text-center block hover:opacity-90 transition-colors"
              style={{ backgroundColor: primaryColor, color: "white" }}
            >
              Subscribe Now
            </Link>
          </div>
        )}
      </header>

      <main className="grow">{children}</main>

      <footer className="border-t border-border bg-muted/50 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
            <div className="col-span-1 md:col-span-2">
              <Link
                href="/"
                className="text-3xl font-black tracking-tighter mb-6 inline-block"
                style={{ fontFamily: `${headingFont}, sans-serif` }}
              >
                {siteName}
              </Link>
              <p className="text-muted-foreground text-base max-w-sm mb-8 leading-relaxed font-medium">
                {site?.tagline ||
                  "Curating the best products and insights."}
                <br />
                <br />
                {site?.affiliateDetails?.commonContext && (
                  <span className="text-xs italic opacity-60">
                    {site.affiliateDetails.commonContext}
                  </span>
                )}
              </p>
            </div>
            <div>
              <h3 className="font-black text-xs uppercase tracking-[0.2em] mb-6 text-foreground/50">
                Explore
              </h3>
              <ul className="space-y-4 text-sm text-muted-foreground font-bold">
                <li>
                  <Link
                    href="/"
                    className="hover:text-primary transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/learn"
                    className="hover:text-primary transition-colors"
                  >
                    Learn
                  </Link>
                </li>
                <li>
                  <Link
                    href="/reviews"
                    className="hover:text-primary transition-colors"
                  >
                    Reviews
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-black text-xs uppercase tracking-[0.2em] mb-6 text-foreground/50">
                Legal
              </h3>
              <ul className="space-y-4 text-sm text-muted-foreground font-bold">
                {site?.staticPages?.privacy && (
                  <li>
                    <Link
                      href="/privacy"
                      className="hover:text-primary transition-colors"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                )}
                {site?.staticPages?.terms && (
                  <li>
                    <Link
                      href="/terms"
                      className="hover:text-primary transition-colors"
                    >
                      Terms of Service
                    </Link>
                  </li>
                )}
                {site?.staticPages?.affiliateDisclosure && (
                  <li>
                    <Link
                      href="/affiliate-disclosure"
                      className="hover:text-primary transition-colors"
                    >
                      Affiliate Disclosure
                    </Link>
                  </li>
                )}
                {site?.contactInfo?.email && (
                  <li>
                    <a
                      href={`mailto:${site.contactInfo.email}`}
                      className="hover:text-primary transition-colors"
                    >
                      Contact Us
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>
          <div className="mt-20 pt-10 border-t border-border flex flex-col sm:flex-row justify-between items-center text-xs font-bold text-muted-foreground/50 uppercase tracking-widest">
            <p>
              © {new Date().getFullYear()}{" "}
              {site?.contactInfo?.entityName || siteName}.
            </p>
            <div className="mt-6 sm:mt-0 flex items-center space-x-8">
              <span>{site?.niche ? `Your ${site.niche} experts.` : "Smart shopping starts here."}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
