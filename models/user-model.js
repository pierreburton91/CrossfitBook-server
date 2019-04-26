const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    fbId: String,
    showAds: { type: Boolean, default: true },
    weightUnit: { type: Number, default: 0 },
    createdDate: {type: Date, default: Date.now },
    meta: {
        firstName: String,
        lastName: String,
        email: String,
        photo: String
    }
})

module.exports = mongoose.model('User', UserSchema);