import type { Express } from "express";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import path from "path";
import { s3BucketName, s3Client, s3Region } from "../config/s3.js";

export const uploadUserDocumentToS3 = async (
  file: Express.Multer.File,
  userId: number,
): Promise<string> => {
  const sanitizedFilename = file.originalname.replace(/\s+/g, "-");
  const key = `user-documents/${userId}/${Date.now()}-${sanitizedFilename}`;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: s3BucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    }),
  );

  const url = `https://${s3BucketName}.s3.${s3Region}.amazonaws.com/${key}`;

  return url;
};

