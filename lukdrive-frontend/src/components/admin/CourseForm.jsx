import React from 'react';
import { useForm } from 'react-hook-form';
import Input from '../common/Input';
import Button from '../common/Button';

const CourseForm = ({ onSubmit, isLoading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg mx-auto">
      <Input
        id="name"
        name="name"
        label="Course Name"
        placeholder="e.g., Novice Driver Program"
        register={register}
        error={errors.name}
        disabled={isLoading}
      />
      <Input
        id="description"
        name="description"
        label="Course Description"
        placeholder="A brief summary of the course"
        register={register}
        error={errors.description}
        disabled={isLoading}
      />
      <Input
        id="total_chapters"
        name="total_chapters"
        type="number"
        label="Total Number of Chapters"
        placeholder="e.g., 20"
        register={register}
        error={errors.total_chapters}
        disabled={isLoading}
      />
      <div>
        <label htmlFor="license_type" className="block text-sm font-medium text-gray-700">License Type</label>
        <select
          id="license_type"
          name="license_type"
          {...register('license_type')}
          disabled={isLoading}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="B">Class B</option>
          <option value="A">Class A</option>
          <option value="C">Class C</option>
        </select>
      </div>
      <div className="pt-4 flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save and Add Chapters'}
        </Button>
      </div>
    </form>
  );
};

export default CourseForm;