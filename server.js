import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import connectDB from "./config/db.js";

import userRoutes from "./routes/userRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";

dotenv.config();

const app = express();

// ─── DB Connection ────────────────────────────────────────────────────────────
// Use mongoose.connection.readyState instead of a boolean flag.
// readyState: 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
// This is reliable across serverless cold/warm starts on Vercel.

const initDB = async () => {
    // 0 = disconnected, only connect when not already connected or connecting
    if (mongoose.connection.readyState === 0) {
        try {
            await connectDB();
        } catch (err) {
            console.error("❌ MongoDB connection failed:", err.message);
            throw err; // bubble up so the request fails fast instead of buffering
        }
    }
};

// ─── CORS ────────────────────────────────────────────────────────────────────
const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "https://portfolieo-five.vercel.app",
    "https://port-admin.vercel.app",
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (
            allowedOrigins.includes(origin) ||
            /^https:\/\/[\w-]+(\.vercel\.app)$/.test(origin)
        ) {
            return callback(null, true);
        }
        callback(new Error(`CORS blocked: ${origin} is not allowed`));
    },
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

// ─── Vercel Serverless Export ─────────────────────────────────────────────────
// On Vercel every request goes through this handler.
// We await initDB() each time — Mongoose deduplicates the connection internally.
export default async function handler(req, res) {
    await initDB();
    return app(req, res);
}

// ─── Local Development Server ─────────────────────────────────────────────────
// NODE_ENV=development in .env → connect DB first, then listen.
// Not 'local' — the .env file already sets NODE_ENV=development.
if (process.env.NODE_ENV === "development") {
    initDB()
        .then(() => {
            const PORT = process.env.PORT || 5000;
            app.listen(PORT, () => {
                console.log(`🚀 Server running on http://localhost:${PORT}`);
            });
        })
        .catch((err) => {
            console.error("❌ Failed to start server:", err.message);
            process.exit(1);
        });
}