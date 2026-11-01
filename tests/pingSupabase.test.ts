// Verifies the keep-alive read and that a failing database is reported, not hidden.

import assert from "node:assert/strict";
import { test } from "node:test";
import { pingSupabase } from "../lib/pingSupabase.ts";

const respondWith = (status: number) => async () =>
  new Response("[]", { status });

// Only a real database read counts as activity, so the songs table must be queried.
test("reads one song using the project key", async () => {
  let url = "";
  let headers: Record<string, string> = {};
  const fetcher = async (target: string, options: { headers: Record<string, string> }) => {
    url = target;
    headers = options.headers;
    return new Response("[]");
  };

  await pingSupabase("https://demo.supabase.co", "key", fetcher as typeof fetch);

  assert.equal(url, "https://demo.supabase.co/rest/v1/songs?select=id&limit=1");
  assert.equal(headers.apikey, "key");
});

// A paused or broken project must show up as a failed cron run.
test("fails when Supabase answers with an error", async () => {
  await assert.rejects(
    pingSupabase("https://demo.supabase.co", "key", respondWith(503) as typeof fetch),
    /503/
  );
});
