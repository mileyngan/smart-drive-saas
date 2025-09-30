import React, { useState, useEffect } from 'react';

const SecureContentWrapper = ({ children }) => {
  const [isDevToolsOpen, setIsDevToolsOpen] = useState(false);

  useEffect(() => {
    // Disable right-click context menu
    const handleContextMenu = (e) => e.preventDefault();
    document.addEventListener('contextmenu', handleContextMenu);

    // Detect DevTools opening
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

    const interval = setInterval(checkDevTools, 1000);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      clearInterval(interval);
    };
  }, []);

  if (isDevToolsOpen) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black text-white p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500">Security Alert</h2>
          <p className="mt-2">Developer tools are not permitted on this page. Please close them to continue.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default SecureContentWrapper;