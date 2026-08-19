const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function calculateMatchScore(lostItem, foundItem) {
  let totalScore = 0;
  let categoryScore = 0;
  let locationScore = 0;
  let timeScore = 0;
  let textScore = 0;

  // 1. Category Match (30%)
  if (lostItem.category === foundItem.category) {
    categoryScore = 30;
    totalScore += 30;
  }

  // 2. Location Match (25%) - Fallback to simple equality if no coords
  if (lostItem.location_text.toLowerCase() === foundItem.location_text.toLowerCase()) {
    locationScore = 25;
    totalScore += 25;
  } else {
    // Basic partial match
    const lostLoc = lostItem.location_text.toLowerCase();
    const foundLoc = foundItem.location_text.toLowerCase();
    if (lostLoc.includes(foundLoc) || foundLoc.includes(lostLoc)) {
      locationScore = 15;
      totalScore += 15;
    }
  }

  // 3. Time Match (20%) - Found item must be found AFTER lost item was lost, but within a reasonable window
  const lostTime = new Date(lostItem.lost_at).getTime();
  const foundTime = new Date(foundItem.found_at).getTime();
  const timeDiffHours = (foundTime - lostTime) / (1000 * 60 * 60);

  if (timeDiffHours >= 0 && timeDiffHours <= 48) {
    timeScore = 20;
    totalScore += 20;
  } else if (timeDiffHours > 48 && timeDiffHours <= 168) { // within a week
    timeScore = 10;
    totalScore += 10;
  }

  // 4. Smart Text Match with Gemini (25%)
  try {
    const model = genAI.getGenerativeModel(
      { model: "gemini-1.5-flash" },
      { timeout: 5000 } // 5 second timeout to quickly fallback if network is blocked
    );
    
    const prompt = `
    You are an AI matching engine for a lost and found application.
    Compare the following two items to determine if they are the exact same physical object.
    
    Lost Item Details:
    - Color: ${lostItem.color || 'N/A'}
    - Description: ${lostItem.description || 'N/A'}
    
    Found Item Details:
    - Color: ${foundItem.color || 'N/A'}
    - Description: ${foundItem.description || 'N/A'}
    
    Return ONLY a single integer between 0 and 25 representing your confidence that these are the same item. 
    0 means completely different, 25 means extremely high confidence they are the same item.
    Consider synonyms, partial descriptions, and contextual clues. Do not include any other text, just the integer.
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const parsedScore = parseInt(text, 10);
    
    if (!isNaN(parsedScore) && parsedScore >= 0 && parsedScore <= 25) {
      textScore = parsedScore;
      totalScore += parsedScore;
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback to basic word intersection if Gemini fails
    const lostWords = new Set((lostItem.description || '').toLowerCase().split(/\s+/));
    const foundWords = (foundItem.description || '').toLowerCase().split(/\s+/);
    let overlap = 0;
    foundWords.forEach(w => {
      if (w.length > 3 && lostWords.has(w)) overlap++;
    });
    textScore = Math.min(overlap * 5, 25);
    totalScore += textScore;
  }

  return {
    categoryScore,
    locationScore,
    timeScore,
    textScore,
    totalScore
  };
}

module.exports = { calculateMatchScore };
