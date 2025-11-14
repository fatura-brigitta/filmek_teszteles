const mongoose = require("mongoose");

const ForgalmazoSchema = new mongoose.Schema({
    _id: Number,
    nev: String,
    szekhely_orszag: String,
    alapitas_eve: Number,
    weboldal: String,
    email: String
}, { collection: "forgalmazok" });

module.exports = mongoose.model("Forgalmazo", ForgalmazoSchema);