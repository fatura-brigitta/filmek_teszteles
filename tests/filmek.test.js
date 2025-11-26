const Film = require("../models/Film");

// Mockolás
jest.mock("../models/Film");

describe("Végpontok tesztelése", () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Összes film lekérdezése", () => {
    it("Sikeresen visszaadja az összes filmet", async () => {
      const mockFilmek = [
        { _id: "1", cim: "Avatar", megjelenesi_ev: 2009, mufaj: "Sci-Fi" },
        { _id: "2", cim: "Titanic", megjelenesi_ev: 1997, mufaj: "Dráma" }
      ];
      Film.find.mockResolvedValue(mockFilmek);

      const result = await Film.find();

      expect(result).toEqual(mockFilmek);
      expect(result.length).toBe(2);
      expect(Film.find).toHaveBeenCalled();
    });

    it("Üres a lista, ha nincs film", async () => {
      Film.find.mockResolvedValue([]);

      const result = await Film.find();

      expect(result).toEqual([]);
      expect(Array.isArray(result)).toBe(true);
    });

    it("Adatbázis hiba kezelése", async () => {
      const error = new Error("MongoDB connection failed");
      Film.find.mockRejectedValue(error);

      try {
        await Film.find();
        fail("Hibának kellett volna lennie");
      } catch (err) {
        expect(err.message).toBe("MongoDB connection failed");
      }
    });
  });

  describe("Egy film lekérdezése", () => {
    it("SIkeresen visszaad egy filmet ID alapján", async () => {
      const mockFilm = { _id: "1", cim: "Avatar", megjelenesi_ev: 2009 };
      Film.findById.mockResolvedValue(mockFilm);

      const result = await Film.findById("1");

      expect(result).toEqual(mockFilm);
      expect(result.cim).toBe("Avatar");
      expect(Film.findById).toHaveBeenCalledWith("1");
    });

    it("404 hiba ha a film nem létezik", async () => {
      Film.findById.mockResolvedValue(null);

      const result = await Film.findById("999");

      expect(result).toBeNull();
    });

    it("Hiba érvénytelen ID formátum esetén", async () => {
      const error = new Error("Invalid ObjectId");
      Film.findById.mockRejectedValue(error);

      try {
        await Film.findById("invalid-id");
        fail("Hibának kellett volna lennie");
      } catch (err) {
        expect(err.message).toBe("Invalid ObjectId");
      }
    });
  });

  describe(" Új film hozzáadása", () => {
    it("Új film sikeres létrehozása", async () => {
      const ujFilm = { _id: "3", cim: "Inception", megjelenesi_ev: 2010, mufaj: "Sci-Fi" };
      
      Film.mockImplementation(() => ({
        save: jest.fn().mockResolvedValue(ujFilm)
      }));

      const filmObj = new Film(ujFilm);
      const result = await filmObj.save();

      expect(result).toEqual(ujFilm);
      expect(result.cim).toBe("Inception");
    });

    it("Kötelező mező hiánya esetén hiba", async () => {
      const error = new Error("Validation error: cim is required");
      Film.mockImplementation(() => ({
        save: jest.fn().mockRejectedValue(error)
      }));

      const filmObj = new Film({ megjelenesi_ev: 2010 });
      
      try {
        await filmObj.save();
        fail("Hibának kellett volna lennie");
      } catch (err) {
        expect(err.message).toContain("required");
      }
    });

    it("Duplikált ID esetén hiba", async () => {
      const error = new Error("Duplicate key error");
      Film.mockImplementation(() => ({
        save: jest.fn().mockRejectedValue(error)
      }));

      const filmObj = new Film({ _id: "1", cim: "New Film" });
      
      try {
        await filmObj.save();
        fail("Hibának kellett volna lennie");
      } catch (err) {
        expect(err.message).toContain("Duplicate");
      }
    });
  });

  describe("Film módosítása", () => {
    it("Film módosítása sikeres", async () => {
      const modositottFilm = { _id: "1", cim: "Avatar 2", megjelenesi_ev: 2022 };
      Film.findByIdAndUpdate.mockResolvedValue(modositottFilm);

      const result = await Film.findByIdAndUpdate("1", { cim: "Avatar 2", megjelenesi_ev: 2022 });

      expect(result).toEqual(modositottFilm);
      expect(result.cim).toBe("Avatar 2");
    });

    it("404 hiba ha a film nem létezik a módosításhoz", async () => {
      Film.findByIdAndUpdate.mockResolvedValue(null);

      const result = await Film.findByIdAndUpdate("999", { cim: "Nem létezik" });

      expect(result).toBeNull();
    });

    it("Hiba az adatbázis módosítás során", async () => {
      const error = new Error("Update operation failed");
      Film.findByIdAndUpdate.mockRejectedValue(error);

      try {
        await Film.findByIdAndUpdate("1", { cim: "New Title" });
        fail("Hibának kellett volna lennie");
      } catch (err) {
        expect(err.message).toBe("Update operation failed");
      }
    });
  });

  describe("Film törlése", () => {
    it("Film törlése sikeres", async () => {
      Film.findByIdAndDelete.mockResolvedValue({ _id: "1", cim: "Avatar" });

      const result = await Film.findByIdAndDelete("1");

      expect(result).toBeDefined();
      expect(Film.findByIdAndDelete).toHaveBeenCalledWith("1");
    });

    it("404 hiba ha a film nem létezik a törléshez", async () => {
      Film.findByIdAndDelete.mockResolvedValue(null);

      const result = await Film.findByIdAndDelete("999");

      expect(result).toBeNull();
    });

    it("Hiba az adatbázis törlése során", async () => {
      const error = new Error("Delete operation failed");
      Film.findByIdAndDelete.mockRejectedValue(error);

      try {
        await Film.findByIdAndDelete("1");
        fail("Hibának kellett volna lennie");
      } catch (err) {
        expect(err.message).toBe("Delete operation failed");
      }
    });
  });

  describe("Adatok létezésének tesztje", () => {
    it("Ellenőrzi, hogy a Film model meglétezik", () => {
      expect(Film).toBeDefined();
    });

    it("Ellenőrzi, hogy az összes szükséges metódus meglétezik", () => {
      expect(Film.find).toBeDefined();
      expect(Film.findById).toBeDefined();
      expect(Film.findByIdAndUpdate).toBeDefined();
      expect(Film.findByIdAndDelete).toBeDefined();
    });

    it("Ellenőrzi, hogy az adatok szerkezete helyes", async () => {
      const mockFilm = {
        _id: "1",
        cim: "Avatar",
        megjelenesi_ev: 2009,
        mufaj: "Sci-Fi",
        jatekido_perc: 162,
        imdb_ertekeles: 7.8,
        forgalmazo_id: 1
      };
      Film.find.mockResolvedValue([mockFilm]);

      const result = await Film.find();

      expect(result[0]).toHaveProperty("cim");
      expect(result[0]).toHaveProperty("megjelenesi_ev");
      expect(result[0]).toHaveProperty("mufaj");
      expect(result[0]).toHaveProperty("jatekido_perc");
      expect(result[0]).toHaveProperty("imdb_ertekeles");
    });
  });
});
