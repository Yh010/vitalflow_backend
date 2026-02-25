import type { Request, Response, NextFunction } from "express";
import { LLMResponse } from "../services/llm/llmservice/llmservice.js";
import {
  convertSpeechToText,
  convertTextToSpeech,
} from "../services/voice/voiceservice/voiceservice.js";
import { AddChatToHistory, GetChatHistory } from "../utils/chatHistory.js";
import type { ChatMessage } from "../types/types.js";

export const getLLMResponseController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const inputText = res.locals.inputText;
    console.log("input text is", inputText);
    const llmresponse = await LLMResponse(inputText, "randomSessionId");
    console.log("llm response is", llmresponse.reply);
    console.log("Chat history: ", llmresponse.history);
    res.locals.llmresponse = llmresponse.reply;
    AddChatToHistory(llmresponse.history as ChatMessage[]);
    next();
  } catch (error) {
    next(error);
  }
};

export const convertSpeechToTextController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.file) return res.status(400).json({ error: "No audio file." });
  const filePath = req.file.path;

  try {
    const { transcript, language } = await convertSpeechToText(filePath);
    res.locals.inputText = transcript;
    res.locals.language_code = language;
    next();
  } catch (err) {
    next(err);
  }
};

export const convertTextToSpeechController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const LLMResponse = res.locals.llmresponse;
  const language_code = res.locals.language_code;
  if (!LLMResponse) return res.status(400).json({ error: "No llm response." });

  try {
    const audioResponse = await convertTextToSpeech(LLMResponse, language_code);
    return res.status(200).json({ audio: audioResponse[0] });
  } catch (err) {
    next(err);
  }
};

export const getChatHistory = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const chatHistory = GetChatHistory();
  return res.status(200).json({ history: chatHistory });
};
