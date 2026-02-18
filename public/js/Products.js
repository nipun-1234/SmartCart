// Products Management JavaScript

// Sample products data
const sampleProducts = [
    {
        id: 1,
        name: "Wireless Headphones",
        description: "High-quality wireless headphones with noise cancellation",
        price: 89.99,
        category: "electronics",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
        stock: 25
    },
    {
        id: 2,
        name: "Smart Watch",
        description: "Feature-rich smart watch with fitness tracking",
        price: 199.99,
        category: "electronics",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w-400&h=300&fit=crop",
        stock: 15
    },
    {
        id: 3,
        name: "Cotton T-Shirt",
        description: "100% cotton comfortable t-shirt",
        price: 24.99,
        category: "clothing",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop",
        stock: 50
    },
    {
        id: 4,
        name: "JavaScript Book",
        description: "Complete guide to modern JavaScript",
        price: 39.99,
        category: "books",
        image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop",
        stock: 30
    },
    {
        id: 5,
        name: "Coffee Maker",
        description: "Automatic coffee maker with timer",
        price: 79.99,
        category: "home",
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop",
        stock: 20
    },
    {
        id: 6,
        name: "Laptop Backpack",
        description: "Water-resistant laptop backpack",
        price: 49.99,
        category: "electronics",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop",
        stock: 40
    },
    {
        id: 7,
        name: "Yoga Mat",
        description: "Non-slip yoga mat with carrying strap",
        price: 29.99,
        category: "home",
        image: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=400&h=300&fit=crop",
        stock: 35
    },
    {
        id: 8,
        name: "Running Shoes",
        description: "Lightweight running shoes with cushion",
        price: 129.99,
        category: "clothing",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop",
        stock: 25
    }
];

// Initialize products when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load products for different pages
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        loadFeaturedProducts();
    }
    
    if (window.location.pathname.includes('products.html')) {
        loadAllProducts();
        setupProductFilters();
    }
    
    // Setup event listeners for product actions
    setupProductEventListeners();
});

// Load featured products on homepage
function loadFeaturedProducts() {
    const featuredProductsContainer = document.getElementById('featuredProducts');
    
    if (!featuredProductsContainer) return;
    
    // Clear existing content
    featuredProductsContainer.innerHTML = '';
    
    // Get first 4 products as featured
    const featuredProducts = sampleProducts.slice(0, 4);
    
    // Create product cards
    featuredProducts.forEach(product => {
        const productCard = createProductCard(product);
        featuredProductsContainer.appendChild(productCard);
    });
}

// Load all products on products page
function loadAllProducts() {
    const allProductsContainer = document.getElementById('allProducts');
    
    if (!allProductsContainer) return;
    
    // Clear existing content
    allProductsContainer.innerHTML = '';
    
    // Create product cards for all products
    sampleProducts.forEach(product => {
        const productCard = createProductCard(product);
        allProductsContainer.appendChild(productCard);
    });
}

// Create product card HTML
function createProductCard(product) {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    productCard.dataset.id = product.id;
    productCard.dataset.category = product.category;
    productCard.dataset.price = product.price;
    productCard.dataset.name = product.name.toLowerCase();
    
    productCard.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}" onerror="this.src='https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=300&fit=crop'">
        </div>
        <div class="product-info">
            <span class="product-category">${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</span>
            <h3 class="product-title">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-price">$${product.price.toFixed(2)}</div>
            <div class="product-actions">
                <button class="btn-add-cart" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}" data-image="${product.image}">
                    <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
                <button class="btn-view-details" data-id="${product.id}">
                    <i class="fas fa-eye"></i> Details
                </button>
            </div>
        </div>
    `;
    
    return productCard;
}

// Setup product filters
function setupProductFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const sortFilter = document.getElementById('sortFilter');
    const clearFiltersBtn = document.getElementById('clearFilters');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterAndSortProducts);
    }
    
    if (sortFilter) {
        sortFilter.addEventListener('change', filterAndSortProducts);
    }
    
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearFilters);
    }
}

// Filter and sort products
function filterAndSortProducts() {
    const categoryFilter = document.getElementById('categoryFilter');
    const sortFilter = document.getElementById('sortFilter');
    const productCards = document.querySelectorAll('.product-card');
    
    let filteredProducts = Array.from(productCards);
    
    // Filter by category
    const selectedCategory = categoryFilter.value;
    if (selectedCategory !== 'all') {
        filteredProducts = filteredProducts.filter(card => 
            card.dataset.category === selectedCategory
        );
    }
    
    // Sort products
    const sortBy = sortFilter.value;
    filteredProducts.sort((a, b) => {
        switch (sortBy) {
            case 'price-low':
                return parseFloat(a.dataset.price) - parseFloat(b.dataset.price);
            case 'price-high':
                return parseFloat(b.dataset.price) - parseFloat(a.dataset.price);
            case 'name':
                return a.dataset.name.localeCompare(b.dataset.name);
            default:
                return parseInt(a.dataset.id) - parseInt(b.dataset.id);
        }
    });
    
    // Hide all products first
    productCards.forEach(card => {
        card.style.display = 'none';
    });
    
    // Show filtered products in sorted order
    const container = document.getElementById('allProducts');
    container.innerHTML = '';
    filteredProducts.forEach(card => {
        container.appendChild(card);
        card.style.display = 'block';
    });
}

// Clear filters
function clearFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const sortFilter = document.getElementById('sortFilter');
    
    categoryFilter.value = 'all';
    sortFilter.value = 'default';
    
    filterAndSortProducts();
}

// Setup product event listeners
function setupProductEventListeners() {
    // Delegate add to cart events
    document.addEventListener('click', function(e) {
        if (e.target.closest('.btn-add-cart')) {
            const button = e.target.closest('.btn-add-cart');
            const productId = button.dataset.id;
            const productName = button.dataset.name;
            const productPrice = parseFloat(button.dataset.price);
            const productImage = button.dataset.image;
            
            addToCart(productId, productName, productPrice, productImage);
        }
        
        if (e.target.closest('.btn-view-details')) {
            const button = e.target.closest('.btn-view-details');
            const productId = button.dataset.id;
            viewProductDetails(productId);
        }
    });
}

// View product details
function viewProductDetails(productId) {
    const product = sampleProducts.find(p => p.id == productId);
    
    if (product) {
        // Create modal for product details
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        `;
        
        modal.innerHTML = `
            <div class="modal-content" style="background: white; padding: 30px; border-radius: 15px; max-width: 600px; width: 90%;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2>${product.name}</h2>
                    <button class="close-modal" style="background: none; border: none; font-size: 1.5rem; cursor: pointer;">×</button>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    <div>
                        <img src="${product.image}" alt="${product.name}" style="width: 100%; border-radius: 10px;">
                    </div>
                    <div>
                        <p><strong>Price:</strong> $${product.price.toFixed(2)}</p>
                        <p><strong>Category:</strong> ${product.category}</p>
                        <p><strong>Stock:</strong> ${product.stock} available</p>
                        <p><strong>Description:</strong></p>
                        <p>${product.description}</p>
                        <button class="btn-add-cart btn btn-primary" 
                                data-id="${product.id}"
                                data-name="${product.name}"
                                data-price="${product.price}"
                                data-image="${product.image}"
                                style="margin-top: 20px; width: 100%;">
                            <i class="fas fa-cart-plus"></i> Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close modal events
        modal.querySelector('.close-modal').addEventListener('click', function() {
            document.body.removeChild(modal);
        });
        
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 1001;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 3000);
}

// Add CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(notificationStyles);

// Update cart count (called from main.js)
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}