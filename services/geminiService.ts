import { GoogleGenAI, Type, Schema } from "@google/genai";

// Initialize Gemini
// Note: In a real production app, ensure API Key is handled securely.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const modelId = 'gemini-2.5-flash';

interface AnalysisResult {
  tags: string[];
  summary: string;
  isGenerallySafe: boolean;
}

export const analyzeFoodItem = async (foodName: string, brand: string, notes: string): Promise<AnalysisResult> => {
  if (!process.env.API_KEY) {
    // Fail silently or gently for this simplified app version
    return {
      tags: [],
      summary: '',
      isGenerallySafe: true
    };
  }

  try {
    const prompt = `
      Analyze this pet food item (likely wet food, puree, or treat) for cats/dogs.
      Food Name: ${foodName}
      Brand: ${brand}
      User Notes: ${notes}

      Task:
      1. Generate 2-3 short, Punchy tags (in Traditional Chinese) (e.g., "高蛋白", "無穀", "補水").
      2. Provide a very brief 10-word summary (Traditional Chinese).
      3. Safety check.
    `;

    const schema: Schema = {
      type: Type.OBJECT,
      properties: {
        tags: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "2-3 descriptive tags in Traditional Chinese"
        },
        summary: {
          type: Type.STRING,
          description: "Very short summary"
        },
        isGenerallySafe: {
          type: Type.BOOLEAN
        }
      },
      required: ["tags", "summary", "isGenerallySafe"]
    };

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AnalysisResult;
    }
    
    return { tags: [], summary: '', isGenerallySafe: true };

  } catch (error) {
    console.warn("Gemini analysis failed or skipped:", error);
    return {
      tags: [],
      summary: '',
      isGenerallySafe: true
    };
  }
};