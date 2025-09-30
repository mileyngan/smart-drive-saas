import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { LogOut } from 'lucide-react';

const UserNav = () => {
  const navigate = useNavigate();
  const { user, logout: logoutAction } = useAuthStore();

  const handleLogout = () => {
    logoutAction();
    navigate('/login');
  };

  return (
    <div className="flex items-center">
      <span className="text-gray-700 text-sm mr-4">
        Welcome, <span className="font-semibold">{user?.first_name}</span>
      </span>
      <button
        onClick={handleLogout}
        className="flex items-center text-sm text-gray-500 hover:text-red-600 transition-colors"
        title="Logout"
      >
        <LogOut className="w-5 h-5" />
      </button>
    </div>
  );
};

export default UserNav;