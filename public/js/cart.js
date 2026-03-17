// Load cart from localStorage or fallback to default sample item
let cart = JSON.parse(localStorage.getItem("cart")) || [
    {
        name: "Wireless Headphones",
        price: 49.99,
        quantity: 1,
        image: "https://via.placeholder.com/150"
    }
];

// DOM Elements
const cartItems = document.getElementById("cartItems");
const emptyCart = document.getElementById("emptyCart");
const subtotalEl = document.getElementById("subtotal");
const taxEl = document.getElementById("tax");
const totalEl = document.getElementById("total");
const checkoutBtn = document.getElementById("checkoutBtn");

// Save cart data to localStorage
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Render cart items to the DOM
function renderCart() {
    cartItems.innerHTML = "";

    if (cart.length === 0) {
        emptyCart.style.display = "block";
        checkoutBtn.disabled = true;
        updateSummary();
        return;
    }

    emptyCart.style.display = "none";
    checkoutBtn.disabled = false;

    // Use DocumentFragment for better rendering performance
    const fragment = document.createDocumentFragment();

    cart.forEach((item, i) => {
        const itemDiv = document.createElement("div");
        itemDiv.className = "cart-item";
        
        itemDiv.innerHTML = `
            <img src="${item.image}">
            <div class="item-details">
                <h3>${item.name}</h3>
                <p>$${item.price}</p>
                <div class="quantity">
                    <button onclick="changeQty(${i}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="changeQty(${i}, 1)">+</button>
                </div>
            </div>
            <button class="remove" onclick="removeItem(${i})">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        fragment.appendChild(itemDiv);
    });

    cartItems.appendChild(fragment);
    updateSummary();
}

// Change item quantity
function changeQty(i, value) {
    cart[i].quantity += value;
    if (cart[i].quantity <= 0) cart.splice(i, 1);
    saveCart();
    renderCart();
}

// Remove single item from cart
function removeItem(i) {
    cart.splice(i, 1);
    saveCart();
    renderCart();
}

// Calculate and update subtotal, tax, and total
function updateSummary() {
    let subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    let tax = subtotal * 0.1;
    let total = subtotal + tax;

    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    taxEl.textContent = `$${tax.toFixed(2)}`;
    totalEl.textContent = `$${total.toFixed(2)}`;
}

// Checkout button handler
checkoutBtn.onclick = () => {
    alert("Checkout Successful! (Demo)");
    cart = [];
    saveCart();
    renderCart();
};

// Initial render when script loads
renderCart();
