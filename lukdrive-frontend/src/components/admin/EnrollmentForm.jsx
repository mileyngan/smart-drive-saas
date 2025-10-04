import React from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import adminService from '../../services/admin.service';
import Button from '../common/Button';

const EnrollmentForm = ({ student, onSubmit, isLoading }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const { data: programs, isLoading: isLoadingPrograms } = useQuery({
        queryKey: ['programs'],
        queryFn: () => adminService.getPrograms().then(res => res.data),
    });

    const handleFormSubmit = (data) => {
        onSubmit({
            student_id: student.id,
            program_id: data.program_id,
        });
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <div>
                <p className="text-gray-700">
                    You are enrolling: <span className="font-semibold">{student.first_name} {student.last_name}</span>
                </p>
            </div>
            <div>
                <label htmlFor="program_id" className="block text-sm font-medium text-gray-700">
                    Select a Program
                </label>
                <select
                    id="program_id"
                    {...register('program_id', { required: 'Please select a program.' })}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    disabled={isLoading || isLoadingPrograms}
                >
                    <option value="">{isLoadingPrograms ? 'Loading programs...' : 'Choose a program'}</option>
                    {programs?.map(program => (
                        <option key={program.id} value={program.id}>
                            {program.name}
                        </option>
                    ))}
                </select>
                {errors.program_id && <p className="mt-2 text-sm text-red-600">{errors.program_id.message}</p>}
            </div>
            <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isLoading || isLoadingPrograms}>
                    {isLoading ? 'Enrolling...' : 'Enroll Student'}
                </Button>
            </div>
        </form>
    );
};

export default EnrollmentForm;