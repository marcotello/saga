/**
 * User Entity
 * Represents a user in the system
 */
class User {
  /**
   * Creates a new User instance
   * @param {number} id - Unique identifier
   * @param {string} name - First name
   * @param {string} lastName - Last name
   * @param {string} email - Email address
   * @param {string} username - Username
   * @param {string} bio - User biography
   * @param {number} role - Role ID
   * @param {string} password - Hashed password
   * @param {boolean} isActive - Whether the user is active
   */
  constructor(id, name, lastName, email, username, bio, role, password, isActive = true) {
    this.id = id;
    this.name = name;
    this.lastName = lastName;
    this.email = email;
    this.username = username;
    this.bio = bio;
    this.role = role;
    this.password = password;
    this.isActive = isActive;
  }

  /**
   * Returns user data without sensitive information
   * @returns {Object} User data without password
   */
  toSafeObject() {
    return {
      id: this.id,
      name: this.name,
      lastName: this.lastName,
      email: this.email,
      username: this.username,
      bio: this.bio,
      role: this.role,
      isActive: this.isActive
    };
  }
}

module.exports = User;

