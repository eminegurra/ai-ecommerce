// src/app/api/chatbot/replyGenerators.js
import { OpenAI } from 'openai';
import { getAttributesByProductIds } from './productQueries';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateInitialReply(message, budget, results) {
  if (results.length === 0) {
    const prompt = budget
      ? `A user has €${budget}, but there are no matching products. Kindly inform them and suggest alternatives.`
      : `The user said: "${message}", but there are no matching products by name, brand, or category. Offer helpful suggestions or ask them to clarify.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
    });

    return completion.choices?.[0]?.message?.content || "Couldn't generate a reply.";
  }

  const productList = results
    .map((p, i) => `${i + 1}. ${p.name} – €${p.price}`)
    .join('\n');

  return `Here are some products we found:\n\n${productList}\n\nWould you like more information about any of them? Just reply with the number or name.`;
}

export async function generateFollowupReply(entity, previousResults) {
  let selectedProduct = null;

  if (typeof entity === "number") {
    if (entity >= 1 && entity <= previousResults.length) {
      selectedProduct = previousResults[entity - 1];
    }
  } else {
    selectedProduct = previousResults.find((p) =>
      p.name.toLowerCase().includes(entity.toLowerCase())
    );
  }

  if (!selectedProduct) {
    return "Sorry, I couldn't find a matching product from the list. Please try again with a number or name.";
  }

  const attributesMap = await getAttributesByProductIds([selectedProduct.id]);
  const attrs = attributesMap[selectedProduct.id]?.join(', ') || 'No attributes';

  const prompt = `Tell the user more about this product:\n\nName: ${selectedProduct.name}\nPrice: €${selectedProduct.price}\nBrand: ${selectedProduct.brandName}\nCategory: ${selectedProduct.categoryName}\nAttributes: ${attrs}`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
  });

  return (
    (completion.choices?.[0]?.message?.content || "Couldn't generate product details.") +
    `\n\nWould you like to compare this with another product, or see cheaper alternatives?`
  );
}

export async function generateComparisonReply(entityName, previousResults) {
  const selected = previousResults[0];
  const compare = previousResults.find((p) =>
    p.name.toLowerCase().includes(entityName.toLowerCase())
  );

  if (!compare) {
    return `Sorry, I couldn't find "${entityName}" to compare with.`;
  }

  const attributesMap = await getAttributesByProductIds([selected.id, compare.id]);

  const prompt = `Compare these two products for the user:\n\n1. ${selected.name} (€${selected.price}) - Brand: ${selected.brandName}, Attributes: ${attributesMap[selected.id]?.join(', ') || 'N/A'}\n2. ${compare.name} (€${compare.price}) - Brand: ${compare.brandName}, Attributes: ${attributesMap[compare.id]?.join(', ') || 'N/A'}`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
  });

  return completion.choices?.[0]?.message?.content || "Couldn't generate comparison.";
}

export async function generateCheaperAlternatives(previousResults) {
  const referencePrice = previousResults[0]?.price;
  if (!referencePrice) return "No reference product found to compare prices.";

  const cheaper = previousResults.filter((p) => p.price < referencePrice);
  if (!cheaper.length) return "There are no cheaper alternatives available.";

  const list = cheaper.map((p) => `${p.name} – €${p.price}`).join('\n');
  return `Here are some cheaper alternatives:\n\n${list}`;
}