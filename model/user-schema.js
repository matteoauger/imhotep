const mongoose = require('mongoose');

const EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

/**
 * User db schema
 */
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: [true, 'Cette adresse e-mail est déjà utilisée'],
        required: [true, 'L\'adresse e-mail est obligatoire'],
        trim: true,
        validate: {
            validator: function(email) {
              return EMAIL_REGEXP.test(email)
            },
            message: () => 'L\'adresse email est invalide'
        }
    },
    firstname: {
        type: String,
        required: [true, 'Le prénom est obligatoire'],
        trim: true
    },
    lastname: {
        type: String,
        required: [true, 'Le nom est obligatoire'],
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Le mot de passe doit être compris entre 8 et 32 caractères']
    },
    role_id: {
        type: Number,
        required: [true, 'Le rôle est obligatoire'],
    }
});

module.exports = mongoose.model('User', UserSchema);