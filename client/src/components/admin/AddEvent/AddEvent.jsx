import { useState } from "react";

const AddEvent = () => {
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventType, setEventType] = useState("image");
  const [eventFile, setEventFile] = useState(null);
  const [attendeeFile, setAttendeeFile] = useState(null);
  const [eventLink, setEventLink] = useState("");
  const [error, setError] = useState(""); // State to store error messages
  const [loading, setLoading] = useState(false); // State for loading spinner

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    setError("");
  
    const fileExtension = eventFile ? eventFile.name.split(".").pop().toLowerCase() : "";
  
    // Validate if the file type matches the selected event type
    if (eventType === "image" && !["jpg", "jpeg", "png"].includes(fileExtension)) {
      setError("Please upload a valid image file (JPG, JPEG, PNG).");
      return;
    }
  
    if (eventType === "video" && !["mp4", "avi", "mov"].includes(fileExtension)) {
      setError("Please upload a valid video file (MP4, AVI, MOV).");
      return;
    }
  
    // Proceed with form submission if validation passes
    const formData = new FormData();
    formData.append("eventName", eventName);
    formData.append("eventDate", eventDate);
    formData.append("eventType", eventType);
    formData.append("eventFile", eventFile);
    formData.append("attendeeFile", attendeeFile);
    formData.append("eventLink", eventLink);
  
    try {
      setLoading(true); // Set loading to true before sending the request
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
  
      // Reset form values after successful submission
      setEventName("");
      setEventDate("");
      setEventType("image");
      setEventLink("");
  
      // Reset file input values
      setEventFile(null);   // Reset event file
      setAttendeeFile(null); // Reset attendee file
      setEventFile("");   // Reset event file
      setAttendeeFile("")
    } catch (error) {
      console.error("Error:", error);
      setError("Error submitting the form. Please try again later.");
    } finally {
      setLoading(false); // Reset loading state
    }
  };
  

  return (
    <div className="max-w-lg mx-auto p-6 border rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Add an Event</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>} {/* Show error message if any */}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1">Event Name</label>
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Name of the event"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">Event Date</label>
          <input
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

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

        <div className="mb-4 border p-4 rounded">
          <label className="block mb-2">Upload Attendee List (Excel)</label>
          <input
            type="file"
            onChange={(e) => setAttendeeFile(e.target.files[0])}
            className="w-full"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">Event Web Link</label>
          <input
            type="url"
            value={eventLink}
            onChange={(e) => setEventLink(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter URL"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white p-2 rounded"
          disabled={loading} // Disable button while submitting
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default AddEvent;
