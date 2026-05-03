const menuData = [
  {
    category: "🍻 Drinks & Beverages",
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
    category: "🍳 Cooked Food",
    items: [
      { name: "Hot Dog", price: 30, icon: "🌭" },
      { name: "Ham Sandwich", price: 30, icon: "🥪" },
      { name: "Nachos", price: 60, icon: "🌮" }
    ]
  },
  {
    category: "🍟 Chakna",
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
    category: "🍱 Combo Meals",
    items: [
      { name: "Halka Pinik", price: 350, icon: "🍷", desc: "Margarita 2x, Nachos 2x, Hot Dog 2x" },
      { name: "Broken Meal", price: 550, icon: "💔", desc: "Jameson 2x, Vodka 2x, Ham Sandwich 2x, Chips 2x" },
      { name: "Special Dizz", price: 750, icon: "🌀", desc: "Whiskey Sour 2x, Rainbow Rush 2x, Mojito 2x, Ham Sandwich 2x, Hot Dog 2x" },
      { name: "Party Monster", price: 999, icon: "🌟", desc: "Shirley Temple 4x, Bloody Mary 4x, Absinthe 4x, Lime 4x, Ham Sandwich 2x, Hot Dog 2x, Nachos 2x" }
    ]
  }
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
  updateOrderDisplay();

  discountInput.value = localStorage.getItem('omalleyDiscount') || 0;

  discountInput.addEventListener('input', () => {
    localStorage.setItem('omalleyDiscount', discountInput.value);
    calculateTotals();
  });

  document.getElementById('clearBtn').addEventListener('click', clearOrder);
  document.getElementById('copyBtn').addEventListener('click', copyReceipt);
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

      if (item.desc) btn.title = item.desc;

      btn.innerHTML = `
        <span>${item.icon} ${item.name}</span>
        <span>$${item.price}</span>
      `;

      btn.onclick = () => addItem(item);
      chipList.appendChild(btn);
    });

    groupDiv.appendChild(title);
    groupDiv.appendChild(chipList);
    quickMenuContainer.appendChild(groupDiv);
  });
}

function addItem(item) {
  const found = orderItems.find(i => i.name === item.name);
  found ? found.qty++ : orderItems.push({ ...item, qty: 1 });
  save();
}

function save() {
  localStorage.setItem('omalleyOrder', JSON.stringify(orderItems));
  updateOrderDisplay();
}

function updateOrderDisplay() {
  itemsBody.innerHTML = "";

  if (!orderItems.length) {
    itemsBody.innerHTML = `<tr><td colspan="5">No items yet</td></tr>`;
    return calculateTotals();
  }

  orderItems.forEach((item, i) => {
    itemsBody.innerHTML += `
      <tr>
        <td>${item.icon} ${item.name}</td>
        <td>$${item.price}</td>
        <td><input type="number" value="${item.qty}" min="1" onchange="updateQty(${i}, this.value)"></td>
        <td>$${item.price * item.qty}</td>
        <td><button onclick="removeItem(${i})">❌</button></td>
      </tr>
    `;
  });

  calculateTotals();
}

function updateQty(i, q) {
  if (q < 1) return;
  orderItems[i].qty = parseInt(q);
  save();
}

function removeItem(i) {
  orderItems.splice(i, 1);
  save();
}

function calculateTotals() {
  const subtotal = orderItems.reduce((s, i) => s + i.price * i.qty, 0);
  const discount = parseFloat(discountInput.value) || 0;
  const total = subtotal - (subtotal * discount / 100);

  subtotalEl.textContent = `$${subtotal}`;
  grandTotalEl.textContent = `$${Math.max(0, total)}`;
}

function clearOrder() {
  if (!confirm("Clear order?")) return;
  orderItems = [];
  localStorage.clear();
  save();
}

function copyReceipt() {
  let text = "☘️ O'MALLEY'S PUB ☘️\n\n";

  orderItems.forEach(i => {
    text += `${i.qty}x ${i.name} - $${i.price * i.qty}\n`;
  });

  navigator.clipboard.writeText(text);
  alert("Copied!");
}

function sendToDiscord() {
  const webhookURL = "https://discord.com/api/webhooks/1500113973897592996/b6e1tH5cL_9_rnT1PBh08MrevC8-S0KEVwuVAyvaAUmwlgTrBGuinwkpoAlDdNpuDSM0";

  const subtotal = orderItems.reduce((s, i) => s + i.price * i.qty, 0);
  const discount = parseFloat(discountInput.value) || 0;
  const total = subtotal - subtotal * discount / 100;

  const payload = {
    username: "O'Malley POS",
    avatar_url: "https://i.postimg.cc/XJV5W8dx/Picsart-26-04-28-23-05-58-620.jpg",
    content: "🍀 NEW ORDER 🍻",
    embeds: [{
      title: "🧾 Order Summary",
      color: 3066993,
      description: orderItems.map(i => `🍽️ ${i.qty}x ${i.name} - $${i.price * i.qty}`).join("\n"),
      fields: [
        { name: "👨‍🍳 Staff", value: staffInput.value || "Unknown", inline: true },
        { name: "💰 Total", value: `$${total}`, inline: true }
      ]
    }]
  };

  fetch(webhookURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  alert("Sent!");
}

window.updateQty = updateQty;
window.removeItem = removeItem;

init();