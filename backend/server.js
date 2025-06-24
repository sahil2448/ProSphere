import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import postRoutes from "./routes/posts.routes.js";
import userRoutes from "./routes/users.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("uploads"));

app.use("/", postRoutes);
app.use("/users", userRoutes);

const start = async () => {
  const connectDB = await mongoose.connect(
    "mongodb+srv://syk2448:sk_iitr@cluster0.up0a0ri.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  );
  console.log("Connected to MONGO_DB");
};

start();

app.listen(9090, () => {
  console.log("Listening on the port 9090");
});
