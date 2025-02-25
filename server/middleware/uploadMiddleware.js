import multer from "multer";
const storage = multer.memoryStorage();  // File stored in memory as a Buffer
const fileFilter = (req, file, cb) => {
  const allowedImageTypes = ["image/jpeg", "image/png", "image/jpg"];
  const allowedVideoTypes = ["video/mp4", "video/avi", "video/mov"];

  if (req.body.eventType === "image" && allowedImageTypes.includes(file.mimetype)) {
    cb(null, true);
  } else if (req.body.eventType === "video" && allowedVideoTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"), false); 
  }
};
const upload = multer({ storage, fileFilter });
export default upload;
