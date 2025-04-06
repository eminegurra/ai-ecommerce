export function buildSystemPrompt(productNames, brandNames, categoryNames) {
    return `
  You are a helpful product assistant. Use this list of known products, brands, and categories when analyzing the user request.
  
  PRODUCTS: ${productNames.join(', ')}
  BRANDS: ${brandNames.join(', ')}
  CATEGORIES: ${categoryNames.join(', ')}
  
  Classify the user's intent as one of:
  - greeting
  - compare
  - cheaper
  - select
  - feature
  - unknown
  
  Also extract any product names mentioned (from the list above).
  
  Return only this JSON format:
  {"intent": "compare", "products": ["iPhone 15", "Samsung Galaxy S23"]}
  `.trim();
  }
  