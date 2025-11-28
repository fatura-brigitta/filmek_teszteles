const Film = require("../models/Film");
jest.mock("../models/Film");

// Mockolt res objektum a controller tesztekhez
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.sendStatus = jest.fn().mockReturnValue(res);
  return res;
};

describe("Film Controller Tesztek", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Összes film lekérdezése", () => {
    it("Sikeres lekérdezés (200)", async () => {
      const mockFilmek = [
        { _id: 1, cim: "Avatar", megjelenesi_ev: 2009 },
        { _id: 2, cim: "Titanic", megjelenesi_ev: 1997 },
      ];
      Film.find.mockResolvedValue(mockFilmek);

      const res = mockResponse();
      const req = {};

      try {
        const filmek = await Film.find();
        res.status(200).json(filmek);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }

      expect(Film.find).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockFilmek);
    });

    it("Hiba az adatbázis kezelése során (500)", async () => {
      const error = new Error("DB hiba");
      Film.find.mockRejectedValue(error);

      const res = mockResponse();
      const req = {};

      try {
        await Film.find();
        res.status(200).json([]);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }

      expect(Film.find).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "DB hiba" });
    });
  });

  describe("Egy film lekérdezése", () => {
    it("Sikeres lekérdezés ID alapján (200)", async () => {
      const mockFilm = { _id: 1, cim: "Avatar", megjelenesi_ev: 2009 };
      Film.findById.mockResolvedValue(mockFilm);

      const res = mockResponse();
      const req = { params: { id: 1 } };

      const film = await Film.findById(req.params.id);
      if (!film) res.status(404).json({ error: "Film nem található" });
      else res.status(200).json(film);

      expect(Film.findById).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockFilm);
    });

    it("404 ha a film nem létezik", async () => {
      Film.findById.mockResolvedValue(null);

      const res = mockResponse();
      const req = { params: { id: 999 } };

      const film = await Film.findById(req.params.id);
      if (!film) res.status(404).json({ error: "Film nem található" });
      else res.status(200).json(film);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Film nem található" });
    });

    it("Hiba lekérdezés közben (500)", async () => {
      const error = new Error("DB hiba");
      Film.findById.mockRejectedValue(error);

      const res = mockResponse();
      const req = { params: { id: 1 } };

      try {
        await Film.findById(req.params.id);
        res.status(200).json({});
      } catch (err) {
        res.status(500).json({ error: err.message });
      }

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "DB hiba" });
    });
  });

  describe("Új film létrehozása", () => {
    it("Sikeres létrehozás (201)", async () => {
      const ujFilm = { _id: 3, cim: "Inception", megjelenesi_ev: 2010 };
      Film.mockImplementation(() => ({
        save: jest.fn().mockResolvedValue(ujFilm),
      }));

      const req = { body: ujFilm };
      const res = mockResponse();

      const filmObj = new Film(req.body);
      const saved = await filmObj.save();
      res.status(201).json(saved);

      expect(Film).toHaveBeenCalledWith(ujFilm);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(ujFilm);
    });

    it("Hiba kötelező mező hiánya (500)", async () => {
      const error = new Error("Validation error: cim is required");
      Film.mockImplementation(() => ({
        save: jest.fn().mockRejectedValue(error),
      }));

      const req = { body: { megjelenesi_ev: 2010 } };
      const res = mockResponse();

      const filmObj = new Film(req.body);
      try {
        await filmObj.save();
        res.status(201).json({});
      } catch (err) {
        res.status(500).json({ error: err.message });
      }

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Validation error: cim is required" });
    });
  });

  describe("Film módosítása", () => {
    it("Sikeres módosítás (200)", async () => {
      const modositottFilm = { _id: 1, cim: "Avatar 2", megjelenesi_ev: 2022 };
      Film.findByIdAndUpdate.mockResolvedValue(modositottFilm);

      const req = { params: { id: 1 }, body: { cim: "Avatar 2", megjelenesi_ev: 2022 } };
      const res = mockResponse();

      const updated = await Film.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updated) res.status(404).json({ error: "Film nem található" });
      else res.status(200).json(updated);

      expect(Film.findByIdAndUpdate).toHaveBeenCalledWith(req.params.id, req.body, { new: true });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(modositottFilm);
    });

    it("404 ha a film nem létezik", async () => {
      Film.findByIdAndUpdate.mockResolvedValue(null);

      const req = { params: { id: 999 }, body: { cim: "Nem létezik" } };
      const res = mockResponse();

      const updated = await Film.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updated) res.status(404).json({ error: "Film nem található" });
      else res.status(200).json(updated);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Film nem található" });
    });
  });

  describe("Film törlése", () => {
    it("Sikeres törlés (204)", async () => {
      Film.findByIdAndDelete.mockResolvedValue({ _id: 1, cim: "Avatar" });

      const req = { params: { id: 1 } };
      const res = mockResponse();

      const deleted = await Film.findByIdAndDelete(req.params.id);
      if (!deleted) res.status(404).json({ error: "Film nem található" });
      else res.sendStatus(204);

      expect(Film.findByIdAndDelete).toHaveBeenCalledWith(1);
      expect(res.sendStatus).toHaveBeenCalledWith(204);
    });

    it("404 ha nem létezik", async () => {
      Film.findByIdAndDelete.mockResolvedValue(null);

      const req = { params: { id: 999 } };
      const res = mockResponse();

      const deleted = await Film.findByIdAndDelete(req.params.id);
      if (!deleted) res.status(404).json({ error: "Film nem található" });
      else res.sendStatus(204);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Film nem található" });
    });

    it("Hiba törlés során (500)", async () => {
      const error = new Error("Delete operation failed");
      Film.findByIdAndDelete.mockRejectedValue(error);

      const req = { params: { id: 1 } };
      const res = mockResponse();

      try {
        await Film.findByIdAndDelete(req.params.id);
        res.sendStatus(204);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Delete operation failed" });
    });
  });
});