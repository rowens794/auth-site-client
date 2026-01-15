import React from "react";
import Link from "next/link";
import { Article, Site } from "../lib/db";
import { Clock, Tag, ArrowRight } from "lucide-react";

interface ArticleCardProps {
  article: Article;
  featuredImage?: string;
  site?: Site | null;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  featuredImage,
  site,
}) => {
  const primaryColor = site?.branding?.colors?.primary?.hex || "#10b981";
  const headingFont = site?.branding?.typography?.heading || "Inter";

  return (
    <article
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card transition-all hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2"
      style={{ "--primary": primaryColor } as React.CSSProperties}
    >
      <Link href={`/${article.slug}`} className="absolute inset-0 z-10">
        <span className="sr-only">Read {article.title}</span>
      </Link>

      <div className="aspect-video w-full overflow-hidden bg-muted relative">
        {featuredImage ? (
          <img
            src={featuredImage}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            width={400}
            height={225}
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-primary/10 to-primary/5">
            <Tag className="w-12 h-12 text-primary/20" />
          </div>
        )}
        <div className="absolute top-4 left-4">
          <span
            className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-lg"
            style={{ backgroundColor: primaryColor }}
          >
            {article.articleType}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-8">
        <div className="mb-4 flex items-center space-x-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
          <span className="flex items-center">
            <Clock className="mr-1.5 h-3.5 w-3.5" />5 min read
          </span>
        </div>

        <h3
          className="mb-4 line-clamp-2 text-2xl font-black leading-tight transition-colors group-hover:text-primary"
          style={{ fontFamily: `${headingFont}, sans-serif` }}
        >
          {article.title}
        </h3>

        <p className="mb-8 line-clamp-3 text-sm text-muted-foreground font-medium leading-relaxed flex-grow grow">
          {article.metaDescription ||
            `Our expert guide to ${article.title} covers everything you need to know before making your next purchase.`}
        </p>

        <div
          className="flex items-center text-sm font-black uppercase tracking-widest group-hover:gap-2 transition-all"
          style={{ color: primaryColor }}
        >
          Read Full Guide
          <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </article>
  );
};
