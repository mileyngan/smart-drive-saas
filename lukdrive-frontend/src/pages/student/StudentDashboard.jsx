import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAuthStore from '../../store/authStore';
import studentService from '../../services/student.service';
import { BookOpen, Target, CheckCircle } from 'lucide-react';

const StatCard = ({ title, value, icon }) => (
    <div className="bg-white p-4 rounded-lg shadow flex items-center">
        <div className="flex-shrink-0">{icon}</div>
        <div className="ml-4">
            <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
            <p className="text-xl font-semibold text-gray-900">{value}</p>
        </div>
    </div>
);

const StudentDashboard = () => {
  const token = useAuthStore((state) => state.token);

  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['studentDashboard'],
    queryFn: () => studentService.getDashboard(token).then(res => res.data),
    enabled: !!token,
  });

  if (isLoading) return <div>Loading dashboard...</div>;
  if (error) return <div className="text-red-500">Could not load dashboard data. You may not be enrolled in a program yet.</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">My Dashboard</h1>
      <p className="mt-1 text-gray-600">Welcome back! Let's continue your learning journey.</p>

      <div className="mt-6">
        <h2 className="text-xl font-semibold text-gray-700">{dashboardData?.programName}</h2>
        <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
            <div
                className="bg-blue-600 h-4 rounded-full"
                style={{ width: `${dashboardData?.progressPercentage || 0}%` }}
            ></div>
        </div>
        <p className="text-right text-sm text-gray-600 mt-1">{dashboardData?.progressPercentage || 0}% Complete</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <StatCard
            title="Program Progress"
            value={`${dashboardData?.progressPercentage || 0}%`}
            icon={<Target className="w-8 h-8 text-blue-500" />}
        />
        <StatCard
            title="Chapters Completed"
            value={`${dashboardData?.completedChapters || 0} / ${dashboardData?.totalChapters || 0}`}
            icon={<BookOpen className="w-8 h-8 text-green-500" />}
        />
        <StatCard
            title="Readiness Score"
            value="N/A" // Placeholder for gauge
            icon={<CheckCircle className="w-8 h-8 text-purple-500" />}
        />
      </div>

       <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Next Steps</h2>
            <div className="bg-white p-6 rounded-lg shadow">
                {/* This will link to the chapter view */}
                <p>Your next chapter is ready. Let's get started!</p>
                <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Go to Next Chapter
                </button>
            </div>
        </div>
    </div>
  );
};

export default StudentDashboard;