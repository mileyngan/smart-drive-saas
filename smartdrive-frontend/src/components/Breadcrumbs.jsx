import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaChevronRight, FaHome } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

const Breadcrumbs = ({ dynamicNames = {} }) => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);
    const { theme } = useTheme();

    const getReadableName = (path, index, fullPath) => {
        // First check if we have a dynamic name for this path
        if (dynamicNames[path]) {
            return dynamicNames[path];
        }

        // Special case for quiz paths
        if (path === 'quiz' && index < fullPath.length - 1) {
            const quizNumber = fullPath[index + 1];
            return `Quiz Assessment ${quizNumber}`;
        }

        const routeMap = {
            'student': 'Student Dashboard',
            'course': 'Course',
            'library': 'Library',
        };

        return routeMap[path] || path.charAt(0).toUpperCase() + path.slice(1);
    };

    // Filter and transform pathnames to handle special cases
    const transformedPathnames = pathnames.reduce((acc, path, index) => {
        // Skip 'quiz' path and combine it with its ID
        if (path === 'quiz') {
            return acc;
        }
        
        // Skip the quiz ID if the previous path was 'quiz'
        if (index > 0 && pathnames[index - 1] === 'quiz') {
            const quizName = `Quiz Assessment ${path}`;
            acc.push({
                name: quizName,
                path: `/${pathnames.slice(0, index + 1).join('/')}`,
                isQuiz: true
            });
            return acc;
        }

        acc.push({
            name: getReadableName(path, index, pathnames),
            path: `/${pathnames.slice(0, index + 1).join('/')}`,
            isLast: index === pathnames.length - 1
        });
        return acc;
    }, []);

    return (
        <nav className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center h-12">
                    <ol className="flex items-center space-x-2 text-sm">
                        <li>
                            <Link 
                                to="/smartdrive-frontend/student" 
                                className="text-green-600 hover:text-green-700 flex items-center"
                            >
                                <FaHome className="mr-1" />
                                Home
                            </Link>
                        </li>
                        {transformedPathnames.map((item, index) => (
                            <React.Fragment key={item.path}>
                                <li>
                                    <FaChevronRight className={`${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
                                </li>
                                <li>
                                    {item.isLast ? (
                                        <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} font-medium`}>
                                            {item.name}
                                        </span>
                                    ) : (
                                        <Link
                                            to={item.path}
                                            className="text-green-600 hover:text-green-700"
                                        >
                                            {item.name}
                                        </Link>
                                    )}
                                </li>
                            </React.Fragment>
                        ))}
                    </ol>
                </div>
            </div>
        </nav>
    );
};

export default Breadcrumbs;
