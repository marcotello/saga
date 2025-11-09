const jwt = require('jsonwebtoken');

/**
 * JWT utility functions
 */

// Secret key for JWT signing (in production, this should be in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '1h'; // 60 minutes

/**
 * Generates a JWT token for a user
 * @param {Object} user - User object
 * @param {Object} role - Role object
 * @returns {Object} Token information
 */
function generateToken(user, role) {
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: role.name
  };

  const token = jwt.sign(payload, JWT_SECRET, { 
    expiresIn: JWT_EXPIRATION 
  });

  return {
    accessToken: token,
    tokenType: 'Bearer',
    expiresIn: 3600 // 1 hour in seconds
  };
}

/**
 * Verifies a JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object|null} Decoded payload or null if invalid
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

module.exports = {
  generateToken,
  verifyToken
};

