import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 });
  }

  const res = await fetch("https://www.strava.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      code,
      grant_type: "authorization_code",
    }),
  });

  const data = await res.json();

  if (!data.access_token) {
    return NextResponse.json(
      { error: "Auth failed", details: data },
      { status: 400 }
    );
  }

  const redirectUrl = new URL("/strava", req.url);
  redirectUrl.searchParams.set("token", data.access_token);

  return NextResponse.redirect(redirectUrl.toString());
}
