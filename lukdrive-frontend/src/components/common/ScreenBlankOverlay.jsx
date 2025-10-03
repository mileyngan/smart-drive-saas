import React from 'react';
import { ShieldAlert } from 'lucide-react';

const ScreenBlankOverlay = ({ message, details }) => {
    return (
        <div className="absolute inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
            <div className="text-center text-white p-8">
                <ShieldAlert className="mx-auto h-16 w-16 text-red-500 mb-4" />
                <h2 className="text-2xl font-bold text-red-500">{message}</h2>
                <p className="mt-2 max-w-md">{details}</p>
            </div>
        </div>
    );
};

export default ScreenBlankOverlay;