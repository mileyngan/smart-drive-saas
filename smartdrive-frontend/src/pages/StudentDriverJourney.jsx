import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Breadcrumbs from '../components/Breadcrumbs';
import RegisteredFooter from '../components/RegisteredFooter';
import StudentDashNavbar from '../components/StudentDashNavbar';

const tasks = [
    { id: 1, title: 'Register for the Course', completed: false },
    { id: 2, title: 'Complete the Theory Test', completed: false },
    { id: 3, title: 'Book Your First Driving Lesson', completed: false },
    { id: 4, title: 'Pass the Practical Driving Test', completed: false },
    { id: 5, title: 'Receive Your Driver License', completed: false },
];

const StudentDriverJourney = () => {
    const [taskList, setTaskList] = useState(tasks);

    const handleCheckboxChange = (id) => {
        setTaskList((prevTasks) =>
            prevTasks.map((task) =>
                task.id === id ? { ...task, completed: !task.completed } : task
            )
        );
    };

    return (
        <div className="flex flex-col min-h-screen">
            <StudentDashNavbar />
            <div className="flex-grow container mx-auto p-4">
                <Breadcrumbs dynamicNames={{ journey: 'Your Student Driver Journey' }} />
                <h1 className="text-2xl font-bold my-4">Your Student Driver Journey</h1>
                <div className="space-y-4">
                    {taskList.map((task) => (
                        <motion.div
                            key={task.id}
                            className={`flex items-center justify-between p-4 border rounded-md shadow ${
                                task.completed ? 'bg-green-100' : 'bg-white'
                            }`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={task.completed}
                                    onChange={() => handleCheckboxChange(task.id)}
                                    className="mr-2"
                                />
                                <span className={`text-lg ${task.completed ? 'line-through text-gray-500' : ''}`}>
                                    {task.title}
                                </span>
                            </div>
                            {task.completed && (
                                <span className="text-green-600 font-semibold">Completed</span>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
            <RegisteredFooter />
        </div>
    );
};

export default StudentDriverJourney;
