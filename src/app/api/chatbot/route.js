import { OpenAI } from 'openai';
import { getAllProductsWithAttributes } from './productQueries';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  try {
    const { message } = await req.json();
    if (!message) return Response.json({ reply: 'Please enter a message.' });

    // Get products from DB
    const products = await getAllProductsWithAttributes();

    // Build system prompt with product context
    const productContext = products.map(p =>
      `- ${p.name} (€${p.price}) – Brand: ${p.brandName}, Category: ${p.categoryName}, Attributes: ${p.attributes.join(', ')}`
    ).join('\n');

    const systemPrompt = `
You are a helpful product assistant.
Only answer using the following product list. Do not make up products, brands, or features.

${productContext}

Always answer based only on the products above. If the user asks for something not listed, kindly say it's not available.

If the user asks for a short comparison (e.g., "in two sentences"), respond briefly. Otherwise, provide a helpful, clear answer.
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ]
    });

    const reply = completion.choices?.[0]?.message?.content || "Couldn't generate a response.";
    return Response.json({ reply });
  } catch (err) {
    console.error('Chatbot error:', err);
    return Response.json({ reply: 'Something went wrong while generating a reply.' }, { status: 500 });
  }
}
