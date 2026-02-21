import { Router } from "express";
import {
  convertSpeechToTextController,
  convertTextToSpeechController,
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

export default router;
