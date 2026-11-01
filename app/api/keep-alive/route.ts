// Called by Vercel Cron a few times a day to keep the Supabase project active.

import { NextResponse } from "next/server";
import { pingSupabase } from "@/lib/pingSupabase";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await pingSupabase(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Supabase keep-alive failed", error);
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}
