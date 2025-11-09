/**
 * Role Entity
 * Represents a user role in the system
 */
class Role {
  /**
   * Creates a new Role instance
   * @param {number} id - Unique identifier
   * @param {string} name - Role name
   * @param {boolean} isActive - Whether the role is active
   */
  constructor(id, name, isActive = true) {
    this.id = id;
    this.name = name;
    this.isActive = isActive;
  }
}

module.exports = Role;

