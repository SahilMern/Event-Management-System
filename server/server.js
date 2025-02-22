console.log("JAI SHREE RAM JI / JAI BAJARANG BALI JI");
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express from "express";
const app = express();
const PORT = process.env.PORT || 9080;
import path from "path";
import cookieParser from "cookie-parser";
import "./config/Database/connection.js";

//? Middlewares
app.use(express.json());
app.use(cors());
app.use(cookieParser());

//TODO:- Routes Handling Here
import { AuthRoutes } from "./routes/index.js";
import multer from "multer";
app.use("/api/auth", AuthRoutes);


// Set up file storage using multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log(file, "file");
        
      cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });
  
  const upload = multer({ storage: storage });
  

app.post("/api/events", upload.fields([{ name: "eventFile" }, { name: "attendeeFile" }]), (req, res) => {
    const { eventName, eventDate, eventType, eventLink } = req.body;
    const eventFile = req.files.eventFile ? req.files.eventFile[0].path : null;
    const attendeeFile = req.files.attendeeFile ? req.files.attendeeFile[0].path : null;
  
    if (!eventName || !eventDate || !eventType || !eventFile || !attendeeFile) {
      return res.status(400).json({ error: "All fields are required." });
    }
  
    // Logic to handle event based on eventType (image or video)
    if (eventType === "image" && !eventFile.match(/\.(jpg|jpeg|png)$/)) {
      return res.status(400).json({ error: "Only image files are allowed for this event type." });
    }
  
    if (eventType === "video" && !eventFile.match(/\.(mp4|avi|mov)$/)) {
      return res.status(400).json({ error: "Only video files are allowed for this event type." });
    }
  
    // Save event to database or process as needed
    // For now, we just log the data
    console.log({
      eventName,
      eventDate,
      eventType,
      eventFile,
      attendeeFile,
      eventLink,
    });
  
    res.status(200).json({ message: "Event successfully added" });
  });
app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
