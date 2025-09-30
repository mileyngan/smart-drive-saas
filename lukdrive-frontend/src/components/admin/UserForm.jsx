import React from 'react';
import { useForm } from 'react-hook-form';
import Input from '../common/Input';
import Button from '../common/Button';

const UserForm = ({ onSubmit, defaultValues, isLoading, isEdit = false }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        id="first_name"
        name="first_name"
        label="First Name"
        register={register}
        error={errors.first_name}
        disabled={isLoading}
      />
      <Input
        id="last_name"
        name="last_name"
        label="Last Name"
        register={register}
        error={errors.last_name}
        disabled={isLoading}
      />
      <Input
        id="email"
        name="email"
        type="email"
        label="Email Address"
        register={register}
        error={errors.email}
        disabled={isLoading}
      />
      {!isEdit && (
        <Input
          id="password"
          name="password"
          type="password"
          label="Password"
          placeholder="A temporary password for the user"
          register={register}
          error={errors.password}
          disabled={isLoading}
        />
      )}
      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
        <select
          id="role"
          name="role"
          {...register('role')}
          disabled={isLoading}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="student">Student</option>
          <option value="instructor">Instructor</option>
        </select>
      </div>
      <div className="pt-4 flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save User'}
        </Button>
      </div>
    </form>
  );
};

export default UserForm;