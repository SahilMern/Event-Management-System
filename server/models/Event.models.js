import mongoose from "mongoose";

// Check if the model already exists to avoid overwriting it
const Event = mongoose.models.Event || mongoose.model('Event', new mongoose.Schema({
  eventName: { type: String, required: true },
  eventDate: { type: Date, required: true },
  eventType: { type: String, required: true },
  eventFile: { type: String, required: true },
  eventLink: { type: String, required: true },
  eventDescription: { type: String, required: true },
  eventLocation: { type: String, required: true },
}, { timestamps: true }));

export default Event;
