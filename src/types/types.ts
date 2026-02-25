// Example:
// export interface Item {
//     id: number;
//     name: string;
// }

// export let items: Item[] = [];

export type ChatMessage = {
  role: "user" | "model";
  parts: { text: string }[];
};

export type TextToSpeechLanguage =
  | "bn-IN"
  | "en-IN"
  | "gu-IN"
  | "hi-IN"
  | "kn-IN"
  | "ml-IN"
  | "mr-IN"
  | "od-IN"
  | "pa-IN"
  | "ta-IN"
  | "te-IN";
