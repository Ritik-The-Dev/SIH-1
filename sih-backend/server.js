import cors from "cors";
import express from "express";
import Router from "./routes/Routes.js";
import cookieParser from "cookie-parser";
import connectDb from "./config/connectDb.js";
import dotenv from "dotenv";

dotenv.config();
connectDb();

const app = express();

// ✅ Allow frontend origin + credentials
app.use(
  cors({
    origin: ["http://localhost:5173/", "https://sih-sapphire.vercel.app/"], // your frontend URL
    credentials: true,               // allow cookies, auth headers
  })
);

app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/v1", Router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
