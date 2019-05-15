const mongoose = require("mongoose");
const product = {
    ptitle: String,
    file: String,
    pdesc: String,
    pprice: Number,
    psprice: Number,
    cId : String
};

const Usermodel = mongoose.model("product", product);
module.exports = Usermodel;