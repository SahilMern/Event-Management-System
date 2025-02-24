import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios"; // Import Axios

const EventDetails = () => {
  const { id } = useParams(); // Get the event ID from the URL
  const navigate = useNavigate(); // For navigation
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch event details using Axios
  const fetchEventDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:9080/api/events/${id}`);
      // console.log(response, "response");
      
      setEvent(response.data); 
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch event details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center text-lg font-semibold text-gray-600">
          Loading event details...
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center text-lg font-semibold text-red-600">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 sm:px-8 py-12">
      <div className="max-w-6xl w-full">
        {/* Event Title */}
        <h1 className="text-4xl sm:text-5xl font-bold text-center text-gray-900 mb-8">
          {event.eventName}
        </h1>

        {/* Event Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Image or Video Section */}
            <div className="lg:w-1/2">
              {event.eventType === "image" ? (
                <img
                  src={`http://localhost:9080/${event.eventFile}`}
                  alt={event.eventName}
                  className="w-full h-96 object-cover"
                />
              ) : event.eventType === "video" ? (
                <div className="relative w-full h-96">
                  <video
                    controls
                    muted
                    className="w-full h-full object-cover"
                  >
                    <source
                      src={`http://localhost:9080/${event.eventFile}`}
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                </div>
              ) : null}
            </div>

            {/* Event Details Section */}
            <div className="lg:w-1/2 p-8">
              <div className="space-y-6">
                {/* Event Date */}
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(event.eventDate).toLocaleDateString()}
                  </p>
                </div>

                {/* Attendees */}
                <div>
                  <p className="text-sm text-gray-500">Attendees</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {event.attendees}
                  </p>
                </div>

                {/* Event Description */}
                <div>
                  <p className="text-sm text-gray-500">Description</p>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut
                    architecto suscipit, optio ea natus ducimus tempore id
                    possimus inventore sed deleniti, in, excepturi veniam ipsa.
                  </p>
                </div>

         
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;