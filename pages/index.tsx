import React from "react";
import { GetStaticProps } from "next";
import Link from "next/link";
import { Layout } from "../components/Layout";
import { ArticleCard } from "../components/ArticleCard";
import {
  getArticles,
  getSite,
  Article,
  Site,
  getArticleImages,
} from "../lib/db";
import { Newspaper, Sparkles, TrendingUp } from "lucide-react";

interface HomeProps {
  articles: (Article & { featuredImage?: string })[];
  site: Site | null;
}

export default function Home({ articles, site }: HomeProps) {
  const primaryColor = site?.branding?.colors?.primary?.hex || "#10b981";
  const headingFont = site?.branding?.typography?.heading || "Inter";
  const heroImageUrl = site?.branding?.heroImageUrl;
  const siteName = site?.name || "Site";

  return (
    <Layout site={site}>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Image */}
        {heroImageUrl ? (
          <>
            <div className="absolute inset-0">
              <img
                src={heroImageUrl}
                alt={`${siteName} hero`}
                className="w-full h-full object-cover"
                fetchPriority="high"
                width={1920}
                height={1080}
              />
              {/* Dark overlay for text readability */}
              <div className="absolute inset-0 bg-black/60" />
              {/* Gradient overlay with brand color */}
              <div
                className="absolute inset-0 opacity-40"
                style={{
                  backgroundImage: `linear-gradient(to right, ${primaryColor}, transparent)`,
                }}
              />
            </div>
            <div className="relative py-32 sm:py-40 lg:py-48">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl">
                  <div
                    className="mb-8 flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold w-fit animate-in fade-in slide-in-from-left duration-700 bg-white/10 backdrop-blur-sm"
                    style={{ color: "white" }}
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>{site?.niche || "Curated for Excellence"}</span>
                  </div>
                  <h1
                    className="text-xl font-extrabold tracking-tight sm:text-2xl md:text-4xl lg:text-6xl mb-6 leading-[1.1] text-white"
                    style={{ fontFamily: `${headingFont}, sans-serif` }}
                  >
                    {site?.tagline?.split(".")[0] || "Expert Reviews."} <br />
                    <span style={{ color: primaryColor }}>
                      {site?.tagline?.split(".")[1] ||
                        "Trusted Recommendations."}
                    </span>
                  </h1>
                  <p className="text-lg text-white/80 leading-relaxed mb-10 max-w-xl font-medium">
                    We meticulously test, analyze, and review the latest
                    products in {siteName} so you can buy with absolute
                    confidence.
                  </p>
                  <Link
                    href="/reviews"
                    className="rounded-full px-10 py-4 text-base font-bold text-white shadow-2xl transition-all hover:scale-105 active:scale-95 inline-block"
                    style={{
                      backgroundColor: primaryColor,
                      boxShadow: `0 20px 40px -10px ${primaryColor}40`,
                    }}
                  >
                    Explore Top Picks
                  </Link>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Fallback without hero image */
          <>
            <div
              className="absolute inset-0 -z-10 opacity-10"
              style={{
                backgroundImage: `radial-gradient(45rem 50rem at top, ${primaryColor}, transparent)`,
              }}
            />
            <div className="py-24 sm:py-36">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl">
                  <div
                    className="mb-8 flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold w-fit animate-in fade-in slide-in-from-left duration-700"
                    style={{
                      backgroundColor: `${primaryColor}15`,
                      color: primaryColor,
                    }}
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>{site?.niche || "Curated for Excellence"}</span>
                  </div>
                  <h1
                    className="text-xl font-extrabold tracking-tight sm:text-2xl md:text-4xl lg:text-6xl mb-6 leading-[1.1]"
                    style={{ fontFamily: `${headingFont}, sans-serif` }}
                  >
                    {site?.tagline?.split(".")[0] || "Expert Reviews."} <br />
                    <span style={{ color: primaryColor }}>
                      {site?.tagline?.split(".")[1] ||
                        "Trusted Recommendations."}
                    </span>
                  </h1>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-xl font-medium">
                    We meticulously test, analyze, and review the latest
                    products in {siteName} so you can buy with absolute
                    confidence.
                  </p>
                  <Link
                    href="/reviews"
                    className="rounded-full px-10 py-4 text-base font-bold text-white shadow-2xl transition-all hover:scale-105 active:scale-95 inline-block"
                    style={{
                      backgroundColor: primaryColor,
                      boxShadow: `0 20px 40px -10px ${primaryColor}40`,
                    }}
                  >
                    Explore Top Picks
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </section>

      {/* Latest Articles Grid */}
      <section className="py-24 bg-muted/20 border-t border-border/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 flex items-end justify-between">
            <div>
              <div
                className="flex items-center gap-2 font-bold mb-3 uppercase tracking-widest text-xs"
                style={{ color: primaryColor }}
              >
                <TrendingUp className="h-4 w-4" />
                <span>Trending Now</span>
              </div>
              <h2 className="text-4xl font-extrabold tracking-tight">
                Latest from {site?.name}
              </h2>
            </div>
            <button
              className="hidden sm:block text-sm font-bold hover:underline transition-all"
              style={{ color: primaryColor }}
            >
              View Archive
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {articles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                featuredImage={article.featuredImage}
                site={site}
              />
            ))}
          </div>

          {articles.length === 0 && (
            <div className="text-center py-32 bg-card rounded-3xl border border-dashed border-border">
              <Newspaper className="mx-auto h-16 w-16 text-muted-foreground/30 mb-6" />
              <p className="text-muted-foreground font-medium text-lg">
                Our experts are currently writing amazing content. <br />
                Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  // getSite and getArticles use NEXT_PUBLIC_SITE_ID from env
  const [articles, site] = await Promise.all([getArticles(), getSite()]);

  const articlesWithImages = await Promise.all(
    articles.map(async (article) => {
      const images = await getArticleImages(article.id);
      const featured =
        images.find(
          (img) =>
            img.imageType === "lifestyle" || img.imageType === "generated"
        ) || images[0];
      return {
        ...article,
        featuredImage: featured?.url || null,
      };
    })
  );

  return {
    props: {
      articles: JSON.parse(JSON.stringify(articlesWithImages)),
      site: JSON.parse(JSON.stringify(site)),
    },
  };
};
