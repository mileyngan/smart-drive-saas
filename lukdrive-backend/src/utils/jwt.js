const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRY = process.env.JWT_EXPIRY || '24h';

if (!JWT_SECRET) {
  console.error("JWT_SECRET is missing. Make sure to set it in your .env file.");
}

/**
 * Generates a JWT for a given user payload.
 * @param {object} payload - The user data to include in the token.
 * @returns {string} The generated JWT.
 */
const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
};

module.exports = {
  generateToken,
};