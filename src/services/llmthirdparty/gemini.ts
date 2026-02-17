import { GoogleGenAI } from "@google/genai";

class GeminiClient {
    private static instance: GoogleGenAI;

    private constructor() { } // Prevent direct construction

    public static getInstance(): GoogleGenAI {
        if (!GeminiClient.instance) {
            const apiKey = process.env.GEMINI_API_KEY;

            if (!apiKey) {
                throw new Error(
                    "GEMINI_API_KEY is not defined. Check your .env configuration."
                );
            }

            GeminiClient.instance = new GoogleGenAI({
                apiKey: apiKey,
            });

            console.log("Gemini client initialized.");
        }

        return GeminiClient.instance;
    }
}


export async function GeminiResponse(inputText: string) {
    try {
        console.log("Input text:", inputText);
        const ai = GeminiClient.getInstance();

        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: inputText,
        });

        console.log("Gemini response:", response.text);

        return response.text;
    } catch (error) {
        console.error("Error generating Gemini response:", error);
        throw error;
    }
}