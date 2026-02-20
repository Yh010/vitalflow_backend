import { SarvamAIClient } from "sarvamai";
import fs from "fs";

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
    language_code: "hi-IN",
  });

  console.log(response.transcript);

  return response.transcript;
}

export async function SarvamTextToSpeech(inputText: string) {
  const client = SarvamClient.getInstance();

  const response = await client.textToSpeech.convert({
    text: inputText,
    model: "bulbul:v3",
    speaker: "shubh",
    target_language_code: "en-IN",
  });

  //console.log(response.audios[0]);

  return response.audios;
}
