import React, { useState } from "react";
import axios from 'axios';

function CourseForm() {
  const [name, setName] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [description, setDescription] = useState("");
  const [onlineClassNo, setOnlineClassNo] = useState("");
  const [practicalClassNo, setPracticalClassNo] = useState("");
  const [onlinePass, setOnlinePass] = useState("");
  const [practicalPass, setPracticalPass] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const courseData = {
      name,
      vehicleType,
      description,
      onlineClassNo,
      practicalClassNo,
      onlinePass,
      practicalPass
    };

    try {
      const response = await axios.post("http://localhost:5000/api/course", courseData, {
        headers: { 'Content-Type': 'application/json' }
      });
      console.log(response.data);
      alert("Course added successfully!");
    } catch (error) {
      console.error("Error adding course:", error.response?.data || error.message);
      alert("Error adding course.");
    }

    // Reset form after submission
    setName('');
    setVehicleType('');
    setDescription('');
    setOnlineClassNo('');
    setPracticalClassNo('');
    setOnlinePass('');
    setPracticalPass('');
  };

  const handleDescChange = (event) => setDescription(event.target.value);
  const handleVTypeChange = (event) => setVehicleType(event.target.value);
  const handleOnlineChange = (event) => setOnlineClassNo(event.target.value);
  const handlePracticalChange = (event) => setPracticalClassNo(event.target.value);
  const handleOnlinePassChange = (event) => setOnlinePass(event.target.value);
  const handlePracticalPassChange = (event) => setPracticalPass(event.target.value);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-8">Create a New Course</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Course Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Course Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Vehicle Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Vehicle Type</label>
          <select
            value={vehicleType}
            onChange={handleVTypeChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="None">Manual Car</option>
            <option value="Course1">Auto Scooter</option>
            <option value="Course2">Motor bike</option>
            <option value="Course3">Auto Car</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={handleDescChange}
            placeholder="Write a description for the course."
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Number of Online Classes */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Number of Online Classes</label>
          <input
            type="number"
            value={onlineClassNo}
            onChange={handleOnlineChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Number of Practical Sessions */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Number of Practical Sessions</label>
          <input
            type="number"
            value={practicalClassNo}
            onChange={handlePracticalChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Passing Grade for Online Classes */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Passing Grade for Online Classes</label>
          <input
            type="number"
            value={onlinePass}
            onChange={handleOnlinePassChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Passing Grade for Practical Sessions */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Passing Grade for Practical Sessions</label>
          <input
            type="number"
            value={practicalPass}
            onChange={handlePracticalPassChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            Create Course
          </button>
        </div>
      </form>
    </div>
  );
}

export default CourseForm;
