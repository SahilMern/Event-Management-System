import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

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

  useEffect(() => {
    fetch(`http://localhost:9080/api/events/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setEventData({
          ...data,
          eventDate: data.eventDate ? data.eventDate.split("T")[0] : "",
          eventType: data.eventType.toLowerCase(),
          eventFile: data.eventFile || null, // DB se jo file mili, uska naam store karein
        });
      })
      .catch((err) => console.error(err));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setEventData((prev) => ({ ...prev, eventFile: e.target.files[0] }));
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   const formData = new FormData();
  //   formData.append("eventName", eventData.eventName);
  //   formData.append("eventDate", eventData.eventDate);
  //   formData.append("eventType", eventData.eventType);
  //   formData.append("eventLink", eventData.eventLink);

  //   if (eventData.eventFile && typeof eventData.eventFile !== "string") {
  //     formData.append("eventFile", eventData.eventFile);
  //   } else {
  //     formData.append("existingFile", eventData.eventFile); // Purana file ka naam bhejna hoga
  //   }

  //   try {
  //     const response = await fetch(`http://localhost:9080/api/events/${id}`, {
  //       method: "PUT",
  //       body: formData,
  //     });

  //     if (!response.ok) throw new Error("Failed to update event");

  //     alert("Event updated successfully!");
  //   //   navigate("/");
  //   } catch (error) {
  //     console.error("Update Error:", error);
  //   }
  // };


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
      const response = await fetch(`http://localhost:9080/api/events/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to update event");

      alert("Event updated successfully!");
      // navigate("/");  // Uncomment if you want to redirect after successful update
    } catch (error) {
      console.error("Update Error:", error);
    }
};

  return (
    <div className="max-w-lg mx-auto p-6 border rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Edit Event</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1">Event Name</label>
          <input
            type="text"
            name="eventName"
            value={eventData.eventName}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">Event Date</label>
          <input
            type="date"
            name="eventDate"
            value={eventData.eventDate}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">Event Type</label>
          <select
            name="eventType"
            value={eventData.eventType}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-1">Upload {eventData.eventType}</label>
          <input
            type="file"
            accept={eventData.eventType === "image" ? "image/*" : "video/*"}
            onChange={handleFileChange}
            className="w-full p-2 border rounded"
          />

          {/* Existing File Name Show Karega */}
          {eventData.eventFile && typeof eventData.eventFile === "string" && (
            <p className="text-sm text-gray-500 mt-1">
              Current File: {eventData.eventFile}
            </p>
          )}

          {/* Image Preview */}
          {eventData.eventFile &&
            typeof eventData.eventFile === "string" &&
            eventData.eventType === "image" && (
              <div className="mt-2">
                <img
                  src={`http://localhost:9080/uploads/${eventData.eventFile}`}
                  alt="Uploaded Image"
                  className="w-32 h-32 object-cover"
                />
              </div>
            )}

          {/* Video Name Only (No Preview) */}
          {eventData.eventFile &&
            typeof eventData.eventFile === "string" &&
            eventData.eventType === "video" && (
              <p className="text-sm text-gray-500 mt-1">
                Current Video: {eventData.eventFile}
              </p>
            )}
        </div>

        <div className="mb-4">
          <label className="block mb-1">Event Web Link</label>
          <input
            type="url"
            name="eventLink"
            value={eventData.eventLink}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Enter URL"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          Update Event
        </button>
      </form>
    </div>
  );
};

export default EditEvent;
