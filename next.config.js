const { getSupabaseImageHost } = require("./lib/supabaseImageHost");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    minimumCacheTTL: 2592000,
    domains: [
      getSupabaseImageHost(process.env.NEXT_PUBLIC_SUPABASE_URL),
      "avatars.githubusercontent.com",
    ],
  },
};

module.exports = nextConfig;
