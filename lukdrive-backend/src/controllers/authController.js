const supabase = require('../config/database');
const { hashPassword, comparePassword } = require('../utils/password');
const { generateToken } = require('../utils/jwt');
const { generateOtp } = require('../services/otpService');
const { sendOtpEmail } = require('../services/emailService');

// @desc    Register a new driving school and its admin
exports.registerSchool = async (req, res) => {
  const { schoolName, ministryCode, adminFirstName, adminLastName, email, password } = req.body;
  if (!schoolName || !ministryCode || !adminFirstName || !email || !password) {
    return res.status(400).json({ message: 'Please provide all required fields.' });
  }
  try {
    const { data: schoolData, error: schoolError } = await supabase.from('schools').insert({ name: schoolName, ministry_code: ministryCode, subscription_plan: 'trial', subscription_expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }).select().single();
    if (schoolError) { if (schoolError.code === '23505') { return res.status(409).json({ message: 'A school with this Ministry Code already exists.' }); } throw schoolError; }
    const password_hash = await hashPassword(password);
    const { data: userData, error: userError } = await supabase.from('users').insert({ first_name: adminFirstName, last_name: adminLastName, email, password_hash, role: 'admin', school_id: schoolData.id }).select('id, first_name, last_name, email, role').single();
    if (userError) { await supabase.from('schools').delete().match({ id: schoolData.id }); if (userError.code === '23505') { return res.status(409).json({ message: 'A user with this email already exists.' }); } throw userError; }
    const token = generateToken({ id: userData.id, email: userData.email, role: userData.role, school_id: schoolData.id });
    res.status(201).json({ message: 'School and admin registered successfully!', token, user: userData, school: schoolData });
  } catch (error) { console.error('Registration Error:', error); res.status(500).json({ message: 'Server error during registration process.' }); }
};

// @desc    Authenticate user & get token
exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) { return res.status(400).json({ message: 'Please provide an email and password.' }); }
  try {
    const { data: user, error: userError } = await supabase.from('users').select('*, school:schools(id, name, subscription_plan)').eq('email', email).single();
    if (userError || !user) { return res.status(401).json({ message: 'Invalid credentials.' }); }
    const isMatch = await comparePassword(password, user.password_hash);
    if (!isMatch) { return res.status(401).json({ message: 'Invalid credentials.' }); }
    const token = generateToken({ id: user.id, email: user.email, role: user.role, school_id: user.school_id });
    delete user.password_hash;
    res.status(200).json({ message: 'Logged in successfully!', token, user });
  } catch (error) { console.error('Login Error:', error); res.status(500).json({ message: 'Server error during login process.' }); }
};

// @desc    Request a new OTP
exports.requestOtp = async (req, res) => {
    const { email } = req.body;
    if (!email) { return res.status(400).json({ message: 'Please provide an email.' }); }
    try {
        const { data: user, error: userError } = await supabase.from('users').select('id, email').eq('email', email).single();
        if (userError || !user) { return res.status(404).json({ message: 'User with this email not found.' }); }
        const otp = await generateOtp(user.id);
        await sendOtpEmail(user.email, otp);
        res.status(200).json({ message: 'An OTP has been sent to your email address.' });
    } catch (error) { console.error('Error requesting OTP:', error); res.status(500).json({ message: 'Server error while requesting OTP.' }); }
};

// @desc    Verify OTP for login
exports.verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) { return res.status(400).json({ message: 'Email and OTP are required.' }); }
    try {
        const { data: user, error: userError } = await supabase.from('users').select('id, email, role, school_id').eq('email', email).single();
        if (userError || !user) { return res.status(404).json({ message: 'User not found.' }); }

        const { data: otpToken, error: otpError } = await supabase.from('otp_tokens').select('*').eq('user_id', user.id).single();
        if (otpError || !otpToken) { return res.status(400).json({ message: 'No OTP found for this user. Please request a new one.' }); }

        const isMatch = await comparePassword(otp, otpToken.token);
        if (!isMatch) { return res.status(401).json({ message: 'Invalid OTP.' }); }

        if (new Date() > new Date(otpToken.expires_at)) { return res.status(401).json({ message: 'OTP has expired. Please request a new one.' }); }

        await supabase.from('otp_tokens').delete().eq('user_id', user.id);

        const token = generateToken({ id: user.id, email: user.email, role: user.role, school_id: user.school_id });
        res.status(200).json({ message: 'Logged in successfully!', token, user });
    } catch (error) { console.error('Error verifying OTP:', error); res.status(500).json({ message: 'Server error during OTP verification.' }); }
};

// @desc    Logout user
exports.logout = async (req, res) => {
  res.status(200).json({ message: 'Logged out successfully.' });
};