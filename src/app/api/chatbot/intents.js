import stringSimilarity from 'string-similarity';

export function detectIntent(message, previousResults = []) {
  const lower = String(message || '').toLowerCase().trim(); // ensure it's a string

  const greetings = ['hi', 'hello', 'hey', 'good morning', 'good afternoon'];
  if (greetings.includes(lower)) {
    return { intent: 'greeting' };
  }

  if (["yes", "sure", "ok", "okay"].includes(lower)) {
    return { intent: "select", entity: 1 };
  }

  if (/^\d+$/.test(lower)) {
    return { intent: "select", entity: parseInt(lower) };
  }

  if (lower.includes("compare with")) {
    const productName = lower.split("compare with")[1].trim();
    return { intent: "compare", entity: productName };
  }

  if (lower.includes("cheaper") || lower.includes("less expensive")) {
    return { intent: "cheaper" };
  }

  // if (lower.includes("storage") || lower.includes("gb")) {
  //   return { intent: "feature", entity: message };
  // }
  const featureKeywords = [
    "storage", "gb", "amoled", "retina", "ip68", "backlit", "scanner",
  
    // From keys
    "ram", "processor", "camera", "display", "weight", "frame", "keyboard", 
    "security", "chip", "battery", "s pen", "water resistance",
  
    // From values
    "m1 pro", "16gb", "256gb", "512gb", "48mp", "6.1-inch amoled", "1.2kg",
    "titanium", "fingerprint scanner", "google tensor g3", "4300mah", 
    "10.9-inch liquid retina", "included"
  ];
  
  if (featureKeywords.some(word => lower.includes(word))) {
    return { intent: "feature", entity: message };
  }


  // ✅ Fuzzy match product names
  if (previousResults.length > 0) {
    const names = previousResults.map(p => String(p.name || '').toLowerCase());
    const { bestMatch } = stringSimilarity.findBestMatch(lower, names);

    if (bestMatch.rating > 0.6) {
      const matched = previousResults.find(
        p => p.name.toLowerCase() === bestMatch.target
      );
      if (matched) {
        return { intent: "select", entity: matched.name };
      }
    }
  }

  return { intent: "unknown" };
}
