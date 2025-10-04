import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import adminService from '../../services/admin.service';
import toast from 'react-hot-toast';
import Button from '../common/Button';
import Input from '../common/Input';

const LogPaymentForm = ({ studentId, enrollmentId }) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: adminService.logPayment,
        onSuccess: () => {
            toast.success('Payment logged successfully!');
            queryClient.invalidateQueries(['studentDetails', studentId]);
            reset();
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to log payment.');
        },
    });

    const handleFormSubmit = (data) => {
        mutation.mutate({
            ...data,
            student_id: studentId,
            enrollment_id: enrollmentId,
        });
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <Input
                id="amount"
                name="amount"
                type="number"
                label="Payment Amount"
                placeholder="e.g., 50000"
                register={register}
                error={errors.amount}
                disabled={mutation.isLoading}
            />
            <div>
                <label htmlFor="payment_method" className="block text-sm font-medium text-gray-700">
                    Payment Method
                </label>
                <select
                    id="payment_method"
                    {...register('payment_method')}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    disabled={mutation.isLoading}
                >
                    <option value="mobile_money">Mobile Money</option>
                    <option value="cash">Cash</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="card">Card</option>
                </select>
            </div>
            <Input
                id="notes"
                name="notes"
                label="Payment Notes (Optional)"
                placeholder="e.g., First installment"
                register={register}
                error={errors.notes}
                disabled={mutation.isLoading}
            />
            <div className="flex justify-end">
                <Button type="submit" disabled={mutation.isLoading}>
                    {mutation.isLoading ? 'Logging...' : 'Log Payment'}
                </Button>
            </div>
        </form>
    );
};

export default LogPaymentForm;