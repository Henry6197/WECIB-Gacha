const GAME_STORAGE_KEY = 'wecib-gacha-state';
const LEGACY_INVENTORY_KEY = 'inventory';
const LEGACY_BALANCE_KEY = 'balance';

const PASSIVE_PP_RATES = {
  freshman: 1,
  sophomore: 2,
  junior: 4,
  senior: 7,
  superSenior: 12,
};

const RARITY_KEY_ALIASES = {
  common: 'freshman',
  uncommon: 'sophomore',
  rare: 'junior',
  epic: 'senior',
  secret: 'superSenior',
};

function roundPP(value) {
  return Math.round(value * 100) / 100;
}

function normalizeStoredRarity(rarityKey) {
  return RARITY_KEY_ALIASES[rarityKey] || rarityKey || 'freshman';
}

function normalizeCard(card) {
  const rarityKey = normalizeStoredRarity(card.rarityKey || card.rarity);

  return {
    id: card.id || crypto.randomUUID(),
    name: card.name || 'Unknown Card',
    rarity: card.rarity || rarityKey,
    rarityKey,
    description: card.description || '',
    attack: Number(card.attack) || 0,
    defense: Number(card.defense) || 0,
    caseName: card.caseName || 'Unknown Case',
    wonAt: card.wonAt || new Date().toISOString(),
  };
}

function createDefaultState() {
  return {
    version: 1,
    ppBalance: 120,
    inventory: [],
    lastAccrualAt: Date.now(),
  };
}

function applyPassiveProgress(state, now = Date.now()) {
  const safeState = {
    ...createDefaultState(),
    ...state,
    inventory: Array.isArray(state.inventory) ? state.inventory.map(normalizeCard) : [],
  };

  const elapsedMs = Math.max(0, now - Number(safeState.lastAccrualAt || now));
  if (elapsedMs === 0) {
    return { ...safeState, lastAccrualAt: now };
  }

  const incomePerHour = safeState.inventory.reduce((sum, card) => {
    return sum + (PASSIVE_PP_RATES[normalizeStoredRarity(card.rarityKey)] || 0);
  }, 0);

  if (incomePerHour <= 0) {
    return { ...safeState, lastAccrualAt: now };
  }

  const earned = roundPP((incomePerHour * elapsedMs) / 3600000);

  return {
    ...safeState,
    ppBalance: roundPP(Number(safeState.ppBalance || 0) + earned),
    lastAccrualAt: now,
  };
}

function readLegacyState() {
  const legacyInventory = JSON.parse(localStorage.getItem(LEGACY_INVENTORY_KEY) || 'null');
  const legacyBalance = JSON.parse(localStorage.getItem(LEGACY_BALANCE_KEY) || 'null');

  if (!Array.isArray(legacyInventory) && typeof legacyBalance !== 'number') {
    return null;
  }

  return {
    version: 1,
    ppBalance: typeof legacyBalance === 'number' ? legacyBalance : 120,
    inventory: Array.isArray(legacyInventory) ? legacyInventory.map(normalizeCard) : [],
    lastAccrualAt: Date.now(),
  };
}

function saveGameState(state) {
  const normalized = {
    ...createDefaultState(),
    ...state,
    ppBalance: roundPP(Number(state.ppBalance || 0)),
    inventory: Array.isArray(state.inventory) ? state.inventory.map(normalizeCard) : [],
  };

  localStorage.setItem(GAME_STORAGE_KEY, JSON.stringify(normalized));
}

function loadGameState() {
  try {
    const stored = JSON.parse(localStorage.getItem(GAME_STORAGE_KEY) || 'null');
    if (stored && typeof stored === 'object') {
      return applyPassiveProgress(stored);
    }
  } catch (error) {
    console.warn('Failed to parse saved WECIB Gacha state.', error);
  }

  const legacyState = readLegacyState();
  if (legacyState) {
    localStorage.removeItem(LEGACY_INVENTORY_KEY);
    localStorage.removeItem(LEGACY_BALANCE_KEY);
    saveGameState(legacyState);
    return legacyState;
  }

  const freshState = createDefaultState();
  saveGameState(freshState);
  return freshState;
}

let gameState = loadGameState();

function getGameState() {
  gameState = applyPassiveProgress(gameState);
  return gameState;
}

function getInventory() {
  return [...getGameState().inventory];
}

function getBalance() {
  return getGameState().ppBalance;
}

function getPassiveIncomePerHour() {
  return getGameState().inventory.reduce((sum, card) => {
    return sum + (PASSIVE_PP_RATES[normalizeStoredRarity(card.rarityKey)] || 0);
  }, 0);
}

function addCardToInventory(card) {
  gameState = getGameState();
  gameState.inventory = [...gameState.inventory, normalizeCard(card)];
  saveGameState(gameState);
}

function spendPP(amount) {
  gameState = getGameState();
  if (gameState.ppBalance < amount) {
    return false;
  }

  gameState.ppBalance = roundPP(gameState.ppBalance - amount);
  saveGameState(gameState);
  return true;
}

function resetGameState() {
  gameState = createDefaultState();
  saveGameState(gameState);
}