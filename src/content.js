class JobCardProcessor {
  extractCompanyName(card) {
    const subtitle = card.querySelector(".artdeco-entity-lockup__subtitle");
    if (!subtitle) return null;
    const text = subtitle.textContent.trim();
    return text || null;
  }

  extractJobId(card) {
    const link = card.querySelector(".job-card-container__link");
    if (!link) return null;
    const match = link.href.match(/\/jobs\/view\/(\d+)/);
    return match ? match[1] : null;
  }

  processCard(card, filter, onBlock) {
    const companyName = this.extractCompanyName(card);
    const jobId = this.extractJobId(card);
    const parent = card.parentElement;

    const shouldHide =
      (companyName && filter.shouldHideCompany(companyName)) ||
      (jobId && filter.shouldHideJob(jobId));

    if (parent) {
      parent.style.display = shouldHide ? "none" : "";
    }

    if (!shouldHide && !card.querySelector(".recruiter-blocker-btn")) {
      this._addBlockButton(card, companyName, jobId, onBlock);
    }
  }

  processAllCards(container, filter, onBlock) {
    const cards = container.querySelectorAll(".job-card-list__entity-lockup");
    cards.forEach((card) => this.processCard(card, filter, onBlock));
  }

  _addBlockButton(card, companyName, jobId, onBlock) {
    const btn = document.createElement("button");
    btn.className = "recruiter-blocker-btn";
    btn.title = `Block ${companyName || "this job"}`;
    btn.textContent = "\u00D7";
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (onBlock) onBlock(companyName, jobId);
    });
    card.appendChild(btn);
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { JobCardProcessor };
}
