import React, { useState, useEffect, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import securityService from '../../services/security.service';
import PermissionModal from '../common/PermissionModal';
import ScreenBlankOverlay from '../common/ScreenBlankOverlay';
import { Camera, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

const SecureContentWrapper = ({ children }) => {
    const [isDevToolsOpen, setIsDevToolsOpen] = useState(false);
    const [cameraPermission, setCameraPermission] = useState('prompt'); // 'prompt', 'granted', 'denied'
    const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(true);
    const [isContentBlanked, setIsContentBlanked] = useState(false);
    const videoRef = useRef(null);

    const logIncidentMutation = useMutation({
        mutationFn: securityService.logIncident,
        onSuccess: (data, variables) => {
            console.log(`Security incident logged: ${variables.incident_type}`);
        },
        onError: (error) => {
            console.error('Failed to log security incident:', error);
        }
    });

    useEffect(() => {
        const preventAction = (e, type) => {
            e.preventDefault();
            toast.error('This action is disabled for security reasons.');
            logIncidentMutation.mutate({ incident_type: type });
        };
        const copyHandler = (e) => preventAction(e, 'copy_attempted');
        const printHandler = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'p') preventAction(e, 'print_attempted');
        };
        document.addEventListener('contextmenu', (e) => preventAction(e, 'context_menu'));
        document.addEventListener('copy', copyHandler);
        document.addEventListener('keydown', printHandler);

        const threshold = 160;
        const checkDevTools = () => {
            if (window.outerWidth - window.innerWidth > threshold || window.outerHeight - window.innerHeight > threshold) {
                if (!isDevToolsOpen) {
                    setIsDevToolsOpen(true);
                    logIncidentMutation.mutate({ incident_type: 'devtools_opened' });
                }
            } else {
                setIsDevToolsOpen(false);
            }
        };
        const devToolsInterval = setInterval(checkDevTools, 1000);

        return () => {
            document.removeEventListener('contextmenu', (e) => preventAction(e, 'context_menu'));
            document.removeEventListener('copy', copyHandler);
            document.removeEventListener('keydown', printHandler);
            clearInterval(devToolsInterval);
        };
    }, [isDevToolsOpen]);

    useEffect(() => {
        let simulationTimeout;
        if (cameraPermission === 'granted') {
            // Start the simulation timer once permission is granted
            simulationTimeout = setTimeout(() => {
                toast.error('Potential recording device detected. Content has been secured.');
                logIncidentMutation.mutate({ incident_type: 'camera_detected', details: 'Simulation triggered.' });
                setIsContentBlanked(true);
            }, 10000); // Trigger after 10 seconds for demo purposes
        }
        return () => clearTimeout(simulationTimeout);
    }, [cameraPermission]);

    const handleAcceptPermission = async () => {
        setIsPermissionModalOpen(false);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            setCameraPermission('granted');
            if (videoRef.current) videoRef.current.srcObject = stream;
        } catch (err) {
            setCameraPermission('denied');
            toast.error('Camera access is required to view this content.');
        }
    };

    const handleDeclinePermission = () => {
        setIsPermissionModalOpen(false);
        setCameraPermission('denied');
    };

    if (isDevToolsOpen) {
        return (
            <div className="w-full h-screen flex items-center justify-center bg-black text-white p-8">
                <div className="text-center">
                    <Shield className="mx-auto h-16 w-16 text-red-500 mb-4" />
                    <h2 className="text-2xl font-bold text-red-500">Security Alert</h2>
                    <p className="mt-2">Developer tools are not permitted. Please close them to continue.</p>
                </div>
            </div>
        );
    }

    if (cameraPermission === 'prompt') {
        return (
            <PermissionModal isOpen={isPermissionModalOpen} onAccept={handleAcceptPermission} onDecline={handleDeclinePermission} title="Camera Access for Security">
                To protect our content, LukDrive uses your camera to prevent screen recording. Your camera feed is not stored or shared. Please grant permission to continue.
            </PermissionModal>
        );
    }

    if (cameraPermission === 'denied') {
        return (
            <div className="w-full h-screen flex items-center justify-center bg-gray-100 p-8">
                <div className="text-center">
                    <Camera className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-700">Camera Access Required</h2>
                    <p className="mt-2 text-gray-500">Camera access was denied. This security measure is required to view content. Please enable camera permissions in your browser settings and refresh.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative" style={{ userSelect: 'none' }}>
            {isContentBlanked && (
                <ScreenBlankOverlay
                    message="Content Secured"
                    details="A potential recording device was detected. For security, this content has been hidden. Please contact support if you believe this is an error."
                />
            )}
            {cameraPermission === 'granted' && (
                <div className="absolute top-2 right-2 w-32 h-24 bg-black rounded-lg shadow-lg overflow-hidden z-20">
                    <video ref={videoRef} autoPlay muted className="w-full h-full object-cover" />
                    <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white text-xs text-center py-0.5 animate-pulse">
                        DRM ACTIVE
                    </div>
                </div>
            )}
            {children}
        </div>
    );
};

export default SecureContentWrapper;