const crypto = require('crypto');
const supabase = require('../config/database');
const { hashPassword } = require('../utils/password');

const OTP_EXPIRY_MINUTES = 15;

/**
 * Generates a 6-digit OTP and saves its hash to the database.
 * @param {string} userId - The UUID of the user requesting the OTP.
 * @returns {Promise<string>} The plaintext 6-digit OTP.
 */
async function generateOtp(userId) {
  // 1. Generate a random 6-digit number
  const otp = crypto.randomInt(100000, 999999).toString();

  // 2. Set an expiration date
  const expires_at = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  // 3. Hash the OTP for storage
  const token_hash = await hashPassword(otp);

  // 4. Invalidate any old tokens for this user
  await supabase
    .from('otp_tokens')
    .delete()
    .eq('user_id', userId);

  // 5. Save the new token hash to the database
  const { error } = await supabase
    .from('otp_tokens')
    .insert({
      user_id: userId,
      token: token_hash,
      expires_at: expires_at,
    });

  if (error) {
    console.error('Error saving OTP token:', error);
    throw new Error('Could not save OTP token.');
  }

  // 6. Return the plaintext OTP to be sent to the user
  return otp;
}

module.exports = {
  generateOtp,
};