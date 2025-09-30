import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAuthStore from '../../store/authStore';
import adminService from '../../services/admin.service';
import Button from '../common/Button';

const EnrollmentForm = ({ student, onSubmit, isLoading }) => {
  const token = useAuthStore((state) => state.token);

  const { data: programs, isLoading: isLoadingPrograms } = useQuery({
    queryKey: ['programs'],
    queryFn: () => adminService.getPrograms(token).then(res => res.data),
    enabled: !!token,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const program_id = e.target.elements.program.value;
    if (program_id) {
      onSubmit({ student_id: student.id, program_id });
    }
  };

  if (isLoadingPrograms) {
    return <p>Loading programs...</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <p className="text-sm text-gray-700">
          You are enrolling: <span className="font-semibold">{student.first_name} {student.last_name}</span>
        </p>
      </div>
      <div>
        <label htmlFor="program" className="block text-sm font-medium text-gray-700">
          Select a Program
        </label>
        <select
          id="program"
          name="program"
          disabled={isLoading || programs?.length === 0}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          {programs?.length === 0 ? (
            <option>No programs found. Please create one first.</option>
          ) : (
            programs?.map((program) => (
              <option key={program.id} value={program.id}>
                {program.name}
              </option>
            ))
          )}
        </select>
      </div>
      <div className="pt-4 flex justify-end">
        <Button type="submit" disabled={isLoading || programs?.length === 0}>
          {isLoading ? 'Enrolling...' : 'Enroll Student'}
        </Button>
      </div>
    </form>
  );
};

export default EnrollmentForm;