import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import { Server } from "socket.io";
import http from "http";

import userRoutes from "./routes/userRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import viewRoutes from "./routes/viewRoutes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // In production, you might want to restrict this
        methods: ["GET", "POST"]
    }
});

// Socket.io Logic
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("send_message", (data) => {
        // Broadcast message to everyone including sender
        io.emit("receive_message", {
            ...data,
            timestamp: new Date().toISOString()
        });
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

// ─── CORS — MUST be the very first middleware ─────────────────────────────────
// If DB fails, CORS headers are still present so the browser can read the error.
const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://localhost:3003",
    "https://portfolieo-five.vercel.app",
    "https://port-admin.vercel.app",
    "http://localhost:5000",
];

app.use(cors({
    origin: (origin, callback) => {
        // Allow no-origin requests (Postman, curl, server-to-server)
        if (!origin) return callback(null, true);
        if (
            allowedOrigins.includes(origin) ||
            /^https:\/\/[\w-]+(\.vercel\.app)$/.test(origin)
        ) {
            return callback(null, true);
        }
        // Return false (not an Error) so Express doesn't throw — just blocks
        return callback(null, false);
    },
    credentials: true,
}));

// Explicitly handle CORS preflight OPTIONS requests
// Express 5 requires "/{*path}" instead of bare "*" (path-to-regexp v8 breaking change)
app.options("/{*path}", cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (
            allowedOrigins.includes(origin) ||
            /^https:\/\/[\w-]+(\.vercel\.app)$/.test(origin)
        ) {
            return callback(null, true);
        }
        return callback(null, false);
    },
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ─── DB Middleware ────────────────────────────────────────────────────────────
// Runs AFTER CORS so every response (including DB errors) has CORS headers.
// This is the critical fix for Vercel — if initDB() was called in the handler
// before app(req,res), a DB crash stripped CORS headers causing "Failed to fetch".

const initDB = async () => {
    if (mongoose.connection.readyState === 0) {
        await connectDB();
    }
};

app.use(async (req, res, next) => {
    try {
        await initDB();
        next();
    } catch (err) {
        console.error("❌ DB connection failed:", err.message);
        res.status(500).json({
            message: "Database connection failed. Check MONGO_URI in Vercel environment variables.",
        });
    }
});

// ─── Routes ──────────────────────────────────────────────────────────────────

app.get("/", (req, res) => {
    res.json({ message: "API is running ✅", db: mongoose.connection.readyState === 1 ? "connected" : "disconnected" });
});

app.use("/api/users", userRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/views", viewRoutes);

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err.message);
    res.status(500).json({ message: err.message || "Internal server error" });
});

// ─── Vercel Serverless Export ─────────────────────────────────────────────────
// Export app directly — Vercel treats Express apps as valid (req, res) handlers.
// DB init is now a middleware inside app, so CORS always runs before it.
export default app;

// ─── Local Development ────────────────────────────────────────────────────────
if (process.env.NODE_ENV === "development") {
    initDB()
        .then(() => {
            const PORT = process.env.PORT || 5000;
            server.listen(PORT, () => {
                console.log(`🚀 Server running on http://localhost:${PORT}`);
            });
        })
        .catch((err) => {
            console.error("❌ Failed to start:", err.message);
            process.exit(1);
        });
}