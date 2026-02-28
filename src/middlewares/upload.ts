import multer from "multer";
import { storage } from "../utils/multerStorage.js";

const upload = multer({ storage: storage });

export const uploadMiddleware = upload.single("audio");

const documentUpload = multer({ storage: multer.memoryStorage() });

export const uploadDocumentMiddleware = documentUpload.single("document");
