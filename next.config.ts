import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  // Live leaderboard rendered at the edge (Cloudflare Workers via OpenNext).
  cacheComponents: false,
  poweredByHeader: false,
  turbopack: {
    rules: {
      "*.css": { loaders: ["@tailwindcss/turbopack"], as: "*.css" },
    },
  },
  // One canonical host: www.crownd.dev → crownd.dev (301), so Google never sees two copies.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.crownd.dev" }],
        destination: "https://crownd.dev/:path*",
        permanent: true,
      },
    ];
  },
  async headers() {
    const prod = process.env.NODE_ENV === "production";
    // Strict CSP in production (dev needs eval/websockets for HMR). 'unsafe-inline' scripts are required by
    // Next's inline RSC payload without a nonce-issuing middleware (not supported on Workers yet).
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://cdn.himetrica.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://himetrica.com https://*.himetrica.com",
      "frame-src 'none'",
      "frame-ancestors 'none'",
      "form-action 'self' https://checkout.stripe.com",
      "base-uri 'self'",
      "object-src 'none'",
      "upgrade-insecure-requests",
    ].join("; ");
    return [
      // Anything not served from the canonical host (workers.dev preview, localhost) stays out of search indexes.
      {
        source: "/:path*",
        missing: [{ type: "host", value: "crownd.dev" }],
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/:path*",
        headers: [
          ...(prod ? [{ key: "Content-Security-Policy", value: csp }] : []),
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "X-DNS-Prefetch-Control", value: "off" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;

// Gives `next dev` the same Cloudflare bindings (local D1) as production.
void initOpenNextCloudflareForDev();
