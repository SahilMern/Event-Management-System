import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Loading from "../components/Loading";
import { eventApis } from "../helper/backend/backend";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEventDetails = async () => {
    try {
      const response = await axios.get(`${eventApis}/${id}`, {
        withCredentials: true,
      });
      setEvent(response.data.event);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch event details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      fetchEventDetails();
    }, 200);
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loading />
      </div>
    );
  }

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
    <div className="min-h-screen flex flex-col items-center px-4 sm:px-8 py-12">
      <div className="max-w-6xl w-full space-y-10">
        <h3 className="text-5xl sm:text-6xl font-extrabold text-center text-gray-900 mb-8">
          {event.eventName}
        </h3>

        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-300">
          <div className="grid lg:grid-cols-2 gap-6 p-8">
            <div className="relative">
              {event.eventType === "image" ? (
                <img
                  src={event.eventFile}
                  alt={event.eventName}
                  className="w-full h-96 object-cover rounded-lg shadow-lg"
                />
              ) : event.eventType === "video" ? (
                <div className="relative w-full h-96">
                  <video
                    controls
                    muted
                    className="w-full h-full rounded-lg shadow-lg"
                  >
                    <source src={event.eventFile} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              ) : null}
            </div>

            <div className="flex flex-col space-y-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Date</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {new Date(event.eventDate).toLocaleDateString()}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-500">Location</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {event.eventLocation}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-500">Web link</p>
                <p className="text-[0.8rem] font-semibold text-gray-500 cursor-not-allowed">
                  {event.eventLink} (Not working)
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Description</p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  {event.eventDescription ||
                    "No description available for this event."}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <button
            onClick={() => navigate(-1)}
            className="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition duration-300 transform hover:scale-105"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;