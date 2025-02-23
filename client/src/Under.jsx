import { useState } from "react";

const Under = () => {
  const [eventType, setEventType] = useState("image");
  const [eventFile, setEventFile] = useState(null);

  return (
    <>
          <div className="mb-4">
            <label className="block mb-1">Event Type</label>
            <div>
              <label className="mr-4">
                <input
                  type="radio"
                  value="image"
                  checked={eventType === "image"}
                  onChange={() => setEventType("image")}
                />{" "}
                Image
              </label>
              <label>
                <input
                  type="radio"
                  value="video"
                  checked={eventType === "video"}
                  onChange={() => setEventType("video")}
                />
                Video
              </label>
            </div>
          </div>
          <div className="mb-4 border p-4 rounded">
          <label className="block mb-2">Upload Event File</label>
          <input
            type="file"
            onChange={(e) => setEventFile(e.target.files[0])}
            className="w-full"
            required
          />
        </div>
    </>
    
  )
}

export default Under