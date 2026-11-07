// Verifies the time labels shown by the player and the song lists.

import assert from "node:assert/strict";
import { test } from "node:test";
import { formatTime } from "../lib/formatTime.ts";

// Seconds must stay two digits, or 3:07 would be displayed as 3:7.
test("pads seconds and rounds partial seconds down", () => {
  assert.equal(formatTime(187.9), "3:07");
});

// Songs over an hour must not wrap around to a small minute count.
test("keeps counting minutes past one hour", () => {
  assert.equal(formatTime(3725), "62:05");
});

// A song without metadata reports NaN or null, which must not reach the screen.
test("shows zero when the length is unknown", () => {
  assert.equal(formatTime(NaN), "0:00");
  assert.equal(formatTime(null), "0:00");
  assert.equal(formatTime(Infinity), "0:00");
});
