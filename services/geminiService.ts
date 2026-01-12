
import { GoogleGenAI } from "@google/genai";
import { Candidate } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getAIAnalysis = async (candidates: Candidate[]) => {
  const stats = candidates.map(c => `${c.name} (${c.language}): ${c.votes} votes`).join('\n');
  const prompt = `Analyze the current results of the E-Day Online Voting System.
Current Standings:
${stats}

Please provide a brief, professional summary of the results, highlighting the frontrunner and any interesting observations about the distribution of votes between Tswana and Zulu candidates. Keep it encouraging and neutral.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are an expert election analyst for E-Day, a secure digital voting platform. Your tone is professional, neutral, and informative.",
        temperature: 0.7,
      }
    });
    return response.text || "I'm unable to analyze the data at the moment. Please check back shortly.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The AI analyst is currently unavailable.";
  }
};
