import { OpenAI } from 'openai';
import { db } from '@/db/index';
import { products, brands, categories } from '@/db/schema';
import { lte, eq } from 'drizzle-orm/expressions';
import { and } from 'drizzle-orm';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { message } = await req.json();
    const match = message.match(/(\d+(\.\d+)?)/);
    const budget = match ? parseFloat(match[0]) : null;

    let productList = '';
    let prompt = '';

    if (budget) {
      const results = await db
        .select({
          id: products.id,
          name: products.name,
          price: products.price,
          brandName: brands.name,
          categoryName: categories.name,
        })
        .from(products)
        .leftJoin(brands, eq(products.brandId, brands.id))
        .leftJoin(categories, eq(products.categoryId, categories.id))
        .where(lte(products.price, budget));

      if (results.length === 0) {
        prompt = `A user has €${budget}, but there are no matching products. Kindly inform them and suggest alternatives.`;
      } else {
        productList = results
          .map(
            (p) =>
              `${p.name} (€${p.price}) - Brand: ${p.brandName || 'N/A'}, Category: ${p.categoryName || 'N/A'}`
          )
          .join('\n');

        prompt = `A user has €${budget} to spend. Suggest what they can buy from this list:\n${productList}`;
      }
    } else {
      prompt = `The user said: "${message}". They didn't provide a budget. Suggest they include one or offer helpful general advice.`;
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
    });

    const reply = completion.choices?.[0]?.message?.content || "Couldn't generate a reply.";

    return Response.json({ reply });
  } catch (error) {
    console.error('Chatbot error:', error);
    return Response.json({ reply: 'Oops! Server error.' }, { status: 500 });
  }
}
