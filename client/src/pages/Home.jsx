import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AllEvents = () => {
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
    setError(null); // Clear previous errors
    try {
      const queryParams = new URLSearchParams({
        search,
        startDate,
        endDate,
        page,
        limit: 3, // Add limit here
      }).toString();

      const response = await axios.get(
        `http://localhost:9080/api/events?${queryParams}`,
        {
          withCredentials: true,
        }
      );

      if (response.status !== 200) {
        throw new Error("Error fetching events.");
      }

      const data = response.data;
      setEvents(data.events);
      setTotalPages(data.totalPages);
    } catch (error) {
      setError(error.response?.data?.message || error.message);
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

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchEvents();
  };

  const handleReset = () => {
    setSearch("");
    setStartDate("");
    setEndDate("");
    setPage(1);
    fetchEvents(); // Fetch events after resetting
  };

  const handleCardClick = (eventId) => {
    navigate(`/eventDetails/${eventId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center text-lg font-semibold text-gray-600">
          Loading events...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center text-lg font-semibold text-red-600">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col px-4 sm:px-8 py-8 mt-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
        Featured Events
      </h1>

      {/* Search and Filter Form */}
      <form
        onSubmit={handleSearch}
        className="mb-8 w-full max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-md"
      >
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <input
            type="text"
            placeholder="Search by event name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={handleReset}
            className="bg-black text-white p-3 rounded-md hover:bg-gray-600 transition duration-200 text-sm w-full sm:w-auto"
          >
            Reset
          </button>
        </div>
      </form>

      {/* Event Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mt-8 mb-8">
        {events.length > 0 ? (
          events.map((event, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              onClick={() => handleCardClick(event._id)}
            >
              <div className="relative">
                {event.eventType === "image" && (
                  <img
                    src={event.eventFile}
                    alt={event.eventName}
                    className="w-full h-40 sm:h-48 object-cover"
                  />
                )}
                {event.eventType === "video" && (
                  <div className="relative h-40 sm:h-48">
                    <video controls muted className="w-full h-full object-cover">
                      <source src={event.eventFile} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
                  {event.eventName}
                </h2>
                <p className="text-gray-600 text-sm sm:text-base mb-3">
                  <strong>Date:</strong>{" "}
                  {new Date(event.eventDate).toLocaleDateString()}
                </p>
                <p className="text-gray-600 text-sm sm:text-base mb-3">
                  <strong>Attendees:</strong> {event.attendees}
                </p>
                <p className="text-gray-600 text-sm sm:text-base mb-4 line-clamp-2">
                  {event.eventDescription}
                </p>
                <div className="flex justify-between items-center mt-4">
                  <button className="bg-black text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200">
                    View Details
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

      {/* Pagination */}
      {events.length > 0 && (
        <div className="flex justify-center items-center mt-8 space-x-2">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className={`px-4 py-2 text-sm font-medium ${
              page === 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-800 transition duration-300"
            } rounded-lg`}
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => setPage(index + 1)}
              className={`px-4 py-2 text-sm font-medium ${
                page === index + 1
                  ? "bg-blue-500 text-white"
                  : "bg-black text-white hover:bg-gray-800 transition duration-300"
              } rounded-lg`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages || totalPages === 0}
            className={`px-4 py-2 text-sm font-medium ${
              page === totalPages || totalPages === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-800 transition duration-300"
            } rounded-lg`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AllEvents;