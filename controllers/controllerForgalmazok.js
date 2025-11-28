const Forgalmazo = require("../models/Forgalmazo");

// Összes forgalmazó lekérdezése
exports.getForgalmazok = async (req, res) => {
  try {
    const forgalmazok = await Forgalmazo.find();
    return res.status(200).json(forgalmazok);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Új forgalmazó létrehozása
exports.createForgalmazo = async (req, res) => {
  try {
    const ujForgalmazo = new Forgalmazo(req.body);
    const mentett = await ujForgalmazo.save();
    return res.status(201).json(mentett);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// Forgalmazó módosítása
exports.updateForgalmazo = async (req, res) => {
  try {
    const modositott = await Forgalmazo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!modositott) {
      return res.status(404).json({ message: "Forgalmazo not found" });
    }
    return res.status(200).json(modositott);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Forgalmazó törlése
exports.deleteForgalmazo = async (req, res) => {
  try {
    const torolt = await Forgalmazo.findByIdAndDelete(req.params.id);

    if (!torolt) {
      return res.status(404).json({ message: "Forgalmazo not found" });
    }

    return res.sendStatus(204);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};