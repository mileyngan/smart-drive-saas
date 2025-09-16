import React, { useState } from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import RegisteredFooter from '../components/RegisteredFooter';
import StudentDashNavbar from '../components/StudentDashNavbar';

const stages = [
    { id: 1, title: 'Register at a Driving School', description: 'Complete your registration at a local driving school to begin your journey.', completed: true },
    { id: 2, title: 'Choose a Preferred Course', description: 'Select the driving course that best fits your needs and schedule.', completed: true },
    { id: 3, title: 'Pay the Registration Fee', description: 'Make the necessary payment to secure your spot in the course.', completed: true },
    { id: 4, title: 'Obtain a Medical Certificate', description: 'Get a medical certificate from the local National Transport Medical Institute branch near you. Check out: "https://ntmi.lk/contact/" for more information.', completed: false },
    { id: 5, title: "Apply for a Learner's Permit", description: 'Once you have obtained a medical certificate, go to the local driving school and submit the medical certificate and request for a learner\'s permit. The school shall prepare an invalid learner\'s permit and provide the date for the written exam.', completed: false },
    { id: 6, title: 'Attend Theory Classes, Attend the Written Exam, and Validate Your Permit', description: 'Participate in theory lessons on the provided LMS to prepare for the written exam. The exam is held in the local district secratariat. Successfully passing the written exam would lead to validating your learner\'s permit.', completed: false },
    { id: 7, title: 'Book Practical Sessions with Instructors', description: 'With a validated learner\'s permit, you may schedule practical driving sessions with your instructors for your vehicle courses.', completed: false },
    { id: 8, title: 'Receive Feedback from Instructors', description: 'Get constructive feedback from your instructor during practical sessions.', completed: false },
    { id: 9, title: 'Apply for Licensing Trial', description: 'When ready, apply for the licensing trial through the school.', completed: false },
    { id: 10, title: 'Attend the Licensing Trial', description: "Follow the school's guidance and attend the licensing trial.", completed: false },
    { id: 11, title: 'Take the Test and Receive Results', description: 'Take the driving test and receive your results on the same day.', completed: false },
    { id: 12, title: "Endorse Learner's Permit", description: 'If the student passes, the examiner endorses the learner\’s permit, which temporarily acts as a valid driver\’s license until the official card is issued by the Department of Motor Traffic. In cases where the license takes too long to arrive, students are advised to extend the validity of their learner\’s permit through the district secretariat.', completed: false },
];

const Journey = () => {
    const [taskList, setTaskList] = useState(stages);

    const handleToggle = (id) => {
        setTaskList(taskList.map(task => 
            task.id === id ? { ...task, completed: !task.completed } : task
        ));
    };

    // Calculate progress percentage
    const totalTasks = taskList.length;
    const completedTasks = taskList.filter(task => task.completed).length;
    const progressPercentage = (completedTasks / totalTasks) * 100;

    return (
        <div className="flex flex-col min-h-screen">
            <StudentDashNavbar />
            <div className="flex-grow container mx-auto p-4">
                <Breadcrumbs dynamicNames={{ journey: 'Your Student Driver Journey' }} />
                <h1 className="text-2xl font-bold my-4">Your Student Driver Journey</h1>

                {/* Progress Bar */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">Acquiring Learner's Permit</span>
                        <span className="font-semibold">Practical Sessions</span>
                        <span className="font-semibold">Trial</span>
                    </div>
                    <div className="relative h-4 bg-gray-200 rounded-full">
                        <div 
                            className="absolute h-full bg-green-500 rounded-full"
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                    <div className="flex justify-between mt-2">
                        <span>0%</span>
                        <span>50%</span>
                        <span>100%</span>
                    </div>
                </div>

                <div className="space-y-4">
                    {taskList.map(task => (
                        <div
                            key={task.id}
                            className={`border rounded-md p-4 transition-all duration-300 ${task.completed ? 'bg-green-100' : 'bg-white'}`}
                            onClick={() => handleToggle(task.id)}
                        >
                            <div className="flex justify-between items-center">
                                <span className={`font-medium ${task.completed ? 'text-green-600' : 'text-gray-800'}`}>
                                    {task.id}. {task.title}
                                </span>
                                {task.completed && <span className="text-green-600 font-semibold">Completed</span>}
                            </div>
                            <p className={`mt-2 ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                                {task.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
            <RegisteredFooter />
        </div>
    );
};

export default Journey;
