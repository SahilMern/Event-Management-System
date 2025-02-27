console.log("JAI SHREE RAM JI / JAI BAJARANG BALI JI");

import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import "./config/Database/connection.js"; //? Database Connection

const app = express();
const PORT = process.env.PORT || 9080;

//? Middlewares Setup
app.use(express.json());
app.use(
  cors({
    origin: process.env.FrontendUrl, //? Set your frotend Url
    credentials: true,
  })
);
app.use(cookieParser());

import { AuthRoutes, UserRoutes, EventRoutes } from "./routes/index.js";
app.use("/api/auth", AuthRoutes);
app.use("/api/user", UserRoutes);
app.use("/api/events", EventRoutes);

app.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}!`));
