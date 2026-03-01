/**
 * @jest-environment jsdom
 */
const { PopupController } = require("../src/popup-controller");

function createPopupDOM() {
  document.body.innerHTML = `
    <input id="company-input" type="text" />
    <button id="add-btn">Add</button>
    <ul id="company-list"></ul>
    <span id="count">0</span>
  `;
  return {
    input: document.getElementById("company-input"),
    addBtn: document.getElementById("add-btn"),
    list: document.getElementById("company-list"),
    count: document.getElementById("count"),
  };
}

function createMockStorage(initialState) {
  const state = initialState || { blockedCompanies: [], blockedJobIds: [] };
  return {
    load: jest.fn(() => Promise.resolve(JSON.parse(JSON.stringify(state)))),
    save: jest.fn((s) => {
      Object.assign(state, s);
      return Promise.resolve();
    }),
  };
}

describe("PopupController", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  describe("init", () => {
    it("renders the blocked companies list on init", async () => {
      const els = createPopupDOM();
      const storage = createMockStorage({
        blockedCompanies: [
          { name: "Oliver Bernard", muted: false },
          { name: "Hays", muted: true },
        ],
        blockedJobIds: [],
      });

      const controller = new PopupController(els, storage);
      await controller.init();

      const items = els.list.querySelectorAll("li");
      expect(items).toHaveLength(2);
      expect(items[0].textContent).toContain("Oliver Bernard");
      expect(items[1].textContent).toContain("Hays");
      expect(els.count.textContent).toBe("2");
    });

    it("shows muted state visually", async () => {
      const els = createPopupDOM();
      const storage = createMockStorage({
        blockedCompanies: [{ name: "Hays", muted: true }],
        blockedJobIds: [],
      });

      const controller = new PopupController(els, storage);
      await controller.init();

      const item = els.list.querySelector("li");
      expect(item.classList.contains("muted")).toBe(true);
    });
  });

  describe("adding a company", () => {
    it("adds a new company and saves to storage", async () => {
      const els = createPopupDOM();
      const storage = createMockStorage();
      const controller = new PopupController(els, storage);
      await controller.init();

      els.input.value = "Oliver Bernard";
      els.addBtn.click();

      await flushPromises();

      expect(storage.save).toHaveBeenCalled();
      const items = els.list.querySelectorAll("li");
      expect(items).toHaveLength(1);
      expect(items[0].textContent).toContain("Oliver Bernard");
      expect(els.input.value).toBe("");
    });

    it("does not add empty company name", async () => {
      const els = createPopupDOM();
      const storage = createMockStorage();
      const controller = new PopupController(els, storage);
      await controller.init();

      els.input.value = "   ";
      els.addBtn.click();

      await flushPromises();

      const items = els.list.querySelectorAll("li");
      expect(items).toHaveLength(0);
    });
  });

  describe("removing a company", () => {
    it("removes company when delete button clicked", async () => {
      const els = createPopupDOM();
      const storage = createMockStorage({
        blockedCompanies: [{ name: "Hays", muted: false }],
        blockedJobIds: [],
      });
      const controller = new PopupController(els, storage);
      await controller.init();

      const removeBtn = els.list.querySelector(".remove-btn");
      removeBtn.click();

      await flushPromises();

      expect(els.list.querySelectorAll("li")).toHaveLength(0);
      expect(storage.save).toHaveBeenCalled();
    });
  });

  describe("muting/unmuting a company", () => {
    it("toggles mute when mute button clicked", async () => {
      const els = createPopupDOM();
      const storage = createMockStorage({
        blockedCompanies: [{ name: "Hays", muted: false }],
        blockedJobIds: [],
      });
      const controller = new PopupController(els, storage);
      await controller.init();

      const muteBtn = els.list.querySelector(".mute-btn");
      muteBtn.click();

      await flushPromises();

      const item = els.list.querySelector("li");
      expect(item.classList.contains("muted")).toBe(true);
      expect(storage.save).toHaveBeenCalled();
    });

    it("unmutes when mute button clicked on muted company", async () => {
      const els = createPopupDOM();
      const storage = createMockStorage({
        blockedCompanies: [{ name: "Hays", muted: true }],
        blockedJobIds: [],
      });
      const controller = new PopupController(els, storage);
      await controller.init();

      const muteBtn = els.list.querySelector(".mute-btn");
      muteBtn.click();

      await flushPromises();

      const item = els.list.querySelector("li");
      expect(item.classList.contains("muted")).toBe(false);
    });
  });
});

function flushPromises() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}
