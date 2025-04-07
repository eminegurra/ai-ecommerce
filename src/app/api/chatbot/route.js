import OpenAI from 'openai';
import { getAllProductsWithAttributes } from './productQueries';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Replace this with the Assistant ID from your dashboard
const ASSISTANT_ID = 'asst_mVoHQghv55HdwyvXnjLXfRvT'; // ← your actual Assistant ID here

// Optional: You can store threads per user in a DB or cache (for now, we'll create a new one per session)
let threadId = null;

export async function POST(req) {
  try {
    const { message } = await req.json();
    if (!message) return Response.json({ reply: 'Please enter a message.' });

    // Fetch product context
    const products = await getAllProductsWithAttributes();

    const productContext = products.map(p =>
      `- ${p.name} (€${p.price}) – Brand: ${p.brandName}, Category: ${p.categoryName}, Attributes: ${p.attributes.join(', ')}`  
    ).join('\n');

    // If this is the first message, create a thread and send the product context as a system message
    if (!threadId) {
      const thread = await openai.beta.threads.create();
      threadId = thread.id;

      // Send system context as assistant message to help the assistant "see" the product list
      await openai.beta.threads.messages.create(threadId, {
        role: 'user',
        content: `Here is the product list:\n${productContext}`
      });
    }

    // Add user's message to the thread
    await openai.beta.threads.messages.create(threadId, {
      role: 'user',
      content: message
    });

    // Run the assistant
    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: ASSISTANT_ID
    });

    // Poll until the run completes
    let runStatus;
    do {
      runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
      await new Promise(res => setTimeout(res, 1000));
    } while (runStatus.status !== 'completed');

    // Get the assistant's reply
    const messages = await openai.beta.threads.messages.list(threadId);
    const lastReply = messages.data
      .filter(m => m.role === 'assistant')
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];

    const reply = lastReply?.content?.[0]?.text?.value || "Couldn't generate a response.";
    return Response.json({ reply });
  } catch (err) {
    console.error('Chatbot error:', err);
    return Response.json({ reply: 'Something went wrong while generating a reply.' }, { status: 500 });
  }
}
