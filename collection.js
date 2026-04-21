const RARITIES = {
  freshman: { label: 'Freshman' },
  sophomore: { label: 'Sophomore' },
  junior: { label: 'Junior' },
  senior: { label: 'Senior' },
  superSenior: { label: 'Super-Senior' },
};

const RARITY_ORDER = ['freshman', 'sophomore', 'junior', 'senior', 'superSenior'];

const balanceEl = document.getElementById('balance');
const inventoryCountEl = document.getElementById('inventoryCount');
const incomeRateEl = document.getElementById('incomeRate');
const collectionGridEl = document.getElementById('collectionGrid');
const collectionEmptyEl = document.getElementById('collectionEmpty');
const collectionSummaryEl = document.getElementById('collectionSummary');
const resetProgressBtn = document.getElementById('resetProgressBtn');

function normalizeRarity(rarity) {
  return rarity in RARITIES ? rarity : 'freshman';
}

function enrichCard(card) {
  const rarityKey = normalizeRarity(card.rarityKey || card.rarity);

  return {
    ...card,
    rarityKey,
    rarityLabel: RARITIES[rarityKey].label,
  };
}

function formatPP(value) {
  return Number(value).toFixed(2);
}

function initialsFromName(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 3)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

function getRarityRank(rarityKey) {
  return RARITY_ORDER.indexOf(rarityKey);
}

function renderCardMarkup(card) {
  const safeCard = enrichCard(card);

  return `
    <article class="display-card rarity-${safeCard.rarityKey}">
      <div class="card-badge">
        <span>${initialsFromName(safeCard.name)}</span>
      </div>
      <div class="card-copy">
        <p class="card-rarity">${safeCard.rarityLabel}</p>
        <h4>${safeCard.name}</h4>
        <p class="card-description">${safeCard.description || 'No description yet.'}</p>
        <div class="card-stats">
          <span>ATK ${safeCard.attack}</span>
          <span>DEF ${safeCard.defense}</span>
        </div>
      </div>
    </article>
  `;
}

function updateDashboard() {
  const inventory = getInventory();
  balanceEl.textContent = formatPP(getBalance());
  inventoryCountEl.textContent = String(inventory.length);
  incomeRateEl.textContent = formatPP(getPassiveIncomePerHour());
}

function getGroupedCollection() {
  const groups = new Map();

  getInventory().forEach((card) => {
    const safeCard = enrichCard(card);
    const key = `${safeCard.name}::${safeCard.rarityKey}`;
    const existing = groups.get(key);

    if (existing) {
      existing.copies += 1;
      if (new Date(safeCard.wonAt) > new Date(existing.wonAt)) {
        existing.wonAt = safeCard.wonAt;
      }
      return;
    }

    groups.set(key, { ...safeCard, copies: 1 });
  });

  return [...groups.values()].sort((left, right) => {
    const rarityDiff = getRarityRank(right.rarityKey) - getRarityRank(left.rarityKey);
    if (rarityDiff !== 0) {
      return rarityDiff;
    }

    if (right.copies !== left.copies) {
      return right.copies - left.copies;
    }

    return left.name.localeCompare(right.name);
  });
}

function renderCollection() {
  const inventory = getInventory();
  const groups = getGroupedCollection();

  collectionGridEl.innerHTML = '';
  collectionEmptyEl.hidden = inventory.length > 0;

  if (inventory.length === 0) {
    collectionSummaryEl.textContent = 'No cards collected yet.';
    return;
  }

  const raritySummary = RARITY_ORDER.map((rarityKey) => {
    const count = inventory.filter((card) => enrichCard(card).rarityKey === rarityKey).length;
    return `${RARITIES[rarityKey].label}: ${count}`;
  }).join(' | ');

  collectionSummaryEl.textContent = `${inventory.length} total cards. ${raritySummary}`;

  groups.forEach((group) => {
    const collectionCard = document.createElement('article');
    collectionCard.className = `collection-card rarity-${group.rarityKey}`;
    collectionCard.innerHTML = `
      <div class="collection-card-top">
        <span class="copy-count">x${group.copies}</span>
        <span class="collection-case">${group.caseName}</span>
      </div>
      ${renderCardMarkup(group)}
      <p class="collection-foot">Last pulled ${new Date(group.wonAt).toLocaleString()}</p>
    `;
    collectionGridEl.appendChild(collectionCard);
  });
}

resetProgressBtn.addEventListener('click', () => {
  const shouldReset = window.confirm('Reset your WECIBGacha collection and PP progress?');
  if (!shouldReset) {
    return;
  }

  resetGameState();
  updateDashboard();
  renderCollection();
});

updateDashboard();
renderCollection();
window.setInterval(updateDashboard, 1000);
