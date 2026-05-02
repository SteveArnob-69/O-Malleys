const menuData = [
  {
    category: "🍺 Drinks & Beverages",
    items: [
      { name: "Tomato Juice", price: 35, icon: "🍅" },
      { name: "Almond Milk", price: 45, icon: "🥛" },
      { name: "Beer", price: 50, icon: "🍺" },
      { name: "Irish Coffee", price: 50, icon: "☕" },
      { name: "Pigeon Milk", price: 50, icon: "🥛" },
      { name: "Rum", price: 50, icon: "🥃" },
      { name: "Sprunk", price: 100, icon: "🥤" },
      { name: "Cider", price: 60, icon: "🍺" },
      { name: "Guinness", price: 60, icon: "🍺" },
      { name: "Vodka", price: 60, icon: "🥃" },
      { name: "Pina Colada", price: 65, icon: "🥥" },
      { name: "Bloody Mary", price: 70, icon: "🍅" },
      { name: "Margarita", price: 70, icon: "🍹" },
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
      { name: "Shirley Temple", price: 220, icon: "🍒" }
    ]
  },
  {
    category: "🍔 Cooked Food",
    items: [
      { name: "Fries", price: 120, icon: "🍟" },
      { name: "Shepherd's Pie", price: 120, icon: "🥧" },
      { name: "Fried Eggs", price: 60, icon: "🍳" },
      { name: "Hot Dog", price: 25, icon: "🌭" },
      { name: "Ham Sandwich", price: 25, icon: "🥪" },
      { name: "Nachos", price: 40, icon: "🌮" }
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
      { name: "Halka Pinik", price: 250, icon: "🥡" },
      { name: "Broken Meal", price: 350, icon: "🍱" },
      { name: "Special Dizz", price: 450, icon: "🍽️" },
      { name: "Chill Meal", price: 799, icon: "🧊" },
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
  { name: "🍷 Halka Pinik ($250)", ingredients: ["2x Margarita", "2x Fries"] },
  { name: "💔 Broken Meal ($350)", ingredients: ["2x Jameson", "2x Vodka", "2x Fries"] },
  { name: "🌀 Special Dizz ($450)", ingredients: ["2x Whiskey Sour", "2x Rainbow Rush", "2x Shepherd’s Pie", "2x Hot Dog"] },
  { name: "😎 Chill Meal (799)", ingredients: ["3x Fries", "3x Shepherd's Pie", "3x Fried Eggs"] },
  { name: "🌟 Party Monster ($999)", ingredients: ["4x Shirley Temple", "4x Bloody Mary", "4x Sprunk", "4x Lime", "2x Shepherd’s Pie", "2x Hot Dog", "2x Nachos"] }
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
    `🍽️ ${i.qty}x ${i.name} — $${i.price * i.qty}`
  ).join("\n");

  const receiptText = `🍻 O'Malley POS 🍻\nStaff: ${staffName}\n\n${itemsText}\n\nSubtotal: $${subtotal}\nDiscount: ${discount}%\nTotal: $${total}`;

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
    `🍽️ ${i.qty}x ${i.name} — $${i.price * i.qty}`
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
      alert("Receipt copied & Sent to Discord!");
      clearOrder();
    })
    .catch(() => alert("Receipt copied, but failed to send to Discord."));
}

window.updateQty = updateQty;
window.removeItem = removeItem;

init();