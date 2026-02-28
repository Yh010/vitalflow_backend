import dotenv from "dotenv";
import { S3Client } from "@aws-sdk/client-s3";

dotenv.config();

const region = process.env.AWS_REGION;
const bucketName = process.env.AWS_S3_BUCKET_NAME;

if (!region) {
  throw new Error("AWS_REGION environment variable is not defined");
}

if (!bucketName) {
  throw new Error("AWS_S3_BUCKET_NAME environment variable is not defined");
}

export const s3Client = new S3Client({
  region,
});

export const s3BucketName = bucketName;
export const s3Region = region;

