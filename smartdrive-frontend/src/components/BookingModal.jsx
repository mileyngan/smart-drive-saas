import React, { useState } from "react";

const BookingModal = ({ instructor, onClose, onBookingConfirm }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [receiveNotification, setReceiveNotification] = useState(false);

  const timeSlots = [
    "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM",
    "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM"
  ];

  const [bookedSlots, setBookedSlots] = useState({
    "9:00 AM": false,
    "9:30 AM": false,
    "10:00 AM": false,
    "10:30 AM": false,
    "11:00 AM": false,
    "11:30 AM": false,
    "12:00 PM": false,
    "12:30 PM": false,
    "1:00 PM": false,
    "1:30 PM": false,
    "2:00 PM": false
  });

  const handleSlotClick = (time) => {
    if (bookedSlots[time]) return;
    setSelectedTime(time);
  };

  const handleBooking = () => {
    onBookingConfirm(selectedDate, selectedClass, selectedTime, receiveNotification);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-md w-96">
        <h2 className="font-bold text-lg mb-4">Book a session with {instructor.name}</h2>

        <label className="block mb-2">Select Date</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="mb-4 w-full p-2 border border-gray-300 rounded"
        />

        <label className="block mb-2">Select Vehicle Class</label>
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="mb-4 w-full p-2 border border-gray-300 rounded"
        >
          <option value="">Select</option>
          <option value="Manual Car">Manual Car</option>
          <option value="Bike">Bike</option>
          <option value="Auto Car">Auto Car</option>
          <option value="Scooter">Scooter</option>
          <option value="Heavy Vehicles">Heavy Vehicles</option>
        </select>

        <label className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={receiveNotification}
            onChange={() => setReceiveNotification(!receiveNotification)}
            className="mr-2"
          />
          Receive notifications
        </label>

        <div className="grid grid-cols-3 gap-4 mb-4">
          {timeSlots.map((time) => (
            <button
              key={time}
              onClick={() => handleSlotClick(time)}
              className={`p-2 border rounded ${
                bookedSlots[time]
                  ? "bg-red-500 cursor-not-allowed"
                  : selectedTime === time
                  ? "bg-green-500"
                  : "bg-white"
              }`}
            >
              {time}
            </button>
          ))}
        </div>

        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="bg-gray-300 px-6 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleBooking}
            className="bg-primary text-white px-6 py-2 rounded"
          >
            Make Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
