const Film = require("./models/Film");
const Forgalmazo = require("./models/Forgalmazo");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect("mongodb+srv://faturabrigitta_db_user:jelszo@cluster0.lwcffz4.mongodb.net/filmek")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("Mongo error:", err));

app.get("/", (req, res) => res.send("Backend fut!"));

app.get("/filmek", async (req, res) => {
  try {
    const filmek = await Film.find();
    res.json(filmek);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/forgalmazok", async (req, res) => {
  try {
    const forgalmazok = await Forgalmazo.find();
    res.json(forgalmazok);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// FILMEK 


// Összes film
app.get("/filmek", async (req, res) => {
  try {
    const filmek = await Film.find();
    res.json(filmek);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Egy film ID alapján
app.get("/filmek/:id", async (req, res) => {
  try {
    const film = await Film.findById(req.params.id);
    if (!film) return res.status(404).json({ error: "Film nem található" });
    res.json(film);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Új film hozzáadása
app.post("/filmek", async (req, res) => {
  try {
    const ujFilm = new Film(req.body);
    await ujFilm.save();
    res.json(ujFilm);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Film módosítása
app.put("/filmek/:id", async (req, res) => {
  try {
    const film = await Film.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!film) return res.status(404).json({ error: "Film nem található" });
    res.json(film);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Film törlése
app.delete("/filmek/:id", async (req, res) => {
  try {
    await Film.findByIdAndDelete(req.params.id);
    res.json({ message: "Film törölve" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//  FORGALMAZOK 



// Összes forgalmazó
app.get("/forgalmazok", async (req, res) => {
  try {
    const forgalmazok = await Forgalmazo.find();
    res.json(forgalmazok);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Új forgalmazó hozzáadása
app.post("/forgalmazok", async (req, res) => {
  try {
    const ujForgalmazo = new Forgalmazo(req.body);
    await ujForgalmazo.save();
    res.json(ujForgalmazo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Forgalmazó módosítása
app.put("/forgalmazok/:id", async (req, res) => {
  try {
    const forgalmazo = await Forgalmazo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!forgalmazo) return res.status(404).json({ error: "Forgalmazó nem található" });
    res.json(forgalmazo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Forgalmazó törlése
app.delete("/forgalmazok/:id", async (req, res) => {
  try {
    await Forgalmazo.findByIdAndDelete(req.params.id);
    res.json({ message: "Forgalmazó törölve" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


const server = app.listen(3000, () => console.log("Server: http://localhost:3000"));
module.exports = server;

