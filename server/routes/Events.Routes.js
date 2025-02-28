import express from "express";
import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} from "../controllers/Events.Controller.js";
import upload from "../middleware/uploadMiddleware.js";
import { verifyAdmin, verifyUserToken } from "../middleware/verifyToken.js";

const router = express.Router();

//TODO:- Create a new event
router.post(
  "/",
  verifyUserToken,
  verifyAdmin,
  upload.single("eventFile"),
  createEvent
);

//TODO:- Get all events with pagination, search, and date filtering
router.get("/", verifyUserToken,  getAllEvents);

//TODO:- Get a single event by ID
router.get("/:id", verifyUserToken, verifyAdmin, getEventById);

//TODO:- Update an event by ID
router.put(
  "/:id",
  verifyUserToken,
  verifyAdmin,
  upload.single("eventFile"),
  updateEvent
);

//TODO:- Delete an event by ID
router.delete("/:id", verifyUserToken, verifyAdmin, deleteEvent);

export default router;
