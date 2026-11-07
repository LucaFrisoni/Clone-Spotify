// Verifies paging, search escaping and how loaded pages are combined.

import assert from "node:assert/strict";
import { test } from "node:test";
import { escapeLike, fetchSongsPage, mergeSongs, PAGE_SIZE } from "../lib/songQueries.ts";

const song = (id: number) => ({ id: String(id) }) as any;

// Records every query step and answers with fixed data, standing in for the database.
const createClient = (result: { data?: unknown[]; error?: { message: string } }) => {
  const calls: unknown[][] = [];
  const query: any = new Proxy({}, {
    get: (_, method: string) =>
      method === "then"
        ? (done: any) => done({ data: result.data ?? [], error: result.error ?? null })
        : (...args: unknown[]) => (calls.push([method, ...args]), query),
  });
  return { client: { from: () => query } as any, calls };
};

// Page 2 must start right after page 1, or songs would repeat or be skipped.
test("requests the rows of the asked page", async () => {
  const { client, calls } = createClient({ data: [] });

  await fetchSongsPage(client, 2);

  assert.deepEqual(calls.find(([method]) => method === "range"), ["range", 2 * PAGE_SIZE, 3 * PAGE_SIZE - 1]);
});

// Typing "%" must search for that character instead of matching every song.
test("escapes wildcard characters in the search text", async () => {
  const { client, calls } = createClient({ data: [] });

  await fetchSongsPage(client, 0, { title: "100%_hits" });

  assert.deepEqual(calls.find(([method]) => method === "ilike"), ["ilike", "tilte", "%100\\%\\_hits%"]);
  assert.equal(escapeLike("a\\b"), "a\\\\b");
});

// A database failure must surface instead of looking like an empty list.
test("throws when the database answers with an error", async () => {
  const { client } = createClient({ error: { message: "timeout" } });

  await assert.rejects(fetchSongsPage(client, 0), /timeout/);
});

// After a refresh the first page comes back; songs already loaded must stay without repeats.
test("keeps loaded songs after a refreshed first page without duplicating them", () => {
  const merged = mergeSongs([song(9), song(1), song(2)], [song(1), song(2), song(3)]);

  assert.deepEqual(merged.map((item) => item.id), ["9", "1", "2", "3"]);
});

// A momentary network drop must not break the page when a second attempt would work.
test("retries once when the network fails, but not for database errors", async () => {
  const answers = [{ error: { message: "TypeError: fetch failed" } }, { data: [song(1)], error: null }];
  let networkCalls = 0;
  const flaky = { from: () => { const query: any = new Proxy({}, { get: (_, key) => key === "then" ? (done: any) => done(answers[networkCalls++]) : () => query }); return query; } } as any;

  const songs = await fetchSongsPage(flaky, 0);
  assert.equal(networkCalls, 2);
  assert.deepEqual(songs.map((item) => item.id), ["1"]);

  let databaseCalls = 0;
  const broken = { from: () => { const query: any = new Proxy({}, { get: (_, key) => key === "then" ? (done: any) => (databaseCalls++, done({ error: { message: "permission denied" } })) : () => query }); return query; } } as any;
  await assert.rejects(fetchSongsPage(broken, 0), /permission denied/);
  assert.equal(databaseCalls, 1);
});
