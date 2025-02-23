import express from "express";

import upload from "../middleware/uploadMiddleware.js"; // Import your upload middleware
import {   createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent, } from "../controllers/Events.Controller.js";

const router = express.Router();

// Create a new event
router.post("/", upload.fields([{ name: "eventFile" }, { name: "attendeeFile" }]), createEvent);

// Get all events with pagination, search, and date filtering
router.get("/", getAllEvents);

// Get a single event by ID
router.get("/:id", getEventById);

// Update an event by ID
router.put("/:id", upload.single("eventFile"), updateEvent);

// Delete an event by ID
router.delete("/:id", deleteEvent);

export default router;