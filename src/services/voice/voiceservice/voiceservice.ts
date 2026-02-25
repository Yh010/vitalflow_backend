import type { TextToSpeechLanguage } from "../../../../node_modules/sarvamai/dist/cjs/api/types/TextToSpeechLanguage.js";
import {
  SarvamSpeechToText,
  SarvamTextToSpeech,
} from "../voicethirdparty/sarvam.js";

export async function convertSpeechToText(filePath: string) {
  return SarvamSpeechToText(filePath);
}

export async function convertTextToSpeech(
  inputText: string,
  language_code: TextToSpeechLanguage,
) {
  return SarvamTextToSpeech(inputText, language_code);
}
