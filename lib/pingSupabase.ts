// Runs a small database read so Supabase sees activity and does not pause the project.

export const pingSupabase = async (
  supabaseUrl: string,
  anonKey: string,
  fetcher: typeof fetch = fetch
) => {
  const response = await fetcher(`${supabaseUrl}/rest/v1/songs?select=id&limit=1`, {
    headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Supabase responded with ${response.status}`);
  }
};
