import Groq from "groq-sdk";

let groq = null;

const getClient = () => {
  if (!groq) {
    groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });
  }
  return groq;
};

// ============================================
// AI RECOMMENDATIONS
// ============================================

export const getAIRecommendations = async ({
  disease,
  confidence,
  cropType,
  weather,
  risk
}) => {
  try {
    const client = getClient();

    const prompt = `
You are an agricultural expert AI.

Give practical recommendations for a farmer.

DATA:
- Crop: ${cropType}
- Disease: ${disease}
- Confidence: ${confidence}%
- Temperature: ${weather.temperature}°C
- Humidity: ${weather.humidity}%
- Weather Condition: ${weather.condition}
- Risk Level: ${risk}

INSTRUCTIONS:
- Give 5–7 clear bullet points
- Keep it simple and practical
- Include treatment, prevention, and monitoring
- Avoid technical jargon
- No explanations, only bullet points

Output format:
- Recommendation 1
- Recommendation 2
`;

    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7
    });

    const text = response.choices[0]?.message?.content || "";

    // Convert text → array
    const suggestions = text
      .split("\n")
      .map(line => line.replace(/^[-•]\s*/, "").trim())
      .filter(line => line.length > 0);

    return suggestions;

  } catch (error) {
    console.error("❌ AI Recommendation Error:", error.message);

    return [
      "Monitor crop regularly",
      "Maintain proper irrigation",
      "Follow crop rotation"
    ];
  }
};