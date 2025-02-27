import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { eventApis } from "../../../helper/backend/backend";

const SingleEventDetails = () => {
  const { id } = useParams(); // Get event ID from URL
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch event details by ID
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(
          `${eventApis}/${id}`
        );
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

  if (loading) {
    return (
      <div className="text-center text-lg font-semibold">
        Loading event details...
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-[80vh] p-4 sm:p-8 bg-gray-50 flex flex-col items-center">
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6 sm:mb-8 text-gray-800">
        {event.eventName}
      </h1>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-4xl">
        <div className="relative">
          {event.eventType === "image" && (
            <img
              src={`http://localhost:9080/${event.eventFile}`}
              alt={event.eventName}
              className="w-full h-64 sm:h-80 object-cover"
            />
          )}
          {event.eventType === "video" && (
            <div className="relative h-64 sm:h-80">
              <video controls muted className="w-full h-full object-cover">
                <source
                  src={`http://localhost:9080/${event.eventFile}`}
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </div>

        <div className="p-4 sm:p-6">
          <p className="text-gray-600 mb-4 text-sm sm:text-base">
            <strong>Date:</strong>{" "}
            {new Date(event.eventDate).toLocaleDateString()}
          </p>
          <p className="text-gray-600 mb-4 text-sm sm:text-base">
            <strong>Attendees:</strong> {event.attendees}
          </p>
          <p className="text-gray-600 text-sm sm:text-base">
            <strong>Description:</strong> {event.eventDescription || "No description available."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SingleEventDetails;
