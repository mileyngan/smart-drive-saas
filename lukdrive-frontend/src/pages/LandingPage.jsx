import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import { Car, ShieldCheck, Users, BarChart2 } from 'lucide-react';

const LandingPage = () => {
  const features = [
    {
      icon: <Users size={40} className="text-blue-600" />,
      title: 'Comprehensive Management',
      description: 'Manage students, instructors, and courses all in one place with ease.',
    },
    {
      icon: <BarChart2 size={40} className="text-blue-600" />,
      title: 'Real-time Analytics',
      description: 'Gain insights with real-time dashboards and reporting on student progress and school performance.',
    },
    {
      icon: <ShieldCheck size={40} className="text-blue-600" />,
      title: 'Secure & Reliable',
      description: 'Built with security in mind to protect your school and student data.',
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">The Future of Driving School</span>
              <span className="block text-blue-600">Management is Here</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              LukDrive provides a modern, all-in-one platform to streamline your driving school operations, from student enrollment to progress tracking.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Link to="/register">
                  <Button variant="primary" className="w-full">
                    Get Started
                  </Button>
                </Link>
              </div>
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                <Link to="/login">
                  <Button variant="secondary" className="w-full">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to run a successful driving school
            </p>
          </div>

          <div className="mt-10">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              {features.map((feature) => (
                <div key={feature.title} className="relative">
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-100">
                      {feature.icon}
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.title}</p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-gray-500">{feature.description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingPage;