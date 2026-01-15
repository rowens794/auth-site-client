import React from "react";
import { GetStaticProps } from "next";
import { Layout } from "../components/Layout";
import { ArticleCard } from "../components/ArticleCard";
import {
  getArticlesByTypes,
  getSite,
  getArticleImages,
  Article,
  Site,
} from "../lib/db";
import { Star, Package } from "lucide-react";

interface ReviewsProps {
  articles: (Article & { featuredImage?: string })[];
  site: Site | null;
}

export default function Reviews({ articles, site }: ReviewsProps) {
  const primaryColor = site?.branding?.colors?.primary?.hex || "#10b981";
  const headingFont = site?.branding?.typography?.heading || "Inter";

  return (
    <Layout
      site={site}
      title="Reviews"
      description="Expert product reviews and recommendations"
    >
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <div
              className="flex items-center gap-2 font-bold mb-3 uppercase tracking-widest text-xs"
              style={{ color: primaryColor }}
            >
              <Star className="h-4 w-4" />
              <span>Expert Reviews</span>
            </div>
            <h1
              className="text-4xl font-extrabold tracking-tight mb-4"
              style={{ fontFamily: `${headingFont}, sans-serif` }}
            >
              Product Reviews
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Comprehensive product reviews and comparisons to help you make
              informed purchasing decisions.
            </p>
          </div>

          {articles.length > 0 ? (
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
          ) : (
            <div className="text-center py-32 bg-card rounded-3xl border border-dashed border-border">
              <Package className="mx-auto h-16 w-16 text-muted-foreground/30 mb-6" />
              <p className="text-muted-foreground font-medium text-lg">
                Product reviews coming soon. <br />
                Our experts are testing and reviewing!
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const [articles, site] = await Promise.all([
    getArticlesByTypes(["product", "review", "comparison"]),
    getSite(),
  ]);

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
