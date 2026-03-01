import mongoose from "mongoose";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  throw new Error("MONGO_URI environment variable is not defined");
}

export const vectorDBMongoClient = new MongoClient(mongoUri);

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(mongoUri);
    console.log("Mongoose connected");

    await vectorDBMongoClient.connect();
    console.log("Vector MongoClient connected");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
    throw error;
  }
};
