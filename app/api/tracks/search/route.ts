// Searches Deezer's catalog so songs can be added without uploading files.

import { NextResponse } from "next/server";
import { searchTracks } from "@/lib/deezer";

export const dynamic = "force-dynamic";

const MIN_QUERY_LENGTH = 2;
const MAX_QUERY_LENGTH = 100;

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  if (query.length < MIN_QUERY_LENGTH) {
    return NextResponse.json({ tracks: [] });
  }

  try {
    const tracks = await searchTracks(query.slice(0, MAX_QUERY_LENGTH));
    return NextResponse.json({ tracks });
  } catch (error) {
    console.error("Deezer search failed", error);
    return NextResponse.json({ error: "Search is unavailable right now" }, { status: 502 });
  }
}
