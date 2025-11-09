const bcrypt = require('bcrypt');
const User = require('../models/User');
const Role = require('../models/Role');

/**
 * In-memory data store for users and roles
 */
class DataStore {
  constructor() {
    this.roles = [];
    this.users = [];
    this.initialized = false;
  }

  /**
   * Initialize roles and users with hashed passwords
   */
  async initializeData() {
    if (this.initialized) {
      return; // Already initialized
    }

    // Create roles
    this.roles.push(new Role(1, 'Admin', true));
    this.roles.push(new Role(2, 'User', true));

    // Hash passwords
    const adminPasswordHash = await bcrypt.hash('Password@123', 10);
    const userPasswordHash = await bcrypt.hash('meive4Lei', 10);

    // Create Admin user
    this.users.push(
      new User(
        1,
        'John',
        'Smith',
        'johnsmith@saga.com',
        'johnsmith',
        "I'm the admin",
        1, // Admin role
        adminPasswordHash,
        true
      )
    );

    // Create Normal user
    this.users.push(
      new User(
        2,
        'James',
        'Dixon',
        'jamesldixon@dayrep.com',
        'Teen1976',
        'I love to read.',
        2, // User role
        userPasswordHash,
        true
      )
    );

    this.initialized = true;
  }

  /**
   * Find user by email or username
   * @param {string} credential - Email or username
   * @returns {User|null} User object or null if not found
   */
  findUserByCredential(credential) {
    return this.users.find(
      user => 
        user.email.toLowerCase() === credential.toLowerCase() || 
        user.username.toLowerCase() === credential.toLowerCase()
    ) || null;
  }

  /**
   * Find role by ID
   * @param {number} roleId - Role ID
   * @returns {Role|null} Role object or null if not found
   */
  findRoleById(roleId) {
    return this.roles.find(role => role.id === roleId) || null;
  }

  /**
   * Get all users
   * @returns {User[]} Array of users
   */
  getAllUsers() {
    return this.users;
  }

  /**
   * Get all roles
   * @returns {Role[]} Array of roles
   */
  getAllRoles() {
    return this.roles;
  }
}

// Create and export a singleton instance
const dataStore = new DataStore();

module.exports = dataStore;

