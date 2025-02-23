import fs from "fs";
import path from "path";
import Eventss from "../models/Event.models.js";

// Create a new event
export const createEvent = async (req, res) => {
  try {
    const { eventName, eventDate, eventType, eventLink } = req.body;
    const eventFile = req.files?.eventFile?.[0]?.path || null;
    const attendeeFile = req.files?.attendeeFile?.[0]?.path || null;

    // Validate required fields
    if (!eventName || !eventDate || !eventType || !eventFile || !attendeeFile) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Validate file types
    if (eventType === "image" && !eventFile.match(/\.(jpg|jpeg|png)$/)) {
      return res.status(400).json({ error: "Only image files are allowed." });
    }
    if (eventType === "video" && !eventFile.match(/\.(mp4|avi|mov)$/)) {
      return res.status(400).json({ error: "Only video files are allowed." });
    }

    // Create and save the new event
    const newEvent = new Eventss({ eventName, eventDate, eventType, eventFile, attendeeFile, eventLink });
    await newEvent.save();

    return res.status(200).json({ message: "Event successfully added", event: newEvent });
  } catch (error) {
    console.error("Error saving event:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Get all events with pagination, search, and date filtering
export const getAllEvents = async (req, res) => {
    console.log("heye");
    
  const { search, startDate, endDate, page = 1, limit = 3 } = req.query;

  const query = {};

  // Add search filter
  if (search) {
    query.eventName = { $regex: search, $options: "i" };
  }

  // Add date range filter
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

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
  }

  try {
    const pageNumber = parseInt(page);
    const limitNumber = Math.min(Math.max(parseInt(limit), 1), 100);

    const totalEvents = await Eventss.countDocuments(query);
    const totalPages = Math.ceil(totalEvents / limitNumber);

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
    return res.status(500).json({ error: "Internal server error while fetching events." });
  }
};

// Get a single event by ID
export const getEventById = async (req, res) => {
  try {
    const event = await Eventss.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });

    return res.status(200).json(event);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error fetching event." });
  }
};

// Update an event by ID
export const updateEvent = async (req, res) => {
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
    const updatedEvent = await Eventss.findByIdAndUpdate(req.params.id, updatedData, { new: true });

    if (!updatedEvent) return res.status(404).json({ error: "Event not found" });

    return res.status(200).json({ message: "Event updated successfully!", event: updatedEvent });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error updating event." });
  }
};

// Delete an event by ID
export const deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;

    // First, find the event to get its file path
    const event = await Eventss.findById(eventId);
    if (!event) return res.status(404).json({ error: "Event not found" });

    // Remove the event from the database
    await Eventss.findByIdAndDelete(eventId);

    // Optionally, delete the associated files from the server
    if (event.eventFile) {
      const eventFilePath = path.join(__dirname, "..", "uploads", event.eventFile);
      if (fs.existsSync(eventFilePath)) {
        fs.unlinkSync(eventFilePath);
      }
    }

    return res.status(200).json({ message: "Event deleted successfully!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error deleting event." });
  }
};