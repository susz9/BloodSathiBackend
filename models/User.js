const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    fullName: String,
    email: String,
    password: String,
    phone: Number,
    dateOfBirth: Date,
    bloodGroup: String,
    sex: String,
});

module.exports = mongoose.model("User", UserSchema);
