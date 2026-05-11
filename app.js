const menuData = [
  {
    category: "🍺 Drinks & Beverages",
    items: [
      { name: "Tomato Juice", price: 35, icon: "🍅" },
      { name: "Almond Milk", price: 45, icon: "🥛" },
      { name: "Beer", price: 50, icon: "🍺" },
      { name: "Irish Coffee", price: 60, icon: "☕" },
      { name: "Pigeon Milk", price: 50, icon: "🥛" },
      { name: "Rum", price: 70, icon: "🥃" },
      { name: "Sprunk", price: 100, icon: "🥤" },
      { name: "Cider", price: 80, icon: "🍺" },
      { name: "Guinness", price: 90, icon: "🍺" },
      { name: "Vodka", price: 100, icon: "🥃" },
      { name: "Pina Colada", price: 130, icon: "🥥" },
      { name: "Bloody Mary", price: 125, icon: "🍅" },
      { name: "Margarita", price: 120, icon: "🍹" },
      { name: "Tequila", price: 70, icon: "🥃" },
      { name: "Green Cow", price: 80, icon: "🔋" },
      { name: "Salty Pigeon", price: 95, icon: "🐦" },
      { name: "Whiskey", price: 110, icon: "🥃" },
      { name: "Absinthe", price: 120, icon: "🍸" },
      { name: "Jameson", price: 120, icon: "🍾" },
      { name: "Whiskey Sour", price: 125, icon: "🥃" },
      { name: "Red Wine", price: 150, icon: "🍷" },
      { name: "Old Fashioned", price: 165, icon: "🥃" },
      { name: "Rainbow Rush", price: 210, icon: "🌈" },
      { name: "Virgin Mojito", price: 215, icon: "🌿" },
      { name: "Mojito", price: 220, icon: "🍸" },
      { name: "Shirley Temple", price: 240, icon: "🍒" }
    ]
  },
  {
    category: "🍔 Cooked Food",
    items: [
      { name: "Hot Dog", price: 30, icon: "🌭" },
      { name: "Ham Sandwich", price: 30, icon: "🥪" },
      { name: "Nachos", price: 60, icon: "🌮" }
    ]
  },
  {
    category: "🥜 Chakna",
    items: [
      { name: "Chips", price: 20, icon: "🥔" },
      { name: "Lime", price: 12, icon: "🍋" },
      { name: "Salted Peanuts", price: 20, icon: "🥜" },
      { name: "Olive", price: 20, icon: "🫒" },
      { name: "S'mores", price: 20, icon: "🍢" },
      { name: "Skittles", price: 20, icon: "🍬" }
    ]
  },
  {
    category: "📦 Combo Meals",
    items: [
      { name: "Halka Pinik", price: 350, icon: "🥡" },
      { name: "Broken Meal", price: 550, icon: "🍱" },
      { name: "Special Dizz", price: 750, icon: "🍽️" },
      { name: "Party Monster", price: 999, icon: "🎉" }
    ]
  }
];

const recipes = [
  { name: "Mojito", ingredients: ["1x Mint Leaves", "1x Sprunk", "1x Lime", "1x Rum", "1x Sugar"] },
  { name: "Margarita", ingredients: ["1x Orange", "1x Sugar", "1x Tequila", "2x Lime"] },
  { name: "Virgin Mojito", ingredients: ["1x Mint Leaves", "1x Sugar", "1x Sprunk", "2x Lime"] },
  { name: "Bloody Mary", ingredients: ["1x Vodka", "1x Salt", "1x Chili", "1x Lemon", "1x Tomato Juice"] },
  { name: "Whiskey Sour", ingredients: ["1x Eggs", "1x Whiskey", "1x Lemon", "1x Sugar"] },
  { name: "Old Fashioned", ingredients: ["1x Angostura Bitters", "1x Whiskey", "1x Orange", "1x Sugar"] },
  { name: "Pina Colada", ingredients: ["1x Rum", "1x Coconut", "1x Pineapple"] },
  { name: "Rainbow Rush", ingredients: ["1x Skittles", "1x Vodka", "1x Sprunk"] },
  { name: "Salty Pigeon", ingredients: ["1x Cocoa Powder", "1x Pigeon Milk", "1x Vodka", "1x Salt"] },
  { name: "Shirley Temple", ingredients: ["1x Grenadine", "1x Sprunk", "1x Cherry"] }
];

const meals = [
  { name: "🍷 Halka Pinik ($350)", ingredients: ["2x Margarita", "2x Nachos", "2x Hot Dog"] },
  { name: "💔 Broken Meal ($550)", ingredients: ["2x Jameson", "2x Vodka", "2x Ham Sandwich", "2x Chips"] },
  { name: "🌀 Special Dizz ($750)", ingredients: ["2x Whiskey Sour", "2x Rainbow Rush", "2x Mojito", "2x Ham Sandwich", "2x Hot Dog"] },
  { name: "🌟 Party Monster ($999)", ingredients: ["4x Shirley Temple", "4x Bloody Mary", "4x Absinthe", "4x Lime", "2x Ham Sandwich", "2x Hot Dog", "2x Nachos"] }
];

let orderItems = JSON.parse(localStorage.getItem('omalleyOrder')) || [];

const quickMenuContainer = document.getElementById('quickMenu');
const itemsBody = document.getElementById('itemsBody');
const subtotalEl = document.getElementById('subtotal');
const grandTotalEl = document.getElementById('grandTotal');
const discountInput = document.getElementById('discountInput');
const staffInput = document.getElementById('staffInput');

function init() {
  renderMenu();
  renderRecipes();
  renderMeals();
  updateOrderDisplay();

  discountInput.value = localStorage.getItem('omalleyDiscount') || 0;

  discountInput.addEventListener('input', () => {
    localStorage.setItem('omalleyDiscount', discountInput.value);
    calculateTotals();
  });

  document.getElementById('clearBtn').addEventListener('click', clearOrder);
  document.getElementById('copyBtn').addEventListener('click', copyReceipt);

  const addCustomBtn = document.getElementById('addCustomBtn');
  if (addCustomBtn) {
    addCustomBtn.addEventListener('click', () => {
      const name = prompt("Enter item name:");
      if (!name) return;
      const price = prompt("Enter item price:");
      if (!price || isNaN(parseFloat(price))) return alert("Invalid price!");
      addItem({ name: name.trim(), price: parseFloat(price), icon: "🏷️" });
    });
  }

  const modal = document.getElementById('recipesModal');
  const mealsModal = document.getElementById('mealsModal');

  document.getElementById('recipesBtn').addEventListener('click', () => {
    modal.classList.add('active');
  });

  document.getElementById('mealsBtn').addEventListener('click', () => {
    mealsModal.classList.add('active');
  });

  document.querySelector('.close-modal').addEventListener('click', () => {
    modal.classList.remove('active');
  });

  document.querySelector('.close-modal-meals').addEventListener('click', () => {
    mealsModal.classList.remove('active');
  });

  window.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('active');
    if (e.target === mealsModal) mealsModal.classList.remove('active');
  });

  // Duty button
  const dutyBtn = document.getElementById('dutyBtn');
  if (dutyBtn) dutyBtn.addEventListener('click', toggleDuty);

  // Staff select
  populateStaffSelect();
  const addStaffBtn = document.getElementById('addStaffBtn');
  if (addStaffBtn) addStaffBtn.addEventListener('click', addStaff);
  staffInput.addEventListener('change', updateDutyStats);

  // Restore duty state if was on duty when page closed
  initDuty();
}

function renderMenu() {
  quickMenuContainer.innerHTML = "";

  menuData.forEach(group => {
    const groupDiv = document.createElement('div');
    groupDiv.className = 'qm-group';

    const title = document.createElement('h3');
    title.textContent = group.category;

    const chipList = document.createElement('div');
    chipList.className = 'chip-list';

    group.items.forEach(item => {
      const btn = document.createElement('button');
      btn.className = 'chip';
      btn.dataset.itemName = item.name;

      btn.innerHTML = `
        <span class="chip-name">${item.icon} ${item.name}</span>
        <span class="chip-price">$${item.price}</span>
      `;

      btn.addEventListener('click', () => addItem(item));
      chipList.appendChild(btn);
    });

    groupDiv.appendChild(title);
    groupDiv.appendChild(chipList);
    quickMenuContainer.appendChild(groupDiv);
  });
}

function renderRecipes() {
  const container = document.getElementById('recipesList');
  container.innerHTML = '';

  recipes.forEach(recipe => {
    const card = document.createElement('div');
    card.className = 'recipe-card';

    const title = document.createElement('h4');
    title.textContent = recipe.name;

    const list = document.createElement('ul');

    recipe.ingredients.forEach(ing => {
      const li = document.createElement('li');
      li.innerHTML = `🔸 ${ing}`;
      list.appendChild(li);
    });

    card.appendChild(title);
    card.appendChild(list);
    container.appendChild(card);
  });
}

function renderMeals() {
  const container = document.getElementById('mealsList');
  if (!container) return;
  container.innerHTML = '';

  meals.forEach(meal => {
    const card = document.createElement('div');
    card.className = 'recipe-card';

    const title = document.createElement('h4');
    title.textContent = meal.name;

    const list = document.createElement('ul');

    meal.ingredients.forEach(ing => {
      const li = document.createElement('li');
      li.innerHTML = `🔸 ${ing}`;
      list.appendChild(li);
    });

    card.appendChild(title);
    card.appendChild(list);
    container.appendChild(card);
  });
}

function addItem(item) {
  const existing = orderItems.find(i => i.name === item.name);
  if (existing) existing.qty++;
  else orderItems.push({ ...item, qty: 1 });

  saveAndRender();
}

function removeItem(index) {
  orderItems.splice(index, 1);
  saveAndRender();
}

function updateQty(index, qty) {
  if (qty < 1) return;
  orderItems[index].qty = qty;
  saveAndRender();
}

function saveAndRender() {
  localStorage.setItem('omalleyOrder', JSON.stringify(orderItems));
  updateOrderDisplay();
}

function updateOrderDisplay() {
  itemsBody.innerHTML = '';

  if (!orderItems.length) {
    itemsBody.innerHTML = `<tr><td colspan="5">No items yet.</td></tr>`;
    calculateTotals();
    updateMenuHighlight();
    return;
  }

  orderItems.forEach((item, index) => {
    const tr = document.createElement('tr');
    const total = item.price * item.qty;

    tr.innerHTML = `
      <td>${item.icon} ${item.name}</td>
      <td>$${item.price}</td>
      <td>
        <input type="number" min="1" value="${item.qty}" onchange="updateQty(${index}, parseInt(this.value))">
      </td>
      <td>$${total}</td>
      <td><button onclick="removeItem(${index})">&times;</button></td>
    `;

    itemsBody.appendChild(tr);
  });

  calculateTotals();
  updateMenuHighlight();
}

function updateMenuHighlight() {
  const chips = document.querySelectorAll('.chip');
  chips.forEach(chip => {
    const itemName = chip.dataset.itemName;
    const inCart = orderItems.some(i => i.name === itemName);
    if (inCart) {
      chip.classList.add('in-cart');
    } else {
      chip.classList.remove('in-cart');
    }
  });
}

function calculateTotals() {
  const subtotal = orderItems.reduce((a, b) => a + b.price * b.qty, 0);
  const discount = parseFloat(discountInput.value) || 0;
  const total = subtotal - subtotal * (discount / 100);

  subtotalEl.textContent = `$${subtotal}`;
  grandTotalEl.textContent = `$${Math.max(0, total)}`;
}

function clearOrder() {
  orderItems = [];
  localStorage.removeItem('omalleyOrder');
  saveAndRender();
}

function copyReceipt() {
  if (!orderItems.length) return alert("Order is empty!");
  
  const staffName = staffInput.value.trim();
  if (!staffName) return alert("Please enter the staff name before copying and sending!");

  const subtotal = orderItems.reduce((a, b) => a + b.price * b.qty, 0);
  const discount = parseFloat(discountInput.value) || 0;
  const total = subtotal - subtotal * (discount / 100);

  let itemsText = orderItems.map(i =>
    `${i.qty}x ${i.name} - $${i.price * i.qty}`
  ).join("\n");

  const currentDate = new Date().toLocaleDateString();
  const receiptText = ` O'MALLEY'S IRISH PUB \n---------------------------\nDate: ${currentDate}\n---------------------------\n${itemsText}\n---------------------------\nSubtotal: $${subtotal}\n${discount > 0 ? `Discount: ${discount}%\n` : ''}Total: $${total}\n---------------------------\nSláinte! Thank you for visiting!`;

  navigator.clipboard.writeText(receiptText).then(() => {
    sendToDiscord();
  }).catch(() => {
    sendToDiscord();
  });
}

function sendToDiscord() {
  if (!orderItems.length) return alert("Order is empty!");

  const staffName = staffInput.value.trim();
  if (!staffName) return alert("Please enter the staff name before sending to Discord!");

  const webhookURL = "https://discord.com/api/webhooks/1500113973897592996/b6e1tH5cL_9_rnT1PBh08MrevC8-S0KEVwuVAyvaAUmwlgTrBGuinwkpoAlDdNpuDSM0";

  const subtotal = orderItems.reduce((a, b) => a + b.price * b.qty, 0);
  const discount = parseFloat(discountInput.value) || 0;
  const total = subtotal - subtotal * (discount / 100);

  let itemsText = orderItems.map(i =>
    `${i.qty}x ${i.name} — $${i.price * i.qty}`
  ).join("\n");

  const payload = {
    content: "🍀🧾 **Sales History** 🍻",
    username: `${staffName} | O'Malley POS`,
    avatar_url: "https://i.postimg.cc/XJV5W8dx/Picsart-26-04-28-23-05-58-620.jpg",
    embeds: [
      {
        title: "🍻 Order Summary",
        color: 3066993,
        fields: [
          { name: "👨‍🍳 Staff", value: staffName, inline: true },
          { name: "🛒 Items", value: itemsText },
          { name: "💵 Subtotal", value: `$${subtotal}`, inline: true },
          { name: "🏷️ Discount", value: `${discount}%`, inline: true },
          { name: "💰 Total", value: `$${total}`, inline: true }
        ],
        footer: { text: new Date().toLocaleString() }
      }
    ]
  };

  fetch(webhookURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
    .then(() => {
      const copyBtn = document.getElementById('copyBtn');
      if (copyBtn) {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✅ Copied & Sent!';
        copyBtn.style.background = 'linear-gradient(180deg, #27ae60, #229954)';
        setTimeout(() => {
          copyBtn.textContent = originalText;
          copyBtn.style.background = '';
        }, 1600);
      }
      clearOrder();
    })
    .catch(() => alert("Receipt copied, but failed to send to Discord."));
}

window.updateQty = updateQty;
window.removeItem = removeItem;

// ──────────────────────────────────────────────
// STAFF MANAGEMENT
// ──────────────────────────────────────────────
const LS_STAFF_LIST = 'omalley_staff_list';

function getStaffList() {
  return JSON.parse(localStorage.getItem(LS_STAFF_LIST) || '[]');
}

function saveStaffList(list) {
  localStorage.setItem(LS_STAFF_LIST, JSON.stringify(list));
}

function populateStaffSelect() {
  const sel = document.getElementById('staffInput');
  if (!sel) return;
  const prev = sel.value;
  sel.innerHTML = '<option value="">\u2014 Select Staff \u2014</option>';
  getStaffList().forEach(name => {
    const opt = document.createElement('option');
    opt.value = opt.textContent = name;
    sel.appendChild(opt);
  });
  const active = localStorage.getItem('omalley_duty_active_staff') || '';
  sel.value = prev || active || '';
}

function addStaff() {
  const name = prompt('Enter new staff member name:');
  if (!name || !name.trim()) return;
  const trimmed = name.trim();
  const list = getStaffList();
  if (list.map(n => n.toLowerCase()).includes(trimmed.toLowerCase())) {
    return alert(`"${trimmed}" is already in the roster.`);
  }
  list.push(trimmed);
  saveStaffList(list);
  populateStaffSelect();
  document.getElementById('staffInput').value = trimmed;
  // Announce on Discord
  fetch(DUTY_WEBHOOK, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: "O'Malley's | Staff Manager",
      avatar_url: "https://i.postimg.cc/XJV5W8dx/Picsart-26-04-28-23-05-58-620.jpg",
      embeds: [{
        title: '\u{1F464} New Staff Member Added',
        description: `**${trimmed}** has been added to the O'Malley's roster and can now clock in.`,
        color: 0xD4AF37,
        footer: { text: "O'Malley's Irish Pub \u2022 Staff Manager" },
        timestamp: new Date().toISOString()
      }]
    })
  }).catch(() => {});
}

// ──────────────────────────────────────────────
// DUTY TRACKING
// ──────────────────────────────────────────────
const DUTY_WEBHOOK = "https://discord.com/api/webhooks/1500565532674621522/TKZUOuC23Zgwjera0eJkgpJSQaUuQpRh_WZ60ih-R8Pgjdr_dM5jNuCQCybd5BZflOHn";

const LS_DUTY_ACTIVE       = 'omalley_duty_active';
const LS_DUTY_ACTIVE_STAFF = 'omalley_duty_active_staff';
const LS_DUTY_START        = 'omalley_duty_start';
const LS_DUTY_SESSION      = 'omalley_duty_session';
const LS_DUTY_WEEK         = 'omalley_duty_week';
const LS_DUTY_LIFETIME     = 'omalley_duty_lifetime';
const LS_DUTY_WEEK_KEY     = 'omalley_duty_week_key';

let dutyInterval = null;

function sKey(base, name) {
  return `${base}__${name.replace(/\s+/g, '_').toLowerCase()}`;
}

function getWeekKey() {
  const now = new Date();
  const jan1 = new Date(now.getFullYear(), 0, 1);
  const week = Math.ceil((((now - jan1) / 86400000) + jan1.getDay() + 1) / 7);
  return `${now.getFullYear()}-W${String(week).padStart(2, '0')}`;
}

function fmtSec(s) {
  s = Math.floor(s);
  return `${Math.floor(s/3600)}h ${Math.floor((s%3600)/60)}m ${s%60}s`;
}

function fmtSecLong(s) {
  s = Math.floor(s);
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
  const p = [];
  if (h) p.push(`${h} hour${h !== 1 ? 's' : ''}`);
  if (m) p.push(`${m} minute${m !== 1 ? 's' : ''}`);
  p.push(`${sec} second${sec !== 1 ? 's' : ''}`);
  return p.join(', ');
}

function getDutyState() {
  return {
    active:      localStorage.getItem(LS_DUTY_ACTIVE) === 'true',
    activeStaff: localStorage.getItem(LS_DUTY_ACTIVE_STAFF) || '',
    start:       parseInt(localStorage.getItem(LS_DUTY_START) || '0'),
  };
}

function getStaffTimes(name) {
  const wk = getWeekKey();
  if ((localStorage.getItem(sKey(LS_DUTY_WEEK_KEY, name)) || '') !== wk) {
    localStorage.setItem(sKey(LS_DUTY_WEEK_KEY, name), wk);
    localStorage.setItem(sKey(LS_DUTY_WEEK, name), '0');
  }
  return {
    session:  parseFloat(localStorage.getItem(sKey(LS_DUTY_SESSION,  name)) || '0'),
    week:     parseFloat(localStorage.getItem(sKey(LS_DUTY_WEEK,     name)) || '0'),
    lifetime: parseFloat(localStorage.getItem(sKey(LS_DUTY_LIFETIME, name)) || '0'),
  };
}

function saveStaffTimes(name, session, week, lifetime) {
  localStorage.setItem(sKey(LS_DUTY_SESSION,  name), session.toString());
  localStorage.setItem(sKey(LS_DUTY_WEEK,     name), week.toString());
  localStorage.setItem(sKey(LS_DUTY_LIFETIME, name), lifetime.toString());
}

function initDuty() {
  const state = getDutyState();
  updateDutyUI(state.active);
  if (state.active && state.activeStaff) {
    const sel = document.getElementById('staffInput');
    if (sel) sel.value = state.activeStaff;
    startDutyTick();
  }
  updateDutyStats();
}

function startDutyTick() {
  if (dutyInterval) clearInterval(dutyInterval);
  dutyInterval = setInterval(updateDutyStats, 1000);
}

function updateDutyStats() {
  const state = getDutyState();
  const selectedName = staffInput.value.trim();
  const who = selectedName || state.activeStaff; // Show selected, fallback to active
  
  let sess = 0, wk = 0, life = 0;
  if (who) {
    const t = getStaffTimes(who);
    // If the person we are LOOKING at is the one ON DUTY, add live elapsed time
    const elapsed = (state.active && state.activeStaff === who) ? (Date.now() - state.start) / 1000 : 0;
    sess = t.session  + elapsed;
    wk   = t.week     + elapsed;
    life = t.lifetime + elapsed;
  }

  // Update header badge (only for the person actually on duty)
  const timerEl = document.getElementById('dutyTimerDisplay');
  if (timerEl) {
    if (state.active && state.activeStaff) {
      const activeT = getStaffTimes(state.activeStaff);
      const activeElapsed = (Date.now() - state.start) / 1000;
      timerEl.textContent = `\u23F1 ${fmtSec(activeT.session + activeElapsed)}`;
    } else {
      timerEl.textContent = '';
    }
  }

  const el = id => document.getElementById(id);
  if (el('statSession'))  el('statSession').textContent  = fmtSec(sess);
  if (el('statWeek'))     el('statWeek').textContent     = fmtSec(wk);
  if (el('statLifetime')) el('statLifetime').textContent = fmtSec(life);
}

function updateDutyUI(isOn) {
  const btn = document.getElementById('dutyBtn');
  if (!btn) return;
  btn.textContent = isOn ? '\uD83D\uDFE2 On Duty' : '\uD83D\uDD52 On Duty';
  btn.classList.toggle('duty-active', isOn);
}

function toggleDuty() {
  const state = getDutyState();
  const name = staffInput.value.trim();
  if (!name) return alert('Please select a staff member first!');

  if (!state.active) {
    // ── CLOCK IN ──
    const t = getStaffTimes(name);
    // Reset session for a fresh start
    saveStaffTimes(name, 0, t.week, t.lifetime);
    
    localStorage.setItem(LS_DUTY_ACTIVE, 'true');
    localStorage.setItem(LS_DUTY_ACTIVE_STAFF, name);
    localStorage.setItem(LS_DUTY_START, Date.now().toString());
    
    updateDutyUI(true);
    startDutyTick();
    sendDutyMessage('ON', name, 0, t.week, t.lifetime);
  } else {
    if (state.activeStaff !== name) {
      return alert(`${state.activeStaff} is currently on duty. Ask them to clock out first.`);
    }
    // ── CLOCK OUT ──
    const elapsed = (Date.now() - state.start) / 1000;
    const t = getStaffTimes(name);
    const newSess = t.session + elapsed;
    const newWk   = t.week    + elapsed;
    const newLife = t.lifetime + elapsed;
    
    saveStaffTimes(name, newSess, newWk, newLife);
    
    localStorage.setItem(LS_DUTY_ACTIVE, 'false');
    localStorage.removeItem(LS_DUTY_ACTIVE_STAFF);
    localStorage.removeItem(LS_DUTY_START);
    
    if (dutyInterval) { clearInterval(dutyInterval); dutyInterval = null; }
    updateDutyUI(false);
    updateDutyStats();
    sendDutyMessage('OFF', name, newSess, newWk, newLife);
  }
}

function sendDutyMessage(type, name, sess, wk, life) {
  const isOn  = type === 'ON';
  const color = isOn ? 0x2ECC71 : 0xE74C3C;
  const emoji = isOn ? '\uD83D\uDFE2' : '\uD83D\uDD34';
  const now   = new Date().toLocaleString();

  const fields = isOn ? [
    { name: '\u23F1 Clocked In At',   value: now,              inline: false },
    { name: '\uD83D\uDCC5 This Week So Far',    value: fmtSecLong(wk),   inline: true },
    { name: '\uD83C\uDF10 Lifetime Total',        value: fmtSecLong(life), inline: true },
  ] : [
    { name: '\u23F1 Clocked Out At',  value: now,              inline: false },
    { name: '\u23F3 Shift Duration',  value: `**${fmtSecLong(sess)}**`, inline: false },
    { name: '\uD83D\uDCC5 Total This Week',    value: fmtSecLong(wk),   inline: true },
    { name: '\uD83C\uDF10 Lifetime Total',     value: fmtSecLong(life), inline: true },
  ];

  fetch(DUTY_WEBHOOK, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: `${name} | O'Malley's`,
      avatar_url: "https://i.postimg.cc/XJV5W8dx/Picsart-26-04-28-23-05-58-620.jpg",
      embeds: [{
        title: `${emoji} ${name} is now ${isOn ? 'ON DUTY' : 'OFF DUTY'}`,
        description: isOn ? `*Have a great shift at O'Malley's!*` : `*Shift completed. Great work today!*`,
        color,
        fields,
        footer: { text: "O'Malley's Irish Pub \u2022 Duty Tracker" },
        timestamp: new Date().toISOString()
      }]
    })
  }).catch(() => console.warn('Duty webhook failed'));
}

init();
