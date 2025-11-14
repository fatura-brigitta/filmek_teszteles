const mongoose = require("mongoose");

const FilmSchema = new mongoose.Schema({
    _id: String,
    film_id: String,
    cim: String,
    megjelenesi_ev: Number,
    mufaj: String,
    jatekido_perc: Number,
    imdb_ertekeles: Number,
    forgalmazo_id: Number
}, { collection: "filmek" });

module.exports = mongoose.model("Film", FilmSchema);
