const bcrypt = require('bcrypt');
const dataStore = require('../data/store');
const { validateLoginCredentials } = require('../utils/validation');
const { generateToken } = require('../utils/jwt');

/**
 * Authentication Controller
 * Handles authentication-related operations
 */

/**
 * Login endpoint handler
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function login(req, res) {
  try {
    const { credential, password } = req.body;

    // Validate input
    const validation = validateLoginCredentials(credential, password);
    if (!validation.isValid) {
      return res.status(400).json({
        status: 'error',
        code: 'INVALID_INPUT',
        message: validation.errors.join(', ')
      });
    }

    // Find user by credential (email or username)
    const user = dataStore.findUserByCredential(credential);
    if (!user) {
      // Return generic error to prevent user enumeration
      return res.status(401).json({
        status: 'error',
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        status: 'error',
        code: 'ACCOUNT_INACTIVE',
        message: 'Account is inactive'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      // Return same error as user not found to prevent user enumeration
      return res.status(401).json({
        status: 'error',
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password'
      });
    }

    // Get user role
    const role = dataStore.findRoleById(user.role);
    if (!role || !role.isActive) {
      return res.status(500).json({
        status: 'error',
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred'
      });
    }

    // Generate JWT token
    const tokenData = generateToken(user, role);

    // Return success response
    return res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        accessToken: tokenData.accessToken,
        tokenType: tokenData.tokenType,
        expiresIn: tokenData.expiresIn,
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          lastName: user.lastName,
          email: user.email,
          bio: user.bio,
          role: role.name
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      status: 'error',
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred'
    });
  }
}

module.exports = {
  login
};

