// Verifies which Deezer tracks are offered and which files the server agrees to download.

import assert from "node:assert/strict";
import { test } from "node:test";
import { getTrackAssets, isDeezerAsset, isTrackId, searchTracks } from "../lib/deezer.ts";

const track = (overrides: Record<string, unknown> = {}) => ({
  id: 7,
  title: "Snow",
  artist: { name: "Red Hot Chili Peppers" },
  preview: "https://cdnt-preview.dzcdn.net/snow.mp3",
  album: { cover_medium: "https://cdn-images.dzcdn.net/m.jpg", cover_xl: "https://cdn-images.dzcdn.net/xl.jpg" },
  ...overrides,
});

const answer = (body: unknown) => (async () => new Response(JSON.stringify(body))) as typeof fetch;

// Tracks without a preview cannot be played, so they must not appear as options.
test("offers only tracks that have a preview", async () => {
  const fetcher = answer({ data: [track(), track({ id: 8, preview: "" })] });

  const results = await searchTracks("snow", fetcher);

  assert.deepEqual(results.map((result) => result.id), ["7"]);
  assert.equal(results[0].artist, "Red Hot Chili Peppers");
});

// The server downloads these files, so any host outside Deezer's CDN is refused.
test("accepts only https files from Deezer's CDN", () => {
  assert.equal(isDeezerAsset("https://cdnt-preview.dzcdn.net/a.mp3"), true);
  assert.equal(isDeezerAsset("http://cdnt-preview.dzcdn.net/a.mp3"), false);
  assert.equal(isDeezerAsset("https://dzcdn.net.evil.com/a.mp3"), false);
  assert.equal(isDeezerAsset("not a url"), false);
});

// A tampered track pointing somewhere else must be rejected before anything is downloaded.
test("refuses a track whose preview is hosted elsewhere", async () => {
  const fetcher = answer(track({ preview: "https://internal.example/secret.mp3" }));

  await assert.rejects(getTrackAssets("7", fetcher), /no preview/);
});

// Deezer reports errors inside a 200 response, which must still count as a failure.
test("treats an error body from Deezer as a failure", async () => {
  const fetcher = answer({ error: { message: "Quota limit exceeded" } });

  await assert.rejects(searchTracks("snow", fetcher), /Quota limit exceeded/);
});

// Ids reach the server from the browser, so only plain digits may be used in the URL.
test("accepts only numeric track ids", () => {
  assert.equal(isTrackId("106506512"), true);
  assert.equal(isTrackId("1/../../user"), false);
  assert.equal(isTrackId(106506512), false);
});
