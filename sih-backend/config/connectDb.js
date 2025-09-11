import mongoose from "mongoose";

export default async function connectDb() {
  const DB_URL = process.env.MONGO_URI;
  if (DB_URL) {
    try {
      await mongoose
        .connect(process.env.MONGO_URI)
        .then(() => {
          console.log("MongoDB connected");
        })
        .catch((err) => {
          console.log(err);
          process.exit(1);
        });
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  } else {
    console.log("MongoDB connection string is not defined");
    process.exit(1);
  }
}
