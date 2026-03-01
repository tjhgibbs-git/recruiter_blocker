class PopupController {
  constructor(els, storage) {
    this._els = els;
    this._storage = storage;
    this._filter = null;
    this._state = null;
  }

  async init() {
    this._state = await this._storage.load();
    this._render();
    this._els.addBtn.addEventListener("click", () => this._onAdd());
    this._els.input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") this._onAdd();
    });
  }

  async _onAdd() {
    const name = this._els.input.value.trim();
    if (!name) return;

    const exists = this._state.blockedCompanies.some(
      (c) => c.name.toLowerCase() === name.toLowerCase()
    );
    if (!exists) {
      this._state.blockedCompanies.push({ name, muted: false });
      await this._storage.save(this._state);
      this._render();
    }
    this._els.input.value = "";
  }

  async _onRemove(name) {
    this._state.blockedCompanies = this._state.blockedCompanies.filter(
      (c) => c.name.toLowerCase() !== name.toLowerCase()
    );
    await this._storage.save(this._state);
    this._render();
  }

  async _onToggleMute(name) {
    const company = this._state.blockedCompanies.find(
      (c) => c.name.toLowerCase() === name.toLowerCase()
    );
    if (company) {
      company.muted = !company.muted;
      await this._storage.save(this._state);
      this._render();
    }
  }

  _render() {
    const list = this._els.list;
    list.innerHTML = "";

    for (const company of this._state.blockedCompanies) {
      const li = document.createElement("li");
      if (company.muted) li.classList.add("muted");

      const nameSpan = document.createElement("span");
      nameSpan.className = "company-name";
      nameSpan.textContent = company.name;
      li.appendChild(nameSpan);

      const actions = document.createElement("span");
      actions.className = "actions";

      const muteBtn = document.createElement("button");
      muteBtn.className = "mute-btn";
      muteBtn.textContent = company.muted ? "\u25B6" : "\u23F8";
      muteBtn.title = company.muted ? "Unmute" : "Mute";
      muteBtn.addEventListener("click", () =>
        this._onToggleMute(company.name)
      );

      const removeBtn = document.createElement("button");
      removeBtn.className = "remove-btn";
      removeBtn.textContent = "\u00D7";
      removeBtn.title = "Remove";
      removeBtn.addEventListener("click", () => this._onRemove(company.name));

      actions.appendChild(muteBtn);
      actions.appendChild(removeBtn);
      li.appendChild(actions);
      list.appendChild(li);
    }

    this._els.count.textContent = String(
      this._state.blockedCompanies.length
    );
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { PopupController };
}
