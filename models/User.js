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
    address: String,
    location: Object,
    isDonor: Boolean,
    isAvailable: Boolean,
});

module.exports = mongoose.model("User", UserSchema);
