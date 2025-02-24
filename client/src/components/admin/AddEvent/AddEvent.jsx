import { useState, useRef } from "react";

const AddEvent = () => {
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventType, setEventType] = useState("image");
  const [eventFile, setEventFile] = useState(null);
  const [attendeeFile, setAttendeeFile] = useState(null);
  const [eventLink, setEventLink] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Refs for file inputs
  const eventFileRef = useRef(null);
  const attendeeFileRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const fileExtension = eventFile
      ? eventFile.name.split(".").pop().toLowerCase()
      : "";

    // Validate file type
    if (
      eventType === "image" &&
      !["jpg", "jpeg", "png"].includes(fileExtension)
    ) {
      setError("Please upload a valid image file (JPG, JPEG, PNG).");
      return;
    }

    if (
      eventType === "video" &&
      !["mp4", "avi", "mov"].includes(fileExtension)
    ) {
      setError("Please upload a valid video file (MP4, AVI, MOV).");
      return;
    }

    // Prepare form data
    const formData = new FormData();
    formData.append("eventName", eventName);
    formData.append("eventDate", eventDate);
    formData.append("eventType", eventType);
    formData.append("eventFile", eventFile);
    formData.append("attendeeFile", attendeeFile);
    formData.append("eventLink", eventLink);

    try {
      setLoading(true);
      const response = await fetch("http://localhost:9080/api/events", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to add event.");
      }

      const result = await response.json();
      console.log(result);
      alert("Event added successfully!");

      // Reset form
      setEventName("");
      setEventDate("");
      setEventType("image");
      setEventLink("");

      // Clear file inputs
      setEventFile(null);
      setAttendeeFile(null);
      if (eventFileRef.current) eventFileRef.current.value = ""; // Clear event file input
      if (attendeeFileRef.current) attendeeFileRef.current.value = ""; // Clear attendee file input
    } catch (error) {
      console.error("Error:", error);
      setError("Error submitting the form. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-2xl transform transition-all duration-300 hover:shadow-3xl">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Add an Event
      </h2>

      {/* ERROR HANDLING  */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Event Name */}
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

        {/* Event Date */}
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

        {/* Event Type */}
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

        {/* Upload Event File */}
        <div className="border p-6 rounded-lg bg-gray-50 border-dotted">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Event File
          </label>
          <input
            type="file"
            onChange={(e) => setEventFile(e.target.files[0])}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            required
            ref={eventFileRef} // Add ref to event file input
          />
        </div>

        {/* Upload Attendee List */}
        <div className="border p-6 rounded-lg bg-gray-50 border-dotted">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Attendee List (Excel)
          </label>
          <input
            type="file"
            onChange={(e) => setAttendeeFile(e.target.files[0])}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            required
            ref={attendeeFileRef} // Add ref to attendee file input
          />
        </div>

        {/* Event Web Link */}
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

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-black focus:ring-2 focus:ring-black focus:ring-offset-2 transition-all duration-300 cursor-pointer"
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
  );
};

export default AddEvent;