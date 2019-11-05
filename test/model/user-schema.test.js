const assert = require('assert');
const User = require('../../model/user-schema');
const UserRoles = require('../../model/user-roles');

describe('User schema', () => {
    describe('Email validation', () => {
        it('should not validate with an invalid email', () => {
            const usr = new User();
            usr.email = 'blabla';

            const error = usr.validateSync();
            assert.equal(error.errors['email'].message, "L'adresse email est invalide");
            assert.equal(error.errors['email'].name, 'ValidatorError');
        });

        it('should not validate with an empty email', () => {
            const usr = new User();
            
            const error = usr.validateSync();
            assert.equal(error.errors['email'].message, "L'adresse e-mail est obligatoire");
            assert.equal(error.errors['email'].name, 'ValidatorError');
        });

        it('should validate with a valid email', () => {
            const usr = new User();
            usr.email = 'test@test.com';

            const error = usr.validateSync();
            assert.equal(error.errors['email'], null);
        });
    });

    describe('Firstname validation', () => {
        it('should not validate with an empty firstname', () => {
            const usr = new User();

            const error = usr.validateSync();
            assert.equal(error.errors['firstname'].name, 'ValidatorError');
            assert.equal(error.errors['firstname'].message, 'Le prénom est obligatoire');
        });

        it('should validate with a valid firstname', () => {
            const usr = new User();
            usr.firstname = 'test';

            const error = usr.validateSync();
            assert.equal(error.errors['firstname'], null);
        });
    });

    describe('Lastname validation', () => {
        it('should not validate with an empty lastname', () => {
            const usr = new User();

            const error = usr.validateSync();
            assert.equal(error.errors['lastname'].name, 'ValidatorError');
            assert.equal(error.errors['lastname'].message, "Le nom est obligatoire");
        });

        it('should validate with a valid lastname', () => {
            const usr = new User();
            usr.lastname = 'test';

            const error = usr.validateSync();
            assert.equal(error.errors['lastname'], null);
        });
    });

    describe('Password validation', () => {
        it('should not validate with an empty password', () => {
            const usr = new User();

            const error = usr.validateSync();

            // as the password is hashed, there is no validation about the password size in the user schema
            assert.equal(error.errors['password'].name, 'ValidatorError');
            assert.equal(error.errors['password'].message, 'Le mot de passe doit être compris entre 8 et 32 caractères');
        });

        it('should validate with a password', () => {
            const usr = new User()
            usr.password = 'hello';

            const error = usr.validateSync();
            assert.equal(error.errors['password'], null);
        });
    });

    describe('Role validation', () => {
        it('should not validate with an empty role', () => {
            const usr = new User();

            const error = usr.validateSync();
            assert.equal(error.errors['role_id'].name, 'ValidatorError');
            assert.equal(error.errors['role_id'].message, 'Le rôle est obligatoire');
        });

        it('should validate with a valid role', () => {
           const usr = new User();
           usr.role_id = 0;
           
           const error = usr.validateSync();
           assert.equal(error.errors['role_id'], null);
        });
    });
});