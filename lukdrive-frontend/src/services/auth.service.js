import api from './api';

const registerSchool = (registrationData) => {
  return api.post('/auth/register/school', registrationData);
};

const login = (credentials) => {
  return api.post('/auth/login', credentials);
};

const requestOtp = (email) => {
    return api.post('/auth/request-otp', { email });
};

const verifyOtp = (email, otp) => {
    return api.post('/auth/verify-otp', { email, otp });
};

const authService = {
  registerSchool,
  login,
  requestOtp,
  verifyOtp,
};

export default authService;