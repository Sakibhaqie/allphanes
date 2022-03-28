const mongoose = require("mongoose")

const users = new mongoose.Schema({
    firstName: { type: String, required: true},
    lastName: { type: String, required: true },
    email: { type: String, unique: true, required: true},
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true},
    otp: { type: String, },
    otpExpTime: { type: Date, default: ''},
    altPhoneNo: { type: String, required: false, default: ''},
    mostInterested: { type: String, required: false, default: ''},
    lastLoginDateTime: { type: Date, default: ''},
    isCompletedRegistration: { type: Boolean, required: false, default: false},
    isActive: { type: Boolean, required: false, default: false},
    countryId: { type: Number, required: false, default: ''},
    stateId: { type: Number, required: false, default: ''},
    cityId: { type: Number, required: false, default: '' },
    isEmailVerified: { type: Boolean, required: false, default: false},
    profilePhoto: { type: String, required: false, default: ''},
    coverPhoto: { type: String, required: false, default: ''},
    commendStatus: { type: String, required: false, default: ''},
    dateOfBirth: { type: Date, default: ''},
}, 
{
    timestamps: true
})

users.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id
        delete ret.password
    }
})

module.exports = mongoose.model('users', users)