/**
 * @jest-environment jsdom
 */
const { Filter } = require("../src/filter");
const { JobCardProcessor } = require("../src/content");

function createJobCard(companyName, jobUrl) {
  const card = document.createElement("div");
  card.classList.add("job-card-list__entity-lockup");

  const subtitle = document.createElement("div");
  subtitle.classList.add("artdeco-entity-lockup__subtitle");
  const span = document.createElement("span");
  span.textContent = companyName;
  subtitle.appendChild(span);

  const link = document.createElement("a");
  link.classList.add("job-card-container__link");
  link.href = jobUrl || "/jobs/view/12345/";
  const title = document.createElement("div");
  title.classList.add("artdeco-entity-lockup__title");
  title.appendChild(link);

  card.appendChild(title);
  card.appendChild(subtitle);

  // Wrap in a parent li like LinkedIn does
  const li = document.createElement("li");
  li.appendChild(card);

  return { li, card };
}

describe("JobCardProcessor", () => {
  describe("extractCompanyName", () => {
    it("extracts company name from a job card", () => {
      const { card } = createJobCard("Oliver Bernard");
      const processor = new JobCardProcessor();
      expect(processor.extractCompanyName(card)).toBe("Oliver Bernard");
    });

    it("returns null when no company name element found", () => {
      const card = document.createElement("div");
      const processor = new JobCardProcessor();
      expect(processor.extractCompanyName(card)).toBeNull();
    });
  });

  describe("extractJobId", () => {
    it("extracts job ID from the job card link href", () => {
      const { card } = createJobCard("Acme", "/jobs/view/4357586607/?eBP=xxx");
      const processor = new JobCardProcessor();
      expect(processor.extractJobId(card)).toBe("4357586607");
    });

    it("returns null when no link found", () => {
      const card = document.createElement("div");
      const processor = new JobCardProcessor();
      expect(processor.extractJobId(card)).toBeNull();
    });
  });

  describe("processCard", () => {
    it("hides card when company is blocked", () => {
      const { li, card } = createJobCard("Oliver Bernard");
      const filter = new Filter({
        blockedCompanies: [{ name: "Oliver Bernard", muted: false }],
        blockedJobIds: [],
      });
      const processor = new JobCardProcessor();
      processor.processCard(card, filter);
      expect(li.style.display).toBe("none");
    });

    it("does not hide card when company is not blocked", () => {
      const { li, card } = createJobCard("Google");
      const filter = new Filter({
        blockedCompanies: [{ name: "Oliver Bernard", muted: false }],
        blockedJobIds: [],
      });
      const processor = new JobCardProcessor();
      processor.processCard(card, filter);
      expect(li.style.display).not.toBe("none");
    });

    it("hides card when job ID is blocked", () => {
      const { li, card } = createJobCard(
        "Google",
        "/jobs/view/4357586607/?eBP=xxx"
      );
      const filter = new Filter({
        blockedCompanies: [],
        blockedJobIds: ["4357586607"],
      });
      const processor = new JobCardProcessor();
      processor.processCard(card, filter);
      expect(li.style.display).toBe("none");
    });

    it("adds block button to visible cards", () => {
      const { card } = createJobCard("Google");
      const filter = new Filter({
        blockedCompanies: [],
        blockedJobIds: [],
      });
      const processor = new JobCardProcessor();
      processor.processCard(card, filter);
      const btn = card.querySelector(".recruiter-blocker-btn");
      expect(btn).not.toBeNull();
      expect(btn.title).toContain("Block");
    });

    it("does not add duplicate block buttons", () => {
      const { card } = createJobCard("Google");
      const filter = new Filter({
        blockedCompanies: [],
        blockedJobIds: [],
      });
      const processor = new JobCardProcessor();
      processor.processCard(card, filter);
      processor.processCard(card, filter);
      const buttons = card.querySelectorAll(".recruiter-blocker-btn");
      expect(buttons).toHaveLength(1);
    });

    it("restores hidden card when company is unmuted", () => {
      const { li, card } = createJobCard("Hays");
      const filter = new Filter({
        blockedCompanies: [{ name: "Hays", muted: false }],
        blockedJobIds: [],
      });
      const processor = new JobCardProcessor();
      processor.processCard(card, filter);
      expect(li.style.display).toBe("none");

      filter.muteCompany("Hays");
      processor.processCard(card, filter);
      expect(li.style.display).toBe("");
    });
  });

  describe("processAllCards", () => {
    it("processes all job cards in a container", () => {
      const container = document.createElement("div");
      const { li: li1 } = createJobCard("Oliver Bernard");
      const { li: li2 } = createJobCard("Google");
      container.appendChild(li1);
      container.appendChild(li2);

      const filter = new Filter({
        blockedCompanies: [{ name: "Oliver Bernard", muted: false }],
        blockedJobIds: [],
      });
      const processor = new JobCardProcessor();
      processor.processAllCards(container, filter);

      expect(li1.style.display).toBe("none");
      expect(li2.style.display).not.toBe("none");
    });
  });
});
