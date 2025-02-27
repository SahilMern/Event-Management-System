import Event from "../models/Event.models.js";
import cloudinary from "cloudinary";
import crypto from "crypto";

// Encryption and Decryption Functions
const algorithm = 'aes-256-cbc'; // Encryption algorithm
const secretKey = crypto.randomBytes(32); // Secret key of 32 bytes (256 bits)

// Encrypt function
function encrypt(text) {
  const iv = crypto.randomBytes(16); // Generate a random 16-byte IV
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return { iv: iv.toString('hex'), encryptedData: encrypted };
}

// Decrypt function
function decrypt(encryptedData, iv) {
  const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(iv, 'hex'));
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

cloudinary.config({
  cloud_name: "dt2zvo07s", // Replace with your Cloudinary cloud name
  api_key: "963549411432585", // Replace with your Cloudinary API key
  api_secret: "dCEpv6ooJ_WASF59skd87afNQ7k", // Replace with your Cloudinary API secret
});

// Create new event
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

    if (!req.file) {
      return res.status(400).json({ error: "Event file is required." });
    }

    // Encrypt event location
    let { iv: locationIv, encryptedData: encryptedLocation } = encrypt(eventLocation);

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

    const newEvent = new Event({
      eventName,
      eventDate,
      eventType,
      eventFile: result.secure_url,
      eventLink,
      eventDescription,
      eventLocation: encryptedLocation, // Store encrypted location
      locationIv, // Store IV for later decryption
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
  const { search, startDate, endDate, page = 1, limit = 3 } = req.query;
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

    // Decrypt event locations before sending them
    events.forEach((event) => {
      if (event.eventLocation && event.locationIv) {
        const decryptedLocation = decrypt(event.eventLocation, event.locationIv);
        event.eventLocation = decryptedLocation;
      }
    });

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

    // Decrypt the event location if both fields are present
    if (event.eventLocation && event.locationIv) {
      const decryptedLocation = decrypt(event.eventLocation, event.locationIv);
      event.eventLocation = decryptedLocation; // Update with decrypted location
    }

    return res.status(200).json({
      event,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error fetching event." });
  }
};

// Update event details
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

    let eventFile = existingFile;

    let locationIv = null;
    let encryptedLocation = eventLocation;

    if (eventLocation) {
      const encrypted = encrypt(eventLocation);
      locationIv = encrypted.iv;
      encryptedLocation = encrypted.encryptedData;
    }

    if (req.file) {
      if (existingFile) {
        const urlParts = existingFile.split("/");
        const publicId = urlParts
          .slice(urlParts.indexOf("upload") + 1)
          .join("/")
          .split(".")[0];

        await cloudinary.v2.uploader.destroy(publicId, {
          resource_type: eventType === "video" ? "video" : "image",
        });
      }

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

      eventFile = result.secure_url;
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      {
        eventName,
        eventDate,
        eventType,
        eventFile,
        eventLink,
        eventDescription,
        eventLocation: encryptedLocation, // Store encrypted location
        locationIv, // Store IV
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

    if (event.eventFile) {
      const fileName = event.eventFile.split("/").pop().split(".")[0];
      await cloudinary.v2.uploader.destroy(fileName);
    }

    await Event.findByIdAndDelete(eventId);

    return res.status(200).json({ message: "Event deleted successfully!" });
  } catch (error) {
    console.error("Error deleting event:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
