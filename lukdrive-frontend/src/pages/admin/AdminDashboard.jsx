import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, UserCheck, BarChartHorizontal, DollarSign } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import adminService from '../../services/admin.service';
import StatCard from '../../components/dashboard/StatCard';
import ChartWidget from '../../components/dashboard/ChartWidget';

// Sample data for the chart, as the backend doesn't provide this yet.
const sampleChartData = [
  { name: 'Jan', uv: 400, pv: 2400, amt: 2400 },
  { name: 'Feb', uv: 300, pv: 1398, amt: 2210 },
  { name: 'Mar', uv: 200, pv: 9800, amt: 2290 },
  { name: 'Apr', uv: 278, pv: 3908, amt: 2000 },
  { name: 'May', uv: 189, pv: 4800, amt: 2181 },
  { name: 'Jun', uv: 239, pv: 3800, amt: 2500 },
  { name: 'Jul', uv: 349, pv: 4300, amt: 2100 },
];

const AdminDashboard = () => {
  const { token, user } = useAuthStore();

  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: () => adminService.getDashboardStats(token).then(res => res.data),
    enabled: !!token, // Only run the query if the token exists
  });

  if (isLoading) {
    return <div>Loading dashboard...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error fetching dashboard data: {error.message}</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">Welcome, {user?.first_name}!</h1>
      <p className="mt-1 text-gray-600">Here's a summary of your driving school's activity.</p>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        <StatCard
          title="Total Students"
          value={stats?.totalStudents ?? 'N/A'}
          icon={<Users className="w-6 h-6 text-blue-600" />}
        />
        <StatCard
          title="Total Instructors"
          value={stats?.totalInstructors ?? 'N/A'}
          icon={<UserCheck className="w-6 h-6 text-green-600" />}
        />
        <StatCard
          title="Completion Rate"
          value={`${stats?.completionRate ?? 0}%`}
          icon={<BarChartHorizontal className="w-6 h-6 text-yellow-600" />}
        />
        <StatCard
          title="Revenue (Monthly)"
          value={`$${stats?.revenue ?? 0}`}
          icon={<DollarSign className="w-6 h-6 text-purple-600" />}
        />
      </div>

      {/* Charts */}
      <div className="mt-8">
        <ChartWidget data={sampleChartData} title="Enrollment Trends (Last 7 Months)" />
      </div>
    </div>
  );
};

export default AdminDashboard;