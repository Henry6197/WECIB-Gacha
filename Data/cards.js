//placeholder values
export class Card {
  constructor({
    id,
    name,
    rarity,
    tier,
    category,
    pp_gain,
    attack,
    defense,
    image
  }) {
    this.id = id;
    this.name = name;
    this.rarity = rarity;
    this.tier = tier;
    this.category = category;
    this.pp_gain = pp_gain;
    this.attack = attack;
    this.defense = defense;
    this.image = image;
  }
}

export const cards = [
  new Card({
    id: "vending_machine_24",
    name: "Vending Machine Incident of '24",
    rarity: "super_senior",
    tier: "common",
    category: "event",
    pp_gain: 10,
    attack: 95,
    defense: 70,
    image: "images/cards/vending_machine_24.webp"
  }),

  new Card({
    id: "academic_rigor",
    name: "Academic Rigor",
    rarity: "super_senior",
    tier: "uncommon",
    category: "people",
    pp_gain: 50,
    attack: 110,
    defense: 70,
    image: "images/cards/sleeping_rhys.png"
  }),

  new Card({
    id: "2_nick",
    name: "2Nick",
    rarity: "super_senior",
    tier: "common",
    category: "people",
    pp_gain: 10,
    attack: 95,
    defense: 70,
    image: "images/cards/vending_machine_24.webp"
  })
];
