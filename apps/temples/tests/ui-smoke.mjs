import { renderHomeView, renderShell, renderTempleView } from "../app/ui.js";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function runHomeSmoke() {
  const html = renderShell(
    renderHomeView({
      locale: "en",
      query: "",
      category: "all",
      temples: [
        {
          id: "somnath",
          name: "Somnath",
          name_local: "सोमनाथ",
          location: "Veraval, Gujarat",
          thumbnail: "./data/temples/somnath/images/hero.png",
          short_desc: "The first Jyotirlinga",
          category: "jyotirlinga"
        }
      ],
      loading: false,
      error: "",
      savedTempleIds: new Set(["somnath"]),
      visitedTempleIds: new Set(),
      planner: { total: 13, visited: 1, nextTemple: { id: "mallikarjuna", name: "Mallikarjuna" } }
    }),
    { title: "Sanatan Temples", locale: "en", pwaUpdateReady: true }
  );

  assert(html.includes("data-action=\"toggle-language\""), "Language toggle missing.");
  assert(html.includes("data-action=\"toggle-save\""), "Save action missing.");
  assert(html.includes("data-action=\"continue-yatra\""), "Planner continue action missing.");
  assert(html.includes("data-action=\"apply-update\""), "Update action missing.");
}

function runDetailSmoke() {
  const html = renderTempleView({
    locale: "hi",
    loading: false,
    error: "",
    isSaved: true,
    isVisited: true,
    temple: {
      id: "somnath",
      name: "Somnath",
      name_local: "सोमनाथ",
      thumbnail: "./data/temples/somnath/images/hero.png",
      short_desc: "desc",
      location: "Veraval, Gujarat"
    },
    bundle: {
      manifest: {
        name: "Somnath",
        name_local: "सोमनाथ",
        description: "overview",
        hero_image: "./data/temples/somnath/images/hero.png",
        location: { city: "Veraval", state: "Gujarat", coords: [20.88, 70.4] },
        stats: { age_years: 2000 }
      },
      deity: { name: "Someshwara", meaning: "Lord of Moon", mythology: { origin_story: "story" } },
      whyVisit: { spiritual_invitation: "invite", spiritual_benefits: [{ blessing: "peace", significance: "calm" }] },
      facts: [{ category: "History", title: "Fact", hook: "hook" }],
      media: [{ url: "./data/temples/somnath/images/hero.png", caption: "Hero" }],
      qualityWarnings: ["sample"]
    }
  });

  assert(html.includes("data-action=\"toggle-save\""), "Detail save action missing.");
  assert(html.includes("google.com/maps"), "Map link missing.");
  assert(html.includes("quality" ) || html.includes("अधूरी"), "Quality notice not rendered.");
}

runHomeSmoke();
runDetailSmoke();
console.log("UI smoke checks passed.");
