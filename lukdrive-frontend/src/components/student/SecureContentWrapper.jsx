import React, { useState, useEffect } from 'react';
import { Camera, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

const SecureContentWrapper = ({ children }) => {
  const [isDevToolsOpen, setIsDevToolsOpen] = useState(false);
  const [showCameraAlert, setShowCameraAlert] = useState(false);

  useEffect(() => {
    // --- BASIC DRM ---
    const preventAction = (e) => {
      e.preventDefault();
      toast.error('This action is disabled for security reasons.');
    };

    // Disable right-click context menu
    document.addEventListener('contextmenu', preventAction);
    // Disable copy, paste, and cut
    document.addEventListener('copy', preventAction);
    document.addEventListener('paste', preventAction);
    document.addEventListener('cut', preventAction);

    // Disable printing
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        preventAction(e);
      }
      // Attempt to block PrintScreen - limited browser support
      if (e.key === 'PrintScreen') {
        preventAction(e);
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    // --- DEVTOOLS DETECTION ---
    const threshold = 160;
    const checkDevTools = () => {
      if (
        window.outerWidth - window.innerWidth > threshold ||
        window.outerHeight - window.innerHeight > threshold
      ) {
        setIsDevToolsOpen(true);
      } else {
        setIsDevToolsOpen(false);
      }
    };
    const devToolsInterval = setInterval(checkDevTools, 1000);

    // --- CAMERA DETECTION SIMULATION ---
    // For the demo, we'll simulate a camera detection alert after a short delay.
    const cameraSimTimeout = setTimeout(() => {
        // In a real app, this would be triggered by an actual camera detection event.
        setShowCameraAlert(true);
        toast(
            (t) => (
                <span>
                    <b>Camera Detected!</b> For security, the screen will be blanked if an external recording device is pointed at it.
                    <button onClick={() => toast.dismiss(t.id)} className="ml-2 px-2 py-1 rounded bg-gray-200 text-sm">
                        Dismiss
                    </button>
                </span>
            ),
            { icon: <Camera className="text-orange-500" />, duration: 6000 }
        );
        // Hide the visual alert after a few seconds
        setTimeout(() => setShowCameraAlert(false), 5000);
    }, 8000); // Show alert 8 seconds after component mounts

    return () => {
      // Cleanup all event listeners
      document.removeEventListener('contextmenu', preventAction);
      document.removeEventListener('copy', preventAction);
      document.removeEventListener('paste', preventAction);
      document.removeEventListener('cut', preventAction);
      document.removeEventListener('keydown', handleKeyDown);
      clearInterval(devToolsInterval);
      clearTimeout(cameraSimTimeout);
    };
  }, []);

  if (isDevToolsOpen) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-black text-white p-8">
        <div className="text-center">
          <Shield className="mx-auto h-16 w-16 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-red-500">Security Alert</h2>
          <p className="mt-2">Developer tools are not permitted on this page. Please close them to continue.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative" style={{ userSelect: 'none' }}>
      {/* This is the visual indicator for the camera detection simulation */}
      {showCameraAlert && (
        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-50 flex items-center animate-pulse">
            <Camera className="h-4 w-4 mr-1" />
            CAM-DRM ACTIVE
        </div>
      )}
      {children}
    </div>
  );
};

export default SecureContentWrapper;