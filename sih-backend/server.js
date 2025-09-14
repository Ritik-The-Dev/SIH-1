import cors from "cors";
import express from "express";
import Router from "./routes/Routes.js";
import cookieParser from "cookie-parser";
import connectDb from "./config/connectDb.js";
import { config } from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// ✅ Fix __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectDb();

const app = express();
config();

app.use(
  cors({
    origin: "*", 
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, ".", "builds", "sih")));

const PORT = process.env.PORT || 5000;

app.use("/api/v1", Router);

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, ".", "builds", "sih", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
