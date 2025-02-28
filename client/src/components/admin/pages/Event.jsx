import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { eventApis, getAllEvent } from "../../../helper/backend/backend";
import Loading from "../../Loading";

const Event = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchEvents = async () => {
    try {
      const queryParams = new URLSearchParams({
        search,
        startDate,
        endDate,
        page,
        limit: 3,
      }).toString();

      const response = await axios.get(`${getAllEvent}?${queryParams}`, {
        withCredentials: true,
      });
      setEvents(response.data.events);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      setError(error.response?.data?.message || error.message);
      toast.error("Failed to fetch events. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchEvents();
    }
  }, [search, startDate, endDate, page, user]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleReset = () => {
    setSearch("");
    setStartDate("");
    setEndDate("");
    setPage(1);
    toast.info("Filters reset successfully.");
  };

  const handleDelete = async (eventId) => {
    try {
      const confirmDelete = await window.confirm(
        "Are you sure you want to delete this event?"
      );
      if (!confirmDelete) return;

      await axios.delete(`${eventApis}/${eventId}`, {
        withCredentials: true,
      });
      fetchEvents();
      toast.success("Event deleted successfully!");
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event. Please try again.");
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <>

    <div className="min-h-[80vh] p-4 sm:p-8 bg-gray-50 flex flex-col">
      {/* <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6 sm:mb-8 text-gray-800">
        Admin Evnts
      </h1> */}

      {/* Search Functionality */}
      <form className="mb-6 sm:mb-8 w-full mx-auto">
        <div className="flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Search by event name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded text-sm sm:text-base"
          />
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-2 border border-gray-300 rounded text-sm sm:text-base"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="p-2 border border-gray-300 rounded text-sm sm:text-base"
          />
          <button
            type="button"
            onClick={handleReset}
            className="bg-red-500 text-white p-2 rounded hover:bg-red-700 text-sm sm:text-base"
          >
            Reset
          </button>
          <NavLink to={"/admin/addevent"}>
            <button className="bg-black rounded-sm text-white p-2">
              Add Events
            </button>
          </NavLink>
        </div>
      </form>

      <div className="flex-1 mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {events.length > 0 ? (
            events.map((event, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative">
                  {event.eventType === "image" && (
                    <img
                      src={event.eventFile}
                      alt={event.eventName}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  {event.eventType === "video" && (
                    <div className="relative h-48">
                      <video
                        controls
                        muted
                        className="w-full h-full object-cover"
                      >
                        <source src={event.eventFile} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  )}
                </div>
                <div className="p-4 sm:p-6">
                  <h2 className="text-xl sm:text-2xl font-bold mb-2 text-gray-800">
                    {event.eventName}
                  </h2>
                  <p className="text-gray-600 mb-4 text-sm sm:text-base">
                    <strong>Date:</strong>{" "}
                    {new Date(event.eventDate).toLocaleDateString()}
                  </p>
                  {event.eventLocation && (
                    <p className="text-gray-600 mb-4 text-sm sm:text-base">
                      <strong>Location:</strong> {event.eventLocation}
                    </p>
                  )}
                  {event.eventDescription && (
                    <p className="text-gray-600 text-sm sm:text-base line-clamp-2">
                      {event.eventDescription}
                    </p>
                  )}
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => navigate(`/admin/edit-event/${event._id}`)}
                      className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors text-sm sm:text-base"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(event._id)}
                      className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors text-sm sm:text-base"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 flex justify-center items-center h-64">
              <p className="text-center text-gray-600 text-lg">
                No events found. Try adjusting your search or filters.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Pagination Logic */}
      {events.length > 0 && (
        <div className="flex justify-center items-center mt-6 sm:mt-8 space-x-2">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            Previous
          </button>
          <div className="flex space-x-1">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => setPage(index + 1)}
                className={`px-3 py-2 ${
                  page === index + 1
                    ? "bg-blue-500 text-white"
                    : "bg-white text-black border border-gray-300"
                } rounded-lg hover:bg-gray-100 transition-colors text-sm sm:text-base`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={page === totalPages || totalPages === 0}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            Next
          </button>
        </div>
      )}
    </div>
      <ToastContainer />
      </>
  );
};

export default Event;
