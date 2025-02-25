console.log("JAI SHREE RAM JI / JAI BAJARANG BALI JI");

import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express from "express";
import path, { dirname } from "path";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import "./config/Database/connection.js"; // Database Connection Import
import multer from "multer";
import Eventss from "./models/Event.models.js"; // Event Model

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 9080;

// Middlewares
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your frontend port
    credentials: true,
  })
);
app.use(cookieParser());

// import cloudinary from "cloudinary"
// cloudinary.config({
//   cloud_name: "dt2zvo07s",
//   api_key: "963549411432585",
//   api_secret: "dCEpv6ooJ_WASF59skd87afNQ7k",
// });

// Serve static files
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

import { AuthRoutes, UserRoutes, EventRoutes } from "./routes/index.js";
app.use("/api/auth", AuthRoutes);
app.use("/api/user", UserRoutes);
app.use("/api/events", EventRoutes);

app.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}!`));
