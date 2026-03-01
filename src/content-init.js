(function () {
  const storage = new Storage(browser);
  const processor = new JobCardProcessor();
  let filter;

  async function loadAndApply() {
    const state = await storage.load();
    filter = new Filter(state);
    processor.processAllCards(document, filter, onBlock);
  }

  async function onBlock(companyName, jobId) {
    if (companyName) {
      filter.addCompany(companyName);
    }
    if (jobId) {
      filter.addBlockedJob(jobId);
    }
    await storage.save(filter.getState());
    processor.processAllCards(document, filter, onBlock);
  }

  loadAndApply();

  const observer = new MutationObserver(() => {
    if (filter) {
      processor.processAllCards(document, filter, onBlock);
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  browser.storage.onChanged.addListener(() => {
    loadAndApply();
  });
})();
