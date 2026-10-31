// Verifies the safety rules used to restore Storage files after a recovery.

import assert from "node:assert/strict";
import { test } from "node:test";
import {
  detectMimeType,
  parseObjectManifest,
  planUploads,
} from "../scripts/storageManifest.mjs";

const objectRow = (bucket: string, name: string, size: number) =>
  ["id", bucket, name, "", "", "", "", `{"size": ${size}}`, "", ""].join("\t");

const dump = [
  "COPY storage.objects (id, bucket_id, name) FROM stdin;",
  objectRow("songs", "song-Crazy -abc", 10),
  objectRow("images", ".emptyFolderPlaceholder", 0),
  "\\.",
].join("\n");

// Names with spaces must survive, and empty placeholders are not real files.
test("manifest keeps exact names and ignores empty placeholders", () => {
  assert.deepEqual(parseObjectManifest(dump), [
    { bucket: "songs", name: "song-Crazy -abc", size: 10 },
  ]);
});

// A dump without Storage data must fail instead of looking like an empty library.
test("manifest rejects a dump without storage objects", () => {
  assert.throws(() => parseObjectManifest("SELECT 1;"), /storage\.objects/);
});

// Existing files must never be uploaded twice or replaced.
test("plan skips files that already exist in the project", () => {
  const object = { bucket: "songs", name: "a", size: 10 };
  const plan = planUploads([object], new Map([["songs/a", 10]]), new Set(["songs/a"]));
  assert.deepEqual(plan.present, [object]);
  assert.deepEqual(plan.upload, []);
});

// A file with another size is not the original and must not be restored.
test("plan refuses local files whose size differs from the dump", () => {
  const object = { bucket: "songs", name: "a", size: 10 };
  const plan = planUploads([object], new Map([["songs/a", 9]]), new Set());
  assert.deepEqual(plan.sizeMismatch, [object]);
});

// Lost files must be reported so nothing is silently left out.
test("plan reports files absent from the download", () => {
  const object = { bucket: "songs", name: "a", size: 10 };
  const plan = planUploads([object], new Map(), new Set());
  assert.deepEqual(plan.missing, [object]);
});

// Stored names have no extension and the songs bucket only accepts audio/mpeg.
test("detects the file type from its content", () => {
  assert.equal(detectMimeType(Buffer.from("ID3abcdefghij")), "audio/mpeg");
  assert.equal(detectMimeType(Buffer.from([0xff, 0xfb, 0, 0])), "audio/mpeg");
  assert.equal(detectMimeType(Buffer.from([0xff, 0xd8, 0xff])), "image/jpeg");
});
