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
      messages: [
        {
          role: "system",
          content: "Ti si trener fitnessa koji sastavlja planove treninga.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 500,
    });

    const odgovor = completion.choices[0].message?.content || "";

    return NextResponse.json({ odgovor });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { odgovor: "Došlo je do greške prilikom generiranja plana." },
      { status: 500 }
    );
  }
}
