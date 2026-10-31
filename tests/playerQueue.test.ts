// Verifies how the player picks the next song in normal and random mode.

import assert from "node:assert/strict";
import { test } from "node:test";
import { getNextId, getPreviousId, pickRandomId } from "../lib/playerQueue.ts";

// The queue must loop so playback does not stop at the last song.
test("next song wraps to the first after the last", () => {
  assert.equal(getNextId(["a", "b"], "b"), "a");
});

// Going back from the first song must land on the last one, not undefined.
test("previous song wraps to the last before the first", () => {
  assert.equal(getPreviousId(["a", "b", "c"], "a"), "c");
});

// Regression: an exhausted queue returned undefined and the player disappeared.
test("random mode restarts with a valid song when all were played", () => {
  const { id, history } = pickRandomId(["a", "b"], ["a", "b"], "b", () => 0);
  assert.equal(id, "a");
  assert.deepEqual(history, ["a"]);
});

// With a single song there is nothing else to pick, so it must not return undefined.
test("random mode keeps the only song playing in a one song queue", () => {
  assert.equal(pickRandomId(["a"], ["a"], "a").id, "a");
});

// Songs already played in this round must not come up again.
test("random mode skips songs already played", () => {
  const { id } = pickRandomId(["a", "b", "c"], ["a", "b"], "b", () => 0.99);
  assert.equal(id, "c");
});

// The stored history is kept small so it cannot grow forever in localStorage.
test("random history keeps only the last ten songs", () => {
  const ids = Array.from({ length: 12 }, (_, index) => `${index}`);
  const { history } = pickRandomId(ids, ids.slice(0, 10), "9", () => 0);
  assert.equal(history.length, 10);
  assert.equal(history[9], "10");
});
