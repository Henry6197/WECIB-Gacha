export class Case {
  constructor({ id, name, costPP, image, drops }) {
    this.id = id;
    this.name = name;
    this.costPP = costPP;
    this.image = image;
    this.drops = drops;
  }
}


export const cases = [
  new Case({
    id: "rtp2_case",
    name: "RTP-2 Case",
    costPP: 25,
    image: "images/cases/crate.jpeg",

    drops: [
      { cardId: "vending_machine_24" },
      { cardId: "academic_rigor" }
    ]
  }),

  new Case({
    id: "rt1_case",
    name: "RT1 Case",
    costPP: 40,
    image: "images/cases/crate.jpeg",

    drops: [
      { cardId: "rt1_hallway" },
      { cardId: "vending_machine_24" }
    ]
  })
];
