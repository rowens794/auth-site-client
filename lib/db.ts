import { client } from "./libsql";

// Validate SITE_ID is provided
function validateSiteId(): string {
  const siteId = process.env.NEXT_PUBLIC_SITE_ID;
  if (!siteId) {
    throw new Error(
      "NEXT_PUBLIC_SITE_ID environment variable is required. " +
        "Please set it to the ID of the site you want to display."
    );
  }
  return siteId;
}

export function getSiteId(): string {
  return validateSiteId();
}

// ============================================================================
// Branding Types
// ============================================================================

export interface ColorValue {
  name: string;
  hex: string;
}

export interface BrandingColors {
  primary: ColorValue;
  secondary: ColorValue;
  accent: ColorValue;
}

export interface BrandingTypography {
  heading: string;
  body: string;
}

export interface Branding {
  logoDescription?: string;
  faviconDescription?: string;
  colors: BrandingColors;
  typography: BrandingTypography;
  heroImageUrl?: string;
  iconUrl?: string;
}

// ============================================================================
// Site Metadata Types
// ============================================================================

export interface MetaTemplates {
  titlePattern: string;
  descriptionPattern: string;
}

export interface ToneVoice {
  formality: string;
  personality: string[];
  audience: string;
  examplePhrases: string[];
}

export interface AffiliateDetails {
  networkNames: string[];
  commonContext: string;
}

export interface LegalDetails {
  privacyPolicyHighlights: string[];
  tosHighlights: string[];
}

export interface ContactInfo {
  entityName: string;
  email: string;
}

export interface AnalyticsIds {
  ga4?: string;
}

// ============================================================================
// Static Pages Types
// ============================================================================

export interface StaticPage {
  slug: string;
  title: string;
  content: string;
  lastUpdated: string;
  inlineDisclosure?: string;
  authorName?: string;
}

export interface StaticPages {
  affiliateDisclosure?: StaticPage;
  privacy?: StaticPage;
  about?: StaticPage;
  terms?: StaticPage;
}

// ============================================================================
// Main Entity Types
// ============================================================================

export interface Site {
  id: string;
  name: string;
  tagline: string | null;
  domain: string | null;
  niche: string | null;
  categories: string[];
  amazonAssociateTag: string | null;
  branding: Branding;
  metaTemplates: MetaTemplates | null;
  toneVoice: ToneVoice | null;
  affiliateDetails: AffiliateDetails | null;
  legalDetails: LegalDetails | null;
  contactInfo: ContactInfo | null;
  analyticsIds: AnalyticsIds | null;
  staticPages: StaticPages | null;
}

export interface Article {
  id: string;
  siteId: string;
  title: string;
  slug: string;
  content: string;
  status: string;
  articleType: string;
  metaDescription: string | null;
  targetKeyword: string | null;
  wordCount: number | null;
  publishedAt: number | null;
  createdAt: number;
}

export type ProductRole =
  | "top-pick"
  | "budget-pick"
  | "premium-pick"
  | "runner-up"
  | "mentioned";

export interface Product {
  asin: string;
  title: string;
  description: string | null;
  features: string[];
  imageUrl: string;
  affiliateUrl: string;
  rating: number | null;
  reviewCount: number | null;
  priceAmount: number | null;
  priceCurrency: string | null;
  role: ProductRole;
  displayOrder: number;
}

export interface ArticleImage {
  articleId: string;
  imageType: "product" | "generated" | "lifestyle";
  url: string;
  altText: string;
  caption: string | null;
  position: number;
}

// ============================================================================
// Default Values
// ============================================================================

const DEFAULT_BRANDING: Branding = {
  colors: {
    primary: { name: "emerald-500", hex: "#10b981" },
    secondary: { name: "slate-600", hex: "#475569" },
    accent: { name: "amber-500", hex: "#f59e0b" },
  },
  typography: {
    heading: "Inter",
    body: "Inter",
  },
};

// ============================================================================
// JSON Parsing Helpers
// ============================================================================

function parseJson<T>(value: unknown, fallback: T): T {
  if (!value) return fallback;
  if (typeof value === "object") return value as T;
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }
  return fallback;
}

function parseJsonArray<T>(value: unknown): T[] {
  if (!value) return [];
  if (Array.isArray(value)) return value as T[];
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

// ============================================================================
// Database Row Types (raw from DB)
// ============================================================================

interface SiteRow {
  id: string;
  name: string;
  tagline: string | null;
  domain: string | null;
  niche: string | null;
  categories: string | null;
  amazonAssociateTag: string | null;
  branding: string | null;
  metaTemplates: string | null;
  toneVoice: string | null;
  affiliateDetails: string | null;
  legalDetails: string | null;
  contactInfo: string | null;
  analyticsIds: string | null;
  staticPages: string | null;
}

interface ArticleImageRow {
  articleId: string;
  imageType: string;
  url: string;
  altText: string | null;
  caption: string | null;
  position: number | null;
}

interface ProductRow {
  asin: string;
  title: string;
  description: string | null;
  features: string | null;
  imageUrl: string | null;
  affiliateUrl: string;
  rating: number | null;
  reviewCount: number | null;
  priceAmount: number | null;
  priceCurrency: string | null;
  role: string | null;
  displayOrder: number | null;
}

// ============================================================================
// Transform Functions
// ============================================================================

function transformSiteRow(row: SiteRow): Site {
  return {
    id: row.id,
    name: row.name,
    tagline: row.tagline,
    domain: row.domain,
    niche: row.niche,
    categories: parseJsonArray<string>(row.categories),
    amazonAssociateTag: row.amazonAssociateTag,
    branding: parseJson<Branding>(row.branding, DEFAULT_BRANDING),
    metaTemplates: parseJson<MetaTemplates | null>(row.metaTemplates, null),
    toneVoice: parseJson<ToneVoice | null>(row.toneVoice, null),
    affiliateDetails: parseJson<AffiliateDetails | null>(row.affiliateDetails, null),
    legalDetails: parseJson<LegalDetails | null>(row.legalDetails, null),
    contactInfo: parseJson<ContactInfo | null>(row.contactInfo, null),
    analyticsIds: parseJson<AnalyticsIds | null>(row.analyticsIds, null),
    staticPages: parseJson<StaticPages | null>(row.staticPages, null),
  };
}

function transformArticleImageRow(row: ArticleImageRow): ArticleImage {
  return {
    articleId: row.articleId,
    imageType: (row.imageType as ArticleImage["imageType"]) || "product",
    url: row.url,
    altText: row.altText || "",
    caption: row.caption,
    position: row.position ?? 0,
  };
}

function transformProductRow(row: ProductRow): Product {
  return {
    asin: row.asin,
    title: row.title,
    description: row.description,
    features: parseJsonArray<string>(row.features),
    imageUrl: row.imageUrl || "",
    affiliateUrl: row.affiliateUrl,
    rating: row.rating,
    reviewCount: row.reviewCount,
    priceAmount: row.priceAmount,
    priceCurrency: row.priceCurrency,
    role: (row.role as ProductRole) || "mentioned",
    displayOrder: row.displayOrder ?? 0,
  };
}

// ============================================================================
// Database Query Functions
// ============================================================================

export async function getSite(siteId?: string): Promise<Site | null> {
  const targetSiteId = siteId || getSiteId();

  const result = await client.execute({
    sql: `SELECT
      id, name, tagline, domain, niche, categories,
      amazon_associate_tag as amazonAssociateTag,
      branding, meta_templates as metaTemplates,
      tone_voice as toneVoice, affiliate_details as affiliateDetails,
      legal_details as legalDetails, contact_info as contactInfo,
      analytics_ids as analyticsIds, static_pages as staticPages
    FROM sites WHERE id = ?`,
    args: [targetSiteId],
  });

  const row = result.rows[0] as unknown as SiteRow | undefined;
  return row ? transformSiteRow(row) : null;
}

export async function getSiteByDomain(domain: string): Promise<Site | null> {
  const result = await client.execute({
    sql: `SELECT
      id, name, tagline, domain, niche, categories,
      amazon_associate_tag as amazonAssociateTag,
      branding, meta_templates as metaTemplates,
      tone_voice as toneVoice, affiliate_details as affiliateDetails,
      legal_details as legalDetails, contact_info as contactInfo,
      analytics_ids as analyticsIds, static_pages as staticPages
    FROM sites WHERE domain = ?`,
    args: [domain],
  });

  const row = result.rows[0] as unknown as SiteRow | undefined;
  return row ? transformSiteRow(row) : null;
}

export async function getArticles(siteId?: string): Promise<Article[]> {
  const targetSiteId = siteId || getSiteId();

  // Try published first
  let result = await client.execute({
    sql: `SELECT
      id, site_id as siteId, title, slug, content, status,
      article_type as articleType, meta_description as metaDescription,
      target_keyword as targetKeyword, word_count as wordCount,
      published_at as publishedAt, created_at as createdAt
    FROM articles
    WHERE site_id = ? AND status = 'published'
    ORDER BY published_at DESC, created_at DESC`,
    args: [targetSiteId],
  });

  // If no published articles, fall back to drafts in development
  if (result.rows.length === 0) {
    result = await client.execute({
      sql: `SELECT
        id, site_id as siteId, title, slug, content, status,
        article_type as articleType, meta_description as metaDescription,
        target_keyword as targetKeyword, word_count as wordCount,
        published_at as publishedAt, created_at as createdAt
      FROM articles
      WHERE site_id = ?
      ORDER BY created_at DESC`,
      args: [targetSiteId],
    });
  }

  return result.rows as unknown as Article[];
}

export async function getArticlesByTypes(
  types: string[],
  siteId?: string
): Promise<Article[]> {
  const targetSiteId = siteId || getSiteId();
  const placeholders = types.map(() => "?").join(", ");

  let result = await client.execute({
    sql: `SELECT
      id, site_id as siteId, title, slug, content, status,
      article_type as articleType, meta_description as metaDescription,
      target_keyword as targetKeyword, word_count as wordCount,
      published_at as publishedAt, created_at as createdAt
    FROM articles
    WHERE site_id = ? AND status = 'published' AND article_type IN (${placeholders})
    ORDER BY published_at DESC, created_at DESC`,
    args: [targetSiteId, ...types],
  });

  if (result.rows.length === 0) {
    result = await client.execute({
      sql: `SELECT
        id, site_id as siteId, title, slug, content, status,
        article_type as articleType, meta_description as metaDescription,
        target_keyword as targetKeyword, word_count as wordCount,
        published_at as publishedAt, created_at as createdAt
      FROM articles
      WHERE site_id = ? AND article_type IN (${placeholders})
      ORDER BY created_at DESC`,
      args: [targetSiteId, ...types],
    });
  }

  return result.rows as unknown as Article[];
}

export async function getArticleBySlug(
  slug: string,
  siteId?: string
): Promise<Article | null> {
  const targetSiteId = siteId || getSiteId();

  // Try published first
  let result = await client.execute({
    sql: `SELECT
      id, site_id as siteId, title, slug, content, status,
      article_type as articleType, meta_description as metaDescription,
      target_keyword as targetKeyword, word_count as wordCount,
      published_at as publishedAt, created_at as createdAt
    FROM articles
    WHERE site_id = ? AND slug = ? AND status = 'published'`,
    args: [targetSiteId, slug],
  });

  // If no published article found, try any status (drafts)
  if (result.rows.length === 0) {
    result = await client.execute({
      sql: `SELECT
        id, site_id as siteId, title, slug, content, status,
        article_type as articleType, meta_description as metaDescription,
        target_keyword as targetKeyword, word_count as wordCount,
        published_at as publishedAt, created_at as createdAt
      FROM articles
      WHERE site_id = ? AND slug = ?`,
      args: [targetSiteId, slug],
    });
  }

  return (result.rows[0] as unknown as Article) || null;
}

export async function getArticleImages(
  articleId: string
): Promise<ArticleImage[]> {
  const result = await client.execute({
    sql: `SELECT
      article_id as articleId, image_type as imageType,
      r2_url as url, alt_text as altText, caption, position
    FROM article_images
    WHERE article_id = ?
    ORDER BY position ASC`,
    args: [articleId],
  });

  return (result.rows as unknown as ArticleImageRow[]).map(transformArticleImageRow);
}

export async function getArticleProducts(
  articleId: string
): Promise<Product[]> {
  try {
    const result = await client.execute({
      sql: `SELECT
        p.asin, p.title, p.description, p.features,
        p.image_url as imageUrl, p.affiliate_url as affiliateUrl,
        p.rating, p.review_count as reviewCount,
        p.price_amount as priceAmount, p.price_currency as priceCurrency,
        ap.role, ap.display_order as displayOrder
      FROM products p
      JOIN article_products ap ON p.id = ap.product_id
      WHERE ap.article_id = ?
      ORDER BY ap.display_order ASC`,
      args: [articleId],
    });

    return (result.rows as unknown as ProductRow[]).map(transformProductRow);
  } catch (e) {
    console.error("Error fetching products:", e);
    return [];
  }
}

// ============================================================================
// Contact Messages
// ============================================================================

export interface ContactMessage {
  id?: string;
  siteId: string;
  name: string;
  email: string;
  message: string;
  createdAt?: number;
}

export async function saveContactMessage(
  message: Omit<ContactMessage, "id" | "createdAt">
): Promise<{ success: boolean; error?: string }> {
  try {
    const id = crypto.randomUUID();
    const createdAt = Date.now();

    await client.execute({
      sql: `INSERT INTO contact_messages (id, site_id, name, email, message, created_at)
            VALUES (?, ?, ?, ?, ?, ?)`,
      args: [id, message.siteId, message.name, message.email, message.message, createdAt],
    });

    return { success: true };
  } catch (e) {
    console.error("Error saving contact message:", e);
    return { success: false, error: "Failed to save message" };
  }
}

// ============================================================================
// Email Subscriptions
// ============================================================================

export interface EmailSubscription {
  id?: string;
  siteId: string;
  email: string;
  createdAt?: number;
}

export async function saveEmailSubscription(
  subscription: Omit<EmailSubscription, "id" | "createdAt">
): Promise<{ success: boolean; error?: string }> {
  try {
    const id = crypto.randomUUID();
    const createdAt = Date.now();

    await client.execute({
      sql: `INSERT INTO email_subscriptions (id, site_id, email, created_at)
            VALUES (?, ?, ?, ?)`,
      args: [id, subscription.siteId, subscription.email, createdAt],
    });

    return { success: true };
  } catch (e: unknown) {
    console.error("Error saving email subscription:", e);
    // Check for unique constraint violation (already subscribed)
    if (e instanceof Error && e.message?.includes("UNIQUE constraint failed")) {
      return { success: false, error: "This email is already subscribed" };
    }
    return { success: false, error: "Failed to save subscription" };
  }
}
