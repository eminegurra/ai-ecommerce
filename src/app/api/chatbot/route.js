// src/app/api/chatbot/route.js
import { OpenAI } from 'openai';
import { detectIntent } from './intents';
import {
  generateInitialReply,
  generateFollowupReply,
  generateComparisonReply,
  generateCheaperAlternatives,
} from './replyGenerators';
import {
  getProductsByBudget,
  getProductsByKeyword,
  getProductsByFeature,
} from './productQueries';

const sessionContext = new Map();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  try {
    const { message, sessionId } = await req.json();
    const previousResults = sessionContext.get(sessionId) || [];
    const { intent, entity } = detectIntent(message, previousResults);

    switch (intent) {
      case 'greeting':
        return Response.json({
          reply: "Hi! 👋 I can help you find laptops, phones, and more. You can ask things like:\n- Show me laptops under €1000\n- I need a tablet with 128GB\n- Do you have any Samsung phones?\nWhat would you like to find today?",
        });

      case 'select':
        return Response.json({ reply: await generateFollowupReply(entity, previousResults) });

      case 'compare':
        return Response.json({ reply: await generateComparisonReply(entity, previousResults) });

      case 'cheaper':
        return Response.json({ reply: await generateCheaperAlternatives(previousResults) });

      case 'feature': {
        const { list, reply } = await getProductsByFeature(entity);
        sessionContext.set(sessionId, list);
        return Response.json({ reply });
      }

      default: {
        const budget = extractBudget(message);
        const results = budget
          ? await getProductsByBudget(budget)
          : await getProductsByKeyword(message);

        sessionContext.set(sessionId, results);

        if (results.length === 0) {
          const fallbackPrompt = `The user said: "${message}". There are no matching results from the database. Respond with a helpful answer or suggestions for what to do next.`;

          const completion = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [{ role: 'user', content: fallbackPrompt }],
          });

          const reply = completion.choices?.[0]?.message?.content || "Sorry, no results and I couldn't generate a suggestion.";
          return Response.json({ reply });
        }

        const reply = await generateInitialReply(message, budget, results);
        return Response.json({ reply });
      }
    }
  } catch (error) {
    console.error('Chatbot error:', error);
    return Response.json({ reply: 'Oops! Server error.' }, { status: 500 });
  }
}

function extractBudget(text) {
  const match = text.match(/(\d+(\.\d+)?)/);
  return match ? parseFloat(match[0]) : null;
}
