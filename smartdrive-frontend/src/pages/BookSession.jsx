import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentDashNavbar from '../components/StudentDashNavbar';
import RegisteredFooter from '../components/RegisteredFooter';
import Breadcrumbs from '../components/Breadcrumbs';

const courses = [
    { id: 1, title: 'Road Rules Basics' },
    { id: 2, title: 'Traffic Signs Mastery' },
    { id: 3, title: 'Safe Driving Practices' },
];

const instructors = [
    { id: 1, name: 'Instructor A', availableSlots: ['10:00 AM', '1:00 PM'] },
    { id: 2, name: 'Instructor B', availableSlots: ['11:00 AM', '2:00 PM'] },
    { id: 3, name: 'Instructor C', availableSlots: ['12:00 PM', '3:00 PM'] },
];

const BookSession = () => {
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [confirmationVisible, setConfirmationVisible] = useState(false);
    const navigate = useNavigate();

    const handleCourseChange = (e) => {
        setSelectedCourse(e.target.value);
        setSelectedSlot(null); // Reset slot when course changes
    };

    const handleSlotClick = (slot) => {
        setSelectedSlot(slot);
    };

    const handleNext = () => {
        if (selectedSlot) {
            setConfirmationVisible(true);
        } else {
            alert('Please select a time slot.');
        }
    };

    const handleConfirm = () => {
        // Logic to save the booking can be added here
        alert(`Booking confirmed for ${selectedSlot}!`);
        navigate('/student/dashboard');
    };

    const handleCancel = () => {
        setConfirmationVisible(false);
    };

    return (
        <div className="flex flex-col min-h-screen">
            <StudentDashNavbar />
            <div className="flex-grow p-4">
                <Breadcrumbs dynamicNames={{ journey: 'Book a Session' }} />
                <h1 className="text-2xl font-bold mb-4">Book a Session</h1>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Select Course</label>
                    <select value={selectedCourse} onChange={handleCourseChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2">
                        <option value="">Select a course</option>
                        {courses.map(course => (
                            <option key={course.id} value={course.id}>{course.title}</option>
                        ))}
                    </select>
                </div>

                {selectedCourse && (
                    <div>
                        <h2 className="text-lg font-bold mb-2">Available Instructors and Time Slots</h2>
                        <div className="space-y-4">
                            {instructors.map(instructor => (
                                <div key={instructor.id} className="border rounded-md p-4">
                                    <h3 className="font-semibold">{instructor.name}</h3>
                                    <div className="grid grid-cols-2 gap-4 mt-2">
                                        {instructor.availableSlots.map(slot => (
                                            <button
                                                key={slot}
                                                onClick={() => handleSlotClick(slot)}
                                                className={`p-2 border rounded-md ${selectedSlot === slot ? 'bg-green-500 text-white' : 'bg-white'} hover:bg-green-100`}
                                            >
                                                {slot}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {selectedSlot && (
                    <div className="mt-4">
                        <button onClick={handleNext} className="bg-blue-500 text-white rounded-md p-2">
                            Next
                        </button>
                    </div>
                )}

                {confirmationVisible && (
                    <div className="mt-4 p-4 border rounded-md bg-gray-100">
                        <h3 className="font-bold">Confirm Booking</h3>
                        <p>Are you sure you want to book a session at {selectedSlot}?</p>
                        <div className="flex space-x-2 mt-4">
                            <button onClick={handleConfirm} className="bg-green-500 text-white rounded-md p-2">Confirm</button>
                            <button onClick={handleCancel} className="bg-gray-300 text-gray-700 rounded-md p-2">Cancel</button>
                        </div>
                    </div>
                )}
            </div>
            <RegisteredFooter />
        </div>
    );
};

export default BookSession;
