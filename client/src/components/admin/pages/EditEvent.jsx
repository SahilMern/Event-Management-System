import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [eventData, setEventData] = useState({
    eventName: '',
    eventDate: '',
    eventType: 'image',
    eventLink: '',
    eventFile: null, // For new file upload
    eventDescription: '',
    eventLocation: '',
  });
  const [previewUrl, setPreviewUrl] = useState(null); // For preview URL
  const [loading, setLoading] = useState(false); // Loading state

  // Fetch event data on component mount
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await axios.get(`http://localhost:9080/api/events/${id}`, {
          withCredentials: true, // Include cookies
        });
        console.log(response.data, 'response in edit page');

        if (response.data && response.data.event) {
          const data = response.data.event;

          setEventData({
            eventName: data.eventName || '',
            eventDate: data.eventDate ? data.eventDate.split('T')[0] : '',
            eventType: data.eventType.toLowerCase() || 'image',
            eventFile: data.eventFile || null, // Cloudinary URL
            eventDescription: data.eventDescription || '',
            eventLocation: data.eventLocation || '',
            eventLink: data.eventLink || '',
          });

          // Set preview URL if the file already exists
          if (data.eventFile) {
            setPreviewUrl(data.eventFile); // Directly use Cloudinary URL
          }
        } else {
          console.error('Event data is missing in the response');
        }
      } catch (error) {
        console.error('Error fetching event data:', error);
      }
    };

    fetchEventData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prev) => ({ ...prev, [name]: value }));

    // If the event type is changed (image/video), reset previewUrl
    if (name === 'eventType') {
      setPreviewUrl(null); // Reset preview URL when type is changed
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setEventData((prev) => ({ ...prev, eventFile: file }));

    // Set the preview URL for the selected file
    const fileUrl = URL.createObjectURL(file);
    setPreviewUrl(fileUrl); // Update preview URL
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    setLoading(true); // Start loading
  
    const formData = new FormData();
    formData.append('eventName', eventData.eventName);
    formData.append('eventDate', eventData.eventDate);
    formData.append('eventType', eventData.eventType);
    formData.append('eventLink', eventData.eventLink);
    formData.append('eventDescription', eventData.eventDescription);
    formData.append('eventLocation', eventData.eventLocation);
  
    // Always append the existing file URL
    if (eventData.eventFile && typeof eventData.eventFile === 'string') {
      formData.append('existingFile', eventData.eventFile);
    }
  
    // Append the new file if it exists
    if (eventData.eventFile && typeof eventData.eventFile !== 'string') {
      formData.append('eventFile', eventData.eventFile);
    }
  
    // Debugging: Log FormData before sending
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
  
    try {
      const response = await axios.put(
        `http://localhost:9080/api/events/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data', // Required for file uploads
          },
          withCredentials: true, // Include cookies
        }
      );
  
      if (response.status === 200) {
        toast.success('Event updated successfully!');
        // navigate('/'); // Redirect after successful update
      }
    } catch (error) {
      console.error('Update Error:', error);
      toast.error('Error updating the event!');
    } finally {
      setLoading(false); // Stop loading after the API call is done
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-2xl">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Edit Event</h2>

      {/* Event Update Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Event Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Event Name</label>
          <input
            type="text"
            name="eventName"
            value={eventData.eventName}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Enter event name"
            required
          />
        </div>

        {/* Event Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Event Date</label>
          <input
            type="date"
            name="eventDate"
            value={eventData.eventDate}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Event Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Event Type</label>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="image"
                checked={eventData.eventType === 'image'}
                onChange={() => setEventData({ ...eventData, eventType: 'image' })}
                className="form-radio h-5 w-5 text-blue-600"
              />
              <span className="text-gray-700">Image</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="video"
                checked={eventData.eventType === 'video'}
                onChange={() => setEventData({ ...eventData, eventType: 'video' })}
                className="form-radio h-5 w-5 text-blue-600"
              />
              <span className="text-gray-700">Video</span>
            </label>
          </div>
        </div>

        {/* Upload Event File */}
        <div className="border p-6 rounded-lg bg-gray-50 border-dotted">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload {eventData.eventType === 'image' ? 'Image' : 'Video'}
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            accept={eventData.eventType === 'image' ? 'image/*' : 'video/*'}
          />
        </div>

        {/* Show File Preview */}
        {previewUrl && (
          <div className="mt-4">
            <p className="text-sm text-gray-600">Preview:</p>
            {eventData.eventType === 'image' ? (
              <img src={previewUrl} alt="Preview" className="w-full h-auto max-h-64 object-cover rounded-lg" />
            ) : (
              <video controls className="w-full h-auto max-h-64 rounded-lg">
                <source src={previewUrl} type="video/mp4" />
              </video>
            )}
          </div>
        )}

        {/* Event Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Event Description</label>
          <textarea
            name="eventDescription"
            value={eventData.eventDescription}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Enter event description"
            rows="4"
          />
        </div>

        {/* Event Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Event Location</label>
          <input
            type="text"
            name="eventLocation"
            value={eventData.eventLocation}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Enter event location"
          />
        </div>

        {/* Event Web Link */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Event Web Link</label>
          <input
            type="url"
            name="eventLink"
            value={eventData.eventLink}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Enter event URL"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
          disabled={loading} // Disable the button while loading
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin h-5 w-5 mr-3 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Updating...
            </div>
          ) : (
            'Update Event'
          )}
        </button>
      </form>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default EditEvent;