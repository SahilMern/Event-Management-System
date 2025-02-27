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
      enum: ["image", "video"],
    },
    eventFile: {
      type: String,
      required: true,
    },
    eventLink: {
      type: String,
      required: false,
    },
    eventDescription: {
      type: String,
      required: false,
    },
    eventLocation: {
      type: String,
      required: false,
    },
    eventLocationIV: {
      type: String, // Store IV for decryption
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Event = mongoose.model("Event", eventSchema);
export default Event;
