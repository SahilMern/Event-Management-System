import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Event = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const fetchEvents = async () => {
    try {
      const queryParams = new URLSearchParams({
        search,
        startDate,
        endDate,
        page,
      }).toString();

      const response = await fetch(`http://localhost:9080/api/getEvent?${queryParams}`);

      if (!response.ok) {
        throw new Error("Error fetching events.");
      }

      const data = await response.json();
      setEvents(data.events);
      setTotalPages(data.totalPages); // Ensure this is updated
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [search, startDate, endDate, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); // Reset to the first page when searching
    fetchEvents();
  };

  const handleReset = () => {
    setSearch("");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  const handleDelete = async (eventId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this event?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:9080/api/events/${eventId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete the event");
      }

      setEvents(events.filter((event) => event._id !== eventId));
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return <div className="text-center text-lg font-semibold">Loading events...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">All Events</h1>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Search by event name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded"
          />
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          />
          {/* <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Search
          </button> */}
          <button
            type="button"
            onClick={handleReset}
            className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
          >
            Reset
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.length > 0 ? (
          events.map((event, index) => (
            <div key={index} className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="relative">
                {event.eventType === "image" && (
                  <img
                    src={`http://localhost:9080/${event.eventFile}`}
                    alt={event.eventName}
                    className="w-full h-48 object-cover"
                  />
                )}
                {event.eventType === "video" && (
                  <div className="relative">
                    <video className="w-full h-48 object-cover">
                      <source
                        src={`http://localhost:9080/${event.eventFile}`}
                        type="video/mp4"
                      />
                    </video>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black bg-opacity-50 rounded-full p-3">
                        <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M4 4l12 6-12 6V4z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{event.eventName}</h3>
                <p className="text-gray-700">
                  <strong>Date:</strong> {new Date(event.eventDate).toLocaleDateString()}
                </p>
                <p className="text-gray-700">
                  <strong>Attendees:</strong> {event.attendees}
                </p>
                <div className="flex space-x-4 mt-4">
                  <button
                    onClick={() => navigate(`/edit-event/${event._id}`, { state: event })}
                    className="text-blue-500 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(event._id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">No events found.</p>
        )}
      </div>

      <div className="flex justify-center mt-6">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="mx-2 p-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Previous
        </button>

        {/* Display page numbers */}
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => setPage(index + 1)}
            className={`mx-1 p-2 ${
              page === index + 1 ? "bg-blue-700" : "bg-blue-500"
            } text-white rounded`}
          >
            {index + 1}
          </button>
        ))}

        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={page === totalPages || totalPages === 0}
          className="mx-2 p-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Event;