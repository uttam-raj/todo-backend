require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectToMongo = require("./utils/db");

const authRouter = require("./routes/authRouter");
const todoRouter = require("./routes/todoRouter");
const settingsRoutes = require("./routes/settingsRoutes");
const errorMiddleware = require("./Middlewares/error-middleware");

const app = express();

/* ================= CORS CONFIG ================= */
const allowedOrigins = [
  "http://localhost:5173", // Local frontend (Vite)
  "https://todomeru.netlify.app/" // Deployed frontend (Netlify)
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (Postman, mobile apps, etc.)
      if (!origin) return callback(null, true);

      if (!allowedOrigins.includes(origin)) {
        return callback(new Error("Not allowed by CORS"));
      }

      return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD"],
    credentials: true,
  })
);

/* ================= MIDDLEWARE ================= */
app.use(express.json());

/* ================= ROUTES ================= */
app.use("/api/auth", authRouter);
app.use("/api/todo", todoRouter);
app.use("/api/settings", settingsRoutes);

/* ================= ERROR HANDLER ================= */
app.use(errorMiddleware);

/* ================= SERVER START ================= */
const PORT = process.env.PORT || 5000;

connectToMongo()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server is running at port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
  });