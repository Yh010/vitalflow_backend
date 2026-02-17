import { GeminiResponse } from "../llmthirdparty/gemini.js";

export async function LLMResponse(inputText: string) {
    return GeminiResponse(inputText);
}