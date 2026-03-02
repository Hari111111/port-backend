import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";

import userRoutes from "./routes/userRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";

dotenv.config();

const app = express();

// ✅ Important: connect DB inside handler-safe area
let isConnected = false;

const initDB = async () => {
    if (!isConnected) {
        await connectDB();
        isConnected = true;
    }
};

// CORS
app.use(cors({
    origin: ["http://localhost:3002", "https://portfolieo-five.vercel.app"],
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("API is running...");
});

app.use("/api/users", userRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/projects", projectRoutes);

// ✅ THIS IS IMPORTANT FOR VERCEL
export default async function handler(req, res) {
    await initDB();
    return app(req, res);
}