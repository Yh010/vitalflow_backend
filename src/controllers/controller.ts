// example:
import type { Request, Response, NextFunction } from "express";
import { LLMResponse } from "../services/llmservice/llmservice.js";
import {
  SarvamSpeechToText,
  SarvamTextToSpeech,
} from "../services/voicethirdparty/sarvam.js";
import {
  convertSpeechToText,
  convertTextToSpeech,
} from "../services/voiceservice/voiceservice.js";

export const getLLMResponseController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const inputText = res.locals.inputText;
    console.log("input text is", inputText);
    const llmresponse = await LLMResponse(inputText);
    console.log("llm response is", llmresponse);
    res.locals.llmresponse = llmresponse;
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
  const llmresponse = res.locals.llmresponse;
  if (!llmresponse) return res.status(400).json({ error: "No llm response." });

  try {
    const audioResponse = await convertTextToSpeech(llmresponse);
    return res.status(200).json({ audio: audioResponse[0] });
  } catch (err) {
    next(err);
  }
};
