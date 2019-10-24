const mongoose = require('mongoose');

/**
 * User db schema
 */
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role_id: {
        type: Number,
        required: true
    }
});

var User = mongoose.model('User', UserSchema);
module.exports = User;