const Film = require("../models/Film");

exports.getFilmek = async (req, res) => {
  try {
    const filmek = await Film.find();
    return res.status(200).json(filmek);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.getFilmById = async (req, res) => {
  try {
    const film = await Film.findById(req.params.id);
    if (!film) {
      return res.status(404).json({ message: "Film nem található" });
    }
    return res.status(200).json(film);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.createFilm = async (req, res) => {
  try {
    const ujFilm = new Film(req.body);
    const mentett = await ujFilm.save();
    return res.status(201).json(mentett);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

exports.updateFilm = async (req, res) => {
  try {
    const frissitett = await Film.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!frissitett) {
      return res.status(404).json({ message: "Film nem található" });
    }
    return res.status(200).json(frissitett);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.deleteFilm = async (req, res) => {
  try {
    const torolt = await Film.findByIdAndDelete(req.params.id);
    if (!torolt) {
      return res.status(404).json({ message: "Film nem található" });
    }
    return res.sendStatus(204);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
