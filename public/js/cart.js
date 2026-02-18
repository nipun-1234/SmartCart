let cart = JSON.parse(localStorage.getItem("cart")) || [
    {
        name: "Wireless Headphones",
        price: 49.99,
        quantity: 1,
        image: "https://via.placeholder.com/150"
    }
];

const cartItems = document.getElementById("cartItems");
const emptyCart = document.getElementById("emptyCart");
const subtotalEl = document.getElementById("subtotal");
const taxEl = document.getElementById("tax");
const totalEl = document.getElementById("total");
const checkoutBtn = document.getElementById("checkoutBtn");

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

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

    cart.forEach((item, i) => {
        cartItems.innerHTML += `
        <div class="cart-item">
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
        </div>`;
    });

    updateSummary();
}

function changeQty(i, value) {
    cart[i].quantity += value;
    if (cart[i].quantity <= 0) cart.splice(i, 1);
    saveCart();
    renderCart();
}

function removeItem(i) {
    cart.splice(i, 1);
    saveCart();
    renderCart();
}

function updateSummary() {
    let subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    let tax = subtotal * 0.1;
    let total = subtotal + tax;

    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    taxEl.textContent = `$${tax.toFixed(2)}`;
    totalEl.textContent = `$${total.toFixed(2)}`;
}

checkoutBtn.onclick = () => {
    alert("Checkout Successful! (Demo)");
    cart = [];
    saveCart();
    renderCart();
};

renderCart();
