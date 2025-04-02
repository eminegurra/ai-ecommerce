// src/app/api/chatbot/route.js
import { OpenAI } from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { message } = await req.json();

    const myservicesContext = servicesData
      .map((s) => `${s.name}: ${s.description}`)
      .join("\n");

    const prompt = `
      You are a helpful assistant. The following are services the company offers:

      ${myservicesContext}

      Answer the user's question using the context above when possible.

      User: ${message}
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
    });

    const reply = response.choices[0].message.content;

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("OpenAI error:", err);
    return NextResponse.json({ reply: "Something went wrong." }, { status: 500 });
  }
}
