const mongoose = require('mongoose');

const PWD_MIN = 8;
const PWD_MAX = 32;
const EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

/**
 * User db schema
 */
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: [true, 'Cette adresse e-mail est déjà utilisée'],
        required: [true, "L'adresse e-mail est obligatoire"],
        trim: true,
        validate: {
            validator: function(email) {
              return EMAIL_REGEXP.test(email)
            },
            message: () => "L'adresse email est invalide"
        }
    },
    firstname: {
        type: String,
        required: [true, "Le nom est obligatoire"],
        trim: true
    },
    lastname: {
        type: String,
        required: [true, "Le nom de famille est obligatoire"],
        trim: true
    },
    password: {
        type: String,
        required: [true, `Le mot de passe est obligatoire`]
    },
    role_id: {
        type: Number,
        required: true,
    }
});

var User = mongoose.model('User', UserSchema);
module.exports = User;