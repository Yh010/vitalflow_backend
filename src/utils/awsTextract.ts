import {
  DetectDocumentTextCommand,
  type Block,
} from "@aws-sdk/client-textract";
import { textractClient } from "../config/awsTextract.js";

export async function detectTextFromS3(bucketName: string, objectKey: string) {
  const command = new DetectDocumentTextCommand({
    Document: {
      S3Object: {
        Bucket: bucketName,
        Name: objectKey,
      },
    },
  });

  try {
    const response = await textractClient.send(command);

    const blocks: Block[] | undefined = response.Blocks;

    if (blocks) {
      console.log("Detected text lines: ");

      const lines = blocks
        .filter((b) => b.BlockType === "LINE")
        .map((b) => b.Text);
      lines.forEach((line) => console.log(line));

      return lines.join(" ");
    } else {
      console.log("No text blocks found.");
      return "";
    }
  } catch (err) {
    console.error("Error detecting text fropm document: ", err);
    throw err;
  }
}
