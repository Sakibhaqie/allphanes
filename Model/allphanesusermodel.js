const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { stringify } = require("nodemon/lib/utils");

const allphanesuserSchema = new mongoose.Schema({
    FirstName: {
        type: String,
        required: true
    },
    LastName: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        unique: true,
        required: true
    },
    PhoneNo: {
        type: String,
        required: true,
        unique: true
    },
    Password: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        // expires: '2m'
    },
    otpExpTime: {
        type: Date,
        default: ''
    },
    OtherPhoneNo: {
        type: String,
        required: false,
        default: ''
    },
    Mostinterested: {
        type: String,
        required: false,
        default: ''
    },
    LastLoginDateTime: {
        type: Date,
        default: ''
    },
    IsCompletedRegistration: {
        type: Boolean,
        required: false,
        default: 0
    },
    IsActive: {
        type: Boolean,
        required: false,
        default: 0
    },
    CountryId: {
        type: Number,
        required: false,
        default: ''
    },
    StateId: {
        type: Number,
        required: false,
        default: ''
    },
    CityId: {
        type: Number,
        required: false,
        default: ''
    },
    Isemailverified: {
        type: String,
        required: false
    },
    profile_pic: {
        type: String,
        required: false,
        default: ''
    },
    cover_pic: {
        type: String,
        required: false,
        default: ''
    },
    commend_status: {
        type: String,
        required: false,
        default: ''
    },
    DateOfBirth: {
        type: Date,
        default: ''
    },
    userToken: {
        type: String
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Allphanesuser', allphanesuserSchema);