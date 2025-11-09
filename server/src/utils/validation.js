/**
 * Validation utilities for input validation
 */

/**
 * Validates login credentials
 * @param {string} credential - Username or email
 * @param {string} password - Password
 * @returns {Object} Validation result with isValid flag and errors array
 */
function validateLoginCredentials(credential, password) {
  const errors = [];

  // Check if credential is provided
  if (!credential || typeof credential !== 'string' || credential.trim() === '') {
    errors.push('Credential (email or username) is required');
  }

  // Check if password is provided
  if (!password || typeof password !== 'string' || password.trim() === '') {
    errors.push('Password is required');
  } else {
    // Validate password requirements:
    // Min 8 chars, one uppercase, one lowercase, one number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      errors.push(
        'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number'
      );
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates username format
 * @param {string} username - Username to validate
 * @returns {boolean} True if valid, false otherwise
 */
function validateUsername(username) {
  // Username can contain uppercase, lowercase, and numbers
  const usernameRegex = /^[a-zA-Z0-9]+$/;
  return usernameRegex.test(username);
}

module.exports = {
  validateLoginCredentials,
  validateUsername
};

