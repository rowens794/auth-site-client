import { GetStaticProps, GetStaticPaths } from "next";
import { Layout } from "../components/Layout";
import {
  getArticleBySlug,
  getSite,
  Article,
  Site,
  getArticleImages,
  getArticleProducts,
  ArticleImage,
  Product,
  getArticles,
  ProductRole,
  StaticPages,
} from "../lib/db";
import { marked, Renderer } from "marked";

// Configure marked to add IDs to headings
const renderer = new Renderer();
renderer.heading = function ({ text, depth }) {
  const customIdMatch = text.match(/\{#([\w-]+)\}\s*$/);
  let slug: string;
  let cleanText = text;

  if (customIdMatch) {
    slug = customIdMatch[1];
    cleanText = text.replace(/\s*\{#[\w-]+\}\s*$/, "");
  } else {
    slug = text
      .toLowerCase()
      .replace(/<[^>]*>/g, "")
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .trim();
  }
  return `<h${depth} id="${slug}">${cleanText}</h${depth}>`;
};
marked.use({ renderer });

import {
  Calendar,
  Clock,
  ShoppingCart,
  Star,
  CheckCircle2,
  ChevronRight,
  Award,
  DollarSign,
  Crown,
  Medal,
  ArrowLeft,
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import React from "react";

// =============================================================================
// Static Page Slug Mapping
// =============================================================================

const STATIC_PAGE_SLUGS: Record<string, keyof StaticPages> = {
  "affiliate-disclosure": "affiliateDisclosure",
  privacy: "privacy",
  about: "about",
  terms: "terms",
};

// =============================================================================
// Product Badge Helper
// =============================================================================

function getProductRoleBadge(role: ProductRole): {
  label: string;
  icon: React.ReactNode;
  bgColor: string;
} {
  switch (role) {
    case "top-pick":
      return {
        label: "Top Pick",
        icon: <Award className="h-4 w-4" />,
        bgColor: "#10b981",
      };
    case "budget-pick":
      return {
        label: "Budget Pick",
        icon: <DollarSign className="h-4 w-4" />,
        bgColor: "#3b82f6",
      };
    case "premium-pick":
      return {
        label: "Premium Pick",
        icon: <Crown className="h-4 w-4" />,
        bgColor: "#8b5cf6",
      };
    case "runner-up":
      return {
        label: "Runner Up",
        icon: <Medal className="h-4 w-4" />,
        bgColor: "#f59e0b",
      };
    default:
      return {
        label: "Featured",
        icon: <Star className="h-4 w-4" />,
        bgColor: "#6b7280",
      };
  }
}

// =============================================================================
// Types
// =============================================================================

interface StaticPageData {
  title: string;
  content: string;
  lastUpdated: string;
  authorName?: string | null;
  inlineDisclosure?: string | null;
}

interface PageProps {
  site: Site | null;
  // Either an article or a static page
  article?: Article | null;
  images?: ArticleImage[];
  products?: Product[];
  staticPage?: StaticPageData | null;
}

// =============================================================================
// Static Page Component
// =============================================================================

function StaticPageView({
  site,
  page,
}: {
  site: Site | null;
  page: StaticPageData;
}) {
  const primaryColor = site?.branding?.colors?.primary?.hex || "#10b981";
  const headingFont = site?.branding?.typography?.heading || "Inter";

  return (
    <Layout site={site} title={page.title}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-10 group transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>

          <h1
            className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-6"
            style={{ fontFamily: `${headingFont}, sans-serif` }}
          >
            {page.title}
          </h1>

          {/* Inline disclosure callout */}
          {page.inlineDisclosure && (
            <div
              className="mb-10 p-4 rounded-xl border-l-4"
              style={{
                borderColor: primaryColor,
                backgroundColor: `${primaryColor}10`,
              }}
            >
              <p
                className="text-sm font-medium"
                style={{ color: primaryColor }}
              >
                {page.inlineDisclosure}
              </p>
            </div>
          )}

          <div
            className="prose prose-lg prose-emerald dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-primary hover:prose-a:underline prose-h1:hidden"
            style={{ "--tw-prose-links": primaryColor } as React.CSSProperties}
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </div>
      </div>
    </Layout>
  );
}

// =============================================================================
// Article Component
// =============================================================================

function ArticleView({
  site,
  article,
  images,
  products,
}: {
  site: Site | null;
  article: Article;
  images: ArticleImage[];
  products: Product[];
}) {
  const primaryColor = site?.branding?.colors?.primary?.hex || "#10b981";
  const headingFont = site?.branding?.typography?.heading || "Inter";
  const featuredImage =
    images.find(
      (img) => img.imageType === "lifestyle" || img.imageType === "generated"
    ) || images[0];

  return (
    <Layout
      site={site}
      title={article.title}
      description={article.metaDescription || undefined}
    >
      <article
        className="pb-32"
        style={{ "--primary": primaryColor } as React.CSSProperties}
      >
        {/* Article Header */}
        <header className="relative pt-16 pb-10 bg-muted/10 overflow-hidden">
          <div
            className="absolute inset-0 -z-10 opacity-[0.03]"
            style={{ backgroundColor: primaryColor }}
          />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <nav className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-10">
                <Link href="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
                <ChevronRight className="h-3 w-3" />
                <span className="text-foreground truncate opacity-50">
                  {article.title}
                </span>
              </nav>

              <h1
                className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-10 leading-[1.15]"
                style={{ fontFamily: `${headingFont}, sans-serif` }}
              >
                {article.title}
              </h1>

              <div className="flex flex-wrap items-center gap-8 text-sm text-muted-foreground mb-16 border-y border-border/50 py-6">
                <div className="flex items-center gap-3">
                  <div
                    className="h-12 w-12 rounded-full flex items-center justify-center text-white font-black text-lg shadow-lg"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {site?.name?.charAt(0) || "S"}
                  </div>
                  <div>
                    <span className="block font-bold text-foreground leading-none mb-1">
                      {site?.name || "Site"} Editorial
                    </span>
                    <span className="text-xs">Expert Review Team</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {article.publishedAt
                      ? format(new Date(article.publishedAt), "MMMM d, yyyy")
                      : format(new Date(article.createdAt), "MMMM d, yyyy")}
                  </span>
                </div>
                <div
                  className="flex items-center gap-2 font-bold"
                  style={{ color: primaryColor }}
                >
                  <Clock className="h-4 w-4" />
                  <span>8 min read</span>
                </div>
              </div>
            </div>

            {featuredImage && (
              <div className="max-w-5xl mx-auto animate-in fade-in zoom-in duration-1000">
                <div className="rounded-[2rem] overflow-hidden shadow-2xl border border-border bg-muted ring-8 ring-background">
                  <img
                    src={featuredImage.url}
                    alt={featuredImage.altText || article.title}
                    className="w-full object-cover transition-transform duration-700 hover:scale-105"
                    fetchPriority="high"
                    width={1200}
                    height={630}
                  />
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Article Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-24">
          <div className="max-w-4xl mx-auto">
            <div
              className="prose prose-lg prose-emerald dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary hover:prose-a:underline prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-2xl"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Product Recommendations */}
            {products.length > 0 && (
              <div className="mt-32 border-t-4 border-primary/20 pt-24">
                <div className="mb-16">
                  <div
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-4"
                    style={{
                      backgroundColor: `${primaryColor}15`,
                      color: primaryColor,
                    }}
                  >
                    <ShoppingCart className="h-3 w-3" />
                    Buyer&apos;s Guide
                  </div>
                  <h2 className="text-4xl font-extrabold tracking-tight">
                    Our Top Picks for 2026
                  </h2>
                  <p className="text-muted-foreground mt-4 text-lg">
                    We&apos;ve spent hours researching and testing to find the
                    absolute best options currently available.
                  </p>
                </div>

                <div className="space-y-16">
                  {products.map((product) => {
                    const badge = getProductRoleBadge(product.role);
                    return (
                      <div
                        key={product.asin}
                        className="flex flex-col gap-10 bg-card border border-border rounded-[2.5rem] p-10 shadow-2xl shadow-primary/5 hover:shadow-primary/10 transition-all hover:-translate-y-1 relative overflow-hidden group"
                      >
                        <div
                          className="absolute top-0 right-0 px-6 py-2 text-white font-black text-sm rounded-bl-3xl flex items-center gap-2"
                          style={{ backgroundColor: badge.bgColor }}
                        >
                          {badge.icon}
                          {badge.label}
                        </div>

                        <div className="flex flex-col md:flex-row gap-12">
                          <div className="w-full md:w-2/5 aspect-square rounded-3xl overflow-hidden bg-white flex items-center justify-center border border-border/50 p-8 group-hover:bg-primary/5 transition-colors">
                            <img
                              src={product.imageUrl}
                              alt={product.title}
                              className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-110"
                              width={500}
                              height={500}
                              loading="lazy"
                            />
                          </div>
                          <div className="flex-1 flex flex-col justify-center">
                            <div className="flex items-center gap-1.5 text-orange-400 mb-6">
                              {[1, 2, 3, 4, 5].map((i) => (
                                <Star
                                  key={i}
                                  className={`h-5 w-5 ${
                                    i <= Math.floor(product.rating || 5)
                                      ? "fill-current"
                                      : ""
                                  }`}
                                />
                              ))}
                              <span className="ml-2 text-sm font-black text-foreground uppercase tracking-widest">
                                {product.rating?.toFixed(1) || "5.0"} (
                                {product.reviewCount?.toLocaleString() || 0}{" "}
                                reviews)
                              </span>
                            </div>
                            <h3
                              className="text-3xl font-black mb-6 leading-tight group-hover:text-primary transition-colors"
                              style={{
                                fontFamily: `${headingFont}, sans-serif`,
                              }}
                            >
                              {product.title}
                            </h3>

                            {product.features.length > 0 ? (
                              <ul className="space-y-4 mb-10">
                                {product.features
                                  .slice(0, 3)
                                  .map((feature, idx) => (
                                    <li
                                      key={idx}
                                      className="flex items-start gap-3 text-base text-muted-foreground font-medium"
                                    >
                                      <CheckCircle2
                                        className="h-6 w-6 shrink-0 mt-0.5"
                                        style={{ color: primaryColor }}
                                      />
                                      <span className="line-clamp-2">
                                        {feature}
                                      </span>
                                    </li>
                                  ))}
                              </ul>
                            ) : (
                              <ul className="space-y-4 mb-10">
                                <li className="flex items-start gap-3 text-base text-muted-foreground font-medium">
                                  <CheckCircle2
                                    className="h-6 w-6 shrink-0"
                                    style={{ color: primaryColor }}
                                  />
                                  <span>
                                    Top-tier performance in real-world testing
                                  </span>
                                </li>
                                <li className="flex items-start gap-3 text-base text-muted-foreground font-medium">
                                  <CheckCircle2
                                    className="h-6 w-6 shrink-0"
                                    style={{ color: primaryColor }}
                                  />
                                  <span>
                                    Premium materials and exceptional build
                                    quality
                                  </span>
                                </li>
                              </ul>
                            )}

                            <div className="flex flex-col sm:flex-row items-center gap-6">
                              <a
                                href={`${product.affiliateUrl}${
                                  site?.amazonAssociateTag
                                    ? `&tag=${site.amazonAssociateTag}`
                                    : ""
                                }`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full sm:w-fit py-4 px-10 text-xl font-black shadow-primary/20 hover:scale-105 active:scale-95 transition-all text-white rounded-full text-center"
                                style={{ backgroundColor: primaryColor }}
                              >
                                View on Amazon
                              </a>
                              {product.priceAmount && (
                                <span className="text-2xl font-black opacity-40 select-none">
                                  ~${product.priceAmount.toFixed(2)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </article>
    </Layout>
  );
}

// =============================================================================
// Main Page Component
// =============================================================================

export default function SlugPage({
  site,
  article,
  images,
  products,
  staticPage,
}: PageProps) {
  // Render static page if we have one
  if (staticPage) {
    return <StaticPageView site={site} page={staticPage} />;
  }

  // Render article
  if (article) {
    return (
      <ArticleView
        site={site}
        article={article}
        images={images || []}
        products={products || []}
      />
    );
  }

  // Fallback
  return <div>Page not found</div>;
}

// =============================================================================
// Data Fetching
// =============================================================================

export const getStaticPaths: GetStaticPaths = async () => {
  const articles = await getArticles();

  // Article paths
  const articlePaths = articles.map((article) => ({
    params: { slug: article.slug },
  }));

  // Static page paths
  const staticPagePaths = Object.keys(STATIC_PAGE_SLUGS).map((slug) => ({
    params: { slug },
  }));

  return {
    paths: [...articlePaths, ...staticPagePaths],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;

  if (!slug) {
    return { notFound: true };
  }

  const site = await getSite();
  if (!site) {
    return { notFound: true };
  }

  // Check if this is a static page slug
  const staticPageKey = STATIC_PAGE_SLUGS[slug];
  if (staticPageKey && site.staticPages?.[staticPageKey]) {
    const pageData = site.staticPages[staticPageKey];
    const contentHtml = await marked.parse(pageData.content);

    return {
      props: {
        site: JSON.parse(JSON.stringify(site)),
        staticPage: {
          title: pageData.title,
          content: contentHtml,
          lastUpdated: pageData.lastUpdated,
          authorName: pageData.authorName || null,
          inlineDisclosure: pageData.inlineDisclosure || null,
        },
      },
    };
  }

  // Otherwise, try to find an article
  const article = await getArticleBySlug(slug);
  if (!article) {
    return { notFound: true };
  }

  const [images, products] = await Promise.all([
    getArticleImages(article.id),
    getArticleProducts(article.id),
  ]);

  // Parse Markdown to HTML
  let contentHtml = await marked.parse(article.content);

  // Remove leading h1 and first image to avoid duplicating the header hero
  contentHtml = contentHtml.replace(/^\s*<h1[^>]*>.*?<\/h1>\s*/is, "");
  contentHtml = contentHtml.replace(
    /^\s*(<p>\s*)?<img[^>]*>(\s*<\/p>)?\s*/i,
    ""
  );
  contentHtml = contentHtml.replace(
    /^\s*<p>.*?Disclosure.*?affiliate.*?<\/p>\s*/is,
    ""
  );

  return {
    props: {
      site: JSON.parse(JSON.stringify(site)),
      article: JSON.parse(
        JSON.stringify({
          ...article,
          content: contentHtml,
        })
      ),
      images: JSON.parse(JSON.stringify(images)),
      products: JSON.parse(JSON.stringify(products)),
    },
  };
};
