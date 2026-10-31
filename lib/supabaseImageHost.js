// Gets the Supabase hostname that next/image must allow from the project URL.

const getSupabaseImageHost = (supabaseUrl) => {
  if (!supabaseUrl) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is required to allow song images");
  }
  return new URL(supabaseUrl).hostname;
};

module.exports = { getSupabaseImageHost };
