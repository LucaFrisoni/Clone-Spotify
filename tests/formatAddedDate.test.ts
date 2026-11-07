// Verifies the "Date added" labels of the Liked Songs list.

import assert from "node:assert/strict";
import { test } from "node:test";
import { formatAddedDate } from "../lib/formatAddedDate.ts";

const NOW = new Date("2026-11-07T12:00:00Z");

// Recent likes read better as relative time, with correct singular and plural.
test("shows recent likes as relative time", () => {
  assert.equal(formatAddedDate("2026-11-07T08:00:00Z", NOW), "Today");
  assert.equal(formatAddedDate("2026-11-06T10:00:00Z", NOW), "1 day ago");
  assert.equal(formatAddedDate("2026-11-02T12:00:00Z", NOW), "5 days ago");
  assert.equal(formatAddedDate("2026-10-24T12:00:00Z", NOW), "2 weeks ago");
});

// Likes older than a month show the full date, so the year is not lost.
test("shows the full date for likes older than a month", () => {
  assert.equal(formatAddedDate("2023-07-21T15:38:19Z", NOW), "Jul 21, 2023");
});

// Songs from other lists have no like date and must leave the column empty.
test("returns an empty label when there is no date", () => {
  assert.equal(formatAddedDate(undefined, NOW), "");
  assert.equal(formatAddedDate("not a date", NOW), "");
});
