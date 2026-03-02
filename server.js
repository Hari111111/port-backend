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

// ─── Allowed Origins ──────────────────────────────────────────────────────────
// Add any new Vercel deployment URLs here
const allowedOrigins = [
    // Local development
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    // Production — admin panel on Vercel (update with your actual admin URL)
    "https://portfolieo-five.vercel.app",
    "https://port-admin.vercel.app",
    // Allow any *.vercel.app subdomain for preview deployments
];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (curl, Postman, mobile apps)
        if (!origin) return callback(null, true);

        if (
            allowedOrigins.includes(origin) ||
            // Allow all Vercel preview deployments automatically
            /^https:\/\/[\w-]+(\.vercel\.app)$/.test(origin)
        ) {
            return callback(null, true);
        }

        callback(new Error(`CORS blocked: ${origin} is not allowed`));
    },
    credentials: true, // Required for cross-origin cookies
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

// ✅ Vercel serverless handler — DB is connected per-request (lazy)
export default async function handler(req, res) {
    await initDB();
    return app(req, res);
}

// ✅ Local development — connect DB FIRST, then start the HTTP server
// Without this, all Mongoose queries buffer forever → timeout error
if (process.env.NODE_ENV === 'local') {
    initDB().then(() => {
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    }).catch((err) => {
        console.error('❌ Failed to connect to MongoDB:', err.message);
        process.exit(1);
    });
}