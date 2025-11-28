const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const {
  getForgalmazok,
  createForgalmazo,
  updateForgalmazo,
  deleteForgalmazo
} = require("./controllers/forgalmazoController");

const {
  getFilmek,
  getFilmById,
  createFilm,
  updateFilm,
  deleteFilm
} = require("./controllers/filmController");

const Film = require("./models/Film");
const Forgalmazo = require("./models/Forgalmazo");

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB kapcsolat
mongoose
  .connect("mongodb+srv://faturabrigitta_db_user:jelszo@cluster0.lwcffz4.mongodb.net/filmek")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("Mongo error:", err));

// Teszt endpoint
app.get("/", (req, res) => res.send("Backend fut!"));

// ---------------------------------------------------------------------------
// FILMEK
// ---------------------------------------------------------------------------
app.get("/filmek", getFilmek);
app.get("/filmek/:id", getFilmById);
app.post("/filmek", createFilm);
app.put("/filmek/:id", updateFilm);
app.delete("/filmek/:id", deleteFilm);

// ---------------------------------------------------------------------------
// FORGALMAZÓK
// ---------------------------------------------------------------------------
app.get("/forgalmazok", getForgalmazok);
app.post("/forgalmazok", createForgalmazo);
app.put("/forgalmazok/:id", updateForgalmazo);
app.delete("/forgalmazok/:id", deleteForgalmazo);

// ---------------------------------------------------------------------------
// EXPORT
// ---------------------------------------------------------------------------
module.exports = {
  app,
  Film,
  Forgalmazo
};

// Ha közvetlenül futtatják (node app.js)
if (require.main === module) {
  app.listen(3000, () => console.log("Server: http://localhost:3000"));
}