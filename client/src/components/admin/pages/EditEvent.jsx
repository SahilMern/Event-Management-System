import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditEvent = () => {
  const { id } = useParams(); // Get event ID from URL
  const navigate = useNavigate();
  const [event, setEvent] = useState({
    eventName: "",
    eventDate: "",
    eventType: "",
    eventLink: "",
    eventFile: "",
    attendees: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch event details by ID
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`http://localhost:9080/api/getEvent/${id}`);
        if (!response.ok) {
          throw new Error("Event not found.");
        }
        const data = await response.json();
        setEvent(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEvent((prevEvent) => ({ ...prevEvent, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:9080/api/updateEvent/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      });

      if (!response.ok) {
        throw new Error("Error updating event.");
      }

      // Redirect to events page after successful update
      navigate("/");
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  if (loading) {
    return <div className="text-center text-lg font-semibold">Loading event details...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-[80vh] p-4 sm:p-8 bg-gray-50 flex flex-col items-center">
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6 sm:mb-8 text-gray-800">
        Edit Event
      </h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 sm:p-8 w-full max-w-4xl">
        <div className="space-y-4">
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-700">Event Name</label>
            <input
              type="text"
              name="eventName"
              value={event.eventName}
              onChange={handleInputChange}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-700">Event Date</label>
            <input
              type="date"
              name="eventDate"
              value={event.eventDate.split("T")[0]} // Format date for input
              onChange={handleInputChange}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-700">Event Type</label>
            <select
              name="eventType"
              value={event.eventType}
              onChange={handleInputChange}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
              required
            >
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>
          </div>
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-700">Event Link</label>
            <input
              type="text"
              name="eventLink"
              value={event.eventLink}
              onChange={handleInputChange}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            />
          </div>
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-700">Attendees</label>
            <input
              type="number"
              name="attendees"
              value={event.attendees}
              onChange={handleInputChange}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            />
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Update Event
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditEvent;