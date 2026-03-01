const { Storage } = require("../src/storage");

describe("Storage", () => {
  let mockBrowser;

  beforeEach(() => {
    mockBrowser = {
      storage: {
        local: {
          _data: {},
          get: jest.fn(function (keys) {
            const result = {};
            for (const key of keys) {
              if (key in this._data) {
                result[key] = this._data[key];
              }
            }
            return Promise.resolve(result);
          }),
          set: jest.fn(function (data) {
            Object.assign(this._data, data);
            return Promise.resolve();
          }),
        },
      },
    };
  });

  describe("load", () => {
    it("returns default state when storage is empty", async () => {
      const storage = new Storage(mockBrowser);
      const state = await storage.load();
      expect(state).toEqual({ blockedCompanies: [], blockedJobIds: [] });
    });

    it("returns saved state from storage", async () => {
      const saved = {
        blockedCompanies: [{ name: "Hays", muted: false }],
        blockedJobIds: ["123"],
      };
      mockBrowser.storage.local._data = saved;
      const storage = new Storage(mockBrowser);
      const state = await storage.load();
      expect(state).toEqual(saved);
    });
  });

  describe("save", () => {
    it("persists state to browser storage", async () => {
      const storage = new Storage(mockBrowser);
      const state = {
        blockedCompanies: [{ name: "Hays", muted: false }],
        blockedJobIds: ["123"],
      };
      await storage.save(state);
      expect(mockBrowser.storage.local.set).toHaveBeenCalledWith(state);
    });

    it("saved state can be loaded back", async () => {
      const storage = new Storage(mockBrowser);
      const state = {
        blockedCompanies: [{ name: "Hays", muted: false }],
        blockedJobIds: ["999"],
      };
      await storage.save(state);
      const loaded = await storage.load();
      expect(loaded).toEqual(state);
    });
  });
});
