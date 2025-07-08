import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 500,
    });

    const odgovor = completion.choices[0].message?.content ?? "";

    return NextResponse.json({ odgovor });
  } catch (error) {
    console.error("OpenAI API error:", error);
    return NextResponse.json(
      { odgovor: "Došlo je do greške pri generiranju." },
      { status: 500 }
    );
  }
}
