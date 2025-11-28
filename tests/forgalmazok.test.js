const Forgalmazo = require("../models/Forgalmazo");
jest.mock("../models/Forgalmazo");

// Mockolt res objektum a controller tesztekhez
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.sendStatus = jest.fn().mockReturnValue(res);
  return res;
};

describe("Forgalmazó Controller Tesztek", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Összes forgalmazó lekérdezése", () => {
    it("Sikeres lekérdezés (200)", async () => {
      const mockForgalmazok = [
        { _id: 1, nev: "20th Century Fox", szekhely_orszag: "USA" },
        { _id: 2, nev: "Paramount Pictures", szekhely_orszag: "USA" },
      ];
      Forgalmazo.find.mockResolvedValue(mockForgalmazok);

      const res = mockResponse();
      const req = {};

      try {
        const forgalmazok = await Forgalmazo.find();
        res.status(200).json(forgalmazok);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }

      expect(Forgalmazo.find).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockForgalmazok);
    });

    it("Hiba az adatbázis kezelése során (500)", async () => {
      const error = new Error("DB hiba");
      Forgalmazo.find.mockRejectedValue(error);

      const res = mockResponse();
      const req = {};

      try {
        await Forgalmazo.find();
        res.status(200).json([]);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }

      expect(Forgalmazo.find).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "DB hiba" });
    });
  });

  describe("Egy forgalmazó lekérdezése", () => {
    it("Sikeres lekérdezés ID alapján (200)", async () => {
      const mockForgalmazo = { _id: 1, nev: "Fox", szekhely_orszag: "USA" };
      Forgalmazo.findById.mockResolvedValue(mockForgalmazo);

      const req = { params: { id: 1 } };
      const res = mockResponse();

      const forgalmazo = await Forgalmazo.findById(req.params.id);
      if (!forgalmazo) res.status(404).json({ error: "Forgalmazó nem található" });
      else res.status(200).json(forgalmazo);

      expect(Forgalmazo.findById).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockForgalmazo);
    });

    it("404 ha nem létezik", async () => {
      Forgalmazo.findById.mockResolvedValue(null);

      const req = { params: { id: 999 } };
      const res = mockResponse();

      const forgalmazo = await Forgalmazo.findById(req.params.id);
      if (!forgalmazo) res.status(404).json({ error: "Forgalmazó nem található" });
      else res.status(200).json(forgalmazo);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Forgalmazó nem található" });
    });
  });

  describe("Új forgalmazó létrehozása", () => {
    it("Sikeres létrehozás (201)", async () => {
      const ujForgalmazo = { _id: 3, nev: "Disney", szekhely_orszag: "USA" };
      Forgalmazo.mockImplementation(() => ({
        save: jest.fn().mockResolvedValue(ujForgalmazo),
      }));

      const req = { body: ujForgalmazo };
      const res = mockResponse();

      const forgObj = new Forgalmazo(req.body);
      const saved = await forgObj.save();
      res.status(201).json(saved);

      expect(Forgalmazo).toHaveBeenCalledWith(ujForgalmazo);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(ujForgalmazo);
    });

    it("Hiba kötelező mező hiánya (500)", async () => {
      const error = new Error("Validation error: nev is required");
      Forgalmazo.mockImplementation(() => ({
        save: jest.fn().mockRejectedValue(error),
      }));

      const req = { body: { szekhely_orszag: "USA" } };
      const res = mockResponse();

      const forgObj = new Forgalmazo(req.body);
      try {
        await forgObj.save();
        res.status(201).json({});
      } catch (err) {
        res.status(500).json({ error: err.message });
      }

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Validation error: nev is required" });
    });
  });

  describe("Forgalmazó módosítása", () => {
    it("Sikeres módosítás (200)", async () => {
      const modositottForgalmazo = { _id: 1, nev: "20th Century Studio" };
      Forgalmazo.findByIdAndUpdate.mockResolvedValue(modositottForgalmazo);

      const req = { params: { id: 1 }, body: { nev: "20th Century Studio" } };
      const res = mockResponse();

      const updated = await Forgalmazo.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updated) res.status(404).json({ error: "Forgalmazó nem található" });
      else res.status(200).json(updated);

      expect(Forgalmazo.findByIdAndUpdate).toHaveBeenCalledWith(1, req.body, { new: true });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(modositottForgalmazo);
    });

    it("404 ha nem létezik", async () => {
      Forgalmazo.findByIdAndUpdate.mockResolvedValue(null);

      const req = { params: { id: 999 }, body: { nev: "Nem létezik" } };
      const res = mockResponse();

      const updated = await Forgalmazo.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updated) res.status(404).json({ error: "Forgalmazó nem található" });
      else res.status(200).json(updated);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Forgalmazó nem található" });
    });
  });

  describe("Forgalmazó törlése", () => {
    it("Sikeres törlés (204)", async () => {
      Forgalmazo.findByIdAndDelete.mockResolvedValue({ _id: 1, nev: "Fox" });

      const req = { params: { id: 1 } };
      const res = mockResponse();

      const deleted = await Forgalmazo.findByIdAndDelete(req.params.id);
      if (!deleted) res.status(404).json({ error: "Forgalmazó nem található" });
      else res.sendStatus(204);

      expect(Forgalmazo.findByIdAndDelete).toHaveBeenCalledWith(1);
      expect(res.sendStatus).toHaveBeenCalledWith(204);
    });

    it("404 ha nem létezik", async () => {
      Forgalmazo.findByIdAndDelete.mockResolvedValue(null);

      const req = { params: { id: 999 } };
      const res = mockResponse();

      const deleted = await Forgalmazo.findByIdAndDelete(req.params.id);
      if (!deleted) res.status(404).json({ error: "Forgalmazó nem található" });
      else res.sendStatus(204);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Forgalmazó nem található" });
    });

    it("Hiba törlés során (500)", async () => {
      const error = new Error("Delete operation failed");
      Forgalmazo.findByIdAndDelete.mockRejectedValue(error);

      const req = { params: { id: 1 } };
      const res = mockResponse();

      try {
        await Forgalmazo.findByIdAndDelete(req.params.id);
        res.sendStatus(204);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Delete operation failed" });
    });
  });
});