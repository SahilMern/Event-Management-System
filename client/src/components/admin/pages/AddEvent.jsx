import { useState, useRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { eventApis } from "../../../helper/backend/backend";

const AddEvent = () => {
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventType, setEventType] = useState("image");
  const [eventFile, setEventFile] = useState(null);
  const [eventLink, setEventLink] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const eventFileRef = useRef(null);

  //TODO:- Handle Event submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    //? strict validation to uplaod image and video
    const fileExtension = eventFile
      ? eventFile.name.split(".").pop().toLowerCase()
      : "";

    if (
      eventType === "image" &&
      !["jpg", "jpeg", "png"].includes(fileExtension)
    ) {
      toast.error("Please upload a valid image file (JPG, JPEG, PNG).");
      return;
    }

    if (
      eventType === "video" &&
      !["mp4", "avi", "mov"].includes(fileExtension)
    ) {
      toast.error("Please upload a valid video file (MP4, AVI, MOV).");
      return;
    }

    const formData = new FormData();
    formData.append("eventName", eventName);
    formData.append("eventDate", eventDate);
    formData.append("eventType", eventType);
    formData.append("eventFile", eventFile);
    formData.append("eventLink", eventLink);
    formData.append("eventDescription", eventDescription);
    formData.append("eventLocation", eventLocation);

    try {
      setLoading(true);
      const response = await axios.post(
        eventApis,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      toast.success('Event added successfully!');

      setEventName("");
      setEventDate("");
      setEventType("image");
      setEventLink("");
      setEventDescription("");
      setEventLocation("");
      setPreviewUrl(null);
      setEventFile(null);
      if (eventFileRef.current) eventFileRef.current.value = "";
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        error.response?.data?.message ||
          "Error submitting the form. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setEventFile(file);

    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
    }
  };

  return (
    <>
      <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-2xl transform transition-all duration-300 hover:shadow-3xl">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Add an Event
        </h2>

        {/* Event Form data */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Name
            </label>
            <input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all outline-none"
              placeholder="Name of the event"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Date
            </label>
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full px-4 py-3 border border-black rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all"
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
          </div>

          <div className="border p-6 rounded-lg bg-gray-50 border-dotted">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Event File
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              required
              ref={eventFileRef}
            />
          </div>

          {previewUrl && (
            <div className="mt-4">
              {eventType === "image" ? (
                <img
                  src={previewUrl}
                  alt="Event Preview"
                  className=" h-[8rem]  rounded-2xl"
                />
              ) : (
                <video
                  src={previewUrl}
                  controls
                  className="h-[20rem] w-full rounded-2xl"
                >
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
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all"
              placeholder="Enter a description for the event"
              rows="4"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Location
            </label>
            <input
              type="text"
              value={eventLocation}
              onChange={(e) => setEventLocation(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all"
              placeholder="Enter the event location"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Web Link
            </label>
            <input
              type="url"
              value={eventLink}
              onChange={(e) => setEventLink(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all"
              placeholder="Enter URL"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-900 focus:ring-2 focus:ring-black focus:ring-offset-2 transition-all duration-300 cursor-pointer"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Submitting...
              </div>
            ) : (
              "Submit"
            )}
          </button>
        </form>
      </div>
      <ToastContainer />
    </>
  );
};

export default AddEvent;
