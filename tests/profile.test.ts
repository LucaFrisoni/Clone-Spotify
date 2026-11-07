// Verifies which name and photo the profile shows and which usernames are allowed.

import assert from "node:assert/strict";
import { test } from "node:test";
import { resolveProfile, validateUsername } from "../lib/profile.ts";

// New accounts get "Username" from the database, which should not be shown as a real name.
test("ignores the default username and falls back to the account name", () => {
  const profile = resolveProfile({ user_name: "Username" }, { email: "luca@mail.com" });

  assert.equal(profile.name, "luca");
});

// A photo the user uploaded must win over the GitHub picture.
test("prefers the uploaded photo over the GitHub one", () => {
  const user = { user_metadata: { avatar_url: "https://github.com/a.png", user_name: "gh" } };

  const uploaded = resolveProfile({ avatar_url: "image-1" }, user);
  const github = resolveProfile({ avatar_url: null }, user);

  assert.deepEqual([uploaded.avatarPath, uploaded.avatarUrl], ["image-1", null]);
  assert.deepEqual([github.avatarPath, github.avatarUrl], [null, "https://github.com/a.png"]);
});

// Long or symbol-heavy names break the profile layout, so they are refused with a reason.
test("rejects usernames that are too long or have too many symbols", () => {
  assert.equal(validateUsername("TimBrown"), null);
  assert.match(validateUsername("a".repeat(17)) ?? "", /longer than 16/);
  assert.match(validateUsername("a.b.c.d") ?? "", /maximum of 2/);
});
