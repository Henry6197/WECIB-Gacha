document.addEventListener('DOMContentLoaded', function() {
  // Navigation for index.html
  const collectionBtn = document.getElementById('collection');
  if (collectionBtn) {
    collectionBtn.addEventListener('click', function() {
      window.location.href = 'collection.html';
      console.log('Nav to collection');
    });
  }
  
  // Collection display
  displayCollectionCards();
  initCollectionControls();
});

function displayCollectionCards(searchTerm = '', sortBy = 'newest', caseFilter = '') {
  const inventory = getInventory();
  const cardBox = document.getElementById('card_box');
  if (!cardBox) return;

  let filtered = inventory.filter(card => {
    const nameMatch = card.name.toLowerCase().includes(searchTerm.toLowerCase());
    const caseMatch = !caseFilter || caseFilter === 'All' || card.caseName === caseFilter;
    return nameMatch && caseMatch;
  });

  // Sort
  const rarityOrder = { common: 0, uncommon: 1, rare: 2, epic: 3, secret: 4 };
  const caseOrder = { 'MHS Case': 0, 'RT2 Case': 1, 'RT1 Case': 2 };
  filtered.sort((a, b) => {
    switch (sortBy) {
      case 'newest': return new Date(b.wonAt) - new Date(a.wonAt);
      case 'rarity': return (rarityOrder[a.rarityKey] || 0) - (rarityOrder[b.rarityKey] || 0);
      case 'attack': return b.attack - a.attack;
      case 'defense': return b.defense - a.defense;
      case 'case': return (caseOrder[a.caseName] || 99) - (caseOrder[b.caseName] || 99);
      default: return 0;
    }
  });

  if (filtered.length === 0) {
    cardBox.innerHTML = '<p style="text-align: center; color: #666;">No cards match your search/sort. Open more cases!</p>';
    return;
  }

  cardBox.innerHTML = filtered.map(card => {
    const rarityInfo = RARITIES[card.rarityKey] || RARITIES.common;
    const date = new Date(card.wonAt).toLocaleDateString();
    return `
      <div class="collection-card rarity-${card.rarityKey}">
        <img src="${card.image}" alt="${card.name}" class="card-image">
        <div class="card-name">${card.name}</div>
        <div class="card-rarity" style="color: ${rarityInfo.color}">${rarityInfo.label}</div>
        <div class="card-price">$${card.price.toFixed(2)}</div>
        <div class="card-stats">
          <span>ATK: ${card.attack}</span>
          <span>DEF: ${card.defense}</span>
        </div>
        <div class="card-case">From: ${card.caseName}</div>
        <div class="card-date">${date}</div>
      </div>
    `;
  }).join('');
}

// Event listeners for controls
let currentCaseFilter = ''; // 'All', 'MHS Case', 'RT2 Case', 'RT1 Case'

function initCollectionControls() {
  const searchInput = document.getElementById('searchInput');
  const sortSelect = document.getElementById('sortSelect');
  const caseButtonsEl = document.getElementById('caseButtons');
  if (!searchInput || !sortSelect || !caseButtonsEl) return;

  // Render case buttons
  const cases = ['All', 'MHS Case', 'RT2 Case', 'RT1 Case'];
  caseButtonsEl.innerHTML = cases.map(name => 
    `<button class="case-btn ${name === 'All' ? 'active' : ''}" data-case="${name}">${name}</button>`
  ).join('');

  function updateDisplay() {
    displayCollectionCards(searchInput.value, sortSelect.value, currentCaseFilter);
  }

  // Event listeners
  searchInput.addEventListener('input', updateDisplay);
  sortSelect.addEventListener('change', updateDisplay);

  // Case buttons
  caseButtonsEl.addEventListener('click', (e) => {
    if (e.target.classList.contains('case-btn')) {
      document.querySelectorAll('.case-btn').forEach(btn => btn.classList.remove('active'));
      e.target.classList.add('active');
      currentCaseFilter = e.target.dataset.case;
      updateDisplay();
    }
  });
}
