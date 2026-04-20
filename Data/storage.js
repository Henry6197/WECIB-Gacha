const INVENTORY_KEY = "inventory";

function getInventory() {
  return JSON.parse(localStorage.getItem(INVENTORY_KEY)) ?? [];
}

function saveInventory(inventory) {
  localStorage.setItem(INVENTORY_KEY, JSON.stringify(inventory));
}

function addCardToInventory(card) {
  const inventory = getInventory();

  inventory.push({
    id: crypto.randomUUID(), // unique so duplicates still work
    name: card.name,
    rarity: card.rarity,
    rarityKey: card.rarityKey,
    price: card.price,
    attack: card.attack,
    defense: card.defense,
    image: card.image,
    caseName: card.caseName,
    wonAt: new Date().toISOString()
  });

  saveInventory(inventory);
}

function clearInventory() {
  localStorage.removeItem(INVENTORY_KEY);
}