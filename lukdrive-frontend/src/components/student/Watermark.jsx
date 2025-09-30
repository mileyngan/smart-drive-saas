import React from 'react';
import useAuthStore from '../../store/authStore';

const Watermark = () => {
  const user = useAuthStore((state) => state.user);

  if (!user) return null;

  const watermarkText = `${user.email} - ${new Date().toISOString()}`;

  return (
    <div className="absolute inset-0 grid grid-cols-3 grid-rows-6 gap-4 pointer-events-none z-50">
      {Array(18).fill(0).map((_, i) => (
        <div key={i} className="flex items-center justify-center">
          <p
            className="text-gray-300 text-opacity-20 font-bold text-lg transform -rotate-45 select-none"
          >
            {watermarkText}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Watermark;