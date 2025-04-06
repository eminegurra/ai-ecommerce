import { OpenAI } from 'openai';
import {
  getAllProductNames,
  getAllBrandNames,
  getAllCategoryNames,
} from './extractKeywords';
import { buildSystemPrompt } from './promptBuilder';
import {
  generateInitialReply,
  generateFollowupReply,
  generateComparisonReply,
  generateCheaperAlternatives,
} from './replyGenerators';
import {
  getProductsByKeyword,
  getProductsByBudget,
  getProductsByFeature,
} from './productQueries';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const sessionContext = new Map();

export async function POST(req) {
  try {
    const { message, sessionId } = await req.json();
    const previousResults = sessionContext.get(sessionId) || [];

    const [productsList, brandsList, categoriesList] = await Promise.all([
      getAllProductNames(),
      getAllBrandNames(),
      getAllCategoryNames(),
    ]);

    const systemPrompt = buildSystemPrompt(productsList, brandsList, categoriesList);

    const gpt = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
    });

    const { intent, products: mentionedProducts = [], feature = message } = JSON.parse(
      gpt.choices[0].message.content
    );

    switch (intent) {
      case 'greeting':
        return Response.json({
          reply: "Hi! 👋 I can help you find phones, laptops, tablets, and more. What are you looking for today?",
        });

      case 'compare': {
        if (mentionedProducts.length < 2) {
          return Response.json({ reply: "Please mention two products you'd like to compare." });
        }

        const allResults = await getProductsByKeyword(mentionedProducts.join(' '));
        const matched = mentionedProducts.map(name =>
          allResults.find(p => p.name.toLowerCase().includes(name.toLowerCase()))
        );

        if (matched.some(m => !m)) {
          return Response.json({ reply: `Couldn't find one of: ${mentionedProducts.join(', ')}` });
        }

        sessionContext.set(sessionId, matched);
        return Response.json({ reply: await generateComparisonReply(mentionedProducts[1], matched) });
      }

      case 'cheaper':
        return Response.json({ reply: await generateCheaperAlternatives(previousResults) });

      case 'feature': {
        const { list, reply } = await getProductsByFeature(feature);
        sessionContext.set(sessionId, list);
        return Response.json({ reply });
      }

      case 'select':
        return Response.json({ reply: await generateFollowupReply(mentionedProducts[0], previousResults) });

      default: {
        const budget = extractBudget(message);
        const results = budget
          ? await getProductsByBudget(budget)
          : await getProductsByKeyword(message);

        sessionContext.set(sessionId, results);

        if (results.length === 0) {
          const fallback = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
              { role: 'user', content: `The user said: "${message}". There are no matching products. Suggest something helpful.` },
            ],
          });
          return Response.json({ reply: fallback.choices[0].message.content });
        }

        const reply = await generateInitialReply(message, budget, results);
        return Response.json({ reply });
      }
    }
  } catch (err) {
    console.error('❌ Chatbot error:', err);
    return Response.json({ reply: 'Oops! Something went wrong.' }, { status: 500 });
  }
}

function extractBudget(text) {
  const match = text.match(/(\d+(\.\d+)?)/);
  return match ? parseFloat(match[0]) : null;
}
