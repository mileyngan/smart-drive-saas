import React from 'react';
import { useParams } from 'react-router-dom';
import StudentDashboardNavbar from '../components/StudentDashNavbar';
import RegisteredFooter from '../components/RegisteredFooter';
import Breadcrumbs from '../components/Breadcrumbs';

const QuizPage = () => {
    const { courseId, quizId } = useParams();

    // Sample quiz data - replace with actual data from your backend
    const quizData = {
        title: `Quiz Assessment ${quizId}`,
        attemptsAllowed: 2,
        timeAllowed: 45,
        attempts: [
            {
                number: 1,
                state: 'Finished',
                submittedDate: '2024-03-15T14:30:00',
                grade: 75.00
            }
        ]
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            weekday: 'long',
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <StudentDashboardNavbar />
            <Breadcrumbs 
                dynamicNames={{
                    [courseId]: course?.title || 'Loading...',
                }} 
            />
            
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">
                        {quizData.title}
                    </h1>
                    
                    <div className="text-center space-y-2 mb-8">
                        <p className="text-gray-600">
                            Attempts Allowed: {quizData.attemptsAllowed}
                        </p>
                        <p className="text-gray-600">
                            Time Allowed: {quizData.timeAllowed} mins
                        </p>
                    </div>

                    <div className="flex justify-center mb-12">
                        <button 
                            className="px-8 py-4 bg-green-600 text-white text-lg rounded-full hover:bg-green-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                            onClick={() => {
                                // Add your quiz start logic here
                                console.log('Starting quiz...');
                            }}
                        >
                            Take the Quiz
                        </button>
                    </div>

                    {quizData.attempts.length > 0 && (
                        <div className="border-t pt-8">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">
                                Summary of your previous attempts
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <tr>
                                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Attempt
                                            </th>
                                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                State
                                            </th>
                                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Grade
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {quizData.attempts.map((attempt, index) => (
                                            <tr key={index}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {attempt.number}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900">
                                                        {attempt.state}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        Submitted on {formatDate(attempt.submittedDate)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {attempt.grade.toFixed(2)}/100.00
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <RegisteredFooter />
        </div>
    );
};

export default QuizPage;
