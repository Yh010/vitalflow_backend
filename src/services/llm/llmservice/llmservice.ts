import { GeminiResponse, type ConversationHistory } from "../llmthirdparty/gemini.js";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadSystemPrompt(): string {
  const raw = fs.readFileSync(
    path.resolve(__dirname, "../SYSTEM_PROMPT.md"),
    "utf-8"
  );
  const fenced = raw.match(/```\n([\s\S]*?)\n```/);
  return fenced ? fenced[1]?.trim() || "" : raw.trim();
}

const SYSTEM_PROMPT = loadSystemPrompt();

const sessions = new Map<string, ConversationHistory>();

function getHistory(sessionId: string): ConversationHistory {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, []);
  }
  return sessions.get(sessionId)!;
}

export function clearSession(sessionId: string) {
  sessions.delete(sessionId);
}

export async function LLMResponse(inputText: string, sessionId: string) {
  const history = getHistory(sessionId);
  return GeminiResponse(inputText, SYSTEM_PROMPT, history);
}
