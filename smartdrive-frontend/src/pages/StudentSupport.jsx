import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StudentDashNavbar from '../components/StudentDashNavbar';
import RegisteredFooter from '../components/RegisteredFooter';
import Breadcrumbs from '../components/Breadcrumbs';
import { supabase } from '../supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheck } from 'react-icons/fa';

const StudentSupport = () => {
    const [faqCategories, setFaqCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [showQuestionForm, setShowQuestionForm] = useState(false);
    const [courses, setCourses] = useState([]);
    const [formData, setFormData] = useState({
        type: 'Ask a Question',
        subject: '',
        description: ''
    });
    const [formStatus, setFormStatus] = useState('idle'); // idle, loading, success, error

    useEffect(() => {
        fetchFaqCategories();
        fetchCourses();
    }, []);

    const fetchFaqCategories = async () => {
        try {
            const { data, error } = await supabase
                .from('faq_categories')
                .select('*');
            
            if (error) throw error;
            
            // Add sample questions to each category if none exist
            const categoriesWithQuestions = data.map(category => {
                if (!category.questions || category.questions.length === 0) {
                    return {
                        ...category,
                        questions: getSampleQuestions(category.name)
                    };
                }
                return category;
            });
            
            setFaqCategories(categoriesWithQuestions);
        } catch (error) {
            console.error('Error fetching FAQ categories:', error);
            // Fallback to sample data if API fails
            setFaqCategories(getSampleCategories());
        }
    };

    // Sample questions based on category
    const getSampleQuestions = (categoryName) => {
        const questionMap = {
            'General Questions': [
                { id: 1, title: 'How do I reset my password?', answer: 'To reset your password, click on the "Forgot Password" link on the login page and follow the instructions sent to your email.' },
                { id: 2, title: 'How can I update my profile information?', answer: 'Go to your profile page by clicking on your avatar in the top right corner, then select "Edit Profile" to update your information.' },
                { id: 3, title: 'What payment methods do you accept?', answer: 'We accept all major credit cards, PayPal, and bank transfers for course payments.' }
            ],
            'Course Content': [
                { id: 1, title: 'How long does it take to complete a course?', answer: 'Course completion time varies by complexity. Basic courses typically take 4-6 weeks, while advanced courses may take 8-12 weeks.' },
                { id: 2, title: 'Can I access course materials offline?', answer: 'Yes, you can download course materials for offline viewing through our mobile app or by using the "Download" button on each lesson.' },
                { id: 3, title: 'Are there any prerequisites for advanced courses?', answer: 'Yes, advanced courses require completion of the corresponding basic courses or equivalent experience.' }
            ],
            'Technical Support': [
                { id: 1, title: 'The video lessons aren\'t loading properly. What should I do?', answer: 'Try clearing your browser cache, using a different browser, or checking your internet connection. If problems persist, contact our technical support team.' },
                { id: 2, title: 'How do I report a bug in the platform?', answer: 'You can report bugs by clicking the "Report Issue" button in the help menu or by emailing support@smartdrive.com with details about the issue.' },
                { id: 3, title: 'Is the platform compatible with mobile devices?', answer: 'Yes, our platform is fully responsive and works on all modern mobile devices through both browsers and our dedicated mobile app.' }
            ],
            'Certification': [
                { id: 1, title: 'How do I get my driving certificate?', answer: 'Upon successful completion of all course requirements and passing the final assessment, your certificate will be automatically generated and available for download from your dashboard.' },
                { id: 2, title: 'Is the certificate recognized by driving authorities?', answer: 'Yes, our certificates are recognized by all major driving authorities and can be used for license applications.' },
                { id: 3, title: 'How long is the certificate valid?', answer: 'Certificates are valid indefinitely once issued, though we recommend refreshing your knowledge every few years.' }
            ]
        };

        return questionMap[categoryName] || [
            { id: 1, title: 'Sample Question 1', answer: 'This is a sample answer for question 1.' },
            { id: 2, title: 'Sample Question 2', answer: 'This is a sample answer for question 2.' }
        ];
    };

    // Fallback sample categories if API fails
    const getSampleCategories = () => {
        return [
            {
                id: 1,
                name: 'General Questions',
                description: 'Common questions about our platform and services',
                questions: getSampleQuestions('General Questions')
            },
            {
                id: 2,
                name: 'Course Content',
                description: 'Information about our courses and learning materials',
                questions: getSampleQuestions('Course Content')
            },
            {
                id: 3,
                name: 'Technical Support',
                description: 'Help with technical issues and platform usage',
                questions: getSampleQuestions('Technical Support')
            },
            {
                id: 4,
                name: 'Certification',
                description: 'Details about certificates and qualifications',
                questions: getSampleQuestions('Certification')
            }
        ];
    };

    const fetchCourses = async () => {
        try {
            const { data, error } = await supabase
                .from('courses')
                .select('*');
            
            if (error) throw error;
            setCourses(data);
        } catch (error) {
            console.error('Error fetching courses:', error);
            // Fallback to sample courses if API fails
            setCourses([
                { id: 1, name: 'Road Rules Basics' },
                { id: 2, name: 'Traffic Signs Mastery' },
                { id: 3, name: 'Safe Driving Practices' }
            ]);
        }
    };

    const handleQuestionSubmit = async (e) => {
        e.preventDefault();
        setFormStatus('loading');
        
        try {
            const { error } = await supabase
                .from('support_questions')
                .insert([
                    {
                        type: formData.type,
                        subject: formData.subject,
                        description: formData.description,
                        status: 'pending'
                    }
                ]);

            if (error) throw error;
            
            // Show success state
            setFormStatus('success');
            
            // Reset form after 3 seconds
            setTimeout(() => {
                setFormData({ type: 'Ask a Question', subject: '', description: '' });
                setShowQuestionForm(false);
                setFormStatus('idle');
            }, 3000);
        } catch (error) {
            console.error('Error submitting question:', error);
            setFormStatus('error');
            
            // Reset error state after 3 seconds
            setTimeout(() => {
                setFormStatus('idle');
            }, 3000);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <StudentDashNavbar />
            
            {/* Breadcrumbs */}
            <Breadcrumbs />

            {/* Main Content */}
            <div className="flex-grow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex justify-between items-start">
                        {/* Left side - FAQ Categories */}
                        <div className="w-2/3 pr-8">
                            <motion.h1 
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-3xl font-bold text-gray-900 mb-8"
                            >
                                Support
                            </motion.h1>

                            <div className="grid grid-cols-2 gap-6">
                                {faqCategories.map((category) => (
                                    <motion.div
                                        key={category.id}
                                        whileHover={{ scale: 1.02 }}
                                        className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow duration-300"
                                        onClick={() => {
                                            setSelectedCategory(category);
                                            setShowModal(true);
                                        }}
                                    >
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                            {category.name}
                                        </h3>
                                        <p className="text-gray-600">
                                            {category.description}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Right side - Feedback Form */}
                        <div className="w-1/3">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white rounded-lg shadow-md p-6 sticky top-6"
                            >
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                     Questions, Feedback, or Issues?
                                </h2>
                                {showQuestionForm ? (
                                    <form onSubmit={handleQuestionSubmit} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Type
                                            </label>
                                            <select
                                                value={formData.type}
                                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                                required
                                            >
                                                <option value="Ask a Question">Ask a Question</option>
                                                <option value="Feedback">Feedback</option>
                                                <option value="Report an Issue">Report an Issue</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Subject
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.subject}
                                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                                placeholder={
                                                    formData.type === 'Ask a Question' ? "I need help with..." :
                                                    formData.type === 'Feedback' ? "Here's my opinion on..." :
                                                    "I have an issue with..."
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Description
                                            </label>
                                            <textarea
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                placeholder="Please include all relevant information"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                                rows="4"
                                                required
                                            />
                                        </div>
                                        <div className="flex space-x-3">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowQuestionForm(false);
                                                    setFormStatus('idle');
                                                }}
                                                className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors duration-300"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-300"
                                            >
                                                Submit
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <button
                                        onClick={() => setShowQuestionForm(true)}
                                        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-300"
                                    >
                                        Ask a Question
                                    </button>
                                )}
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            {/* FAQ Modal */}
            {showModal && selectedCategory && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
                    >
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {selectedCategory.name}
                                </h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-gray-400 hover:text-gray-500"
                                >
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="space-y-4">
                                {selectedCategory.questions && selectedCategory.questions.length > 0 ? (
                                    selectedCategory.questions.map((question) => (
                                        <div
                                            key={question.id}
                                            className="border-b border-gray-200 pb-4 last:border-b-0"
                                        >
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                {question.title}
                                            </h3>
                                            <p className="text-gray-600">
                                                {question.answer}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 italic">No questions available for this category.</p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}

            <RegisteredFooter />
        </div>
    );
};

export default StudentSupport;