import dotenv from "dotenv";
dotenv.config(); // <-- this loads all .env variables into process.env

import express from "express";
import cors from "cors";

import dashboardRoutes from "./routes/dashboard.routes.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import propertyRoutes from "./routes/property.routes.js";
import roomRoutes from "./routes/room.routes.js";
import lockRoutes from "./routes/lock.routes.js";
import roomLockRoutes from "./routes/roomLock.routes.js";
import reservationRoutes from "./routes/reservation.routes.js";
import { createSuperAdmin } from "./middleware/createSuperAdmin.js";
import { connectDB } from "./config/connectDB.js";
import { startCronJobs } from "./cron/cron.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

// Middleware
app.use(express.json());

app.use(
  cors({
    origin: [
      "https://room-lock-management.vercel.app",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

// Routes
app.use("/", dashboardRoutes);
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/properties", propertyRoutes);
app.use("/rooms", roomRoutes);
app.use("/locks", lockRoutes);
app.use("/room-lock", roomLockRoutes);
app.use("/reservations", reservationRoutes);

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

startCronJobs();
const startServer = async () => {
  try {
    await connectDB();
    await createSuperAdmin();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
  }
};

startServer();
