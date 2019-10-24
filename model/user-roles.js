
/**
 * Represents a user role
 */
class UserRole {
    /**
     * Creates a new instance of UserRole
     * @param {number} id role identifier 
     * @param {string} label role label used for display
     */
    constructor(id, label) {
        this.id = id;
        this.label = label;
    }
}

/**
 *
 * Registers every role a user can be assigned to
 */
const USER_ROLES = {
    super_admin: new UserRole(0, "Super Admin"),
    agent: new UserRole(1, "Agent"),
    user: new UserRole(2, "Utilisateur"),
};


module.exports = USER_ROLES;