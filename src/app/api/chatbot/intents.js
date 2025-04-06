import stringSimilarity from 'string-similarity';

export function detectIntent(message, previousResults = []) {
  const lower = String(message || '').toLowerCase().trim();

  // 1. Greetings
  const greetings = ['hi', 'hello', 'hey', 'good morning', 'good afternoon'];
  if (greetings.includes(lower)) {
    return { intent: 'greeting' };
  }

  // 2. Confirmation / follow-up
  if (["yes", "sure", "ok", "okay"].includes(lower)) {
    return { intent: "select", entity: 1 };
  }

  // 3. User selects item by number
  if (/^\d+$/.test(lower)) {
    return { intent: "select", entity: parseInt(lower) };
  }

  // 4. Comparison intent using more flexible wording
  const compareRegex = /(compare|vs|versus|better than)\s+(.*)/;
  const compareMatch = lower.match(compareRegex);
  if (compareMatch) {
    const productName = compareMatch[2]?.trim();
    return { intent: "compare", entity: productName };
  }

  // 5. Compare by detecting 2 product names from previousResults
  if (previousResults.length > 0) {
    const names = previousResults.map(p => String(p.name || '').toLowerCase());
    const matchedNames = names.filter(name => lower.includes(name));

    if (matchedNames.length === 2) {
      // Assume first is selected, second is comparison
      return { intent: "compare", entity: matchedNames[1] };
    }
  }

  // 6. Cheaper alternatives
  if (lower.includes("cheaper") || lower.includes("less expensive") || lower.includes("more affordable")) {
    return { intent: "cheaper" };
  }

  // 7. Feature search
  const featureKeywords = [
    "storage", "gb", "amoled", "retina", "ip68", "backlit", "scanner",
    "ram", "processor", "camera", "display", "weight", "frame", "keyboard", 
    "security", "chip", "battery", "s pen", "water resistance",
    "m1 pro", "16gb", "256gb", "512gb", "48mp", "6.1-inch amoled", "1.2kg",
    "titanium", "fingerprint scanner", "google tensor g3", "4300mah", 
    "10.9-inch liquid retina", "included"
  ];

  if (featureKeywords.some(word => lower.includes(word))) {
    return { intent: "feature", entity: message };
  }

  // 8. Fuzzy match to previous results for "select" by name
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

  // 9. Unknown fallback
  return { intent: "unknown" };
}
