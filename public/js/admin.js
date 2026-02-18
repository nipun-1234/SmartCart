// Admin Panel JavaScript

// Admin credentials
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
};

// Initialize admin panel
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('admin.html')) {
        initializeAdminPanel();
    }
});

// Initialize admin panel
function initializeAdminPanel() {
    // Check if already logged in
    const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    
    if (isLoggedIn) {
        showAdminPanel();
    } else {
        showLoginForm();
    }
    
    setupAdminEventListeners();
}

// Setup admin event listeners
function setupAdminEventListeners() {
    // Login button
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', adminLogin);
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', adminLogout);
    }
    
    // Tab switching
    const tabButtons = document.querySelectorAll('.admin-tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            switchAdminTab(this.dataset.tab);
        });
    });
    
    // Product management
    setupProductManagement();
    
    // Enter key for login
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && document.getElementById('adminLogin').style.display !== 'none') {
            adminLogin();
        }
    });
}

// Admin login
function adminLogin() {
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;
    
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        localStorage.setItem('adminLoggedIn', 'true');
        showAdminPanel();
        showNotification('Login successful!', 'success');
    } else {
        showNotification('Invalid credentials!', 'error');
    }
}

// Admin logout
function adminLogout() {
    localStorage.removeItem('adminLoggedIn');
    showLoginForm();
    showNotification('Logged out successfully', 'success');
}

// Show login form
function showLoginForm() {
    document.getElementById('adminLogin').style.display = 'block';
    document.getElementById('adminPanel').style.display = 'none';
}

// Show admin panel
function showAdminPanel() {
    document.getElementById('adminLogin').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    
    // Load data for current tab
    const activeTab = document.querySelector('.admin-tab-btn.active');
    if (activeTab) {
        switchAdminTab(activeTab.dataset.tab);
    }
}

// Switch admin tabs
function switchAdminTab(tabName) {
    // Update active tab button
    document.querySelectorAll('.admin-tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.querySelector(`.admin-tab-btn[data-tab="${tabName}"]`).classList.add('active');
    
    // Show active tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    document.getElementById(`${tabName}Tab`).classList.add('active');
    
    // Load tab data
    switch (tabName) {
        case 'products':
            loadProductsTable();
            break;
        case 'orders':
            loadOrdersTable();
            break;
        case 'reports':
            loadReports();
            break;
    }
}

// Setup product management
function setupProductManagement() {
    // Add product button
    const addProductBtn = document.getElementById('addProductBtn');
    if (addProductBtn) {
        addProductBtn.addEventListener('click', showProductForm);
    }
    
    // Cancel product form
    const cancelProductBtn = document.getElementById('cancelProductBtn');
    if (cancelProductBtn) {
        cancelProductBtn.addEventListener('click', hideProductForm);
    }
    
    // Save product
    const saveProductBtn = document.getElementById('saveProductBtn');
    if (saveProductBtn) {
        saveProductBtn.addEventListener('click', saveProduct);
    }
    
    // Delegate product actions
    document.addEventListener('click', function(e) {
        if (e.target.closest('.btn-edit')) {
            const productId = e.target.closest('.btn-edit').dataset.id;
            editProduct(productId);
        }
        
        if (e.target.closest('.btn-delete')) {
            const productId = e.target.closest('.btn-delete').dataset.id;
            deleteProduct(productId);
        }
    });
}

// Load products table
function loadProductsTable() {
    const tableBody = document.getElementById('productsTableBody');
    
    // Get products from localStorage or use sample
    let products = JSON.parse(localStorage.getItem('adminProducts')) || sampleProducts;
    
    // Clear table
    tableBody.innerHTML = '';
    
    // Add rows
    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.id}</td>
            <td>
                <img src="${product.image}" alt="${product.name}" 
                     style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;">
            </td>
            <td>${product.name}</td>
            <td><span class="category-badge">${product.category}</span></td>
            <td>$${product.price.toFixed(2)}</td>
            <td>${product.stock}</td>
            <td>
                <div class="table-actions">
                    <button class="btn btn-edit" data-id="${product.id}">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-delete" data-id="${product.id}">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
    
    // Update stats
    updateStats();
}

// Show product form
function showProductForm() {
    document.getElementById('productForm').style.display = 'block';
    document.getElementById('formTitle').textContent = 'Add New Product';
    document.getElementById('addProductBtn').style.display = 'none';
    
    // Clear form
    document.getElementById('productName').value = '';
    document.getElementById('productPrice').value = '';
    document.getElementById('productDescription').value = '';
    document.getElementById('productStock').value = '';
    document.getElementById('productImage').value = '';
    document.getElementById('productCategory').value = 'electronics';
    
    // Remove edit mode
    document.getElementById('saveProductBtn').dataset.mode = 'add';
}

// Hide product form
function hideProductForm() {
    document.getElementById('productForm').style.display = 'none';
    document.getElementById('addProductBtn').style.display = 'block';
}

// Save product
function saveProduct() {
    const mode = this.dataset.mode || 'add';
    const productId = mode === 'edit' ? parseInt(this.dataset.productId) : Date.now();
    
    // Get form values
    const name = document.getElementById('productName').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const description = document.getElementById('productDescription').value;
    const stock = parseInt(document.getElementById('productStock').value);
    const image = document.getElementById('productImage').value || 
                  'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=300&fit=crop';
    const category = document.getElementById('productCategory').value;
    
    // Validation
    if (!name || !price || !description || !stock) {
        showNotification('Please fill all required fields', 'error');
        return;
    }
    
    // Get existing products
    let products = JSON.parse(localStorage.getItem('adminProducts')) || sampleProducts;
    
    if (mode === 'add') {
        // Add new product
        const newProduct = {
            id: productId,
            name,
            description,
            price,
            category,
            image,
            stock
        };
        products.push(newProduct);
        showNotification('Product added successfully', 'success');
    } else {
        // Update existing product
        const index = products.findIndex(p => p.id === productId);
        if (index !== -1) {
            products[index] = {
                ...products[index],
                name,
                description,
                price,
                category,
                image,
                stock
            };
            showNotification('Product updated successfully', 'success');
        }
    }
    
    // Save products
    localStorage.setItem('adminProducts', JSON.stringify(products));
    
    // Reload table and hide form
    loadProductsTable();
    hideProductForm();
}

// Edit product
function editProduct(productId) {
    // Get products
    let products = JSON.parse(localStorage.getItem('adminProducts')) || sampleProducts;
    const product = products.find(p => p.id == productId);
    
    if (product) {
        // Show form
        document.getElementById('productForm').style.display = 'block';
        document.getElementById('formTitle').textContent = 'Edit Product';
        document.getElementById('addProductBtn').style.display = 'none';
        
        // Fill form
        document.getElementById('productName').value = product.name;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productDescription').value = product.description;
        document.getElementById('productStock').value = product.stock;
        document.getElementById('productImage').value = product.image;
        document.getElementById('productCategory').value = product.category;
        
        // Set edit mode
        document.getElementById('saveProductBtn').dataset.mode = 'edit';
        document.getElementById('saveProductBtn').dataset.productId = productId;
    }
}

// Delete product
function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    // Get products
    let products = JSON.parse(localStorage.getItem('adminProducts')) || sampleProducts;
    
    // Filter out the product
    products = products.filter(p => p.id != productId);
    
    // Save products
    localStorage.setItem('adminProducts', JSON.stringify(products));
    
    // Reload table
    loadProductsTable();
    showNotification('Product deleted successfully', 'success');
}

// Load orders table
function loadOrdersTable() {
    const tableBody = document.getElementById('ordersTableBody');
    
    // Get orders from localStorage
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    // Clear table
    tableBody.innerHTML = '';
    
    if (orders.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="7" style="text-align: center; padding: 40px;">No orders yet</td>`;
        tableBody.appendChild(row);
        return;
    }
    
    // Add rows
    orders.forEach(order => {
        const date = new Date(order.date).toLocaleDateString();
        const itemsCount = order.items.length;
        const itemsList = order.items.map(item => 
            `${item.name} (x${item.quantity})`
        ).join(', ');
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${order.id}</td>
            <td>Customer ${order.id % 1000}</td>
            <td>${date}</td>
            <td>${itemsCount} items</td>
            <td>$${order.total.toFixed(2)}</td>
            <td><span class="status-badge status-${order.status}">${order.status}</span></td>
            <td>
                <button class="btn btn-view" data-order="${order.id}">
                    <i class="fas fa-eye"></i> View
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
    
    // Update stats
    updateStats();
}

// Load reports
function loadReports() {
    updateStats();
    createCharts();
}

// Update stats
function updateStats() {
    // Get orders
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    // Get products
    const products = JSON.parse(localStorage.getItem('adminProducts')) || sampleProducts;
    
    // Calculate totals
    const totalOrders = orders.length;
    const totalProducts = products.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalCustomers = new Set(orders.map(order => order.id % 1000)).size;
    
    // Update DOM
    document.getElementById('totalOrders').textContent = totalOrders;
    document.getElementById('totalProducts').textContent = totalProducts;
    document.getElementById('totalRevenue').textContent = `$${totalRevenue.toFixed(2)}`;
    document.getElementById('totalCustomers').textContent = totalCustomers;
}

// Create charts
function createCharts() {
    // Get orders
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const products = JSON.parse(localStorage.getItem('adminProducts')) || sampleProducts;
    
    // Sales chart data (last 7 days)
    const last7Days = [];
    const salesData = [];
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toLocaleDateString('en-US', { weekday: 'short' });
        last7Days.push(dateStr);
        
        // Calculate sales for this day
        const daySales = orders
            .filter(order => {
                const orderDate = new Date(order.date);
                return orderDate.toDateString() === date.toDateString();
            })
            .reduce((sum, order) => sum + order.total, 0);
        
        salesData.push(daySales);
    }
    
    // Category chart data
    const categories = ['electronics', 'clothing', 'books', 'home'];
    const categoryCounts = categories.map(category => 
        products.filter(p => p.category === category).length
    );
    
    // Create sales chart
    const salesCtx = document.getElementById('salesChart');
    if (salesCtx) {
        new Chart(salesCtx, {
            type: 'line',
            data: {
                labels: last7Days,
                datasets: [{
                    label: 'Daily Sales ($)',
                    data: salesData,
                    borderColor: '#4A6FA5',
                    backgroundColor: 'rgba(74, 111, 165, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Sales Trend (Last 7 Days)'
                    }
                }
            }
        });
    }
    
    // Create category chart
    const categoryCtx = document.getElementById('categoryChart');
    if (categoryCtx) {
        new Chart(categoryCtx, {
            type: 'doughnut',
            data: {
                labels: ['Electronics', 'Clothing', 'Books', 'Home & Kitchen'],
                datasets: [{
                    data: categoryCounts,
                    backgroundColor: [
                        '#4A6FA5',
                        '#166088',
                        '#385F71',
                        '#28A745'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Products by Category'
                    }
                }
            }
        });
    }
}