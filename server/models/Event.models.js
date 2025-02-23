// const mongoose = require("mongoose");
import mongoose from "mongoose";

// Create the Event Schema
const eventSchema = new mongoose.Schema(
  {
    eventName: {
      type: String,
      required: true,
    },
    eventDate: {
      type: Date,
      required: true,
    },
    eventType: {
      type: String,
      required: true,
      enum: ["image", "video"], // Only image or video are allowed
    },
    eventFile: {
      type: String, // Store file path of the uploaded event file
      required: true,
    },
    attendeeFile: {
      type: String, // Store file path of the uploaded attendee file
      required: true,
    },
    eventLink: {
      type: String, // Optional web link for the event
      required: false,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Create a model from the schema
const Eventss = mongoose.model("Event", eventSchema);

export default Eventss;
