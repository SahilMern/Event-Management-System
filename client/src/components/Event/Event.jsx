import { useState } from "react";

const Event = () => {
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventType, setEventType] = useState("image");
  const [eventFile, setEventFile] = useState(null);
  const [attendeeFile, setAttendeeFile] = useState(null);
  const [eventLink, setEventLink] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("eventName", eventName);
    formData.append("eventDate", eventDate);
    formData.append("eventType", eventType);
    formData.append("eventFile", eventFile);
    formData.append("attendeeFile", attendeeFile);
    formData.append("eventLink", eventLink);

    try {
      const response = await fetch("http://localhost:9080/api/events", {
        method: "POST",
        body: formData,
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log("Event successfully added:", result);
      } else {
        console.error("Failed to add event");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 border rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Add an Event</h2>
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
              />{" "}
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

        <button type="submit" className="w-full bg-black text-white p-2 rounded">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Event;
