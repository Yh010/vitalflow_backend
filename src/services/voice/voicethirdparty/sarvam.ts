import { SarvamAIClient } from "sarvamai";
import fs from "fs";
import type { TextToSpeechLanguage } from "../../../types/types.js";

class SarvamClient {
  public static instance: SarvamAIClient;

  public constructor() {}

  public static getInstance(): SarvamAIClient {
    if (!SarvamClient.instance) {
      const sarvamApiKey = process.env.SARVAM_API_KEY;

      if (!sarvamApiKey) {
        throw new Error(
          "SARVAM_API_KEY is not defined. Check your .env configuration.",
        );
      }

      SarvamClient.instance = new SarvamAIClient({
        apiSubscriptionKey: sarvamApiKey,
      });
    }

    return SarvamClient.instance;
  }
}

export async function SarvamSpeechToText(filePath: string) {
  const client = SarvamClient.getInstance();

  const audioFile = fs.createReadStream(filePath);
  const response = await client.speechToText.transcribe({
    file: audioFile,
    model: "saaras:v3",
    mode: "transcribe",
  });

  console.log(response.transcript);
  console.log(response.language_code);

  return { transcript: response.transcript, language: response.language_code };
}

export async function SarvamTextToSpeech(
  inputText: string,
  language_code: TextToSpeechLanguage,
) {
  const client = SarvamClient.getInstance();

  const response = await client.textToSpeech.convert({
    text: inputText,
    model: "bulbul:v3",
    speaker: "shubh",
    target_language_code: language_code,
  });

  //console.log(response.audios[0]);

  return response.audios;
}
