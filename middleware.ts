import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const host = request.headers.get("host") || "";

  // Skip if it's an internal Next.js request or an asset
  if (
    url.pathname.startsWith("/_next") ||
    url.pathname.startsWith("/api") ||
    url.pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Handle local development or explicit site ID in env
  const siteId = process.env.NEXT_PUBLIC_SITE_ID;
  if (siteId) {
    request.headers.set("x-site-id", siteId);
    return NextResponse.next();
  }

  // In a real production environment, we would look up the site ID by host
  // This could involve a cache or a fast KV lookup.
  // For now, we'll pass the host and let the data fetching logic resolve it.
  request.headers.set("x-site-host", host);

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
