import dotenv from "dotenv";
dotenv.config();
import express from "express";
import config from "./config/config.js";
import router from "./routes/routes.js";
import cors from "cors";
import { connectDB } from "./config/db.js";

const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:5174",
];

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
  }),
);

app.use("/api/items", (req, res) => {
  res.send("hello world");
});
app.use("/api", router);

const startServer = async () => {
  try {
    await connectDB();
    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  } catch (error) {
    console.error("Failed to start server due to DB connection error");
    process.exit(1);
  }
};

void startServer();
