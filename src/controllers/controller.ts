import type { Request, Response, NextFunction } from "express";
import { LLMResponse } from "../services/llm/llmservice/llmservice.js";
import { convertSpeechToText, convertTextToSpeech } from "../services/voice/voiceservice/voiceservice.js";

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
    res.locals.llmresponse = llmresponse.reply;
    res.locals.history = llmresponse.history;
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
    const textInput = await convertSpeechToText(filePath);
    res.locals.inputText = textInput;
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
  const history = res.locals.history;
  if (!LLMResponse) return res.status(400).json({ error: "No llm response." });

  try {
    const audioResponse = await convertTextToSpeech(LLMResponse);
    return res.status(200).json({ audio: audioResponse[0], history: history });
  } catch (err) {
    next(err);
  }
};
