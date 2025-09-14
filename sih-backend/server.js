import cors from "cors";
import express from "express";
import Router from "./routes/Routes.js";
import cookieParser from "cookie-parser";
import connectDb from "./config/connectDb.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
connectDb();

const app = express();

// ✅ Allow frontend origin + credentials
app.use(
  cors({
    origin: "https://sih-sapphire.vercel.app", // your frontend URL
    credentials: true, // allow cookies, auth headers
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "builds", "sih")));

const PORT = process.env.PORT || 5000;

app.use("/api/v1", Router);

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "builds", "sih", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
