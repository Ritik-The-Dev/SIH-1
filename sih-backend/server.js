import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDb from "./config/connectDb.js";
import Router from "./routes/Routes.js";

dotenv.config();
connectDb();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/v1", Router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
