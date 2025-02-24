import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Home = () => {
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
  };

  const handleCardClick = (eventId) => {
    navigate(`/eventDetails/${eventId}`); // Navigate to event details page with the event ID
  };

  if (loading) {
    return (
      <div className="text-center text-lg font-semibold text-gray-600">
        Loading events...
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
        className="mb-8 max-w-5xl mx-auto bg-white p-6 rounded-xl shadow-md"
      >
        <div className="flex flex-wrap gap-4 justify-between">
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
            className="bg-black text-white p-3 rounded-md hover:bg-gray-600 transition duration-200 text-sm w-[8rem]"
          >
            Reset
          </button>
        </div>
      </form>

      {/* Event Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {events.length > 0 ? (
          events.map((event, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              onClick={() => handleCardClick(event._id)} // Use event ID to navigate
            >
              <div className="relative">
                {event.eventType === "image" && (
                  <img
                    src={`http://localhost:9080/${event.eventFile}`}
                    alt={event.eventName}
                    className="w-full h-40 sm:h-48 object-cover"
                  />
                )}
                {event.eventType === "video" && (
                  <div className="relative h-40 sm:h-48">
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
                {/* Shorten the description with max height and ellipsis */}
                <p className="text-gray-600 text-sm sm:text-base mb-4 line-clamp-2">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Curabitur pretium, felis vel suscipit elementum.
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
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="mx-2 p-3 bg-black text-white rounded-lg disabled:bg-gray-300 text-sm"
          >
            Previous
          </button>

          {/* Page numbers */}
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => setPage(index + 1)}
              className={`mx-1 p-3 ${
                page === index + 1 ? "bg-blue-500" : "bg-black"
              } text-white rounded-lg text-sm`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={page === totalPages || totalPages === 0}
            className="mx-2 p-3 bg-black text-white rounded-lg disabled:bg-gray-300 text-sm"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
