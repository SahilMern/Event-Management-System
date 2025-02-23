// server.js (Main Entry Point)
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const { errorHandler } = require("./middlewares/errorMiddleware");

const app = express();

app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);

// Error Handling Middleware
app.use(errorHandler);

// Database Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// models/User.js
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);


// models/Event.js
const mongoose = require("mongoose");
const eventSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: Date, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema);


// middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");

exports.protect = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
};

exports.admin = (req, res, next) => {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });
    next();
};


// controllers/authController.js
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword });
        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// controllers/eventController.js
const Event = require("../models/Event");

exports.createEvent = async (req, res) => {
    try {
        const { name, description, location, date } = req.body;
        const event = await Event.create({ name, description, location, date, createdBy: req.user.id });
        res.status(201).json(event);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getEvents = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const events = await Event.find().skip((page - 1) * limit).limit(parseInt(limit));
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(event);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        await Event.findByIdAndDelete(req.params.id);
        res.json({ message: "Event deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// routes/authRoutes.js
const express = require("express");
const { register, login } = require("../controllers/authController");
const router = express.Router();
router.post("/register", register);
router.post("/login", login);
module.exports = router;


// routes/eventRoutes.js
const express = require("express");
const { createEvent, getEvents, updateEvent, deleteEvent } = require("../controllers/eventController");
const { protect, admin } = require("../middlewares/authMiddleware");
const router = express.Router();
router.post("/", protect, admin, createEvent);
router.get("/", getEvents);
router.put("/:id", protect, admin, updateEvent);
router.delete("/:id", protect, admin, deleteEvent);
module.exports = router;


const express = require('express');
const multer = require('multer');
const Event = require('./models/Event'); // Import the Event model
const app = express();

// Middleware to parse form data and handle file uploads
const upload = multer({ dest: 'uploads/' });

app.post(
  '/api/events',
  upload.fields([{ name: 'eventFile' }, { name: 'attendeeFile' }]),
  async (req, res) => {
    try {
      const { eventName, eventDate, eventType, eventLink } = req.body;
      const eventFile = req.files.eventFile ? req.files.eventFile[0].path : null;
      const attendeeFile = req.files.attendeeFile ? req.files.attendeeFile[0].path : null;

      // Basic validation: Check if all fields are present
      if (!eventName || !eventDate || !eventType || !eventFile || !attendeeFile) {
        return res.status(400).json({ error: 'All fields are required.' });
      }

      // File type validation based on eventType (image/video)
      if (eventType === 'image' && !eventFile.match(/\.(jpg|jpeg|png)$/)) {
        return res.status(400).json({ error: 'Only image files are allowed for this event type.' });
      }

      if (eventType === 'video' && !eventFile.match(/\.(mp4|avi|mov)$/)) {
        return res.status(400).json({ error: 'Only video files are allowed for this event type.' });
      }

      // Create a new event document and save it to the database
      const newEvent = new Event({
        eventName,
        eventDate,
        eventType,
        eventFile,
        attendeeFile,
        eventLink,
      });

      // Save event to the database
      await newEvent.save();

      // Return success response
      return res.status(200).json({ message: 'Event successfully added', event: newEvent });
    } catch (error) {
      console.error('Error saving event:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// Your server setup (example)
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
