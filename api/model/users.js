const mongoose = require("mongoose");
const User = {
username: String,
email: String,
password: String,
mobile: Number,
gender: String,
country: String,
category: String,
idproof: String,
file : String,
resetPasswordToken: String,
resetPasswordExpires: Date,
};

const Usermodel = mongoose.model("User", User);
module.exports = Usermodel;