import { GoogleGenAI, type Content } from "@google/genai";

function extractBookingData(text: string): Record<string, unknown> | null {
    const match = text.match(/<booking_data>\s*([\s\S]*?)\s*<\/booking_data>/);
    if (!match) return null;
    try {
        return JSON.parse(match[1] || "");
    } catch {
        console.error("Failed to parse <booking_data> JSON");
        return null;
    }
}

function stripBookingData(text: string): string {
    return text.replace(/<booking_data>[\s\S]*?<\/booking_data>/g, "").trim();
}

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

export type ConversationHistory = Content[];
export interface GeminiResult {
    reply: string;
    bookingData: Record<string, unknown> | null; // parsed JSON from <booking_data> tag
    history: ConversationHistory;
}

export async function GeminiResponse(inputText: string, SYSTEM_PROMPT: string, history: ConversationHistory): Promise<GeminiResult> {
    try {
        console.log("Input text:", inputText);
        const ai = GeminiClient.getInstance();

        history.push({ role: "user", parts: [{ text: inputText }] });

        const response = await ai.models.generateContent({
            model: process.env.GEMINI_MODEL || "",
            contents: inputText,
            config: { systemInstruction: SYSTEM_PROMPT },
        });

        console.log("Gemini response:", response.text);
        const rawText = response.text ?? "";
        const bookingData = extractBookingData(rawText);
        const reply = stripBookingData(rawText);
        history.push({ role: "model", parts: [{ text: reply }] });

        return { reply, bookingData, history };
    } catch (error) {
        console.error("Error generating Gemini response:", error);
        throw error;
    }
}