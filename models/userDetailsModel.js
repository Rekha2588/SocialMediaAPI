const mongoose = require('mongoose');

const userDetailsSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    isEmailPersonalPreference: {
        type: Boolean,
        default: true
    },
    attempts: {
        type: Number,
        default: 0
    },
    lockOutTime: Date
},
    {
        timestamps: true
    });

const UserDetails = mongoose.model('UserDetails', userDetailsSchema)
module.exports = UserDetails;