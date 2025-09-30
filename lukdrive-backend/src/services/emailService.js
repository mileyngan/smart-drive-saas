/**
 * Sends an OTP to a user's email address.
 * In a real application, this would use a service like Nodemailer or SendGrid.
 * For this project, we will simulate the email by logging it to the console.
 * @param {string} userEmail - The recipient's email address.
 * @param {string} otp - The 6-digit one-time password.
 */
async function sendOtpEmail(userEmail, otp) {
  console.log('--- SIMULATING EMAIL ---');
  console.log(`To: ${userEmail}`);
  console.log(`Subject: Your LukDrive Login Code`);
  console.log(`Your one-time password is: ${otp}`);
  console.log('This code will expire in 15 minutes.');
  console.log('------------------------');
  // In a real implementation, you would return a promise from your email client.
  return Promise.resolve();
}

module.exports = {
  sendOtpEmail,
};