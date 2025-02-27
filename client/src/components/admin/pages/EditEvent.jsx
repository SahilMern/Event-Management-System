import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { eventApis } from "../../../helper/backend/backend";

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [eventData, setEventData] = useState({
    eventName: "",
    eventDate: "",
    eventType: "image",
    eventLink: "",
    eventFile: null,
    eventDescription: "",
    eventLocation: "",
    myname: "saaa",
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetching Event data
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await axios.get(`${eventApis}/${id}`, {
          withCredentials: true,
        });
        if (response.data && response.data.event) {
          const data = response.data.event;
          setEventData({
            eventName: data.eventName || "",
            eventDate: data.eventDate ? data.eventDate.split("T")[0] : "",
            eventType: data.eventType.toLowerCase() || "image",
            eventFile: data.eventFile || null,
            eventDescription: data.eventDescription || "",
            eventLocation: data.eventLocation || "",
            eventLink: data.eventLink || "",
          });
          if (data.eventFile) {
            setPreviewUrl(data.eventFile);
          }
        }
      } catch (error) {
        console.error("Error fetching event data:", error);
      }
    };
    fetchEventData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prev) => ({ ...prev, [name]: value }));
    if (name === "eventType") {
      setPreviewUrl(null);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setEventData((prev) => ({ ...prev, eventFile: file }));

    // Ensure the file is properly read before setting the preview URL
    const reader = new FileReader();
    
    reader.onloadend = () => {
      setPreviewUrl(reader.result); // Set preview URL after the file is loaded
    };

    if (file) {
      // Read the file as a data URL
      reader.readAsDataURL(file);
    }
  };

  // Handling Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("eventName", eventData.eventName);
    formData.append("eventDate", eventData.eventDate);
    formData.append("eventType", eventData.eventType);
    formData.append("eventLink", eventData.eventLink);
    formData.append("eventDescription", eventData.eventDescription);
    formData.append("eventLocation", eventData.eventLocation);
    if (eventData.eventFile && typeof eventData.eventFile === "string") {
      formData.append("existingFile", eventData.eventFile);
    }
    if (eventData.eventFile && typeof eventData.eventFile !== "string") {
      formData.append("eventFile", eventData.eventFile);
    }
    try {
      const response = await axios.put(
        `${eventApis}/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        toast.success("Event updated successfully!");
      }
    } catch (error) {
      console.error("Update Error:", error);
      toast.error("Error updating the event!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-2xl">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Edit Event
      </h2>

      {/* Handle Edit submission */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Event Name
          </label>
          <input
            type="text"
            name="eventName"
            value={eventData.eventName}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Enter event name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Event Date
          </label>
          <input
            type="date"
            name="eventDate"
            value={eventData.eventDate}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Event Type
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="image"
                checked={eventData.eventType === "image"}
                onChange={() =>
                  setEventData({ ...eventData, eventType: "image" })
                }
                className="form-radio h-5 w-5 text-blue-600"
              />
              <span className="text-gray-700">Image</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="video"
                checked={eventData.eventType === "video"}
                onChange={() =>
                  setEventData({ ...eventData, eventType: "video" })
                }
                className="form-radio h-5 w-5 text-blue-600"
              />
              <span className="text-gray-700">Video</span>
            </label>
          </div>
        </div>
        <div className="border p-6 rounded-lg bg-gray-50 border-dotted">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload {eventData.eventType === "image" ? "Image" : "Video"}
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            accept={eventData.eventType === "image" ? "image/*" : "video/*"}
          />
        </div>
        {previewUrl && (
          <div className="mt-4">
            <p className="text-sm text-gray-600">Preview:</p>
            {eventData.eventType === "image" ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="h-[16rem] object-cover rounded-lg"
              />
            ) : (
              <video controls className="w-full h-auto max-h-64 rounded-lg">
                <source src={previewUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Event Description
          </label>
          <textarea
            name="eventDescription"
            value={eventData.eventDescription}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Enter event description"
            rows="4"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Event Location
          </label>
          <input
            type="text"
            name="eventLocation"
            value={eventData.eventLocation}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Enter event location"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Event Web Link
          </label>
          <input
            type="url"
            name="eventLink"
            value={eventData.eventLink}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Enter event URL"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-900 cursor-pointer focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin h-5 w-5 mr-3 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Updating...
            </div>
          ) : (
            "Update Event"
          )}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default EditEvent;
