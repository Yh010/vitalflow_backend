import { BedrockEmbeddings, ChatBedrockConverse } from "@langchain/aws";
import { OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { MultiQueryRetriever } from "@langchain/classic/retrievers/multi_query";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { vectorDBMongoClient } from "../../config/db.js";
import {
  RunnablePassthrough,
  RunnableSequence,
} from "@langchain/core/runnables";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { Document } from "@langchain/core/documents";

class RagPipeline {
  private static instance: RagPipeline;
  private textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 100,
  });
  private openaiEmbedding = new OpenAIEmbeddings({
    model: "text-embedding-3-large",
  });

  private bedrockEmbedding = new BedrockEmbeddings({
    model: "amazon.titan-embed-text-v2:0",
    region: process.env.AWS_REGION || "us-east-1",
  });

  private llm = new ChatBedrockConverse({
    model: "google.gemma-3-27b-it",
    region: process.env.AWS_REGION || "",
    temperature: 0.2,
  });

  private vectorStore!: MongoDBAtlasVectorSearch;

  public static getInstance = (): RagPipeline => {
    if (!RagPipeline.instance) {
      RagPipeline.instance = new RagPipeline();
    }

    return RagPipeline.instance;
  };

  public initialize = async () => {
    const collection = vectorDBMongoClient
      .db("vitalflow")
      .collection("user_documents");

    this.vectorStore = new MongoDBAtlasVectorSearch(this.bedrockEmbedding, {
      collection,
      indexName: "vector_index",
      textKey: "text",
      embeddingKey: "embedding",
    });
  };

  public ingestDocument = async (content: string, metadata: object = {}) => {
    if (!this.vectorStore) {
      throw new Error("You must call initialize() before ingesting documents.");
    }
    console.log(content);

    const docs = await this.textSplitter.createDocuments([content], [metadata]);

    await this.vectorStore.addDocuments(docs);
    console.log(`Successfully ingested ${docs.length} chunks into MongoDB.`);
  };

  public getRetriever = () => {
    if (!this.vectorStore) {
      throw new Error("You must call initialize() first.");
    }

    return MultiQueryRetriever.fromLLM({
      llm: this.llm,
      retriever: this.vectorStore.asRetriever({
        searchType: "mmr",
        searchKwargs: {
          fetchK: 5,
          lambda: 0.5,
        },
      }),
    });
  };

  public ragChain = () => {
    const tmpl = `
You are an expert clinical AI assistant. Your task is to help a doctor quickly understand if a patient has a history of similar medical issues based on their past records.

Below is the summary of the patient's recent consultation (RECENT CALL SUMMARY). 
You are also provided with relevant extracts from their past medical records (PAST MEDICAL REPORTS).

Your goal is to cross-reference the current issue with their past records and provide a brief clinical synthesis for the doctor.

CRITICAL RULES:
1. ONLY use the information provided in the PAST MEDICAL REPORTS. Do not invent, assume, or pull in outside medical knowledge about the patient.
2. If the past reports do not contain any information related or similar to the current issue, explicitly state: "No relevant past medical history found for this specific issue in the provided records."
3. Highlight any previous occurrences of these symptoms, past diagnoses, or past treatments that are relevant to the current call.
4. Keep your answer concise, objective, and formatted for a doctor's quick review. Do not attempt to diagnose the current issue.

PAST MEDICAL REPORTS (CONTEXT):
{context}

RECENT CALL SUMMARY:
{call_summary}

CLINICAL SYNTHESIS FOR THE DOCTOR:
`;

    const prompt = ChatPromptTemplate.fromTemplate(tmpl);

    const formatDocs = (docs: Document[]) => {
      return docs.map((doc) => doc.pageContent).join("\n\n");
    };

    const multiRetriever = this.getRetriever();

    const chain = RunnableSequence.from([
      {
        context: multiRetriever.pipe(formatDocs),
        call_summary: new RunnablePassthrough(),
      },
      prompt,
      this.llm,
      new StringOutputParser(),
    ]);

    return chain;
  };
}

export const getRagPipelineInstance = (): RagPipeline => {
  return RagPipeline.getInstance();
};

export const initializeRagPipeline = async () => {
  const ragInstance = RagPipeline.getInstance();

  await ragInstance.initialize();
  console.log("RAG Pipeline Initialized...");
};
