const EventCard = ({ event }) => {
    return (
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "16px",
          width: "300px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2>{event.eventName}</h2>
        <p>Date: {new Date(event.eventDate).toLocaleDateString()}</p>
        <p>Type: {event.eventType}</p>
        <p>Link: <a href={event.eventLink} target="_blank" rel="noopener noreferrer">Visit Event</a></p>
        {event.eventFile && (
          <div>
            {event.eventType === "image" ? (
              <img
                src={`http://localhost:5000/${event.eventFile}`}
                alt="Event"
                style={{ width: "100%", borderRadius: "8px" }}
              />
            ) : (
              <video controls style={{ width: "100%", borderRadius: "8px" }}>
                <source src={`http://localhost:5000/${event.eventFile}`} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        )}
      </div>
    );
  };