import React, { useState } from "react";
import { GetStaticProps } from "next";
import { Layout } from "../components/Layout";
import { getSite, Site } from "../lib/db";
import { Mail, CheckCircle, AlertCircle, Sparkles } from "lucide-react";

interface SubscribeProps {
  site: Site | null;
}

export default function Subscribe({ site }: SubscribeProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const primaryColor = site?.branding?.colors?.primary?.hex || "#10b981";
  const headingFont = site?.branding?.typography?.heading || "Inter";
  const siteName = site?.name || "our newsletter";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
        setErrorMessage(data.error || "Failed to subscribe");
      }
    } catch {
      setStatus("error");
      setErrorMessage("An unexpected error occurred");
    }
  };

  return (
    <Layout site={site} title="Subscribe" description={`Subscribe to ${siteName}`}>
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-12">
              <div
                className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold mb-6"
                style={{
                  backgroundColor: `${primaryColor}15`,
                  color: primaryColor,
                }}
              >
                <Sparkles className="h-4 w-4" />
                <span>Stay Updated</span>
              </div>
              <h1
                className="text-4xl font-extrabold tracking-tight mb-4"
                style={{ fontFamily: `${headingFont}, sans-serif` }}
              >
                Subscribe to {siteName}
              </h1>
              <p className="text-lg text-muted-foreground">
                Get the latest reviews, guides, and recommendations delivered
                straight to your inbox.
              </p>
            </div>

            {status === "success" ? (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-green-800 mb-2">
                  You&apos;re Subscribed!
                </h2>
                <p className="text-green-700">
                  Thank you for subscribing. You&apos;ll hear from us soon.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="mt-6 text-sm font-bold hover:underline"
                  style={{ color: primaryColor }}
                >
                  Subscribe another email
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {status === "error" && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <p className="text-red-700 text-sm">{errorMessage}</p>
                  </div>
                )}

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-bold mb-2"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-4 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 transition-shadow text-lg"
                      style={{ "--tw-ring-color": primaryColor } as React.CSSProperties}
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full flex items-center justify-center gap-2 rounded-xl px-6 py-4 text-base font-bold text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: primaryColor }}
                >
                  {status === "loading" ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Subscribing...
                    </>
                  ) : (
                    <>
                      <Mail className="w-5 h-5" />
                      Subscribe
                    </>
                  )}
                </button>

                <p className="text-xs text-muted-foreground text-center">
                  We respect your privacy. Unsubscribe at any time.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const site = await getSite();

  return {
    props: {
      site: JSON.parse(JSON.stringify(site)),
    },
    revalidate: 60,
  };
};
