import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import authService from '../../services/auth.service';
import useAuthStore from '../../store/authStore';

const LoginPage = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, getValues } = useForm();
  const loginAction = useAuthStore((state) => state.login);
  const [loginMethod, setLoginMethod] = useState('password'); // 'password' or 'otp'
  const [otpSent, setOtpSent] = useState(false);

  const passwordLoginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: ({ data }) => {
      toast.success(data.message || 'Login successful!');
      loginAction(data.token, data.user);
      navigate('/dashboard');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Login failed.');
    },
  });

  const requestOtpMutation = useMutation({
      mutationFn: (email) => authService.requestOtp(email),
      onSuccess: () => {
          toast.success('An OTP has been sent to your email.');
          setOtpSent(true);
      },
      onError: (error) => {
          toast.error(error.response?.data?.message || 'Failed to request OTP.');
      }
  });

  const verifyOtpMutation = useMutation({
      mutationFn: ({ email, otp }) => authService.verifyOtp(email, otp),
      onSuccess: ({ data }) => {
          toast.success(data.message || 'Login successful!');
          loginAction(data.token, data.user);
          navigate('/dashboard');
      },
      onError: (error) => {
          toast.error(error.response?.data?.message || 'OTP verification failed.');
      }
  });

  const onSubmit = (data) => {
    if (loginMethod === 'password') {
      passwordLoginMutation.mutate(data);
    } else {
        if (!otpSent) {
            requestOtpMutation.mutate(data.email);
        } else {
            verifyOtpMutation.mutate({ email: getValues('email'), otp: data.otp });
        }
    }
  };

  const isPasswordLoading = passwordLoginMutation.isPending;
  const isOtpLoading = requestOtpMutation.isPending || verifyOtpMutation.isPending;

  return (
    <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
              create a new account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>

          {loginMethod === 'password' ? (
            // Password Form
            <div className="rounded-md shadow-sm -space-y-px">
              <Input id="email" name="email" type="email" label="Email address" placeholder="Email address" register={register} error={errors.email} disabled={isPasswordLoading} />
              <Input id="password" name="password" type="password" label="Password" placeholder="Password" register={register} error={errors.password} disabled={isPasswordLoading} />
            </div>
          ) : (
            // OTP Form
            <div className="rounded-md shadow-sm space-y-4">
                <Input id="email" name="email" type="email" label="Email address" placeholder="Email address" register={register} error={errors.email} disabled={otpSent || isOtpLoading} />
                {otpSent && (
                    <Input id="otp" name="otp" type="text" label="One-Time Password" placeholder="Enter the 6-digit code" register={register} error={errors.otp} disabled={isOtpLoading} />
                )}
            </div>
          )}

          <div>
            <Button type="submit" variant="primary" className="w-full" disabled={isPasswordLoading || isOtpLoading}>
              {isPasswordLoading && 'Signing in...'}
              {isOtpLoading && (otpSent ? 'Verifying...' : 'Sending OTP...')}
              {!isPasswordLoading && !isOtpLoading && (loginMethod === 'password' ? 'Sign in with Password' : (otpSent ? 'Sign in with OTP' : 'Request OTP'))}
            </Button>
          </div>

          <div className="text-center">
            <button type="button" onClick={() => setLoginMethod(loginMethod === 'password' ? 'otp' : 'password')} className="font-medium text-sm text-blue-600 hover:text-blue-500">
                {loginMethod === 'password' ? 'Sign in with One-Time Password' : 'Sign in with Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;