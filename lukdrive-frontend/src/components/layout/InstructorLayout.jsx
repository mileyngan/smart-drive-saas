import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Users, LayoutDashboard, UserCircle } from 'lucide-react';
import UserNav from './UserNav';

const navLinks = [
  { name: 'Dashboard', href: '/instructor/dashboard', icon: LayoutDashboard },
  { name: 'Students', href: '/instructor/students', icon: Users },
  { name: 'My Profile', href: '/instructor/profile', icon: UserCircle },
];

const InstructorLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-white shadow-md hidden md:block">
        <div className="p-5 font-bold text-xl text-blue-600 border-b">LukDrive</div>
        <nav className="p-2 space-y-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.href}
              end={link.href.endsWith('dashboard')} // Use `end` for the dashboard link
              className={({ isActive }) =>
                `flex items-center p-2 rounded-md text-gray-600 hover:bg-gray-100 ${
                  isActive ? 'bg-blue-100 text-blue-700' : ''
                }`
              }
            >
              <link.icon className="w-5 h-5 mr-3" />
              {link.name}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm flex justify-end items-center p-4">
            <UserNav />
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default InstructorLayout;