import React from "react";

const InstructorCard = ({ instructor, onBookClick }) => {
  return (
    <div className="border p-4 rounded-md shadow-md">
      <h2 className="font-bold text-xl">{instructor.name}</h2>
      <p className="text-sm">{instructor.specialty}</p>
      <p className="text-sm">Experience: {instructor.experience} years</p>
      <button
        onClick={() => onBookClick(instructor)}
        className="mt-4 bg-primary text-white px-6 py-2 rounded"
      >
        Book a Session
      </button>
    </div>
  );
};

export default InstructorCard;
