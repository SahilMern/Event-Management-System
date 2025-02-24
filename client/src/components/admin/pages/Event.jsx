import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Event = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth); // Get user from Redux store
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch events from the API
  const fetchEvents = async () => {
    try {
      const queryParams = new URLSearchParams({
        search,
        startDate,
        endDate,
        page,
      }).toString();

      const response = await fetch(
        `http://localhost:9080/api/getEvent?${queryParams}`
      );

      if (!response.ok) {
        throw new Error("Error fetching events.");
      }

      const data = await response.json();
      setEvents(data.events);
      setTotalPages(data.totalPages);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch events on component mount or when search/filters change
  useEffect(() => {
    if (user) {
      fetchEvents();
    }
  }, [search, startDate, endDate, page, user]);

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); // Reset to the first page when searching
    fetchEvents();
  };

  // Reset search and filters
  const handleReset = () => {
    setSearch("");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  // Handle event deletion
  const handleDelete = async (eventId) => {
    try {
      const response = await fetch(`http://localhost:9080/api/events/${eventId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error deleting event.");
      }

      // Refresh events list after deletion
      fetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  if (loading) {
    return (
      <div className="text-center text-lg font-semibold">Loading events...</div>
    );
  }

  return (
    <div className="min-h-[80vh] p-4 sm:p-8 bg-gray-50 flex flex-col">
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6 sm:mb-8 text-gray-800">
        Featured Articles
      </h1>

      {/* Search and Filter Form */}
      <form onSubmit={handleSearch} className="mb-6 sm:mb-8 max-w-4xl mx-auto">
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
            className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 text-sm sm:text-base"
          >
            Reset
          </button>
        </div>
      </form>

      {/* Event Cards */}
      <div className="flex-1">
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
                      src={`http://localhost:9080/${event.eventFile}`}
                      alt={event.eventName}
                      className="w-full h-48 sm:h-56 object-cover"
                    />
                  )}
                  {event.eventType === "video" && (
                    <div className="relative h-48 sm:h-56">
                      <video
                        controls // Add controls for play/pause
                        muted // Mute the video to prevent auto-play
                        className="w-full h-full object-cover"
                      >
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
                  <h2 className="text-xl sm:text-2xl font-bold mb-2 text-gray-800">
                    {event.eventName}
                  </h2>
                  <p className="text-gray-600 mb-4 text-sm sm:text-base">
                    <strong>Date:</strong>{" "}
                    {new Date(event.eventDate).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600 mb-4 text-sm sm:text-base">
                    <strong>Attendees:</strong> {event.attendees}
                  </p>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua.
                  </p>

                  {/* Edit and Delete Buttons */}
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => navigate(`/admin/edit-event/${event._id}`)} // Navigate to edit page
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm sm:text-base"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(event._id)} // Delete event
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm sm:text-base"
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

      {/* Pagination */}
      {events.length > 0 && (
        <div className="flex justify-center mt-6 sm:mt-8">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="mx-2 p-2 bg-black text-white rounded disabled:bg-gray-300 text-sm sm:text-base"
          >
            Previous
          </button>

          {/* Display page numbers */}
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => setPage(index + 1)}
              className={`mx-1 p-2 ${
                page === index + 1 ? "bg-blue-500" : "bg-black"
              } text-white rounded text-sm sm:text-base`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={page === totalPages || totalPages === 0}
            className="mx-2 p-2 bg-black text-white rounded disabled:bg-gray-300 text-sm sm:text-base"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Event;