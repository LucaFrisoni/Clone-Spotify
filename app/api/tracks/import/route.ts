// Adds a Deezer song to the signed-in user's library.

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { isTrackId } from "@/lib/deezer";
import { DuplicateTrackError, importTrack } from "@/lib/importTrack";

export const dynamic = "force-dynamic";

const readTrackId = async (request: Request) => {
  const body = await request.json().catch(() => ({}));
  return isTrackId(body?.id) ? body.id : null;
};

//Corre con la sesion del usuario, asi Storage y la base aplican sus mismas reglas
export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: "Log in to add songs" }, { status: 401 });
  }

  const trackId = await readTrackId(request);
  if (!trackId) {
    return NextResponse.json({ error: "Invalid song" }, { status: 400 });
  }

  try {
    const song = await importTrack(supabase, session.user.id, trackId);
    return NextResponse.json({ song });
  } catch (error: any) {
    const status = error instanceof DuplicateTrackError ? 409 : 502;
    if (status === 502) console.error("Track import failed", error);
    return NextResponse.json({ error: error.message }, { status });
  }
}
