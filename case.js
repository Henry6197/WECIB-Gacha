import { cards } from "./Data/cards.js";
import { CASES, RARITIES } from "./Data/cases.js";
// ─── Skin Data ───────────────────────────────────────────────

const RARITIES = {
  common: { label: 'Freshman', color: '#dee4ff', weight: 65 },
  uncommon: { label: 'Sophomore', color: '#8fff74', weight: 25 },
  rare: { label: 'Junior', color: '#4781ff', weight: 8 },
  epic: { label: 'Senior', color: '#922ce6', weight: 1.8 },
  secret: { label: '★ Super Senior ★', color: '#ffd700', weight: 0.2 },
};

const RARITY_ORDER = ['common', 'uncommon', 'rare', 'epic', 'secret'];

const RARITY_ALIASES = {
  consumer: 'common',
  industrial: 'uncommon',
  milspec: 'rare',
  restricted: 'epic',
  classified: 'epic',
  covert: 'epic',
  gold: 'secret',
};

function normalizeRarity(rarity) {
  return RARITY_ALIASES[rarity] || rarity;
}

// ─── Item Processing ─────────────────────────────────────────

function applyFloat(baseItem) {
  return {
    ...baseItem,
    rarityKey: normalizeRarity(baseItem.rarity),
  };
}

const S = 'https://community.akamai.steamstatic.com/economy/image/';


const CASES = [
  {
name: 'WECIB Starter Case',
    price: 1.00,
    image: S+'i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XsnXwtmkJjSU91dh8bji61XxRCKg0MSz_nUDvPb-OPFvdKTFDzbAkbp16bY5Gn6wkx9ysj7Xntf9IC6WZgA-Sswnnj45WXo',
    items: [
      { name: 'Emma Rodriguez', rarity: 'common', price: 3.50, image: 'https://randomuser.me/api/portraits/women/1.jpg' },
      { name: 'James Chen', rarity: 'uncommon', price: 8.25, image: 'https://randomuser.me/api/portraits/men/1.jpg' },
      { name: 'Sarah Williams', rarity: 'rare', price: 19.99, image: 'https://randomuser.me/api/portraits/women/2.jpg' },
      { name: 'Marcus Johnson', rarity: 'common', price: 2.75, image: 'https://randomuser.me/api/portraits/men/2.jpg' },
      { name: 'Olivia Martin', rarity: 'uncommon', price: 11.40, image: 'https://randomuser.me/api/portraits/women/3.jpg' },
      { name: 'David Anderson', rarity: 'rare', price: 25.30, image: 'https://randomuser.me/api/portraits/men/3.jpg' },
      { name: 'Isabella Davis', rarity: 'epic', price: 42.50, image: 'https://randomuser.me/api/portraits/women/4.jpg' },
      { name: 'Lucas Brown', rarity: 'common', price: 1.99, image: 'https://randomuser.me/api/portraits/men/4.jpg' },
      { name: 'Sophia Kumar', rarity: 'uncommon', price: 9.80, image: 'https://randomuser.me/api/portraits/women/5.jpg' },
      { name: 'Noah Taylor', rarity: 'rare', price: 18.75, image: 'https://randomuser.me/api/portraits/men/5.jpg' },
      { name: 'Ava Thompson', rarity: 'epic', price: 55.00, image: 'https://randomuser.me/api/portraits/women/6.jpg' },
      { name: 'Ethan Wilson', rarity: 'epic', price: 125.99, image: 'https://randomuser.me/api/portraits/men/6.jpg' },
      { name: 'Mia Garcia', rarity: 'common', price: 4.25, image: 'https://randomuser.me/api/portraits/women/7.jpg' },
      { name: 'Benjamin Lee', rarity: 'uncommon', price: 12.60, image: 'https://randomuser.me/api/portraits/men/7.jpg' },
      { name: 'Charlotte Moore', rarity: 'rare', price: 23.45, image: 'https://randomuser.me/api/portraits/women/8.jpg' },
      { name: 'Alexander White', rarity: 'epic', price: 48.75, image: 'https://randomuser.me/api/portraits/men/8.jpg' },
      { name: 'Amelia Harris', rarity: 'epic', price: 89.50, image: 'https://randomuser.me/api/portraits/women/9.jpg' },
      { name: 'Mason Clark', rarity: 'secret', price: 350.00, image: 'https://randomuser.me/api/portraits/men/9.jpg' },
    ]
  },
];

function playTicksDuring() {
  // Optional sound hook; kept as a no-op when no audio assets are configured.
}

    let balance = JSON.parse(localStorage.getItem('balance')) ?? 1000;
    let selectedCase = null;
    let isSpinning = false;

    function saveState() {
  localStorage.setItem('balance', JSON.stringify(balance));
}

// ─── DOM refs ─────────────────────────────────────────────────

const balanceEl       = document.getElementById('balance');
const casesEl         = document.getElementById('cases');
const openerSection   = document.getElementById('openerSection');
const selectedNameEl  = document.getElementById('selectedCaseName');
const selectedPriceEl = document.getElementById('selectedCasePrice');
const rouletteStrip   = document.getElementById('rouletteStrip');
const openBtn         = document.getElementById('openBtn');
const backBtn         = document.getElementById('backBtn');
const wonItemEl       = document.getElementById('wonItem');
const wonItemCard     = document.getElementById('wonItemCard');

// ─── Render Cases (index.html only) ───────────────────────────

if (casesEl) {
  function renderCases() {
    casesEl.innerHTML = '';
    CASES.forEach((c, idx) => {
      const card = document.createElement('div');
      card.className = 'case-card';
      card.innerHTML = `
        <img class="case-icon" src="${c.image}" alt="${c.name}">
        <div class="case-name">${c.name}</div>
        <div class="case-price">$${c.price.toFixed(2)}</div>
      `;
      card.addEventListener('click', () => selectCase(idx));
      casesEl.appendChild(card);
    });
  }

  function selectCase(idx) {
    selectedCase = CASES[idx];
    document.querySelector('.case-select').style.display = 'none';
    openerSection.style.display = 'block';
    selectedNameEl.textContent = selectedCase.name;
    selectedPriceEl.textContent = selectedCase.price.toFixed(2);
    wonItemEl.style.display = 'none';
    rouletteStrip.innerHTML = '';
    rouletteStrip.style.transform = 'translateX(0)';
  }

  backBtn.addEventListener('click', () => {
    if (isSpinning) return;
    openerSection.style.display = 'none';
    document.querySelector('.case-select').style.display = 'block';
    selectedCase = null;
  });

  renderCases();

// ─── Weighted Random Pick ─────────────────────────────────────

function pickItem(caseData) {
  // Count items per rarity so each rarity keeps its intended total weight
  const rarityCounts = {};
  caseData.items.forEach(item => {
    const rarityKey = normalizeRarity(item.rarity);
    rarityCounts[rarityKey] = (rarityCounts[rarityKey] || 0) + 1;
  });

  // Build weighted pool — split rarity weight evenly among its items
  const pool = [];
  caseData.items.forEach(item => {
    const rarityKey = normalizeRarity(item.rarity);
    const rarityDef = RARITIES[rarityKey] || RARITIES.common;
    const w = rarityDef.weight / rarityCounts[rarityKey];
    pool.push({ item, weight: w });
  });

  // Normalize: sum up all weights, pick randomly
  const totalWeight = pool.reduce((sum, p) => sum + p.weight, 0);
  let rand = Math.random() * totalWeight;
  for (const p of pool) {
    rand -= p.weight;
    if (rand <= 0) return p.item;
  }
  return pool[pool.length - 1].item;
}

// ─── Build Roulette Strip ─────────────────────────────────────

function buildStrip(winItem) {
  const ITEM_WIDTH = 140;
  const TOTAL_ITEMS = 70;
  const WIN_INDEX = 55; // where the winning item sits

  rouletteStrip.innerHTML = '';
  rouletteStrip.classList.remove('spinning');
  rouletteStrip.style.transitionProperty = 'none';
  rouletteStrip.style.transform = 'translateX(0)';

  for (let i = 0; i < TOTAL_ITEMS; i++) {
    let item;
    if (i === WIN_INDEX) {
      item = winItem;
    } else {
      item = applyFloat(pickItem(selectedCase));
    }

    const el = document.createElement('div');
    el.className = `roulette-item rarity-${item.rarityKey}`;
    if (item.rarityKey === 'secret') {
      el.innerHTML = `
        <img class="item-icon" src="gold.jpg" alt="★ Rare Special ★">
        <div class="item-name" style="color:#ffd700">★ Rare Special ★</div>
      `;
      el.dataset.goldImage = item.image;
      el.dataset.goldName = item.name;
    } else {
      el.innerHTML = `
        <img class="item-icon" src="${item.image}" alt="${item.name}">
        <div class="item-name">${item.name}</div>
      `;
    }
    rouletteStrip.appendChild(el);
  }

  return { ITEM_WIDTH, WIN_INDEX };
}

// ─── Open Case ────────────────────────────────────────────────

openBtn.addEventListener('click', () => {
  if (isSpinning || !selectedCase) return;
  if (balance < selectedCase.price) {
    alert('Not enough balance!');
    return;
  }

  isSpinning = true;
  openBtn.disabled = true;
  wonItemEl.style.display = 'none';

  balance -= selectedCase.price;
  updateBalance();

  const winItem = applyFloat(pickItem(selectedCase));
  winItem.caseName = selectedCase.name;
  const { ITEM_WIDTH, WIN_INDEX } = buildStrip(winItem);

  // Calculate offset: center the winning item under the marker
  const containerWidth = document.querySelector('.roulette-container').offsetWidth;
  const centerOffset = containerWidth / 2 - ITEM_WIDTH / 2;
  // Add a small random offset within the item so it doesn't always land dead center
  const randomNudge = (Math.random() - 0.5) * (ITEM_WIDTH * 0.6);
  const targetX = -(WIN_INDEX * ITEM_WIDTH) + centerOffset + randomNudge;

  // Spin duration
  const duration = 5000 + Math.random() * 1500;

  // Force reflow then animate
  void rouletteStrip.offsetHeight;
  rouletteStrip.classList.add('spinning');
  rouletteStrip.style.transitionProperty = 'transform';
  rouletteStrip.style.transitionDuration = `${duration}ms`;
  rouletteStrip.style.transitionTimingFunction = 'cubic-bezier(0.15, 0.8, 0.3, 1)';
  rouletteStrip.style.transform = `translateX(${targetX}px)`;

  // Play tick sounds during spin
  playTicksDuring(duration);

  setTimeout(() => {
    isSpinning = false;
    openBtn.disabled = false;
    rouletteStrip.classList.remove('spinning');

    // Reveal real gold item in roulette strip after spin
    const winEl = rouletteStrip.children[55];
    if (winItem.rarityKey === 'secret' && winEl && winEl.dataset.goldImage) {
      winEl.innerHTML = `
        <img class="item-icon" src="${winEl.dataset.goldImage}" alt="${winEl.dataset.goldName}">
        <div class="item-name">${winEl.dataset.goldName}</div>
      `;
    }

    wonItemEl.style.display = 'block';
    wonItemCard.className = `won-item-card rarity-${winItem.rarityKey}`;
    wonItemCard.innerHTML = `
      <img class="item-icon" src="${winItem.image}" alt="${winItem.name}">
      <div class="item-name" style="color:${(RARITIES[winItem.rarityKey] || RARITIES.common).color}">${winItem.name}</div>
      <div class="item-price" style="color:${(RARITIES[winItem.rarityKey] || RARITIES.common).color}">$${winItem.price.toFixed(2)}</div>
      <div style="color:#64748b;font-size:0.7rem;margin-top:2px">${(RARITIES[winItem.rarityKey] || RARITIES.common).label}</div>
    `;

    // Persist current balance after each opening
    saveState();
  }, duration + 200);
});
}
function updateBalance() {
  balanceEl.textContent = balance.toFixed(2);
  saveState();
}

updateBalance();
