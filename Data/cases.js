//placeholders currently
export const RARITIES = {
  common: { label: "Freshman", color: "#dee4ff", weight: 65 },
  uncommon: { label: "Sophomore", color: "#8fff74", weight: 25 },
  rare: { label: "Junior", color: "#4781ff", weight: 8 },
  epic: { label: "Senior", color: "#922ce6", weight: 1.8 },
  secret: { label: "★ Super Senior ★", color: "#ffd700", weight: 0.2 },
};

export const CASES = [
  {
    id: "starter_case",
    name: "WECIB Starter Case",
    pp_cost: 1.0,
    image: "images/cases/crate.jpeg",
    items: [
      { cardId: "vending_machine_24" },
      { cardId: "academic_rigor" },
      { cardId: "2_nick" }
    ]
  },
  {
    id: "rt1_case",
    name: "RT1 Case",
    pp_cost: 5.0,
    image: "images/cases/crate.jpeg",
    items: [
      { cardId: "2_nick" },
      { cardId: "vending_machine_24" }
    ]
  }
];
