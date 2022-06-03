const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    fullName: String,
    phone: Number,
    email: String,
    password: String,
    dateOfBirth: Date,
    bloodGroup: String,
    sex: String,
    district: String,
    address: String,
    location: Object,
    isDonor: Boolean,
    isAvailable: Boolean,
    userSince: Date,
});

UserSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("User", UserSchema);
