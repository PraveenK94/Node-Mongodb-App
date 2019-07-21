const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    mobilenumber: {
        type: String
    },
    password: {
        type: String
    },
    address: {
        type: String
    },
    status: {
        type: String,
        required: true
    },
    social: {

        gmail: {
            type: String
        },
        facebook: {
            type: String
        }
        ,
    },

});