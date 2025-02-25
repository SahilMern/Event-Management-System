import express from "express";
import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getTotalUsers,
  getTotalEvents,
} from "../controllers/Events.Controller.js";
import upload from "../middleware/uploadMiddleware.js"

const router = express.Router();

// Create a new event
router.post("/", upload.single("eventFile"), createEvent);


// Get all events with pagination, search, and date filtering
router.get("/", getAllEvents);

// Get a single event by ID
router.get("/:id", getEventById);

// Update an event by ID
router.put("/:id", upload.single("eventFile"), updateEvent);

// Delete an event by ID
router.delete("/:id", deleteEvent);

router.get("/total-users", getTotalUsers);

// Get total number of events
router.get("/total-events", getTotalEvents);

export default router;
