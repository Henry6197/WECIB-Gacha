const RARITIES = {
  freshman: { label: 'Freshman', color: '#d7e3ff', accent: '#3259a8', weight: 58 },
  sophomore: { label: 'Sophomore', color: '#d9f7c8', accent: '#3b7a2f', weight: 25 },
  junior: { label: 'Junior', color: '#b9d4ff', accent: '#1742b8', weight: 11 },
  senior: { label: 'Senior', color: '#ffd3a9', accent: '#b34d13', weight: 4 },
  superSenior: { label: 'Super-Senior', color: '#ffe48c', accent: '#8b5e00', weight: 2 },
};

const RARITY_ORDER = ['freshman', 'sophomore', 'junior', 'senior', 'superSenior'];

const CASES = [
  {
    name: 'MHS Case',
    price: 12,
    image: 'Images/crate1.png',
    flavor: 'Hallway lore, familiar spots, and the daily chaos that built the wiki.',
    items: [
      { name: 'South Hall Stampede', rarity: 'freshman', attack: 42, defense: 35, description: 'The passing-period traffic jam that somehow happens every single day.' },
      { name: 'MHS Campus', rarity: 'freshman', attack: 38, defense: 44, description: 'A wide-angle classic. Reliable, crowded, and always relevant.' },
      { name: 'As Many People As Want Their Picture Taken', rarity: 'sophomore', attack: 66, defense: 57, description: 'A quote with permanent aura. Nobody fully explains it, everyone remembers it.' },
      { name: 'Theatre Hallway', rarity: 'sophomore', attack: 59, defense: 61, description: 'A cultural corridor where half the lore seems to begin.' },
      { name: 'Wallholes', rarity: 'junior', attack: 74, defense: 72, description: 'Architectural mystery turned community bit.' },
      { name: 'Iconic Stairwell Debate', rarity: 'junior', attack: 82, defense: 68, description: 'A minor argument that somehow turned into a semester-long reference.' },
      { name: 'Mr. Gross Sighting', rarity: 'senior', attack: 95, defense: 80, description: 'A rare appearance that instantly changes the energy in the room.' },
      { name: 'Vending Machine Incident of 24', rarity: 'superSenior', attack: 130, defense: 118, description: 'Peak WECIB legend status. The pull everybody talks about.' },
    ],
  },
  {
    name: 'RT2 Case',
    price: 24,
    image: 'Images/rt2Crate.png',
    flavor: 'More focused event cards and higher-end pulls from the deeper lore pool.',
    items: [
      { name: 'Lunch Table Alliance', rarity: 'freshman', attack: 41, defense: 39, description: 'Temporary treaty. Permanent screenshot material.' },
      { name: 'Club Rush Flyer Wall', rarity: 'freshman', attack: 46, defense: 33, description: 'Too many posters, not enough wall space.' },
      { name: 'Iconic Place Roll Call', rarity: 'sophomore', attack: 63, defense: 55, description: 'A fast tour of the places every WECIB player should know.' },
      { name: 'After-School Atrium Crowd', rarity: 'sophomore', attack: 68, defense: 59, description: 'Nobody is leaving, everyone has a story.' },
      { name: 'Parking Lot Plot Twist', rarity: 'junior', attack: 83, defense: 77, description: 'A routine dismissal interrupted by avoidable nonsense.' },
      { name: 'Spirit Week Sweep', rarity: 'junior', attack: 87, defense: 79, description: 'A coordinated effort with surprising commitment.' },
      { name: 'Iconic Event Archive', rarity: 'senior', attack: 104, defense: 92, description: 'A binder full of proof that the lore is real.' },
      { name: 'Late Bell Legend', rarity: 'senior', attack: 112, defense: 96, description: 'An all-timer excuse card with elite survivability.' },
      { name: 'Picture Day Uprising', rarity: 'superSenior', attack: 136, defense: 121, description: 'The day the hallway became a full production set.' },
    ],
  },
  {
    name: 'RT1 Case',
    price: 40,
    image: 'Images/rt1Crate.png',
    flavor: 'Premium pulls with stacked senior odds and the most replayed WECIB moments.',
    items: [
      { name: 'Morning Announcement Misfire', rarity: 'freshman', attack: 48, defense: 40, description: 'A small glitch that bought itself a lot of attention.' },
      { name: 'Building Tour Speedrun', rarity: 'sophomore', attack: 69, defense: 58, description: 'Every hall, every shortcut, zero time to explain any of it.' },
      { name: 'Iconic Places Deluxe', rarity: 'junior', attack: 89, defense: 82, description: 'The upgraded location card for players chasing stronger boards.' },
      { name: 'Hallway Crowd Control', rarity: 'junior', attack: 92, defense: 84, description: 'A defensive card born from absolute chaos.' },
      { name: 'Building Lore Compendium', rarity: 'senior', attack: 115, defense: 102, description: 'All the context, all the references, none of the filler.' },
      { name: 'Iconic Events Marathon', rarity: 'senior', attack: 120, defense: 108, description: 'A greatest-hits card with heavy staying power.' },
      { name: 'Vending Machine Incident of 24', rarity: 'superSenior', attack: 140, defense: 128, description: 'The defining chase card of Sprint 1.' },
    ],
  },
];

let selectedCase = null;
let isSpinning = false;

const balanceEl = document.getElementById('balance');
const inventoryCountEl = document.getElementById('inventoryCount');
const incomeRateEl = document.getElementById('incomeRate');
const casesEl = document.getElementById('cases');
const openerSection = document.getElementById('openerSection');
const selectedNameEl = document.getElementById('selectedCaseName');
const selectedFlavorEl = document.getElementById('selectedCaseFlavor');
const selectedPriceEl = document.getElementById('selectedCasePrice');
const dropRatesEl = document.getElementById('dropRates');
const statusMessageEl = document.getElementById('statusMessage');
const rouletteStrip = document.getElementById('rouletteStrip');
const openBtn = document.getElementById('openBtn');
const backBtn = document.getElementById('backBtn');
const wonItemEl = document.getElementById('wonItem');
const wonItemCard = document.getElementById('wonItemCard');

function normalizeRarity(rarity) {
  return rarity in RARITIES ? rarity : 'freshman';
}

function enrichCard(card) {
  const rarityKey = normalizeRarity(card.rarityKey || card.rarity);

  return {
    ...card,
    rarityKey,
    rarity: card.rarity || rarityKey,
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

function setStatus(message) {
  statusMessageEl.textContent = message;
}

function getRarityRank(rarityKey) {
  return RARITY_ORDER.indexOf(rarityKey);
}

function renderCardMarkup(card, options = {}) {
  const safeCard = enrichCard(card);
  const compactClass = options.compact ? ' compact' : '';

  return `
    <article class="display-card rarity-${safeCard.rarityKey}${compactClass}">
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

function renderRouletteItemMarkup(card) {
  const safeCard = enrichCard(card);

  return `
    <div class="item-icon" aria-hidden="true">${initialsFromName(safeCard.name)}</div>
    <div class="item-name">${safeCard.name}</div>
  `;
}

function renderWonItemMarkup(card) {
  const safeCard = enrichCard(card);

  return `
    <div class="won-rarity">${safeCard.rarityLabel}</div>
    <div class="item-icon item-icon-large" aria-hidden="true">${initialsFromName(safeCard.name)}</div>
    <div class="item-name won-item-name">${safeCard.name}</div>
    <div class="won-item-meta">${safeCard.caseName}</div>
    <div class="won-item-stats">ATK ${safeCard.attack} | DEF ${safeCard.defense}</div>
    <p class="won-item-description">${safeCard.description || 'No description yet.'}</p>
  `;
}

function getWeightedPool(caseData) {
  const rarityCounts = {};

  caseData.items.forEach((item) => {
    const rarityKey = normalizeRarity(item.rarity);
    rarityCounts[rarityKey] = (rarityCounts[rarityKey] || 0) + 1;
  });

  return caseData.items.map((item) => {
    const rarityKey = normalizeRarity(item.rarity);
    return {
      item: enrichCard(item),
      weight: RARITIES[rarityKey].weight / rarityCounts[rarityKey],
    };
  });
}

function pickItem(caseData) {
  const pool = getWeightedPool(caseData);
  const totalWeight = pool.reduce((sum, entry) => sum + entry.weight, 0);
  let roll = Math.random() * totalWeight;

  for (const entry of pool) {
    roll -= entry.weight;
    if (roll <= 0) {
      return entry.item;
    }
  }

  return pool[pool.length - 1].item;
}

function getDropRateBreakdown(caseData) {
  const pool = getWeightedPool(caseData);
  const totalWeight = pool.reduce((sum, entry) => sum + entry.weight, 0);
  const rarityWeights = {};

  pool.forEach((entry) => {
    rarityWeights[entry.item.rarityKey] = (rarityWeights[entry.item.rarityKey] || 0) + entry.weight;
  });

  return Object.entries(rarityWeights)
    .map(([rarityKey, weight]) => ({
      rarityKey,
      label: RARITIES[rarityKey].label,
      chance: ((weight / totalWeight) * 100).toFixed(1),
    }))
    .sort((left, right) => getRarityRank(left.rarityKey) - getRarityRank(right.rarityKey));
}

function renderCases() {
  casesEl.innerHTML = '';

  CASES.forEach((caseData, index) => {
    const caseCard = document.createElement('button');
    caseCard.type = 'button';
    caseCard.className = 'case-card';
    caseCard.innerHTML = `
      <img class="case-icon" src="${caseData.image}" alt="${caseData.name}">
      <div class="case-card-copy">
        <h3>${caseData.name}</h3>
        <p>${caseData.flavor}</p>
      </div>
      <div class="case-card-meta">
        <span>${caseData.price} PP</span>
        <span>${caseData.items.length} cards</span>
      </div>
    `;
    caseCard.addEventListener('click', () => selectCase(index));
    casesEl.appendChild(caseCard);
  });
}

function selectCase(index) {
  selectedCase = CASES[index];
  openerSection.hidden = false;
  selectedNameEl.textContent = selectedCase.name;
  selectedFlavorEl.textContent = selectedCase.flavor;
  selectedPriceEl.textContent = formatPP(selectedCase.price);
  wonItemEl.hidden = true;
  rouletteStrip.innerHTML = '';
  rouletteStrip.style.transform = 'translateX(0)';

  dropRatesEl.innerHTML = getDropRateBreakdown(selectedCase)
    .map((entry) => `<span class="drop-pill rarity-${entry.rarityKey}">${entry.label}: ${entry.chance}%</span>`)
    .join('');

  setStatus(`Selected ${selectedCase.name}. Cost: ${formatPP(selectedCase.price)} PP.`);
  openerSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function buildStrip(winItem) {
  const itemWidth = 140;
  const totalItems = 70;
  const winIndex = 55;

  rouletteStrip.innerHTML = '';
  rouletteStrip.classList.remove('spinning');
  rouletteStrip.style.transitionProperty = 'none';
  rouletteStrip.style.transform = 'translateX(0)';

  for (let index = 0; index < totalItems; index += 1) {
    const item = index === winIndex ? winItem : pickItem(selectedCase);
    const entry = document.createElement('div');
    entry.className = `roulette-item rarity-${item.rarityKey}`;
    entry.innerHTML = renderRouletteItemMarkup(item);
    rouletteStrip.appendChild(entry);
  }

  return { itemWidth, winIndex };
}

function updateDashboard() {
  const inventory = getInventory();
  balanceEl.textContent = formatPP(getBalance());
  inventoryCountEl.textContent = String(inventory.length);
  incomeRateEl.textContent = formatPP(getPassiveIncomePerHour());
}

function showWonItem(card) {
  wonItemEl.hidden = false;
  wonItemCard.className = `won-item-card rarity-${card.rarityKey}`;
  wonItemCard.innerHTML = renderWonItemMarkup(card);
}

function openSelectedCase() {
  if (isSpinning || !selectedCase) {
    return;
  }

  if (!spendPP(selectedCase.price)) {
    setStatus(`Not enough PPs for ${selectedCase.name}. Keep farming passive income or open a cheaper case.`);
    return;
  }

  isSpinning = true;
  openBtn.disabled = true;
  wonItemEl.hidden = true;
  updateDashboard();

  const winItem = enrichCard({ ...pickItem(selectedCase), caseName: selectedCase.name });
  addCardToInventory(winItem);
  const { itemWidth, winIndex } = buildStrip(winItem);
  const containerWidth = document.querySelector('.roulette-container').offsetWidth;
  const centerOffset = containerWidth / 2 - itemWidth / 2;
  const nudge = (Math.random() - 0.5) * (itemWidth * 0.6);
  const targetX = -(winIndex * itemWidth) + centerOffset + nudge;
  const duration = 5000 + Math.random() * 1500;

  void rouletteStrip.offsetHeight;
  rouletteStrip.classList.add('spinning');
  rouletteStrip.style.transitionProperty = 'transform';
  rouletteStrip.style.transitionDuration = `${duration}ms`;
  rouletteStrip.style.transitionTimingFunction = 'cubic-bezier(0.15, 0.8, 0.3, 1)';
  rouletteStrip.style.transform = `translateX(${targetX}px)`;
  setStatus(`Opening ${selectedCase.name}...`);

  window.setTimeout(() => {
    isSpinning = false;
    openBtn.disabled = false;
    rouletteStrip.classList.remove('spinning');
    updateDashboard();
    showWonItem(winItem);
    setStatus(`You pulled ${winItem.name} (${winItem.rarityLabel}).`);
  }, duration + 120);
}

openBtn.addEventListener('click', openSelectedCase);

backBtn.addEventListener('click', () => {
  if (isSpinning) {
    return;
  }

  selectedCase = null;
  openerSection.hidden = true;
  wonItemEl.hidden = true;
  rouletteStrip.innerHTML = '';
  setStatus('Pick a case to start opening.');
});

renderCases();
updateDashboard();
window.setInterval(updateDashboard, 1000);
