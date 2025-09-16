import React from 'react';
import { useParams, Link } from 'react-router-dom';
import StudentDashboardNavbar from '../components/StudentDashNavbar';
import RegisteredFooter from '../components/RegisteredFooter';
import YoutubeEmbed from '../components/YoutubeEmbed';
import { FaDownload } from 'react-icons/fa';
import Lecture from '../components/Lecture';
import Breadcrumbs from '../components/Breadcrumbs';
import { useTheme } from '../context/ThemeContext';

const CourseDetails = () => {
    const { courseId } = useParams();
    const { theme } = useTheme();

    // Updated course data to include video information
    const courseData = {
        1: {
            title: 'Road Rules Basics',
            description: 'Learn the fundamental rules of the road and traffic regulations. This comprehensive course covers everything from basic traffic signs to complex intersection management. Perfect for beginners and those looking to refresh their knowledge.',
            image: '/path/to/road-rules.jpg',
            progress: 75,
            grade: 82,
            instructor: 'John Doe',
            duration: '8 weeks',
            lectures: [
                {
                    id: 1,
                    title: 'Understanding Basic Road Signs',
                    description: "In this lecture, we cover the fundamental road signs that every driver must know. Learn about regulatory signs, warning signs, and informational signs that you'll encounter on the road.",
                    videoId: "DvHbgHOZwVQ",
                    materialUrl: '/path/to/reference-material.pdf',
                    section: 'pre-quiz'
                },
                {
                    id: 2,
                    title: 'Right of Way and Traffic Flow',
                    description: "Master the essential rules of right of way and learn how to navigate different traffic scenarios safely. This lecture covers intersection rules, emergency vehicle protocols, and pedestrian rights.",
                    videoId: "dX21-kJYrqc",
                    materialUrl: '/path/to/right-of-way-guide.pdf',
                    section: 'pre-quiz'
                },
                {
                    id: 3,
                    title: 'Safe Driving Techniques',
                    description: "Learn advanced driving techniques for various road conditions. This comprehensive lecture covers defensive driving, weather adaptations, and emergency maneuvers.",
                    videoId: "KzmlxV_OyHw",
                    materialUrl: '/path/to/safe-driving-manual.pdf',
                    section: 'pre-quiz'
                },
                {
                    id: 4,
                    title: 'Advanced Intersection Management',
                    description: "Deep dive into complex intersection scenarios and learn how to handle multiple lanes, turning signals, and heavy traffic situations. This lecture focuses on urban driving challenges.",
                    videoId: "qGxGLfLHHGM",
                    materialUrl: '/path/to/intersection-guide.pdf',
                    section: 'post-quiz'
                },
                {
                    id: 5,
                    title: 'Emergency Response and Safety Protocols',
                    description: "Learn crucial emergency response techniques and safety protocols. This lecture covers accident prevention, emergency vehicle encounters, and critical situation handling.",
                    videoId: "3PNvgKZgGbA",
                    materialUrl: '/path/to/emergency-manual.pdf',
                    section: 'post-quiz'
                }
            ],
            modules: [
                {
                    id: 1,
                    title: 'Introduction to Road Rules',
                    completed: true,
                    topics: ['Basic traffic signs', 'Right of way', 'Speed limits']
                },
                {
                    id: 2,
                    title: 'Traffic Signals and Controls',
                    completed: true,
                    topics: ['Traffic light signals', 'Police hand signals', 'Emergency vehicle rules']
                },
                {
                    id: 3,
                    title: 'Road Markings and Lanes',
                    completed: false,
                    topics: ['Lane markings', 'Pedestrian crossings', 'Bicycle lanes']
                }
            ],
            upcomingAssignments: [
                { id: 1, title: 'Road Signs Quiz', dueDate: '2024-03-20' },
                { id: 2, title: 'Traffic Rules Assessment', dueDate: '2024-03-25' }
            ],
            currentQuizNumber: 1,
            quizAttempts: 2
        },
        // Add more courses as needed
    };

    const course = courseData[courseId];

    if (!course) {
        return (
            <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
                <StudentDashboardNavbar />
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <p className="text-xl text-gray-600">Course not found</p>
                </div>
                <RegisteredFooter />
            </div>
        );
    }

    // Calculate the circumference of the circle for the progress bar
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const progressOffset = circumference - (course.progress / 100) * circumference;

    // Create dynamic names for breadcrumbs
    const dynamicNames = {
        [courseId]: course.title
    };

    return (
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
            <StudentDashboardNavbar />
            <Breadcrumbs dynamicNames={dynamicNames} />
            
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Combined Course Progress and Grade Section with Circular Progress */}
                <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6 mb-8`}>
                    <h2 className="text-xl font-bold mb-6">Course Progress & Grade</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Part 1: Circular Progress Indicator */}
                        <div className="flex flex-col items-center">
                            <div className="relative w-40 h-40 mb-4">
                                <svg className="w-full h-full transform -rotate-90">
                                    {/* Background circle */}
                                    <circle 
                                        cx="80" 
                                        cy="80" 
                                        r={radius} 
                                        stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} 
                                        strokeWidth="12" 
                                        fill="none" 
                                    />
                                    {/* Progress circle */}
                                    <circle 
                                        cx="80" 
                                        cy="80" 
                                        r={radius} 
                                        stroke="#10B981" 
                                        strokeWidth="12" 
                                        fill="none" 
                                        strokeDasharray={circumference} 
                                        strokeDashoffset={progressOffset}
                                        className="transition-all duration-500 ease-in-out"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-4xl font-bold text-green-600">{course.progress}%</span>
                                    <span className="text-sm text-gray-500">Complete</span>
                                </div>
                            </div>
                            <h3 className="text-lg font-semibold">Course Progress</h3>
                        </div>
                        
                        {/* Part 2: Course Information */}
                        <div className="flex flex-col">
                            <h3 className="text-lg font-semibold mb-4">Course Information</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Course:</span>
                                    <span className="font-medium">{course.title}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Instructor:</span>
                                    <span className="font-medium">{course.instructor}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Duration:</span>
                                    <span className="font-medium">{course.duration}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Lectures:</span>
                                    <span className="font-medium">{course.lectures.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Practical Sessions:</span>
                                    <span className="font-medium">5</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">No of Quizzes:</span>
                                    <span className="font-medium">{course.currentQuizNumber}</span>
                                </div>
                        </div>
                    </div>

                        {/* Part 3: Current Grade */}
                        <div className="flex flex-col items-center">
                            <h3 className="text-lg font-semibold mb-4">Current Grade</h3>
                            <div className="flex flex-col items-center">
                                <div className="text-6xl font-bold text-green-600 mb-2">{course.grade}</div>
                                <div className="text-sm text-gray-500 mb-2">out of 100</div>
                                
                                <div className="w-full border-t border-gray-200 my-4"></div>
                                
                                <h4 className="text-lg font-semibold text-gray-900 mb-2">Grade</h4>
                                <div className="text-3xl font-bold text-green-600">
                                    {course.grade >= 90 ? 'A' : 
                                     course.grade >= 80 ? 'B' : 
                                     course.grade >= 70 ? 'C' : 
                                     course.grade >= 60 ? 'D' : 'F'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Course Content Section */}
                <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6 mb-8`}>
                    <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
                    <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                        {course.description}
                    </p>

                    <div className="space-y-6">
                        {course.lectures
                            .filter(lecture => lecture.section === 'pre-quiz')
                            .map((lecture) => (
                                <Lecture key={lecture.id} lecture={lecture} />
                            ))}
                    </div>
                </div>

                {/* Quiz Assessment Section */}
                <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6 mb-8`}>
                    <h2 className="text-2xl font-bold mb-4">Quiz Assessment {course.currentQuizNumber}</h2>
                    <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
                        <li>Complete all lectures before attempting the quiz</li>
                        <li>You have {course.quizAttempts} attempts for this assessment</li>
                        <li>Make sure you have a stable internet connection</li>
                        <li>All questions must be answered to submit the quiz</li>
                    </ul>
                    <Link 
                        to={`/student/course/${courseId}/quiz/${course.currentQuizNumber}`}
                        className="inline-block px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transform hover:scale-105 transition-all duration-300"
                    >
                        Quiz Assessment {course.currentQuizNumber}
                    </Link>
                </div>

                {/* Post-Quiz Lectures */}
                <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6 mb-8`}>
                    <h2 className="text-2xl font-bold mb-6">Advanced Topics</h2>
                    <div className="space-y-6">
                        {course.lectures
                            .filter(lecture => lecture.section === 'post-quiz')
                            .map((lecture) => (
                                <Lecture key={lecture.id} lecture={lecture} />
                            ))}
                    </div>
                </div>
            </div>

            <RegisteredFooter />
        </div>
    );
};

export default CourseDetails;
