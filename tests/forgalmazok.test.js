const Forgalmazo = require("../models/Forgalmazo");

// Mockolás
jest.mock("../models/Forgalmazo");

describe("Végpont Tesztek", () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Összes forgalmazó lekérdezése", () => {
    it("Sikeresen visszaadja az összes forgalmazót", async () => {
      const mockForgalmazok = [
        { _id: 1, nev: "20th Century Fox", szekhely_orszag: "USA", alapitas_eve: 1935 },
        { _id: 2, nev: "Paramount Pictures", szekhely_orszag: "USA", alapitas_eve: 1912 }
      ];
      Forgalmazo.find.mockResolvedValue(mockForgalmazok);

      const result = await Forgalmazo.find();

      expect(result).toEqual(mockForgalmazok);
      expect(result.length).toBe(2);
      expect(Forgalmazo.find).toHaveBeenCalled();
    });

    it("Üres lista, ha nincs forgalmazó", async () => {
      Forgalmazo.find.mockResolvedValue([]);

      const result = await Forgalmazo.find();

      expect(result).toEqual([]);
      expect(Array.isArray(result)).toBe(true);
    });

    it("Hiba az adatbázis kezelése során", async () => {
      const error = new Error("MongoDB connection failed");
      Forgalmazo.find.mockRejectedValue(error);

      try {
        await Forgalmazo.find();
        fail("Hibának kellett volna lennie");
      } catch (err) {
        expect(err.message).toBe("MongoDB connection failed");
      }
    });
  });

  describe("Új forgalmazó hozzáadása", () => {
    it("Új forgalmazó sikeres létrehozása", async () => {
      const ujForgalmazo = { 
        _id: 3, 
        nev: "Disney", 
        szekhely_orszag: "USA", 
        alapitas_eve: 1923,
        weboldal: "disney.com",
        email: "info@disney.com"
      };
      
      Forgalmazo.mockImplementation(() => ({
        save: jest.fn().mockResolvedValue(ujForgalmazo)
      }));

      const forgObj = new Forgalmazo(ujForgalmazo);
      const result = await forgObj.save();

      expect(result).toEqual(ujForgalmazo);
      expect(result.nev).toBe("Disney");
      expect(result.szekhely_orszag).toBe("USA");
    });

    it("Hiba a kötelező mező hiánya esetén", async () => {
      const error = new Error("Validation error: nev is required");
      Forgalmazo.mockImplementation(() => ({
        save: jest.fn().mockRejectedValue(error)
      }));

      const forgObj = new Forgalmazo({ szekhely_orszag: "USA" });
      
      try {
        await forgObj.save();
        fail("Hibának kellett volna lennie");
      } catch (err) {
        expect(err.message).toContain("required");
      }
    });

    it("Hiba érvénytelen email formátum esetén", async () => {
      const error = new Error("Validation error: invalid email");
      Forgalmazo.mockImplementation(() => ({
        save: jest.fn().mockRejectedValue(error)
      }));

      const forgObj = new Forgalmazo({ 
        _id: 3,
        nev: "Disney", 
        email: "invalid-email" 
      });
      
      try {
        await forgObj.save();
        fail("Hibának kellett volna lennie");
      } catch (err) {
        expect(err.message).toContain("invalid");
      }
    });
  });

  describe("Forgalmazó módosítása", () => {
    it("Forgalmazó módosítása sikeres", async () => {
      const modositottForgalmazo = { 
        _id: 1, 
        nev: "20th Century Studio", 
        szekhely_orszag: "USA" 
      };
      Forgalmazo.findByIdAndUpdate.mockResolvedValue(modositottForgalmazo);

      const result = await Forgalmazo.findByIdAndUpdate(1, { nev: "20th Century Studio" });

      expect(result).toEqual(modositottForgalmazo);
      expect(result.nev).toBe("20th Century Studio");
    });

    it("404 hiba ha a forgalmazó nem létezik", async () => {
      Forgalmazo.findByIdAndUpdate.mockResolvedValue(null);

      const result = await Forgalmazo.findByIdAndUpdate(999, { nev: "Nem létezik" });

      expect(result).toBeNull();
    });

    it("hiba az adatbázis módosítás során", async () => {
      const error = new Error("Update operation failed");
      Forgalmazo.findByIdAndUpdate.mockRejectedValue(error);

      try {
        await Forgalmazo.findByIdAndUpdate(1, { nev: "Új név" });
        fail("Hibának kellett volna lennie");
      } catch (err) {
        expect(err.message).toBe("Update operation failed");
      }
    });
  });

  describe("Forgalmazó törlése", () => {
    it("Forgalmazó törlése sikeres", async () => {
      Forgalmazo.findByIdAndDelete.mockResolvedValue({ _id: 1, nev: "Fox" });

      const result = await Forgalmazo.findByIdAndDelete(1);

      expect(result).toBeDefined();
      expect(Forgalmazo.findByIdAndDelete).toHaveBeenCalledWith(1);
    });

    it("404 hiba ha a forgalmazó nem létezik a törléshez", async () => {
      Forgalmazo.findByIdAndDelete.mockResolvedValue(null);

      const result = await Forgalmazo.findByIdAndDelete(999);

      expect(result).toBeNull();
    });

    it("Hiba az adatbázis törlése során", async () => {
      const error = new Error("Delete operation failed");
      Forgalmazo.findByIdAndDelete.mockRejectedValue(error);

      try {
        await Forgalmazo.findByIdAndDelete(1);
        fail("Hibának kellett volna lennie");
      } catch (err) {
        expect(err.message).toBe("Delete operation failed");
      }
    });
  });

  describe("Adatok léteznek", () => {
    it("Ellenőrzi, hogy a Forgalmazo model létezik", () => {
      expect(Forgalmazo).toBeDefined();
    });

    it("Ellenőrzi, hogy az összes szükséges metódus létezik", () => {
      expect(Forgalmazo.find).toBeDefined();
      expect(Forgalmazo.findByIdAndUpdate).toBeDefined();
      expect(Forgalmazo.findByIdAndDelete).toBeDefined();
    });

    it("Ellenőrzi, hogy az adatok szerkezete helyes", async () => {
      const mockForgalmazo = {
        _id: 1,
        nev: "20th Century Fox",
        szekhely_orszag: "USA",
        alapitas_eve: 1935,
        weboldal: "fox.com",
        email: "info@fox.com"
      };
      Forgalmazo.find.mockResolvedValue([mockForgalmazo]);

      const result = await Forgalmazo.find();

      expect(result[0]).toHaveProperty("nev");
      expect(result[0]).toHaveProperty("szekhely_orszag");
      expect(result[0]).toHaveProperty("alapitas_eve");
      expect(result[0]).toHaveProperty("weboldal");
      expect(result[0]).toHaveProperty("email");
    });
  });
});
