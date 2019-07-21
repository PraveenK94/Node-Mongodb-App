const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    googleId: {
        type: String,
        required: true

    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },/*
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    mobilenumber: {
        type: Number,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: true
    },
*/
    avatar: [
        {
            value: {
                type: String,
                required: true
            }
        }
    ],
    thumbnail: {
        type: String
    },

    date: {
        type: Date,
        default: Date.now
    }

});

module.exports = User = mongoose.model('user', UserSchema);

