// src/pages/Register.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        phoneNumber: '+94'
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [validation, setValidation] = useState({
        email: { isValid: true, message: '' },
        password: { isValid: true, message: '' },
        confirmPassword: { isValid: true, message: '' },
        phoneNumber: { isValid: true, message: '' }
    });

    // Password validation criteria
    const validatePassword = (password) => {
        const criteria = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[!@#$%^&*]/.test(password)
        };

        return {
            isValid: Object.values(criteria).every(Boolean),
            message: Object.entries(criteria)
                .filter(([_, valid]) => !valid)
                .map(([key]) => {
                    switch (key) {
                        case 'length': return '• At least 8 characters';
                        case 'uppercase': return '• One uppercase letter';
                        case 'lowercase': return '• One lowercase letter';
                        case 'number': return '• One number';
                        case 'special': return '• One special character (!@#$%^&*)';
                        default: return '';
                    }
                })
                .join('\n')
        };
    };

    // Email validation
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return {
            isValid: emailRegex.test(email),
            message: emailRegex.test(email) ? '' : 'Please enter a valid email address'
        };
    };

    // Phone number validation
    const validatePhoneNumber = (phoneNumber) => {
        const phoneRegex = /^\+94[0-9]{9}$/;
        return {
            isValid: phoneRegex.test(phoneNumber),
            message: phoneRegex.test(phoneNumber) ? '' : 'Please enter a valid phone number starting with +94 followed by 9 digits'
        };
    };

    // Real-time validation
    useEffect(() => {
        if (formData.email) {
            setValidation(prev => ({
                ...prev,
                email: validateEmail(formData.email)
            }));
        }

        if (formData.password) {
            setValidation(prev => ({
                ...prev,
                password: validatePassword(formData.password)
            }));
        }

        if (formData.confirmPassword) {
            setValidation(prev => ({
                ...prev,
                confirmPassword: {
                    isValid: formData.password === formData.confirmPassword,
                    message: formData.password === formData.confirmPassword ? '' : 'Passwords do not match'
                }
            }));
        }

        if (formData.phoneNumber) {
            setValidation(prev => ({
                ...prev,
                phoneNumber: validatePhoneNumber(formData.phoneNumber)
            }));
        }
    }, [formData]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError(null);
    };

    const isFormValid = () => {
        return validation.email.isValid && 
               validation.password.isValid && 
               validation.confirmPassword.isValid &&
               validation.phoneNumber.isValid &&
               formData.email && 
               formData.password && 
               formData.confirmPassword &&
               formData.fullName &&
               formData.phoneNumber;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid()) {
            setError("Please fix all validation errors before submitting");
            return;
        }

        setError(null);
        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/register', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    fullName: formData.fullName,
                    phoneNumber: formData.phoneNumber,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            navigate('/login', {
                state: { message: 'Registration successful! Please check your email to verify your account.' }
            });
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg transform transition-all duration-300 hover:shadow-xl">
                <div>
                    <h1 className="text-center text-3xl font-bold text-green-600 mb-2">SmartDrive</h1>
                    <h2 className="text-center text-2xl font-semibold text-gray-900">Create your account</h2>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 transition-all duration-300 animate-fade-in">
                        <p className="text-red-700 whitespace-pre-line">{error}</p>
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                                Full Name
                            </label>
                            <input
                                id="fullName"
                                name="fullName"
                                type="text"
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-300"
                                value={formData.fullName}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                                Phone Number
                            </label>
                            <input
                                id="phoneNumber"
                                name="phoneNumber"
                                type="text"
                                required
                                className={`mt-1 block w-full px-3 py-2 border ${
                                    !validation.phoneNumber.isValid && formData.phoneNumber 
                                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                                    : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
                                } rounded-md shadow-sm focus:outline-none focus:ring-2 transition-colors duration-300`}
                                value={formData.phoneNumber}
                                onChange={handleChange}
                            />
                            {!validation.phoneNumber.isValid && formData.phoneNumber && (
                                <p className="mt-1 text-sm text-red-600 transition-all duration-300">
                                    {validation.phoneNumber.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className={`mt-1 block w-full px-3 py-2 border ${
                                    !validation.email.isValid && formData.email 
                                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                                    : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
                                } rounded-md shadow-sm focus:outline-none focus:ring-2 transition-colors duration-300`}
                                value={formData.email}
                                onChange={handleChange}
                            />
                            {!validation.email.isValid && formData.email && (
                                <p className="mt-1 text-sm text-red-600 transition-all duration-300">
                                    {validation.email.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className={`mt-1 block w-full px-3 py-2 border ${
                                    !validation.password.isValid && formData.password 
                                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                                    : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
                                } rounded-md shadow-sm focus:outline-none focus:ring-2 transition-colors duration-300`}
                                value={formData.password}
                                onChange={handleChange}
                            />
                            {formData.password && (
                                <div className={`mt-1 text-sm ${validation.password.isValid ? 'text-green-600' : 'text-red-600'} whitespace-pre-line transition-all duration-300`}>
                                    {validation.password.message || '✓ Password meets all requirements'}
                                </div>
                            )}
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                className={`mt-1 block w-full px-3 py-2 border ${
                                    !validation.confirmPassword.isValid && formData.confirmPassword 
                                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                                    : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
                                } rounded-md shadow-sm focus:outline-none focus:ring-2 transition-colors duration-300`}
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                            {!validation.confirmPassword.isValid && formData.confirmPassword && (
                                <p className="mt-1 text-sm text-red-600 transition-all duration-300">
                                    {validation.confirmPassword.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading || !isFormValid()}
                            className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-full text-white ${
                                isFormValid() 
                                ? 'bg-green-600 hover:bg-green-700' 
                                : 'bg-gray-400 cursor-not-allowed'
                            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transform transition-all duration-300 hover:scale-105`}
                        >
                            {loading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating account...
                                </span>
                            ) : (
                                'Create account'
                            )}
                        </button>
                    </div>

                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="font-medium text-green-600 hover:text-green-500 transition-colors duration-300">
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;