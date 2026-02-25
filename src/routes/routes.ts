import { Router } from "express";
import {
  convertSpeechToTextController,
  convertTextToSpeechController,
  getChatHistory,
  getLLMResponseController,
} from "../controllers/controller.js";
import { uploadMiddleware } from "../middlewares/upload.js";

const router = Router();

router.post(
  "/talk",
  uploadMiddleware,
  convertSpeechToTextController,
  getLLMResponseController,
  convertTextToSpeechController,
);

router.get("/getChatHistory", getChatHistory);

export default router;
