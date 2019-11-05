
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
const UserRoles = Object.freeze({
    SUPER_ADMIN: new UserRole(0, 'Super Admin'),
    AGENT: new UserRole(1, 'Agent'),
    USER: new UserRole(2, 'Utilisateur'),
});


module.exports = UserRoles;