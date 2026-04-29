const menuData = [
  {
    category: "🍔 Cooked Food & Snacks",
    items: [
      { name: "Fries", price: 120, icon: "🍟" },
      { name: "Shepherd's Pie", price: 120, icon: "🥧" },
      { name: "Hot Dog", price: 25, icon: "🌭" },
      { name: "Ham Sandwich", price: 25, icon: "🥪" },
      { name: "Nachos", price: 20, icon: "🌮" },
      { name: "Salted Peanuts", price: 20, icon: "🥜" }
    ]
  },
  {
    category: "🍸 Custom Drinks",
    items: [
      { name: "Mojito", price: 220, icon: "🍸" },
      { name: "Margarita", price: 60, icon: "🍹" },
      { name: "Virgin Mojito (NA)", price: 215, icon: "🌿" },
      { name: "Bloody Mary", price: 70, icon: "🍅" },
      { name: "Whiskey Sour", price: 125, icon: "🥃" },
      { name: "Old Fashioned", price: 165, icon: "🥃" },
      { name: "Pina Colada", price: 55, icon: "🥥" },
      { name: "Rainbow Rush", price: 210, icon: "🌈" },
      { name: "Salty Pigeon", price: 95, icon: "🐦" },
      { name: "Shirley Temple (NA)", price: 220, icon: "🍒" }
    ]
  },
  {
    category: "🍺 Drinks & Beverages",
    items: [
      { name: "Irish Coffee", price: 30, icon: "☕" },
      { name: "Guinness", price: 25, icon: "🍺" },
      { name: "Jameson", price: 120, icon: "🍾" },
      { name: "Whiskey", price: 110, icon: "🥃" },
      { name: "Rum", price: 50, icon: "🥃" },
      { name: "Vodka", price: 50, icon: "🥃" },
      { name: "Tequila", price: 60, icon: "🥃" },
      { name: "Absinthe", price: 120, icon: "🍸" },
      { name: "Beer", price: 20, icon: "🍺" },
      { name: "Cider", price: 40, icon: "🍺" },
      { name: "Green Apple", price: 80, icon: "🍏" },
      { name: "Red Wine", price: 40, icon: "🍷" },
      { name: "Pigeon Milk", price: 45, icon: "🥛" },
      { name: "Almond Milk", price: 45, icon: "🥛" }
    ]
  },
  {
    category: "📦 Combo Meals",
    items: [
      { name: "Small Meal", price: 250, icon: "🥡", desc: "Snack + Hot Dog + Beer/Cider/Milk" },
      { name: "Medium Meal", price: 350, icon: "🍱", desc: "Food + Snack + Rum/Vodka/Tequila" },
      { name: "Large Meal", price: 450, icon: "🍽️", desc: "Food + Food + Whiskey/Jameson + Snack" },
      { name: "Special Meal (VIP)", price: 700, icon: "👑", desc: "Premium Drink + Drink + Snack" },
      { name: "PD / EMS Meal", price: 280, icon: "🚓", desc: "Food + Snack + Beer/Rum/Vodka" }
    ]
  }
];

const recipes = [
  { name: "Mojito", ingredients: ["1x Mint Leaves", "1x Sprunk", "1x Lime", "1x Rum", "1x Sugar"] },
  { name: "Margarita", ingredients: ["1x Orange", "1x Sugar", "1x Tequila", "2x Lime"] },
  { name: "Virgin Mojito (NA)", ingredients: ["1x Mint Leaves", "1x Sugar", "1x Sprunk", "2x Lime"] },
  { name: "Bloody Mary", ingredients: ["1x Vodka", "1x Salt", "1x Chili", "1x Lemon", "1x Tomato Juice"] },
  { name: "Whiskey Sour", ingredients: ["1x Eggs", "1x Whiskey", "1x Lemon", "1x Sugar"] },
  { name: "Old Fashioned", ingredients: ["1x Angostura Bitters", "1x Whiskey", "1x Orange", "1x Sugar"] },
  { name: "Pina Colada", ingredients: ["1x Rum", "1x Coconut", "1x Pineapple"] },
  { name: "Rainbow Rush", ingredients: ["1x Skittles", "1x Vodka", "1x Sprunk"] },
  { name: "Salty Pigeon", ingredients: ["1x Cocoa Powder", "1x Pigeon Milk", "1x Vodka", "1x Salt"] },
  { name: "Shirley Temple (NA)", ingredients: ["1x Grenadine", "1x Sprunk", "1x Cherry"] }
];

let orderItems = JSON.parse(localStorage.getItem('omalleyOrder')) || [];

const quickMenuContainer = document.getElementById('quickMenu');
const itemsBody = document.getElementById('itemsBody');
const subtotalEl = document.getElementById('subtotal');
const grandTotalEl = document.getElementById('grandTotal');
const discountInput = document.getElementById('discountInput');
const customerInput = document.getElementById('customerInput');

function init() {
  renderMenu();
  renderRecipes();
  updateOrderDisplay();
  
  // Restore saved discount/customer info
  discountInput.value = localStorage.getItem('omalleyDiscount') || 0;
  customerInput.value = localStorage.getItem('omalleyCustomer') || '';

  // Event Listeners
  discountInput.addEventListener('input', () => {
    localStorage.setItem('omalleyDiscount', discountInput.value);
    calculateTotals();
  });

  customerInput.addEventListener('input', () => {
    localStorage.setItem('omalleyCustomer', customerInput.value);
  });

  document.getElementById('clearBtn').addEventListener('click', clearOrder);
  document.getElementById('copyBtn').addEventListener('click', copyReceipt);
  
  // Modal Logic
  const modal = document.getElementById('recipesModal');
  document.getElementById('recipesBtn').addEventListener('click', () => {
    modal.classList.add('active');
  });
  
  document.querySelector('.close-modal').addEventListener('click', () => {
    modal.classList.remove('active');
  });
  
  window.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('active');
  });
}

function renderMenu() {
  quickMenuContainer.innerHTML = '';
  
  menuData.forEach(group => {
    const groupDiv = document.createElement('div');
    groupDiv.className = 'qm-group';
    
    const title = document.createElement('h3');
    title.textContent = group.category;
    groupDiv.appendChild(title);
    
    const chipList = document.createElement('div');
    chipList.className = 'chip-list';
    
    group.items.forEach(item => {
      const btn = document.createElement('button');
      btn.className = 'chip';
      if (item.desc) btn.title = item.desc;
      
      btn.innerHTML = `
        <span class="chip-name">${item.icon} ${item.name}</span>
        <span class="chip-price">$${item.price}</span>
      `;
      
      btn.addEventListener('click', () => addItem(item));
      chipList.appendChild(btn);
    });
    
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

function addItem(item) {
  const existingItem = orderItems.find(i => i.name === item.name);
  if (existingItem) {
    existingItem.qty += 1;
  } else {
    orderItems.push({ ...item, qty: 1 });
  }
  saveAndRender();
}

function removeItem(index) {
  orderItems.splice(index, 1);
  saveAndRender();
}

function updateQty(index, newQty) {
  if (newQty < 1) return;
  orderItems[index].qty = newQty;
  saveAndRender();
}

function saveAndRender() {
  localStorage.setItem('omalleyOrder', JSON.stringify(orderItems));
  updateOrderDisplay();
}

function updateOrderDisplay() {
  itemsBody.innerHTML = '';
  
  if (orderItems.length === 0) {
    itemsBody.innerHTML = `<tr class="empty"><td colspan="5">No items yet. Add from the menu.</td></tr>`;
    calculateTotals();
    return;
  }
  
  orderItems.forEach((item, index) => {
    const tr = document.createElement('tr');
    const total = item.price * item.qty;
    
    tr.innerHTML = `
      <td>${item.icon} ${item.name}</td>
      <td>$${item.price}</td>
      <td>
        <input type="number" min="1" value="${item.qty}" 
          onchange="updateQty(${index}, parseInt(this.value))"
          style="width: 50px; background: transparent; border: 1px solid var(--border-color); color: white; padding: 2px 5px; border-radius: 3px;" />
      </td>
      <td>$${total}</td>
      <td>
        <button class="btn-remove" onclick="removeItem(${index})">&times;</button>
      </td>
    `;
    itemsBody.appendChild(tr);
  });
  
  calculateTotals();
}

function calculateTotals() {
  const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const discount = parseFloat(discountInput.value) || 0;
  
  const discountAmount = subtotal * (discount / 100);
  const grandTotal = subtotal - discountAmount;
  
  subtotalEl.textContent = `$${subtotal.toFixed(0)}`;
  grandTotalEl.textContent = `$${Math.max(0, grandTotal).toFixed(0)}`;
}

function clearOrder() {
  if (confirm('Are you sure you want to clear the entire order?')) {
    orderItems = [];
    discountInput.value = 0;
    customerInput.value = '';
    localStorage.removeItem('omalleyDiscount');
    localStorage.removeItem('omalleyCustomer');
    saveAndRender();
  }
}

function copyReceipt() {
  if (orderItems.length === 0) {
    alert("Order is empty!");
    return;
  }
  
  const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const discount = parseFloat(discountInput.value) || 0;
  const discountAmount = subtotal * (discount / 100);
  const grandTotal = Math.max(0, subtotal - discountAmount);
  
  let receiptText = `☘️ O'MALLEY'S IRISH PUB ☘️\n`;
  receiptText += `---------------------------\n`;
  
  const customer = customerInput.value.trim();
  if (customer) receiptText += `Customer: ${customer}\n`;
  receiptText += `Date: ${new Date().toLocaleDateString()}\n`;
  receiptText += `---------------------------\n`;
  
  orderItems.forEach(item => {
    receiptText += `${item.qty}x ${item.name} - $${(item.price * item.qty).toFixed(0)}\n`;
  });
  
  receiptText += `---------------------------\n`;
  receiptText += `Subtotal: $${subtotal.toFixed(0)}\n`;
  if (discount > 0) {
    receiptText += `Discount (${discount}%): -$${discountAmount.toFixed(0)}\n`;
  }
  receiptText += `Total: $${grandTotal.toFixed(0)}\n`;
  receiptText += `---------------------------\n`;
  receiptText += `Sláinte! Thank you for visiting!`;
  
  navigator.clipboard.writeText(receiptText).then(() => {
    const btn = document.getElementById('copyBtn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '✅ Copied!';
    setTimeout(() => { btn.innerHTML = originalText; }, 2000);
  }).catch(err => {
    console.error('Could not copy text: ', err);
    alert('Failed to copy receipt.');
  });
}

// Make globally available for inline handlers
window.updateQty = updateQty;
window.removeItem = removeItem;

// Start app
init();
