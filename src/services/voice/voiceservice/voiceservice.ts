import {
  SarvamSpeechToText,
  SarvamTextToSpeech,
} from "../voicethirdparty/sarvam.js";

export async function convertSpeechToText(filePath: string) {
  return SarvamSpeechToText(filePath);
}

export async function convertTextToSpeech(inputText: string) {
  return SarvamTextToSpeech(inputText);
}
