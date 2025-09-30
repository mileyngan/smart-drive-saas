import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import authService from '../../services/auth.service';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const mutation = useMutation({
    mutationFn: authService.registerSchool,
    onSuccess: (data) => {
      toast.success(data.data.message || 'Registration successful! Please log in.');
      navigate('/login');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 'An error occurred during registration.';
      toast.error(errorMessage);
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create a new school account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm space-y-4">
            <h3 className="text-lg font-medium text-gray-900">School Information</h3>
            <Input
              id="schoolName"
              name="schoolName"
              label="Driving School Name"
              placeholder="e.g., Luk's Driving School"
              register={register}
              error={errors.schoolName}
              disabled={mutation.isPending}
            />
            <Input
              id="ministryCode"
              name="ministryCode"
              label="Ministry Code"
              placeholder="Your official ministry code"
              register={register}
              error={errors.ministryCode}
              disabled={mutation.isPending}
            />

            <h3 className="text-lg font-medium text-gray-900 pt-4">Admin Information</h3>
            <Input
              id="adminFirstName"
              name="adminFirstName"
              label="First Name"
              placeholder="Admin's First Name"
              register={register}
              error={errors.adminFirstName}
              disabled={mutation.isPending}
            />
            <Input
              id="adminLastName"
              name="adminLastName"
              label="Last Name"
              placeholder="Admin's Last Name"
              register={register}
              error={errors.adminLastName}
              disabled={mutation.isPending}
            />
            <Input
              id="email"
              name="email"
              type="email"
              label="Email address"
              placeholder="Admin's Email Address"
              register={register}
              error={errors.email}
              disabled={mutation.isPending}
            />
            <Input
              id="password"
              name="password"
              type="password"
              label="Password"
              placeholder="Create a strong password"
              register={register}
              error={errors.password}
              disabled={mutation.isPending}
            />
          </div>

          <div>
            <Button type="submit" variant="primary" className="w-full" disabled={mutation.isPending}>
              {mutation.isPending ? 'Registering...' : 'Register School'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;