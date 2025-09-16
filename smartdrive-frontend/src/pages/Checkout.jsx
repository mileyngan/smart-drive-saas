import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import { useNavigate, useLocation } from 'react-router-dom';

// Toggle this flag to switch between static sample and backend fetch
const USE_BACKEND_COURSES = false;

// Sample static courses (for demo/testing)
const sampleCourses = [
    { id: 1, title: 'Traffic Signals and Road Rules', price: '$79', image: '/path/to/traffic-signals.jpg', mandatory: true },
    { id: 2, title: 'Road Rules Basics', price: '$99', image: '/path/to/road-rules.jpg' },
    { id: 3, title: 'Safe Driving Techniques', price: '$149', image: '/path/to/safe-driving.jpg' },
    { id: 4, title: 'Advanced Intersection Management', price: '$129', image: '/path/to/intersection-management.jpg' },
];

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const selectedCourses = location.state?.selectedCourses || [1, 2];
    const [courses, setCourses] = useState(sampleCourses);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [cardDetails, setCardDetails] = useState({
        name: '',
        number: '',
        expiry: '',
        cvv: '',
    });
    const [isPaying, setIsPaying] = useState(false);
    const [success, setSuccess] = useState(false);

    // Fetch courses from backend if enabled
    useEffect(() => {
        if (USE_BACKEND_COURSES) {
            setLoading(true);
            setError('');
            // Replace with your real API endpoint
            fetch('/api/courses')
                .then(res => {
                    if (!res.ok) throw new Error('Failed to fetch courses');
                    return res.json();
                })
                .then(data => {
                    setCourses(data);
                })
                .catch(err => {
                    setError('Could not load courses. Showing sample data.');
                    setCourses(sampleCourses);
                })
                .finally(() => setLoading(false));
        }
    }, []);

    const selectedCourseDetails = courses.filter(c => selectedCourses.includes(c.id));
    const totalPrice = selectedCourseDetails.reduce((total, course) => total + parseFloat(course.price.replace('$', '')), 0);

    const handleCardInput = (e) => {
        setCardDetails({ ...cardDetails, [e.target.name]: e.target.value });
    };

    const handlePay = (e) => {
        e.preventDefault();
        setError('');
        setIsPaying(true);
        // Simulate payment
        setTimeout(() => {
            setIsPaying(false);
            setSuccess(true);
        }, 2000);
    };

    // PayPal button handler (simulate)
    const handlePayPal = () => {
        setIsPaying(true);
        setTimeout(() => {
            setIsPaying(false);
            setSuccess(true);
        }, 2000);
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <div className="flex-grow">
                <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-green-600 mb-6 text-center">Checkout & Payment</h1>
                    <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                        {loading ? (
                            <div className="text-center text-gray-500">Loading courses...</div>
                        ) : error ? (
                            <div className="text-center text-red-500 mb-2">{error}</div>
                        ) : null}
                        <ul className="divide-y divide-gray-200 mb-4">
                            {selectedCourseDetails.map(course => (
                                <li key={course.id} className="flex justify-between py-2">
                                    <span>{course.title}</span>
                                    <span>{course.price}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="flex justify-between font-bold text-lg">
                            <span>Total:</span>
                            <span>${totalPrice}</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                        <h2 className="text-xl font-bold mb-6">Payment Method</h2>
                        <div className="flex gap-6 mb-6">
                            <button
                                className={`px-6 py-2 rounded-full border-2 font-semibold transition-all duration-200 ${paymentMethod === 'card' ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-700 border-gray-300 hover:border-green-400'}`}
                                onClick={() => setPaymentMethod('card')}
                            >
                                Pay with Card
                            </button>
                            <button
                                className={`px-6 py-2 rounded-full border-2 font-semibold transition-all duration-200 ${paymentMethod === 'paypal' ? 'bg-yellow-400 text-black border-yellow-400' : 'bg-white text-gray-700 border-gray-300 hover:border-yellow-400'}`}
                                onClick={() => setPaymentMethod('paypal')}
                            >
                                Pay with PayPal
                            </button>
                        </div>
                        {paymentMethod === 'card' && (
                            <form className="space-y-4" onSubmit={handlePay}>
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-1">Cardholder Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={cardDetails.name}
                                        onChange={handleCardInput}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-1">Card Number</label>
                                    <input
                                        type="text"
                                        name="number"
                                        value={cardDetails.number}
                                        onChange={handleCardInput}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                                        maxLength={19}
                                        placeholder="1234 5678 9012 3456"
                                        required
                                    />
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="block text-gray-700 font-semibold mb-1">Expiry</label>
                                        <input
                                            type="text"
                                            name="expiry"
                                            value={cardDetails.expiry}
                                            onChange={handleCardInput}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                                            placeholder="MM/YY"
                                            required
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-gray-700 font-semibold mb-1">CVV</label>
                                        <input
                                            type="password"
                                            name="cvv"
                                            value={cardDetails.cvv}
                                            onChange={handleCardInput}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                                            maxLength={4}
                                            required
                                        />
                                    </div>
                                </div>
                                {error && <div className="text-red-500 text-sm">{error}</div>}
                                <button
                                    type="submit"
                                    className="w-full mt-4 py-3 bg-green-600 text-white rounded-full font-bold text-lg transition-all duration-300 hover:bg-green-700 disabled:bg-gray-400"
                                    disabled={isPaying}
                                >
                                    {isPaying ? 'Processing...' : `Pay $${totalPrice}`}
                                </button>
                            </form>
                        )}
                        {paymentMethod === 'paypal' && (
                            <div className="flex flex-col items-center gap-4 mt-4">
                                {/* Simulated PayPal button */}
                                <button
                                    onClick={handlePayPal}
                                    className="w-full py-3 bg-yellow-400 text-black rounded-full font-bold text-lg transition-all duration-300 hover:bg-yellow-500 disabled:bg-gray-400"
                                    disabled={isPaying}
                                >
                                    {isPaying ? 'Redirecting to PayPal...' : `Pay with PayPal ($${totalPrice})`}
                                </button>
                                <img src="https://www.paypalobjects.com/webstatic/icon/pp258.png" alt="PayPal" className="h-8" />
                            </div>
                        )}
                        {success && (
                            <div className="mt-6 text-green-600 font-bold text-center text-lg">
                                Payment successful! Thank you for your purchase.
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Checkout; 