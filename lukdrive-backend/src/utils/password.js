const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 10;

/**
 * Hashes a plaintext password.
 * @param {string} password - The plaintext password.
 * @returns {Promise<string>} The hashed password.
 */
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(password, salt);
};

/**
 * Compares a plaintext password with a hashed password.
 * @param {string} password - The plaintext password.
 * @param {string} hashedPassword - The hashed password from the database.
 * @returns {Promise<boolean>} True if the passwords match, false otherwise.
 */
const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

module.exports = {
  hashPassword,
  comparePassword,
};