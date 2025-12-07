import { GoogleGenAI } from "@google/genai";

let ai: GoogleGenAI | null = null;

const initializeGemini = () => {
  if (process.env.API_KEY && !ai) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
};

export const getGeminiResponse = async (userMessage: string): Promise<string> => {
  initializeGemini();
  
  if (!ai) {
    // Graceful fallback if no API key is present in environment
    return "I am currently in offline mode. Please configure my API key to chat!";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userMessage,
      config: {
        systemInstruction: "You are Jido Budi, a friendly, energetic, and helpful mascot for a virtual arcade and snack shop. You love snacks like Maggi, Milo, and chips. You help users navigate the app, explain games (Match 3 and Snack Swipe), and are generally cheerful. Use emojis often. Keep responses concise.",
      }
    });

    return response.text || "I'm not sure what to say to that!";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Oops! My circuits are a bit jammed. Try again later! 🤖";
  }
};