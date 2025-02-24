import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [eventData, setEventData] = useState({
    eventName: "",
    eventDate: "",
    eventType: "image",
    eventLink: "",
    eventFile: null, // Existing file ka naam store hoga
  });

  // Fetch event data on component mount
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await axios.get(`http://localhost:9080/api/events/${id}`);
        const data = response.data;
        setEventData({
          ...data,
          eventDate: data.eventDate ? data.eventDate.split("T")[0] : "",
          eventType: data.eventType.toLowerCase(),
          eventFile: data.eventFile || null, // DB se jo file mili, uska naam store karein
        });
      } catch (error) {
        console.error("Error fetching event data:", error);
      }
    };

    fetchEventData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setEventData((prev) => ({ ...prev, eventFile: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("eventName", eventData.eventName);
    formData.append("eventDate", eventData.eventDate);
    formData.append("eventType", eventData.eventType);
    formData.append("eventLink", eventData.eventLink);

    // Check if a new file is selected and append accordingly
    if (eventData.eventFile && typeof eventData.eventFile !== "string") {
      formData.append("eventFile", eventData.eventFile);
    } else if (eventData.eventFile && typeof eventData.eventFile === "string") {
      formData.append("existingFile", eventData.eventFile); // Send existing file name if no new file is selected
    }

    try {
      const response = await axios.put(
        `http://localhost:9080/api/events/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Required for file uploads
          },
        }
      );

      if (response.status === 200) {
        alert("Event updated successfully!");
        // navigate("/");  // Uncomment if you want to redirect after successful update
      }
    } catch (error) {
      console.error("Update Error:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Edit Event</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Event Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Event Name
          </label>
          <input
            type="text"
            name="eventName"
            value={eventData.eventName}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            required
          />
        </div>

        {/* Event Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Event Date
          </label>
          <input
            type="date"
            name="eventDate"
            value={eventData.eventDate}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            required
          />
        </div>

        {/* Event Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Event Type
          </label>
          <select
            name="eventType"
            value={eventData.eventType}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          >
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
        </div>

        {/* Upload File */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload {eventData.eventType === "image" ? "Image" : "Video"}
          </label>
          <input
            type="file"
            accept={eventData.eventType === "image" ? "image/*" : "video/*"}
            onChange={handleFileChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />

          {/* Existing File Name */}
          {eventData.eventFile && typeof eventData.eventFile === "string" && (
            <p className="text-sm text-gray-500 mt-2">
              Current File: {eventData.eventFile}
            </p>
          )}

          {/* Image Preview */}
          {eventData.eventFile &&
            typeof eventData.eventFile === "string" &&
            eventData.eventType === "image" && (
              <div className="mt-4">
                <img
                  src={`http://localhost:9080/uploads/${eventData.eventFile}`}
                  alt="Uploaded Image"
                  className="w-48 h-48 object-cover rounded-lg shadow-sm"
                />
              </div>
            )}

          {/* Video Name Only (No Preview) */}
          {eventData.eventFile &&
            typeof eventData.eventFile === "string" &&
            eventData.eventType === "video" && (
              <p className="text-sm text-gray-500 mt-2">
                Current Video: {eventData.eventFile}
              </p>
            )}
        </div>

        {/* Event Web Link */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Event Web Link
          </label>
          <input
            type="url"
            name="eventLink"
            value={eventData.eventLink}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            placeholder="Enter URL"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
        >
          Update Event
        </button>
      </form>
    </div>
  );
};

export default EditEvent;