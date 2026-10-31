// Verifies that allowed image hosts always follow the configured Supabase project.

import assert from "node:assert/strict";
import { test } from "node:test";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { getSupabaseImageHost } = require("../lib/supabaseImageHost.js");

// Regression: production allowed an old host, so a new project would break every cover.
test("uses the hostname of the configured project", () => {
  const url = "https://example-project.supabase.co";
  assert.equal(getSupabaseImageHost(url), "example-project.supabase.co");
});

// A missing variable must stop the build instead of shipping broken images.
test("fails with a clear message when the URL is missing", () => {
  assert.throws(() => getSupabaseImageHost(undefined), /NEXT_PUBLIC_SUPABASE_URL/);
});
