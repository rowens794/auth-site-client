import Link from "next/link";
import { GetStaticProps } from "next";
import { Layout } from "../components/Layout";
import { getSite, Site } from "../lib/db";
import { Home, ArrowLeft, Search } from "lucide-react";

interface NotFoundProps {
  site: Site | null;
}

export default function NotFound({ site }: NotFoundProps) {
  const primaryColor = site?.branding?.colors?.primary?.hex || "#10b981";
  const headingFont = site?.branding?.typography?.heading || "Inter";

  return (
    <Layout site={site} title="Page Not Found">
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-lg">
          <div
            className="text-8xl font-black mb-6"
            style={{ color: primaryColor, fontFamily: `${headingFont}, sans-serif` }}
          >
            404
          </div>
          <h1
            className="text-3xl font-bold mb-4"
            style={{ fontFamily: `${headingFont}, sans-serif` }}
          >
            Page Not Found
          </h1>
          <p className="text-muted-foreground mb-10 text-lg">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. It may have
            been moved or no longer exists.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-bold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: primaryColor }}
            >
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
            <Link
              href="/reviews"
              className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-bold border border-border bg-background hover:bg-muted transition-colors"
            >
              <Search className="h-4 w-4" />
              Browse Reviews
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const site = await getSite();

  return {
    props: {
      site: JSON.parse(JSON.stringify(site)),
    },
  };
};
