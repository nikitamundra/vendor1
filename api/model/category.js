const mongoose = require("mongoose");
const category = {
    _cid: String,
    category: String,
};
const Usermodel = mongoose.model("categories", category);
module.exports = Usermodel;