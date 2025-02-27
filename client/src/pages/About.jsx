import React from "react";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      {/* User Profile Section */}
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gray-800 p-6 text-center">
          <img
            src="https://img.freepik.com/premium-vector/programming-home_118813-4357.jpg?w=1380" // Replace with your image URL
            alt="profile"
            className="w-32 h-32 rounded-full mx-auto border-4 border-white"
          />
          <h1 className="mt-4 text-2xl font-bold text-white">John Doe</h1>
          <p className="text-gray-400">@johndoe</p>
        </div>

        {/* Profile Details */}
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-500">Address</label>
              <p className="text-gray-800">123 Main Street, New York, USA</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Email</label>
              <p className="text-gray-800">johndoe@example.com</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Phone Number</label>
              <p className="text-gray-800">+1 (123) 456-7890</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Description</label>
              <p className="text-gray-800">
                I am a MERN stack developer with 3+ years of experience in building scalable and
                efficient web applications. I specialize in React, Node.js, and MongoDB.
              </p>
            </div>
          </div>
        </div>
      </div>

   
    </div>
  );
};

export default About;