const DEFAULT_STATE = {
  blockedCompanies: [],
  blockedJobIds: [],
};

class Storage {
  constructor(browserApi) {
    this._browser = browserApi;
  }

  async load() {
    const result = await this._browser.storage.local.get([
      "blockedCompanies",
      "blockedJobIds",
    ]);
    return {
      blockedCompanies: result.blockedCompanies || DEFAULT_STATE.blockedCompanies,
      blockedJobIds: result.blockedJobIds || DEFAULT_STATE.blockedJobIds,
    };
  }

  async save(state) {
    await this._browser.storage.local.set(state);
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { Storage };
}
