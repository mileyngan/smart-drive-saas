import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { motion, animate, stagger, AnimatePresence } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';

const LandingPage = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedCourse, setSelectedCourse] = useState(0);
    const introRef = useRef(null);
    const aboutRef = useRef(null);
    const testimonials = [
        { user: "User 1", quote: "This was an amazing experience!" },
        { user: "User 2", quote: "I learned so much about safe driving." },
        { user: "User 3", quote: "The instructors were very helpful." },
        { user: "User 4", quote: "I feel confident on the road now!" },
        { user: "User 5", quote: "Highly recommend Smart Drivers!" },
    ];

    // Course data
    const courses = [
        { icon: "🚗", label: "Manual Car", description: "Learn to drive a manual transmission car with our expert instructors." },
        { icon: "🏍️", label: "Manual Bike", description: "Master the art of riding a manual motorcycle with our comprehensive course." },
        { icon: "🚙", label: "Automatic Car", description: "Perfect for beginners, learn to drive an automatic transmission vehicle." },
        { icon: "🛵", label: "Scooter", description: "Get your scooter license with our specialized training program." },
        { icon: "🚛", label: "Heavy Vehicle", description: "Obtain your heavy vehicle license with our professional training." }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
        }, 3000); // Change every 3 seconds

        return () => clearInterval(interval); // Cleanup on unmount
    }, [testimonials.length]);

    useEffect(() => {
        // Wait for fonts to load
        document.fonts.ready.then(() => {
            if (!introRef.current) return;
            
            // Make the container visible
            introRef.current.style.visibility = "visible";
            
            // Get all text elements in the intro section
            const titleElement = introRef.current.querySelector("h2");
            const subtitleElement = introRef.current.querySelector("h3");
            const paragraphElement = introRef.current.querySelector("p");
            
            if (titleElement) {
                const titleWords = titleElement.textContent.split(" ");
                titleElement.innerHTML = titleWords.map(word => `<span class="split-word">${word}</span>`).join(" ");
                
                animate(
                    titleElement.querySelectorAll(".split-word"),
                    { opacity: [0, 1], y: [20, 0] },
                    {
                        type: "spring",
                        duration: 1.5,
                        bounce: 0.2,
                        delay: stagger(0.05),
                    }
                );
            }
            
            if (subtitleElement) {
                const subtitleWords = subtitleElement.textContent.split(" ");
                subtitleElement.innerHTML = subtitleWords.map(word => `<span class="split-word">${word}</span>`).join(" ");
                
                animate(
                    subtitleElement.querySelectorAll(".split-word"),
                    { opacity: [0, 1], y: [15, 0] },
                    {
                        type: "spring",
                        duration: 1.2,
                        bounce: 0.1,
                        delay: stagger(0.03, { start: 0.5 }),
                    }
                );
            }
            
            if (paragraphElement) {
                const paragraphWords = paragraphElement.textContent.split(" ");
                paragraphElement.innerHTML = paragraphWords.map(word => `<span class="split-word">${word}</span>`).join(" ");
                
                animate(
                    paragraphElement.querySelectorAll(".split-word"),
                    { opacity: [0, 1], y: [10, 0] },
                    {
                        type: "spring",
                        duration: 1,
                        bounce: 0,
                        delay: stagger(0.02, { start: 1 }),
                    }
                );
            }
        });
    }, []);

    // Intersection Observer for About section animation
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-about');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.2 }
        );

        if (aboutRef.current) {
            observer.observe(aboutRef.current);
        }

        return () => {
            if (aboutRef.current) {
                observer.unobserve(aboutRef.current);
            }
        };
    }, []);

    const nextTestimonial = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
    };

    return (
        <div>
            <Navbar />

            {/* New Intro Section with Text Animation */}
            <div className="flex justify-between items-start p-8 pl-20 pt-24 mb-10 min-h-[60vh] relative">
                <div className="w-1/2 pr-4" ref={introRef} style={{ visibility: "hidden" }}>
                    <h2 className="text-3xl font-bold mb-2">Welcome to Smart Drivers</h2>
                    <h3 className="text-xl mb-4">Your journey to safe driving starts here.</h3>
                    <p className="text-lg">
                        Join us in our mission to provide top-notch driving education and ensure safety on the roads.
                    </p>
                </div>
                <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
                    <div className="bg-white rounded-lg shadow-lg p-4">
                        <h4 className="font-bold text-lg">Registrations are now open!</h4>
                        <Link to="/smartdrive-frontend/register">
                            <button className="mt-2 bg-green-600 text-white font-bold px-4 py-2 rounded transition duration-300 hover:bg-green-700">
                                Register Now
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Animated Car Emoji */}
            <div className="relative h-15 mb-20 overflow-hidden">
                <motion.div 
                    className="absolute text-5xl"
                    initial={{ x: "100%" }}
                    animate={{ x: "1000%" }}
                    transition={{ 
                        duration: 6, 
                        repeat: Infinity, 
                        ease: "linear" 
                    }}
                >
                    🚗
                </motion.div>
            </div>

            {/* About Smart Drivers Section with Dark Blue Background */}
            <div className="bg-gray-900 py-16 px-8 min-h-[60vh] flex justify-between items-center" ref={aboutRef}>
                <div className="w-1/2 pr-4">
                    <h2 className="text-2xl font-bold mb-4 text-green-400 relative">
                        <span className="absolute -inset-1 bg-green-500/20 blur-md rounded-lg"></span>
                        <span className="relative">About Smart Drivers</span>
                    </h2>
                    <p className="text-xl mb-4 text-white">
                        Smart Drivers is dedicated to providing the best driving education to ensure safety on the roads. Our comprehensive courses cover everything from basic driving skills to advanced techniques, ensuring that every student is well-prepared for their driving test and beyond. We believe in a hands-on approach to learning, where students can practice in real-world scenarios under the guidance of experienced instructors. Our mission is to create confident, safe drivers who are ready to navigate the roads with skill and assurance. Join us today and take the first step towards becoming a skilled driver!
                    </p>
                </div>
                <div className="w-1/2">
                  {/* <div className="bg-gray-300 h-64 rounded-lg"></div>   Placeholder for image */}
                  <img src="https://newlankalearners.com/images/featured-03.jpg" alt="Guy holding a license in a car" />
                </div>
            </div>

            {/* Courses Section with Tab Layout */}
            <div className="py-16 px-8">
                <h2 className="text-center text-2xl font-bold mb-8">Our Courses</h2>
                <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
                    <nav className="bg-gray-50 p-2 border-b border-gray-200">
                        <ul className="flex">
                            {courses.map((course, index) => (
                                <motion.li
                                    key={course.label}
                                    className={`flex-1 text-center py-3 px-4 cursor-pointer relative ${
                                        selectedCourse === index ? 'text-green-600 font-medium' : 'text-gray-600'
                                    }`}
                                    onClick={() => setSelectedCourse(index)}
                                    initial={false}
                                    animate={{
                                        backgroundColor: selectedCourse === index ? 'rgba(0,0,0,0.03)' : 'transparent',
                                    }}
                                >
                                    <span className="mr-2">{course.icon}</span>
                                    {course.label}
                                    {selectedCourse === index && (
                                        <motion.div
                                            className="absolute bottom-0 left-0 right-0 h-1 bg-green-600"
                                            layoutId="underline"
                                        />
                                    )}
                                </motion.li>
                            ))}
                        </ul>
                    </nav>
                    <div className="p-8 flex justify-center items-center min-h-[300px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={selectedCourse}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -20, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="text-center"
                            >
                                <div className="text-6xl mb-4">{courses[selectedCourse].icon}</div>
                                <h3 className="text-xl font-bold mb-2">{courses[selectedCourse].label}</h3>
                                <p className="text-gray-600">{courses[selectedCourse].description}</p>
                            </motion.div>
                        </AnimatePresence>
                    </div>
            </div>
            </div>

            {/* Learning Path Section */}
            <div className="bg-gray-900 py-16 px-8 min-h-[60vh]">
                <h2 className="text-center text-2xl font-bold mb-8 text-green-400 relative inline-block mx-auto">
                    <span className="absolute -inset-1 bg-green-500/20 blur-md rounded-lg"></span>
                    <span className="relative">Learning Path</span>
                </h2>
                <div className="flex flex-col items-center">
                {[
                    { title: "Step 1", description: "Learn the basics of driving and road safety.", direction: "right" },
                    { title: "Step 2", description: "Practice driving in a controlled environment.", direction: "left" },
                    { title: "Step 3", description: "Understand traffic rules and regulations.", direction: "right" },
                    { title: "Step 4", description: "Prepare for the driving test with mock exams.", direction: "left" }
                ].map((step, index) => (
                        <div key={index} className={`border border-gray-700 rounded-lg p-4 shadow-lg transition-transform transform hover:scale-105 w-1/2 mb-4 ${step.direction === 'left' ? 'translate-x-6' : '-translate-x-8'}`}>
                            <h3 className="text-xl font-bold text-white">{step.title}</h3>
                            <p className="mt-2 text-gray-300">{step.description}</p>
                    </div>
                ))}
                </div>
            </div>

            {/* Testimonials Section */}
            <div className="py-16 px-8 min-h-[60vh] bg-white">
                <h2 className="text-center text-2xl font-bold mb-12 text-gray-800">What Our Students Say</h2>
                <div className="flex justify-center items-center gap-8 max-w-6xl mx-auto">
                    {[
                        { 
                            user: "Sarah Johnson", 
                            quote: "The instructors at Smart Drivers are incredibly patient and knowledgeable. I passed my test on the first try!",
                            role: "New Driver"
                        },
                        { 
                            user: "Michael Chen", 
                            quote: "I was nervous about learning to drive, but the structured approach and supportive environment made all the difference.",
                            role: "Graduate"
                        },
                        { 
                            user: "Emily Rodriguez", 
                            quote: "The practical lessons were excellent, and the theory classes were engaging. Highly recommend to anyone learning to drive!",
                            role: "Student"
                        }
                    ].map((testimonial, index) => (
                        <motion.div 
                            key={index}
                            className={`bg-white rounded-xl shadow-lg p-6 w-80 border border-gray-200 ${index === 1 ? 'transform -translate-y-8 scale-105' : ''}`}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            whileHover={{ 
                                scale: 1.05,
                                transition: { duration: 0.2 }
                            }}
                        >
                            <div className="flex flex-col h-full">
                                <div className="text-green-500 text-4xl mb-4">"</div>
                                <p className="text-gray-600 italic mb-6 flex-grow">{testimonial.quote}</p>
                                <div className="border-t border-gray-200 pt-4">
                                    <h4 className="font-bold text-gray-800">{testimonial.user}</h4>
                                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                                </div>
                            </div>
                        </motion.div>
                        ))}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default LandingPage;
