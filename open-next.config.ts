import { defineCloudflareConfig } from "@opennextjs/cloudflare";

/**
 * Pages with data are rendered at the edge on every request (always-live leaderboard),
 * so no incremental cache / queue / tag cache is needed. Static pages ship as assets.
 */
export default defineCloudflareConfig({});
