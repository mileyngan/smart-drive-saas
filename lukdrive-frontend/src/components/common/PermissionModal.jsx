import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { Camera, Shield } from 'lucide-react';

const PermissionModal = ({ isOpen, onAccept, onDecline, title, children }) => {
    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onDecline} title="">
            <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                    <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="mt-5 text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    {title}
                </h3>
                <div className="mt-2 px-7 py-3">
                    <p className="text-sm text-gray-500">
                        {children}
                    </p>
                </div>
                <div className="items-center px-4 py-3 space-x-4">
                    <Button
                        variant="secondary"
                        onClick={onDecline}
                    >
                        Decline
                    </Button>
                    <Button
                        onClick={onAccept}
                    >
                        Accept & Continue
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default PermissionModal;