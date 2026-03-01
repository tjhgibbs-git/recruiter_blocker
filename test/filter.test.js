const { Filter } = require("../src/filter");

describe("Filter", () => {
  describe("shouldHideCompany", () => {
    it("returns true for a blocked company (exact match, case-insensitive)", () => {
      const filter = new Filter({
        blockedCompanies: [{ name: "Oliver Bernard", muted: false }],
        blockedJobIds: [],
      });
      expect(filter.shouldHideCompany("Oliver Bernard")).toBe(true);
      expect(filter.shouldHideCompany("oliver bernard")).toBe(true);
      expect(filter.shouldHideCompany("OLIVER BERNARD")).toBe(true);
    });

    it("returns false for a non-blocked company", () => {
      const filter = new Filter({
        blockedCompanies: [{ name: "Oliver Bernard", muted: false }],
        blockedJobIds: [],
      });
      expect(filter.shouldHideCompany("Google")).toBe(false);
    });

    it("returns false for a muted (temporarily disabled) company", () => {
      const filter = new Filter({
        blockedCompanies: [{ name: "Oliver Bernard", muted: true }],
        blockedJobIds: [],
      });
      expect(filter.shouldHideCompany("Oliver Bernard")).toBe(false);
    });

    it("handles empty blocklist", () => {
      const filter = new Filter({ blockedCompanies: [], blockedJobIds: [] });
      expect(filter.shouldHideCompany("Anything")).toBe(false);
    });

    it("trims whitespace from company names", () => {
      const filter = new Filter({
        blockedCompanies: [{ name: "Oliver Bernard", muted: false }],
        blockedJobIds: [],
      });
      expect(filter.shouldHideCompany("  Oliver Bernard  ")).toBe(true);
    });
  });

  describe("shouldHideJob", () => {
    it("returns true for a blocked job ID", () => {
      const filter = new Filter({
        blockedCompanies: [],
        blockedJobIds: ["4357586607"],
      });
      expect(filter.shouldHideJob("4357586607")).toBe(true);
    });

    it("returns false for a non-blocked job ID", () => {
      const filter = new Filter({
        blockedCompanies: [],
        blockedJobIds: ["4357586607"],
      });
      expect(filter.shouldHideJob("9999999999")).toBe(false);
    });
  });

  describe("addCompany", () => {
    it("adds a company to the blocklist", () => {
      const filter = new Filter({ blockedCompanies: [], blockedJobIds: [] });
      filter.addCompany("Hays");
      expect(filter.shouldHideCompany("Hays")).toBe(true);
    });

    it("does not add duplicates", () => {
      const filter = new Filter({ blockedCompanies: [], blockedJobIds: [] });
      filter.addCompany("Hays");
      filter.addCompany("hays");
      expect(filter.getState().blockedCompanies).toHaveLength(1);
    });
  });

  describe("removeCompany", () => {
    it("removes a company from the blocklist", () => {
      const filter = new Filter({
        blockedCompanies: [{ name: "Hays", muted: false }],
        blockedJobIds: [],
      });
      filter.removeCompany("Hays");
      expect(filter.shouldHideCompany("Hays")).toBe(false);
    });

    it("removes case-insensitively", () => {
      const filter = new Filter({
        blockedCompanies: [{ name: "Hays", muted: false }],
        blockedJobIds: [],
      });
      filter.removeCompany("hays");
      expect(filter.shouldHideCompany("Hays")).toBe(false);
    });
  });

  describe("muteCompany / unmuteCompany", () => {
    it("mutes a company so it stops being filtered", () => {
      const filter = new Filter({
        blockedCompanies: [{ name: "Hays", muted: false }],
        blockedJobIds: [],
      });
      filter.muteCompany("Hays");
      expect(filter.shouldHideCompany("Hays")).toBe(false);
      expect(filter.getState().blockedCompanies[0].muted).toBe(true);
    });

    it("unmutes a company so it resumes filtering", () => {
      const filter = new Filter({
        blockedCompanies: [{ name: "Hays", muted: true }],
        blockedJobIds: [],
      });
      filter.unmuteCompany("Hays");
      expect(filter.shouldHideCompany("Hays")).toBe(true);
      expect(filter.getState().blockedCompanies[0].muted).toBe(false);
    });
  });

  describe("addBlockedJob", () => {
    it("adds a job ID to the blocked list", () => {
      const filter = new Filter({ blockedCompanies: [], blockedJobIds: [] });
      filter.addBlockedJob("12345");
      expect(filter.shouldHideJob("12345")).toBe(true);
    });

    it("does not add duplicate job IDs", () => {
      const filter = new Filter({ blockedCompanies: [], blockedJobIds: [] });
      filter.addBlockedJob("12345");
      filter.addBlockedJob("12345");
      expect(filter.getState().blockedJobIds).toHaveLength(1);
    });
  });

  describe("removeBlockedJob", () => {
    it("removes a job ID from the blocked list", () => {
      const filter = new Filter({
        blockedCompanies: [],
        blockedJobIds: ["12345"],
      });
      filter.removeBlockedJob("12345");
      expect(filter.shouldHideJob("12345")).toBe(false);
    });
  });

  describe("getState", () => {
    it("returns the current filter state", () => {
      const state = {
        blockedCompanies: [{ name: "Hays", muted: false }],
        blockedJobIds: ["12345"],
      };
      const filter = new Filter(state);
      expect(filter.getState()).toEqual(state);
    });

    it("returns a copy, not a reference", () => {
      const filter = new Filter({ blockedCompanies: [], blockedJobIds: [] });
      const state = filter.getState();
      state.blockedCompanies.push({ name: "Hack", muted: false });
      expect(filter.getState().blockedCompanies).toHaveLength(0);
    });
  });
});
