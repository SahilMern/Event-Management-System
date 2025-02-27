import CryptoJS from "crypto-js";
import Event from "../models/Event.models.js";
import cloudinary from "cloudinary";

// Cloudinary configuration
cloudinary.config({
  cloud_name: "dt2zvo07s",
  api_key: "963549411432585",
  api_secret: "dCEpv6ooJ_WASF59skd87afNQ7k",
});

// Secret key for AES encryption (should be stored securely, avoid hardcoding in production)
const secretKey = process.env.SECRET_KEY || 'your-secure-key';

// AES Encrypt function
const encryptData = (data) => {
  return CryptoJS.AES.encrypt(data, secretKey).toString();
};

// AES Decrypt function
const decryptData = (ciphertext) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};

//TODO:-  CREATE NEW EVENT
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

    // Encrypt the eventLocation (if it exists)
    const encryptedEventLocation = eventLocation ? encryptData(eventLocation) : null;

    //? Check if file exists OR Not
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
        .end(req.file.buffer);
    });

    // Create new event and set Cloudinary URL with encrypted eventLocation
    const newEvent = new Event({
      eventName,
      eventDate,
      eventType,
      eventFile: result.secure_url,
      eventLink,
      eventDescription,
      eventLocation: encryptedEventLocation,
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

//TODO:- Get all events with pagination, search, and date filtering From Frontend
export const getAllEvents = async (req, res) => {
  const { search, startDate, endDate, page = 1, limit = 3 } = req.query; // Set limit by default here
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
    const limitNumber = parseInt(limit, 10);

    const totalEvents = await Event.countDocuments(query);
    const totalPages = Math.ceil(totalEvents / limitNumber);

    const events = await Event.find(query)
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    // Decrypt event locations before sending the response
    const eventsWithDecryptedLocation = events.map((event) => {
      if (event.eventLocation) {
        event.eventLocation = decryptData(event.eventLocation);
      }
      return event;
    });

    return res.json({
      events: eventsWithDecryptedLocation,
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
};

//TODO:-  GET SINGLE EVENT
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });

    // Decrypt event location before returning
    if (event.eventLocation) {
      event.eventLocation = decryptData(event.eventLocation);
    }

    return res.status(200).json({ event });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error fetching event." });
  }
};

// Update Event
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
    let eventLocationEncrypted = eventLocation ? encryptData(eventLocation) : null;

    if (req.file) {
      // Remove old file from Cloudinary only if it exists
      if (existingFile) {
        const urlParts = existingFile.split("/");
        const publicId = urlParts
          .slice(urlParts.indexOf("upload") + 1)
          .join("/")
          .split(".")[0];

        // Delete old file from Cloudinary
        await cloudinary.v2.uploader.destroy(publicId, {
          resource_type: eventType === "video" ? "video" : "image",
        });
      }

      // Upload new file to Cloudinary
      const result = await new Promise((resolve, reject) => {
        cloudinary.v2.uploader
          .upload_stream(
            {
              resource_type: eventType === "video" ? "video" : "image",
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          )
          .end(req.file.buffer);
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
        eventLocation: eventLocationEncrypted,
      },
      { new: true }
    );

    res.status(200).json({
      message: "Event updated successfully",
      event: updatedEvent,
    });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ error: "Internal server error" });
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
  