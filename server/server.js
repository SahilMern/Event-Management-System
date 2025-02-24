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

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 👉 **1. Create a new event (POST /api/events)**
app.post(
  "/api/events",
  upload.fields([{ name: "eventFile" }, { name: "attendeeFile" }]),
  async (req, res) => {
    try {
      const { eventName, eventDate, eventType, eventLink } = req.body;
      console.log(eventName, eventDate, eventType, eventLink, "Data aaa");

      const eventFile = req.files?.eventFile?.[0]?.path || null;
      const attendeeFile = req.files?.attendeeFile?.[0]?.path || null;

      if (
        !eventName ||
        !eventDate ||
        !eventType ||
        !eventFile ||
        !attendeeFile
      ) {
        return res.status(400).json({ error: "All fields are required." });
      }

      if (eventType === "image" && !eventFile.match(/\.(jpg|jpeg|png)$/)) {
        return res.status(400).json({ error: "Only image files are allowed." });
      }
      if (eventType === "video" && !eventFile.match(/\.(mp4|avi|mov)$/)) {
        return res.status(400).json({ error: "Only video files are allowed." });
      }

      const newEvent = new Eventss({
        eventName,
        eventDate,
        eventType,
        eventFile,
        attendeeFile,
        eventLink,
      });
      await newEvent.save();

      res
        .status(200)
        .json({ message: "Event successfully added", event: newEvent });
    } catch (error) {
      console.error("Error saving event:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// 👉 **2. Get all events (GET /api/getEvent)**
// app.get("/api/getEvent", async (req, res) => {
//   try {
//     const { page = 1, limit = 10, search = "", startDate, endDate } = req.query;

//     // Convert page and limit to integers
//     const pageNumber = parseInt(page);
//     const limitNumber = parseInt(limit);

//     // Prepare filter conditions for the query
//     let filter = {};

//     if (search) {
//       // Search for events by eventName (case insensitive)
//       filter.eventName = { $regex: search, $options: "i" };
//     }

//     if (startDate && endDate) {
//       // Filter by date range
//       const start = new Date(startDate);
//       const end = new Date(endDate);
//       filter.eventDate = { $gte: start, $lte: end };
//     }

//     // Fetch the events with pagination, search, and date filtering
//     const events = await Eventss.find(filter)
//       .skip((pageNumber - 1) * limitNumber) // Skip for pagination
//       .limit(limitNumber) // Limit the number of results per page
//       .sort({ eventDate: -1 }); // Optional: Sort by event date descending

//     // Get total count for pagination
//     const totalEvents = await Eventss.countDocuments(filter);

//     res.status(200).json({
//       events,
//       totalPages: Math.ceil(totalEvents / limitNumber),
//       currentPage: pageNumber,
//       totalEvents,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Error fetching events." });
//   }
// });

// 👉 **3. Get event by ID (GET /api/events/:id)**

// 👉 **2. Get all events (GET /api/getEvent)**
// 👉 **2. Get all events (GET /api/getEvent)**
app.get("/api/getEvent", async (req, res) => {
  const { search, startDate, endDate, page = 1, limit = 3 } = req.query;

  // console.log(search, startDate, endDate, "search, startDate, endDate");

  const query = {};

  if (search) {
    query.eventName = { $regex: search, $options: "i" };
    console.log(query, "Query");
  }

  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    console.log(start, end, start.getTime());

    if (isNaN(start.getTime())) {
      return res.status(400).json({ error: "Invalid startDate format." });
    }
    if (isNaN(end.getTime())) {
      return res.status(400).json({ error: "Invalid endDate format." });
    }

    query.eventDate = {
      $gte: start,
      $lte: end,
    };

    console.log(query);
  }

  try {
    const pageNumber = parseInt(page);
    const limitNumber = Math.min(Math.max(parseInt(limit), 1), 100);
    console.log(pageNumber, limitNumber, "pageNumber");

    const totalEvents = await Eventss.countDocuments(query);
    const totalPages = Math.ceil(totalEvents / limitNumber);
    console.log(
      totalEvents,
      limitNumber,
      totalEvents / limitNumber,
      totalPages,
      "totalPages"
    );

    const events = await Eventss.find(query)
      .sort({ eventDate: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

   return res.json({
      events,
      totalPages,
      currentPage: pageNumber,
      totalEvents,
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    res
      .status(500)
      .json({ error: "Internal server error while fetching events." });
  }
});

app.get("/api/events/:id", async (req, res) => {
  try {
    const event = await Eventss.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });

    res.status(200).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching event." });
  }
});

// 👉 **4. Update event by ID (PUT /api/events/:id)**
app.put("/api/events/:id", upload.single("eventFile"), async (req, res) => {
  try {
    const { eventName, eventDate, eventType, eventLink } = req.body;
    const updatedData = { eventName, eventDate, eventType, eventLink };

    // If a new file is uploaded, use that file
    if (req.file) {
      updatedData.eventFile = req.file.path;
    } else if (req.body.existingFile) {
      updatedData.eventFile = req.body.existingFile; // If no new file, use the existing file name
    }

    // Update the event in the database
    const updatedEvent = await Eventss.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    if (!updatedEvent)
      return res.status(404).json({ error: "Event not found" });

    res
      .status(200)
      .json({ message: "Event updated successfully!", event: updatedEvent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating event." });
  }
});

import fs from "fs";
// 👉 **5. Delete event by ID (DELETE /api/events/:id)**
app.delete("/api/events/:id", async (req, res) => {
  try {
    const eventId = req.params.id;

    // First, find the event to get its file path
    const event = await Eventss.findById(eventId);
    if (!event) return res.status(404).json({ error: "Event not found" });

    // Remove the event from the database
    await Eventss.findByIdAndDelete(eventId);

    // Optionally, delete the associated files from the server
    // Using fs (filesystem) module to remove event files
    // const fs = require("fs");
    // const path = require("path");

    if (event.eventFile) {
      const eventFilePath = path.join(__dirname, "uploads", event.eventFile);
      if (fs.existsSync(eventFilePath)) {
        fs.unlinkSync(eventFilePath);
      }
    }

    return res.status(200).json({ message: "Event deleted successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting event." });
  }
});

// Start the server

import { AuthRoutes, UserRoutes, EventRoutes } from "./routes/index.js";
import { log } from "console";
app.use("/api/auth", AuthRoutes);
app.use("/api/user", UserRoutes);
app.use("/api/events", EventRoutes);

app.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}!`));
