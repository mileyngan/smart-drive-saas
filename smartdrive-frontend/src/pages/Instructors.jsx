import React, { useState } from "react";
import InstructorCard from "../components/InstructorCard";
import BookingModal from "../components/BookingModal";

const instructors = [
  {
    name: "Suraj Kumar",
    specialty: "Manual Car",
    experience: 5
  },
  {
    name: "Jane Smith",
    specialty: "Bike",
    experience: 3
  },
  {
    name: "Roy De Silva",
    specialty: "Heavy Vehicles",
    experience: 7
  }
];

const Instructors = () => {
  const [selectedInstructor, setSelectedInstructor] = useState(null);

  const handleBookClick = (instructor) => {
    setSelectedInstructor(instructor);
  };

  const handleCloseModal = () => {
    setSelectedInstructor(null);
  };

  const handleBookingConfirm = (date, vehicleClass, time, receiveNotification) => {
    console.log("Booking confirmed:", date, vehicleClass, time, receiveNotification);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Instructors</h1>
      <div className="grid grid-cols-3 gap-6">
        {instructors.map((instructor) => (
          <InstructorCard
            key={instructor.name}
            instructor={instructor}
            onBookClick={handleBookClick}
          />
        ))}
      </div>

      {selectedInstructor && (
        <BookingModal
          instructor={selectedInstructor}
          onClose={handleCloseModal}
          onBookingConfirm={handleBookingConfirm}
        />
      )}
    </div>
  );
};

export default Instructors;