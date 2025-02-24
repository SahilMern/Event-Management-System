import React, { useState } from "react";

const Under = () => {
  console.log(["jpg", "jpeg", "png"].includes("jpg"));
  
  const [eventType, setEventType] = useState("image");
  console.log(eventType, "event");

  const handleFileSellect = (e) => {
    console.log(e.target.files[0], "data In E"); 
    
  }
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Event Type
      </label>
      <div className="flex space-x-4">
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            value="image"
            checked={eventType === "image"}
            onChange={() => setEventType("image")}
            className="form-radio h-5 w-5 text-blue-600"
          />
          <span className="text-gray-700">Image</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            value="video"
            checked={eventType === "video"}
            onChange={() => setEventType("video")}
            className="form-radio h-5 w-5 text-blue-600"
          />
          <span className="text-gray-700">Video</span>
        </label>
      </div>

      <input
        type="file"
        onChange={handleFileSellect}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        required
      />
    </div>
  );
};

export default Under;
