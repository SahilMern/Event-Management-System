import { dirname } from "path";
import { fileURLToPath } from "url";
import Event from "../models/Event.models.js"; // Correct model
import User from "../models/user.model.js"; // Assuming User model exists, if needed
import cloudinary from "cloudinary"; // Ensure correct Cloudinary import

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

cloudinary.config({
  cloud_name: "dt2zvo07s", // Replace with your Cloudinary cloud name
  api_key: "963549411432585", // Replace with your Cloudinary API key
  api_secret: "dCEpv6ooJ_WASF59skd87afNQ7k", // Replace with your Cloudinary API secret
});

// Create a new event
export const createEvent = async (req, res) => {
  try {
    const {
      eventName,
      eventDate,
      eventType,
      eventLink,
      eventDescription,
      eventLocation,
    } = req.body;

    // Check if file exists
    if (!req.file) {
      return res.status(400).json({ error: "Event file is required." });
    }

    // Upload file to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.v2.uploader
        .upload_stream(
          { resource_type: req.body.eventType === "video" ? "video" : "image" },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        )
        .end(req.file.buffer); // Pass file buffer to Cloudinary
    });

    // Create new event with Cloudinary URL
    const newEvent = new Event({
      eventName,
      eventDate,
      eventType,
      eventFile: result.secure_url, // Save Cloudinary URL
      eventLink,
      eventDescription,
      eventLocation,
    });

    await newEvent.save();

    return res.status(200).json({
      message: "Event successfully added",
      event: newEvent,
    });
  } catch (error) {
    console.error("Error saving event:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Get all events with pagination, search, and date filtering
export const getAllEvents = async (req, res) => {
  const { search, startDate, endDate, page = 1, limit = 3 } = req.query; // Default limit is 3
  const query = {};

  if (search) {
    query.eventName = { $regex: search, $options: "i" };
  }

  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ error: "Invalid date format." });
    }

    query.eventDate = {
      $gte: start,
      $lte: end,
    };
  }

  try {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10); // Use the limit sent from the frontend

    const totalEvents = await Event.countDocuments(query);
    const totalPages = Math.ceil(totalEvents / limitNumber);

    const events = await Event.find(query)
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
    res.status(500).json({ error: "Internal server error while fetching events." });
  }
};

// Get a single event by ID
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });

    return res.status(200).json({ event });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error fetching event." });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      eventName,
      eventDate,
      eventType,
      eventLink,
      eventDescription,
      eventLocation,
      existingFile, // Existing Cloudinary URL
    } = req.body;

    let eventFile = existingFile; // Use existing file by default

    // If a new file is uploaded
    if (req.file) {
      // Remove old file from Cloudinary only if it exists
      if (existingFile) {
        // Extract public ID from Cloudinary URL
        const urlParts = existingFile.split('/');
        const publicId = urlParts
          .slice(urlParts.indexOf('upload') + 1) // Get the part after "upload"
          .join('/') // Join the remaining parts
          .split('.')[0]; // Remove file extension

        console.log(publicId, 'Public ID to delete');

        // Delete old file from Cloudinary
        await cloudinary.v2.uploader.destroy(publicId, {
          resource_type: eventType === 'video' ? 'video' : 'image',
        });
      }

      // Upload new file to Cloudinary
      const result = await new Promise((resolve, reject) => {
        cloudinary.v2.uploader.upload_stream(
          {
            resource_type: eventType === 'video' ? 'video' : 'image',
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        ).end(req.file.buffer); // Pass file buffer to Cloudinary
      });

      eventFile = result.secure_url; // Save new Cloudinary URL
    }

    // Update the event in the database
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      {
        eventName,
        eventDate,
        eventType,
        eventFile,
        eventLink,
        eventDescription,
        eventLocation,
      },
      { new: true }
    );

    res.status(200).json({
      message: 'Event updated successfully',
      event: updatedEvent,
    });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete an event by ID
export const deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Remove the event file from Cloudinary
    if (event.eventFile) {
      const fileName = event.eventFile.split("/").pop().split(".")[0]; // Get file name
      await cloudinary.v2.uploader.destroy(fileName); // Destroy the file from Cloudinary
    }

    // Delete the event from the database
    await Event.findByIdAndDelete(eventId);

    return res.status(200).json({ message: "Event deleted successfully!" });
  } catch (error) {
    console.error("Error deleting event:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Get total number of users (Assuming you have a User model)
export const getTotalUsers = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    return res.status(200).json({ totalUsers });
  } catch (error) {
    console.error("Error fetching total users:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get total number of events
export const getTotalEvents = async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    return res.status(200).json({ totalEvents });
  } catch (error) {
    console.error("Error fetching total events:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
