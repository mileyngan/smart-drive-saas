import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import instructorService from '../../services/instructor.service';
import useAuthStore from '../../store/authStore';
import Button from '../../components/common/Button';
import { Upload, CheckCircle } from 'lucide-react';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const timeSlots = ['Morning', 'Afternoon', 'Evening'];

const InstructorProfilePage = () => {
    const { user, setAuth } = useAuthStore();
    const queryClient = useQueryClient();
    const [availability, setAvailability] = useState({});
    const [licenseUrl, setLicenseUrl] = useState('');

    useEffect(() => {
        if (user?.availability) {
            setAvailability(user.availability);
        }
        if (user?.teaching_license_url) {
            setLicenseUrl(user.teaching_license_url);
        }
    }, [user]);

    const uploadMutation = useMutation({
        mutationFn: instructorService.uploadLicense,
        onSuccess: (response) => {
            toast.success('License uploaded successfully!');
            setLicenseUrl(response.data.publicUrl);
            // Also save it to the profile immediately
            profileMutation.mutate({ teaching_license_url: response.data.publicUrl });
        },
        onError: (error) => toast.error(error.response?.data?.message || 'Upload failed.'),
    });

    const profileMutation = useMutation({
        mutationFn: instructorService.updateProfile,
        onSuccess: (response) => {
            toast.success('Profile updated successfully!');
            // Update user state in Zustand store
            setAuth({ user: response.data.user, token: useAuthStore.getState().token });
        },
        onError: (error) => toast.error(error.response?.data?.message || 'Update failed.'),
    });

    const handleAvailabilityChange = (day, slot) => {
        const daySlots = availability[day] || [];
        const updatedSlots = daySlots.includes(slot)
            ? daySlots.filter(s => s !== slot)
            : [...daySlots, slot];
        setAvailability({ ...availability, [day]: updatedSlots });
    };

    const handleLicenseUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('license', file);
            uploadMutation.mutate(formData);
        }
    };

    const handleProfileSave = () => {
        profileMutation.mutate({ availability });
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800">My Profile & Availability</h1>
            <p className="mt-1 text-gray-600">Set your weekly schedule and manage your credentials.</p>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Availability Card */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Set Your Weekly Availability</h2>
                    <div className="space-y-4">
                        {days.map(day => (
                            <div key={day}>
                                <p className="font-medium">{day}</p>
                                <div className="flex space-x-4 mt-2">
                                    {timeSlots.map(slot => (
                                        <label key={slot} className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="rounded"
                                                checked={!!availability[day]?.includes(slot)}
                                                onChange={() => handleAvailabilityChange(day, slot)}
                                            />
                                            <span>{slot}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* License & Save Card */}
                <div className="space-y-8">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-4">Teaching License</h2>
                        <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    {licenseUrl ? (
                                        <>
                                            <CheckCircle className="w-10 h-10 text-green-500 mb-2"/>
                                            <p className="mb-2 text-sm text-green-600 font-semibold">License Uploaded</p>
                                            <a href={licenseUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline" onClick={(e) => e.stopPropagation()}>View License</a>
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-10 h-10 text-gray-400 mb-2"/>
                                            <p className="mb-2 text-sm text-gray-500">
                                                <span className="font-semibold">Click to upload</span> or drag and drop
                                            </p>
                                            <p className="text-xs text-gray-500">PDF, PNG, JPG (MAX. 10MB)</p>
                                        </>
                                    )}
                                </div>
                                <input type="file" className="hidden" onChange={handleLicenseUpload} accept=".pdf,.png,.jpg,.jpeg"/>
                            </label>
                        </div>
                    </div>

                    <Button className="w-full" onClick={handleProfileSave} disabled={profileMutation.isLoading}>
                        {profileMutation.isLoading ? 'Saving...' : 'Save Profile Changes'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default InstructorProfilePage;