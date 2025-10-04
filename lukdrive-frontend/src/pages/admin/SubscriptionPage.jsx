import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { CheckCircle } from 'lucide-react';
import Button from '../../components/common/Button';
import adminService from '../../services/admin.service';
import useAuthStore from '../../store/authStore';

const plans = [
    {
        name: 'Basic',
        price: 'Free',
        description: 'For small schools getting started.',
        features: [
            'Up to 30 Students',
            'Up to 3 Instructors',
            'Core Course Management',
            'Basic Analytics',
        ],
    },
    {
        name: 'Pro',
        price: '50,000 XAF',
        price_sub: '/month',
        description: 'For growing schools that need more power.',
        features: [
            'Up to 200 Students',
            'Up to 15 Instructors',
            'AI Quiz Generation',
            'Advanced DRM Protection',
            'Email & Phone Support',
        ],
    },
    {
        name: 'Enterprise',
        price: '150,000 XAF',
        price_sub: '/month',
        description: 'For large schools and franchises.',
        features: [
            'Unlimited Students & Instructors',
            'Multi-branch Management',
            'Advanced Analytics',
            'Fleet Management',
            'Dedicated Account Manager',
        ],
    },
];

const SubscriptionPage = () => {
    const { user, school, setAuth } = useAuthStore();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: adminService.updateSubscription,
        onSuccess: (response) => {
            toast.success(response.data.message);
            // Update the auth store with the new subscription details
            const newSchoolData = { ...school, subscription: response.data.subscription };
            const newUserData = { ...user, school: newSchoolData };
            setAuth({ user: newUserData, school: newSchoolData, token: useAuthStore.getState().token });
            queryClient.invalidateQueries(['dashboardStats']); // Invalidate related queries
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to update subscription.');
        },
    });

    const handleSelectPlan = (planName) => {
        if (window.confirm(`Are you sure you want to upgrade to the ${planName} plan?`)) {
            mutation.mutate(planName);
        }
    };

    const currentPlanName = school?.subscription?.plan || 'basic';

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800">Subscription Management</h1>
            <p className="mt-1 text-gray-600">Choose the plan that's right for your driving school.</p>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                {plans.map((plan) => {
                    const isCurrent = plan.name.toLowerCase() === currentPlanName;
                    return (
                        <div key={plan.name} className={`border-2 rounded-lg shadow-lg p-6 flex flex-col ${plan.name === 'Pro' ? 'border-blue-500' : 'border-gray-200'}`}>
                            <h2 className="text-xl font-semibold text-gray-800">{plan.name}</h2>
                            <p className="mt-2 text-gray-500">{plan.description}</p>
                            <div className="mt-4">
                                <span className="text-4xl font-bold">{plan.price}</span>
                                <span className="text-gray-500">{plan.price_sub}</span>
                            </div>
                            <ul className="mt-6 space-y-4 text-sm text-gray-600 flex-grow">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-center">
                                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-6">
                                <Button
                                    className="w-full"
                                    onClick={() => handleSelectPlan(plan.name)}
                                    disabled={isCurrent || mutation.isLoading || plan.name === 'Basic'}
                                >
                                    {isCurrent ? 'Current Plan' : 'Select Plan'}
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SubscriptionPage;