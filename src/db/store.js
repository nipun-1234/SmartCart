// SmartCart Central Database & Repository Store
const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');

let isPostgresAvailable = false;

// Check PostgreSQL connectivity on startup
async function checkPostgres() {
  try {
    const client = await pool.connect();
    client.release();
    isPostgresAvailable = true;
    console.log('[Database] PostgreSQL connection active and verified.');
  } catch (_err) {
    isPostgresAvailable = false;
    console.log('[Database] PostgreSQL offline/unreachable; using resilient high-performance store.');
  }
}
checkPostgres();

// Initial mock data store for resilient local development & offline testing
const initialCategories = [
  { id: 1, name: 'Electronics & Tech', slug: 'electronics' },
  { id: 2, name: 'Clothing & Fashion', slug: 'clothing' },
  { id: 3, name: 'Home & Living', slug: 'home' },
  { id: 4, name: 'Sports & Fitness', slug: 'sports' },
  { id: 5, name: 'Books & Literature', slug: 'books' },
  { id: 6, name: 'Grocery & Fresh', slug: 'grocery' },
  { id: 7, name: 'Stationery & Office', slug: 'stationery' },
  { id: 8, name: 'Health & Wellness', slug: 'health' },
  { id: 9, name: 'Beauty & Personal Care', slug: 'beauty' },
  { id: 10, name: 'Toys & Kids', slug: 'toys' }
];

const initialProducts = [
  { id: 1, sku: 'SC-AUD-001', name: 'Wireless Headphones Pro', slug: 'wireless-headphones-pro', category_id: 1, category: 'electronics', price: 25597, currency: 'LKR', stock_quantity: 25, rating: 4.8, reviews: 328, brand: 'SoundPeak', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80', description: 'Premium active noise-cancelling wireless headphones with 40h battery life and spatial audio.', is_active: true },
  { id: 2, sku: 'SC-WEA-001', name: 'Running Performance Jacket', slug: 'running-performance-jacket', category_id: 2, category: 'clothing', price: 19197, currency: 'LKR', stock_quantity: 18, rating: 4.5, reviews: 214, brand: 'TrailForm', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80', description: 'Weather-resistant lightweight running jacket with reflective strips and breathable mesh vents.', is_active: true },
  { id: 3, sku: 'SC-HOM-001', name: 'Garden Tool Set Deluxe', slug: 'garden-tool-set-deluxe', category_id: 3, category: 'home', price: 14717, currency: 'LKR', stock_quantity: 12, rating: 4.7, reviews: 189, brand: 'GreenNest', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80', description: 'Ergonomic stainless steel 7-piece gardening tool collection with carry tote bag.', is_active: true },
  { id: 4, sku: 'SC-TEC-001', name: 'Aluminum Ergonomic Laptop Stand', slug: 'aluminum-ergonomic-laptop-stand', category_id: 1, category: 'electronics', price: 11197, currency: 'LKR', stock_quantity: 67, rating: 4.6, reviews: 456, brand: 'WorkSpace', image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&q=80', description: 'Heat-dissipating anodized aluminum stand with height adjustment for 10-17 inch laptops.', is_active: true },
  { id: 5, sku: 'SC-WEA-002', name: 'Apex Ultra Smart Watch', slug: 'apex-ultra-smart-watch', category_id: 1, category: 'electronics', price: 63997, currency: 'LKR', stock_quantity: 15, rating: 4.9, reviews: 567, brand: 'SoundPeak', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80', description: 'AMOLED display, GPS, SpO2 sensor, heart tracking, and 7-day battery endurance.', is_active: true },
  { id: 6, sku: 'SC-WEA-003', name: 'Thermal Insulated Winter Coat', slug: 'thermal-insulated-winter-coat', category_id: 2, category: 'clothing', price: 41597, currency: 'LKR', stock_quantity: 14, rating: 4.6, reviews: 334, brand: 'TrailForm', image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&q=80', description: 'Waterproof down-fill hooded winter coat designed for sub-zero temperatures.', is_active: true },
  { id: 7, sku: 'SC-HOM-002', name: 'Modern Smart LED Desk Lamp', slug: 'modern-smart-led-desk-lamp', category_id: 3, category: 'home', price: 12797, currency: 'LKR', stock_quantity: 34, rating: 4.4, reviews: 178, brand: 'BrightLiving', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80', description: 'Touch-sensitive dimming with 5 color modes and integrated 10W wireless charging base.', is_active: true },
  { id: 8, sku: 'SC-AUD-002', name: 'Rugged Waterproof Bluetooth Speaker', slug: 'rugged-waterproof-bluetooth-speaker', category_id: 1, category: 'electronics', price: 28797, currency: 'LKR', stock_quantity: 28, rating: 4.5, reviews: 412, brand: 'SoundPeak', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80', description: 'IPX7 waterproof 360-degree bass radiator with 24 hours playtime.', is_active: true },
  { id: 9, sku: 'SC-SPT-001', name: 'Eco-Friendly Non-Slip Yoga Mat', slug: 'eco-friendly-non-slip-yoga-mat', category_id: 4, category: 'sports', price: 9597, currency: 'LKR', stock_quantity: 35, rating: 4.3, reviews: 267, brand: 'ActiveLife', image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&q=80', description: '6mm high-density alignment-line yoga mat with free carrying strap.', is_active: true },
  { id: 10, sku: 'SC-HOM-003', name: 'Ceramic Plant Pot Set (3-Pack)', slug: 'ceramic-plant-pot-set', category_id: 3, category: 'home', price: 7997, currency: 'LKR', stock_quantity: 22, rating: 4.6, reviews: 93, brand: 'GreenNest', image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&q=80', description: 'Modern minimalist glazed ceramic planter set with bamboo drainage trays.', is_active: true },
  { id: 11, sku: 'SC-SPT-002', name: 'AeroCushion Volcanic Sprint Shoes', slug: 'aerocushion-volcanic-sprint-shoes', category_id: 4, category: 'sports', price: 28797, currency: 'LKR', stock_quantity: 19, rating: 4.9, reviews: 523, brand: 'ActiveLife', image: '/images/smart-rock-sneaker.jpg', description: 'Next-Gen Cushioning Architecture with 78% energy return dynamics on volcanic shock-absorbent composite chassis.', is_active: true },
  { id: 12, sku: 'SC-HOM-004', name: 'Barista Espresso & Coffee Maker', slug: 'barista-espresso-coffee-maker', category_id: 3, category: 'home', price: 25597, currency: 'LKR', stock_quantity: 16, rating: 4.7, reviews: 345, brand: 'BrightLiving', image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=600&q=80', description: '15-bar Italian pump with professional milk frother wand for rich lattes and cappuccinos.', is_active: true },
  { id: 13, sku: 'SC-TEC-002', name: 'StreamCam 4K Ultra HD Webcam', slug: 'streamcam-4k-ultra-hd-webcam', category_id: 1, category: 'electronics', price: 41597, currency: 'LKR', stock_quantity: 20, rating: 4.7, reviews: 445, brand: 'WorkSpace', image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80', description: 'Dual noise-cancelling microphones, autofocus, and low-light enhancement sensor.', is_active: true },
  { id: 14, sku: 'SC-WEA-004', name: 'Full-Grain Leather Travel Backpack', slug: 'full-grain-leather-travel-backpack', category_id: 2, category: 'clothing', price: 38397, currency: 'LKR', stock_quantity: 15, rating: 4.9, reviews: 678, brand: 'TrailForm', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80', description: 'Handcrafted genuine leather backpack with padded 16-inch laptop compartment.', is_active: true },
  { id: 15, sku: 'SC-BOK-001', name: 'Atomic Habits by James Clear', slug: 'atomic-habits', category_id: 5, category: 'books', price: 6077, currency: 'LKR', stock_quantity: 40, rating: 5.0, reviews: 2134, brand: 'Penguin', image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=600&q=80', description: 'The #1 New York Times bestseller on building good habits and breaking bad ones.', is_active: true },
  { id: 16, sku: 'SC-HOM-005', name: 'Digital Air Fryer XL 6L', slug: 'digital-air-fryer-xl-6l', category_id: 3, category: 'home', price: 51197, currency: 'LKR', stock_quantity: 11, rating: 4.6, reviews: 892, brand: 'BrightLiving', image: 'https://images.unsplash.com/photo-1611071536466-a4057a814b0c?w=600&q=80', description: 'Rapid 360-degree air circulation technology with 8 pre-programmed culinary presets.', is_active: true },
  { id: 17, sku: 'SC-TEC-003', name: 'Pro Wireless RGB Gaming Mouse', slug: 'pro-wireless-rgb-gaming-mouse', category_id: 1, category: 'electronics', price: 22397, currency: 'LKR', stock_quantity: 30, rating: 4.6, reviews: 556, brand: 'WorkSpace', image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=600&q=80', description: '26,000 DPI optical sensor, ultra-lightweight 60g honeycomb chassis, and zero-latency wireless.', is_active: true },
  { id: 18, sku: 'SC-BOK-002', name: 'Think Like a Monk by Jay Shetty', slug: 'think-like-a-monk', category_id: 5, category: 'books', price: 4797, currency: 'LKR', stock_quantity: 35, rating: 4.8, reviews: 1089, brand: 'Penguin', image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80', description: 'Train your mind for peace and purpose every day using timeless monastic wisdom.', is_active: true },
  { id: 19, sku: 'SC-TEC-004', name: 'Mechanical RGB Hot-Swap Keyboard', slug: 'mechanical-rgb-hot-swap-keyboard', category_id: 1, category: 'electronics', price: 35197, currency: 'LKR', stock_quantity: 24, rating: 4.9, reviews: 763, brand: 'WorkSpace', image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&q=80', description: 'Gateron Yellow switches, sound-dampening foam, and PBT double-shot keycaps.', is_active: true },
  { id: 20, sku: 'SC-BOK-003', name: 'The Alchemist by Paulo Coelho', slug: 'the-alchemist', category_id: 5, category: 'books', price: 3837, currency: 'LKR', stock_quantity: 50, rating: 4.9, reviews: 4102, brand: 'Penguin', image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80', description: 'The magical story of Santiago, an Andalusian shepherd boy who yearns to travel in search of worldly treasure.', is_active: true },
  { id: 21, sku: 'SC-HOM-006', name: 'Smart Robot Vacuum & Mop', slug: 'smart-robot-vacuum-mop', category_id: 3, category: 'home', price: 95997, currency: 'LKR', stock_quantity: 8, rating: 4.8, reviews: 892, brand: 'BrightLiving', image: 'https://images.unsplash.com/photo-1543486958-d783bfbf7f8e?w=600&q=80', description: 'LiDAR laser navigation, 4000Pa suction power, auto carpet boost, and smart app control.', is_active: true },
  { id: 22, sku: 'SC-SPT-003', name: 'Adjustable Dumbbell Set 20 kg', slug: 'adjustable-dumbbell-set-20-kg', category_id: 4, category: 'sports', price: 23997, currency: 'LKR', stock_quantity: 17, rating: 4.7, reviews: 456, brand: 'ActiveLife', image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&q=80', description: 'Quick-dial weight adjustment from 2.5kg to 20kg with anti-slip knurled grip.', is_active: true },
  { id: 23, sku: 'SC-GRO-001', name: 'Keeri Samba Premium Rice 5kg', slug: 'keeri-samba-rice-5kg', category_id: 6, category: 'grocery', price: 1650, currency: 'LKR', stock_quantity: 55, rating: 4.9, reviews: 312, brand: 'Araliya', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80', description: 'Aromatic aged Keeri Samba raw rice, triple-cleaned and vacuum-sealed for maximum freshness.', is_active: true },
  { id: 24, sku: 'SC-GRO-002', name: 'Dilmah Premium Pure Ceylon Black Tea 400g', slug: 'dilmah-ceylon-tea-400g', category_id: 6, category: 'grocery', price: 1250, currency: 'LKR', stock_quantity: 80, rating: 5.0, reviews: 620, brand: 'Dilmah', image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&q=80', description: 'Single origin hand-picked Ceylon black tea with rich amber brew and robust aroma.', is_active: true },
  { id: 25, sku: 'SC-GRO-003', name: 'Anchor Full Cream Milk Powder 400g', slug: 'anchor-milk-powder-400g', category_id: 6, category: 'grocery', price: 1180, currency: 'LKR', stock_quantity: 45, rating: 4.8, reviews: 489, brand: 'Anchor', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&q=80', description: '100% pure New Zealand dairy fortified with Vitamins A & D3 for daily family nutrition.', is_active: true },
  { id: 26, sku: 'SC-GRO-004', name: 'Munchee Super Cream Cracker 500g', slug: 'munchee-cream-cracker-500g', category_id: 6, category: 'grocery', price: 650, currency: 'LKR', stock_quantity: 90, rating: 4.9, reviews: 830, brand: 'Munchee', image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=600&q=80', description: 'Crispy oven-baked cream crackers, the classic Sri Lankan teatime companion.', is_active: true },
  { id: 27, sku: 'SC-STA-001', name: 'Executive Hardcover Journal & Metal Pen Set', slug: 'executive-journal-pen-set', category_id: 7, category: 'stationery', price: 2850, currency: 'LKR', stock_quantity: 30, rating: 4.7, reviews: 140, brand: 'Atlas', image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&q=80', description: 'A5 leatherette dotted notebook with ribbon marker and matching weighted rollerball pen.', is_active: true },
  { id: 28, sku: 'SC-STA-002', name: 'Artist Dual-Tip Brush Marker Pens (24 Pack)', slug: 'artist-dual-tip-markers-24', category_id: 7, category: 'stationery', price: 3450, currency: 'LKR', stock_quantity: 25, rating: 4.9, reviews: 215, brand: 'Atlas', image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=600&q=80', description: 'Vibrant blendable water-based dual brush and fine tip markers for calligraphy and sketching.', is_active: true },
  { id: 29, sku: 'SC-HLT-001', name: 'Link Natural Samahan Herbal Tea (30 Sachets)', slug: 'link-natural-samahan-tea', category_id: 8, category: 'health', price: 1450, currency: 'LKR', stock_quantity: 60, rating: 5.0, reviews: 1420, brand: 'Link Natural', image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&q=80', description: 'Authentic Sri Lankan 14-herb formulation for rapid relief from cold, catarrh, and immunity boost.', is_active: true },
  { id: 30, sku: 'SC-HLT-002', name: 'Baraka Organic Extra Virgin Coconut Oil 500ml', slug: 'baraka-virgin-coconut-oil-500ml', category_id: 8, category: 'health', price: 1850, currency: 'LKR', stock_quantity: 40, rating: 4.9, reviews: 380, brand: 'Baraka', image: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=600&q=80', description: '100% pure cold-pressed unrefined Ceylon virgin coconut oil rich in Lauric Acid and MCTs.', is_active: true },
  { id: 31, sku: 'SC-HLT-003', name: 'Siddhalepa Herbal Ayurvedic Balm 50g', slug: 'siddhalepa-ayurvedic-balm-50g', category_id: 8, category: 'health', price: 420, currency: 'LKR', stock_quantity: 120, rating: 4.9, reviews: 2100, brand: 'Siddhalepa', image: 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=600&q=80', description: 'Traditional herbal pain relief balm crafted from clove, cinnamon, eucalyptus and citronella essence.', is_active: true },
  { id: 32, sku: 'SC-BTY-001', name: 'Spa Ceylon Cinnamon & Honey Facial Cleanser 150ml', slug: 'spa-ceylon-cinnamon-honey-cleanser', category_id: 9, category: 'beauty', price: 3850, currency: 'LKR', stock_quantity: 35, rating: 4.8, reviews: 310, brand: 'Spa Ceylon', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80', description: 'Ayurvedic brightening face wash infused with pure organic Ceylon cinnamon and raw forest bee honey.', is_active: true },
  { id: 33, sku: 'SC-BTY-002', name: 'Pure Aloe Vera Soothing Hydration Gel 250ml', slug: 'pure-aloe-vera-soothing-gel', category_id: 9, category: 'beauty', price: 1250, currency: 'LKR', stock_quantity: 50, rating: 4.8, reviews: 490, brand: "Nature's Secret", image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&q=80', description: '99% pure soothing gel for instant skin cooling, deep daily moisture, and sun damage recovery.', is_active: true },
  { id: 34, sku: 'SC-BTY-003', name: 'Natural Sandalwood Luxury Soap (Pack of 3)', slug: 'natural-sandalwood-luxury-soap', category_id: 9, category: 'beauty', price: 1950, currency: 'LKR', stock_quantity: 45, rating: 4.7, reviews: 275, brand: 'Spa Ceylon', image: 'https://images.unsplash.com/photo-1607006310405-9705f4bf239f?w=600&q=80', description: 'Triple-milled aromatic sandalwood cleansing soap for radiant, smooth, and deeply nourished skin.', is_active: true },
  { id: 35, sku: 'SC-TOY-001', name: 'STEM Robotic Science & Coding Kit for Kids', slug: 'stem-robotic-science-kit', category_id: 10, category: 'toys', price: 8750, currency: 'LKR', stock_quantity: 20, rating: 4.9, reviews: 185, brand: 'SmartKidz', image: 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=600&q=80', description: 'Solar-powered 14-in-1 programmable robot building kit to develop engineering and logic skills.', is_active: true },
  { id: 36, sku: 'SC-TOY-002', name: 'Eco Wooden Geometric Puzzle Board & Blocks', slug: 'eco-wooden-geometric-puzzle', category_id: 10, category: 'toys', price: 3250, currency: 'LKR', stock_quantity: 30, rating: 4.8, reviews: 160, brand: 'SmartKidz', image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&q=80', description: 'Non-toxic organic wooden sorting and stacking Montessori sensory educational toy for toddlers.', is_active: true },
  { id: 37, sku: 'SC-TOY-003', name: 'High-Speed 4WD All-Terrain Remote Control Stunt Car', slug: '4wd-remote-control-stunt-car', category_id: 10, category: 'toys', price: 6850, currency: 'LKR', stock_quantity: 22, rating: 4.7, reviews: 240, brand: 'Turborun', image: 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=600&q=80', description: '360-degree double-sided tumbling RC stunt car with shockproof tires and USB rechargeable battery.', is_active: true }
];

const mockStore = {
  users: [
    {
      id: 1,
      email: 'admin@smartcart.lk',
      password_hash: bcrypt.hashSync('admin123', 10),
      first_name: 'SmartCart',
      last_name: 'Admin',
      role: 'admin',
      phone: '+94 77 000 1122',
      email_verified_at: new Date(),
      created_at: new Date()
    },
    {
      id: 2,
      email: 'demo@smartcart.lk',
      password_hash: bcrypt.hashSync('demo123', 10),
      first_name: 'Jane',
      last_name: 'Shopper',
      role: 'customer',
      phone: '+94 77 123 4567',
      email_verified_at: new Date(),
      created_at: new Date()
    }
  ],
  addresses: [
    {
      id: 1,
      user_id: 2,
      recipient_name: 'Jane Shopper',
      phone: '+94 77 123 4567',
      line1: '42 Galle Road',
      line2: 'Apt 4B',
      city: 'Colombo',
      region: 'Western Province',
      postal_code: '00300',
      country_code: 'LK',
      is_default: true
    }
  ],
  categories: [...initialCategories],
  products: [...initialProducts],
  carts: new Map(), // key: user_id or guest_token -> array of { productId, quantity }
  coupons: [
    { id: 1, code: 'SMART10', discount_type: 'percentage', discount_value: 10, min_spend: 3000, is_active: true },
    { id: 2, code: 'WELCOME500', discount_type: 'fixed', discount_value: 500, min_spend: 2500, is_active: true },
    { id: 3, code: 'SUPER20', discount_type: 'percentage', discount_value: 20, min_spend: 15000, is_active: true }
  ],
  orders: [
    {
      id: 101,
      user_id: 2,
      order_number: 'SC-2026-1001',
      status: 'delivered',
      currency: 'LKR',
      subtotal: 36794,
      discount_total: 3679.4,
      tax_total: 3311.46,
      shipping_total: 0,
      total: 36426.06,
      shipping_address: {
        recipient_name: 'Jane Shopper',
        phone: '+94 77 123 4567',
        line1: '42 Galle Road',
        line2: 'Apt 4B',
        city: 'Colombo',
        postal_code: '00300',
        country_code: 'LK'
      },
      payment_method: 'stripe',
      payment_status: 'paid',
      created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      items: [
        { product_id: 1, name: 'Wireless Headphones Pro', unit_price: 25597, quantity: 1, sku: 'SC-AUD-001' },
        { product_id: 4, name: 'Aluminum Ergonomic Laptop Stand', unit_price: 11197, quantity: 1, sku: 'SC-TEC-001' }
      ]
    },
    {
      id: 102,
      user_id: 2,
      order_number: 'SC-2026-1002',
      status: 'shipped',
      currency: 'LKR',
      subtotal: 19197,
      discount_total: 0,
      tax_total: 1919.7,
      shipping_total: 1917,
      total: 23033.7,
      shipping_address: {
        recipient_name: 'Jane Shopper',
        phone: '+94 77 123 4567',
        line1: '42 Galle Road',
        line2: 'Apt 4B',
        city: 'Colombo',
        postal_code: '00300',
        country_code: 'LK'
      },
      payment_method: 'cash_on_delivery',
      payment_status: 'pending',
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      items: [
        { product_id: 2, name: 'Running Performance Jacket', unit_price: 19197, quantity: 1, sku: 'SC-WEA-001' }
      ]
    }
  ]
};

// ================= REPOSITORY INTERFACE =================

const store = {
  // --- USERS ---
  async getUserByEmail(email) {
    if (!email) return null;
    return mockStore.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  async getUserById(id) {
    return mockStore.users.find((u) => u.id === Number(id)) || null;
  },

  async getUserByVerificationToken(token) {
    return mockStore.users.find((u) => u.verification_token === token) || null;
  },

  async getUserByResetToken(token) {
    const user = mockStore.users.find((u) => u.reset_token === token);
    if (!user) return null;
    if (user.reset_token_expires_at && new Date() > user.reset_token_expires_at) return null;
    return user;
  },

  async createUser({ email, password, firstName, lastName, role = 'customer', phone = '' }) {
    const password_hash = await bcrypt.hash(password, 10);
    const id = mockStore.users.length ? Math.max(...mockStore.users.map((u) => u.id)) + 1 : 1;
    const verification_token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const newUser = {
      id,
      email: email.toLowerCase(),
      password_hash,
      first_name: firstName,
      last_name: lastName,
      role,
      phone,
      verification_token,
      email_verified_at: null,
      created_at: new Date()
    };
    mockStore.users.push(newUser);
    return newUser;
  },

  async updateUser(id, updates) {
    const user = await this.getUserById(id);
    if (!user) return null;
    if (updates.first_name) user.first_name = updates.first_name;
    if (updates.last_name) user.last_name = updates.last_name;
    if (updates.phone !== undefined) user.phone = updates.phone;
    if (updates.password) user.password_hash = await bcrypt.hash(updates.password, 10);
    if (updates.email_verified_at) user.email_verified_at = updates.email_verified_at;
    if (updates.reset_token !== undefined) user.reset_token = updates.reset_token;
    if (updates.reset_token_expires_at !== undefined) user.reset_token_expires_at = updates.reset_token_expires_at;
    return user;
  },

  async getAllUsers() {
    return mockStore.users.map(({ password_hash, verification_token, reset_token, ...safeUser }) => safeUser);
  },

  // --- ADDRESSES ---
  async getUserAddress(userId) {
    return mockStore.addresses.find((a) => a.user_id === Number(userId)) || null;
  },

  async saveUserAddress(userId, addressData) {
    let addr = mockStore.addresses.find((a) => a.user_id === Number(userId));
    if (addr) {
      Object.assign(addr, addressData);
    } else {
      addr = {
        id: mockStore.addresses.length + 1,
        user_id: Number(userId),
        ...addressData,
        country_code: addressData.country_code || 'LK',
        is_default: true
      };
      mockStore.addresses.push(addr);
    }
    return addr;
  },

  // --- PRODUCTS ---
  async getProducts({ category = 'all', search = '', minPrice, maxPrice, rating, brand, sort = 'default', page = 1, limit = 12 }) {
    let list = [...mockStore.products].filter((p) => p.is_active);

    if (category && category !== 'all') {
      const catVal = String(category).toLowerCase().trim();
      list = list.filter((p) => {
        const pCat = (p.category || '').toLowerCase();
        return pCat === catVal || p.category_id === Number(category);
      });
    }

    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || (p.brand && p.brand.toLowerCase().includes(q)));
    }

    if (minPrice !== undefined && minPrice !== '') {
      list = list.filter((p) => p.price >= Number(minPrice));
    }
    if (maxPrice !== undefined && maxPrice !== '') {
      list = list.filter((p) => p.price <= Number(maxPrice));
    }
    if (rating !== undefined && rating !== '') {
      list = list.filter((p) => p.rating >= Number(rating));
    }
    if (brand && brand !== 'all') {
      list = list.filter((p) => p.brand && p.brand.toLowerCase() === brand.toLowerCase());
    }

    // Sorting
    switch (sort) {
      case 'price-low':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        list.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        list.sort((a, b) => b.id - a.id);
        break;
      case 'name-asc':
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // Featured default
        list.sort((a, b) => b.rating - a.rating);
    }

    const total = list.length;
    const offset = (Number(page) - 1) * Number(limit);
    const paginated = list.slice(offset, offset + Number(limit));

    return {
      products: paginated,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.max(1, Math.ceil(total / Number(limit)))
    };
  },

  async getProductById(id) {
    return mockStore.products.find((p) => p.id === Number(id)) || null;
  },

  async getProductBySlug(slug) {
    return mockStore.products.find((p) => p.slug === slug) || null;
  },

  async createProduct(productData) {
    const id = mockStore.products.length ? Math.max(...mockStore.products.map((p) => p.id)) + 1 : 1;
    const slug = productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newProduct = {
      id,
      sku: productData.sku || `SC-PRD-${id.toString().padStart(3, '0')}`,
      slug,
      rating: 5.0,
      reviews: 1,
      is_active: true,
      currency: 'LKR',
      ...productData,
      price: Number(productData.price),
      stock_quantity: Number(productData.stock_quantity || productData.stock || 0)
    };
    mockStore.products.unshift(newProduct);
    return newProduct;
  },

  async updateProduct(id, productData) {
    const p = await this.getProductById(id);
    if (!p) return null;
    Object.assign(p, productData);
    if (productData.price) p.price = Number(productData.price);
    if (productData.stock !== undefined) p.stock_quantity = Number(productData.stock);
    if (productData.stock_quantity !== undefined) p.stock_quantity = Number(productData.stock_quantity);
    return p;
  },

  async deleteProduct(id) {
    const idx = mockStore.products.findIndex((p) => p.id === Number(id));
    if (idx === -1) return false;
    mockStore.products.splice(idx, 1);
    return true;
  },

  // --- CATEGORIES ---
  async getCategories() {
    return mockStore.categories.map((c) => {
      const cSlug = (c.slug || '').toLowerCase();
      const count = mockStore.products.filter(
        (p) => p.is_active && (p.category_id === c.id || (p.category || '').toLowerCase() === cSlug)
      ).length;
      return {
        ...c,
        product_count: count
      };
    });
  },

  async createCategory({ name, slug }) {
    const id = mockStore.categories.length + 1;
    const finalSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const cat = { id, name, slug: finalSlug };
    mockStore.categories.push(cat);
    return cat;
  },

  async deleteCategory(id) {
    const idx = mockStore.categories.findIndex((c) => c.id === Number(id));
    if (idx === -1) return false;
    mockStore.categories.splice(idx, 1);
    return true;
  },

  // --- CARTS ---
  async getCart(cartKey) {
    if (!cartKey) return [];
    const items = mockStore.carts.get(cartKey.toString()) || [];
    return items.map((item) => {
      const product = mockStore.products.find((p) => p.id === item.productId);
      return {
        product_id: item.productId,
        quantity: item.quantity,
        product: product || { id: item.productId, name: 'Item', price: 0 }
      };
    });
  },

  async saveCart(cartKey, items) {
    if (!cartKey) return;
    mockStore.carts.set(cartKey.toString(), items);
  },

  async clearCart(cartKey) {
    if (cartKey) mockStore.carts.delete(cartKey.toString());
  },

  // --- COUPONS ---
  async getCoupon(code) {
    if (!code) return null;
    return mockStore.coupons.find((c) => c.code.toUpperCase() === code.trim().toUpperCase() && c.is_active) || null;
  },

  async getAllCoupons() {
    return mockStore.coupons;
  },

  async createCoupon(data) {
    const id = mockStore.coupons.length + 1;
    const coupon = {
      id,
      code: data.code.toUpperCase(),
      discount_type: data.discount_type || 'percentage',
      discount_value: Number(data.discount_value),
      min_spend: Number(data.min_spend || 0),
      is_active: true
    };
    mockStore.coupons.push(coupon);
    return coupon;
  },

  // --- ORDERS ---
  async createOrder({ userId, items, shippingAddress, subtotal, discountTotal = 0, taxTotal, shippingTotal, total, paymentMethod, couponCode }) {
    const id = mockStore.orders.length ? Math.max(...mockStore.orders.map((o) => o.id)) + 1 : 101;
    const orderNumber = `SC-${new Date().getFullYear()}-${id.toString().padStart(4, '0')}`;
    
    // Decrement stock
    for (const item of items) {
      const prod = mockStore.products.find((p) => p.id === item.product_id);
      if (prod) {
        prod.stock_quantity = Math.max(0, prod.stock_quantity - item.quantity);
      }
    }

    const order = {
      id,
      user_id: userId ? Number(userId) : null,
      order_number: orderNumber,
      status: 'pending',
      currency: 'LKR',
      subtotal: Number(subtotal),
      discount_total: Number(discountTotal),
      tax_total: Number(taxTotal),
      shipping_total: Number(shippingTotal),
      total: Number(total),
      shipping_address: shippingAddress,
      payment_method: paymentMethod,
      payment_status: paymentMethod === 'stripe' ? 'paid' : 'pending',
      coupon_code: couponCode || null,
      created_at: new Date(),
      items: items.map((i) => ({
        product_id: i.product_id,
        name: i.name,
        sku: i.sku || 'SC-PRD',
        unit_price: Number(i.price || i.unit_price),
        quantity: Number(i.quantity)
      }))
    };

    mockStore.orders.unshift(order);
    return order;
  },

  async getOrderById(id) {
    return mockStore.orders.find((o) => o.id === Number(id)) || null;
  },

  async getOrderByNumber(orderNumber) {
    return mockStore.orders.find((o) => o.order_number.toUpperCase() === orderNumber.toUpperCase()) || null;
  },

  async getUserOrders(userId) {
    return mockStore.orders.filter((o) => o.user_id === Number(userId));
  },

  async getAllOrders() {
    return mockStore.orders;
  },

  async updateOrderStatus(orderId, status) {
    const order = await this.getOrderById(orderId);
    if (!order) return null;
    order.status = status;
    order.updated_at = new Date();
    if (status === 'delivered' || status === 'paid') {
      order.payment_status = 'paid';
    }
    return order;
  },

  // --- STATS ---
  async getDashboardStats() {
    const totalOrders = mockStore.orders.length;
    const totalRevenue = mockStore.orders.reduce((sum, o) => sum + (o.payment_status === 'paid' ? o.total : 0), 0);
    const totalProducts = mockStore.products.length;
    const totalUsers = mockStore.users.length;
    const pendingOrders = mockStore.orders.filter((o) => o.status === 'pending').length;

    // Daily sales last 7 days
    const days = [];
    const sales = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const str = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      days.push(str);
      const dayTotal = mockStore.orders
        .filter((o) => new Date(o.created_at).toDateString() === d.toDateString())
        .reduce((sum, o) => sum + o.total, 0);
      sales.push(dayTotal);
    }

    // Category breakdown
    const categoryCounts = mockStore.categories.map((c) => ({
      name: c.name,
      count: mockStore.products.filter((p) => p.category_id === c.id || p.category === c.slug).length
    }));

    return {
      totalOrders,
      totalRevenue,
      totalProducts,
      totalUsers,
      pendingOrders,
      chart: {
        labels: days,
        sales
      },
      categoryCounts,
      recentOrders: mockStore.orders.slice(0, 5)
    };
  }
};

module.exports = {
  store,
  mockStore
};
