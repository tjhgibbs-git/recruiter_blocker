class Filter {
  constructor(state) {
    this._blockedCompanies = (state.blockedCompanies || []).map((c) => ({
      name: c.name,
      muted: c.muted,
    }));
    this._blockedJobIds = [...(state.blockedJobIds || [])];
  }

  shouldHideCompany(companyName) {
    const normalized = companyName.trim().toLowerCase();
    return this._blockedCompanies.some(
      (c) => c.name.toLowerCase() === normalized && !c.muted
    );
  }

  shouldHideJob(jobId) {
    return this._blockedJobIds.includes(jobId);
  }

  addCompany(name) {
    const normalized = name.trim().toLowerCase();
    const exists = this._blockedCompanies.some(
      (c) => c.name.toLowerCase() === normalized
    );
    if (!exists) {
      this._blockedCompanies.push({ name: name.trim(), muted: false });
    }
  }

  removeCompany(name) {
    const normalized = name.trim().toLowerCase();
    this._blockedCompanies = this._blockedCompanies.filter(
      (c) => c.name.toLowerCase() !== normalized
    );
  }

  muteCompany(name) {
    const normalized = name.trim().toLowerCase();
    const company = this._blockedCompanies.find(
      (c) => c.name.toLowerCase() === normalized
    );
    if (company) {
      company.muted = true;
    }
  }

  unmuteCompany(name) {
    const normalized = name.trim().toLowerCase();
    const company = this._blockedCompanies.find(
      (c) => c.name.toLowerCase() === normalized
    );
    if (company) {
      company.muted = false;
    }
  }

  addBlockedJob(jobId) {
    if (!this._blockedJobIds.includes(jobId)) {
      this._blockedJobIds.push(jobId);
    }
  }

  removeBlockedJob(jobId) {
    this._blockedJobIds = this._blockedJobIds.filter((id) => id !== jobId);
  }

  getState() {
    return {
      blockedCompanies: this._blockedCompanies.map((c) => ({
        name: c.name,
        muted: c.muted,
      })),
      blockedJobIds: [...this._blockedJobIds],
    };
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { Filter };
}
