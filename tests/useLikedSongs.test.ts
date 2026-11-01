// Verifies likes update instantly, stay correct on failure and use a single query.

import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";
import useLikedSongs from "../hooks/zustand/useLikedSongs.ts";

interface FakeOptions {
  likedRows?: { song_id: number }[];
  error?: { message: string };
}

// Stands in for the remote database, counting reads and holding writes until released.
const createClient = ({ likedRows = [], error }: FakeOptions = {}) => {
  const calls = { reads: 0, inserts: 0, deletes: 0 };
  let release = () => {};
  const held = new Promise<void>((resolve) => (release = resolve));
  const write = async () => {
    await held;
    return { error: error ?? null };
  };
  const chain = (result: () => Promise<unknown>) => {
    const query: any = { eq: () => query, then: (done: any, fail: any) => result().then(done, fail) };
    return query;
  };
  const client: any = {
    from: () => ({
      select: () => {
        calls.reads += 1;
        return chain(async () => ({ data: likedRows, error: error ?? null }));
      },
      insert: () => (calls.inserts += 1, chain(write)),
      delete: () => (calls.deletes += 1, chain(write)),
    }),
  };
  return { client, calls, release: () => release() };
};

const store = useLikedSongs.getState;
const isLiked = (id: string) => store().ids.has(id);

beforeEach(() => useLikedSongs.setState({ userId: undefined, ids: new Set() }));

// A list of 22 songs must not trigger 22 queries, one per like button.
test("loads the likes only once for the same user", async () => {
  const { client, calls } = createClient({ likedRows: [{ song_id: 7 }] });

  await Promise.all([store().load(client, "user"), store().load(client, "user")]);

  assert.equal(calls.reads, 1);
  assert.ok(isLiked("7"));
});

// The heart must react on click, before the database answers.
test("marks the song as liked before the write finishes", async () => {
  const { client, release } = createClient();

  const toggling = store().toggle(client, "user", "7");
  assert.ok(isLiked("7"));

  release();
  await toggling;
  assert.ok(isLiked("7"));
});

// A failed write must not leave the heart showing something the database lacks.
test("reverts the like and reports the error when the write fails", async () => {
  const { client, release } = createClient({ error: { message: "offline" } });

  const toggling = store().toggle(client, "user", "7");
  release();

  await assert.rejects(toggling, { message: "offline" });
  assert.equal(isLiked("7"), false);
});

// Double clicks must not send a like and an unlike that race each other.
test("ignores a second click while the first write is running", async () => {
  const { client, calls, release } = createClient();

  const first = store().toggle(client, "user", "7");
  await store().toggle(client, "user", "7");
  release();
  await first;

  assert.equal(calls.inserts, 1);
  assert.equal(calls.deletes, 0);
  assert.ok(isLiked("7"));
});
