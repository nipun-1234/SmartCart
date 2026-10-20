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
  { id: 1, sku: 'SC-LAP-001', name: 'Dell Inspiron 15 Laptop', slug: 'dell-inspiron-15-laptop', category_id: 1, category: 'electronics', price: 199999, original_price: 249999, subtitle: 'Intel i5 • 8GB RAM • 512GB SSD', currency: 'LKR', stock_quantity: 12, rating: 4.6, reviews: 124, brand: 'Dell', badge: 'BEST SELLER', image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&q=80', description: 'Intel i5 12th Gen, 8GB DDR4 RAM, 512GB NVMe SSD, 15.6 inch FHD Anti-Glare display.', is_active: true },
  { id: 2, sku: 'SC-SHO-001', name: 'Nike Air Force 1 Sneakers', slug: 'nike-air-force-1-sneakers', category_id: 2, category: 'clothing', price: 24999, original_price: 32000, subtitle: "Men's • White/Orange", currency: 'LKR', stock_quantity: 18, rating: 4.4, reviews: 78, brand: 'ActiveLife', badge: 'NEW', image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80', description: "Classic Nike Air Force 1 low-top sneakers in crisp white with vibrant orange accents.", is_active: true },
  { id: 3, sku: 'SC-HOM-001', name: 'Philips Air Fryer', slug: 'philips-air-fryer', category_id: 3, category: 'home', price: 34999, original_price: 45000, subtitle: '4.1L • Digital Touch', currency: 'LKR', stock_quantity: 15, rating: 4.5, reviews: 95, brand: 'BrightLiving', badge: 'HOT', image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&q=80', description: 'Philips Rapid Air technology digital air fryer with 4.1L pan and 7 preset touch menus.', is_active: true },
  { id: 4, sku: 'SC-BOK-001', name: 'Atomic Habits', slug: 'atomic-habits', category_id: 5, category: 'books', price: 6077, original_price: 7799, subtitle: 'James Clear', currency: 'LKR', stock_quantity: 40, rating: 4.8, reviews: 210, brand: 'Penguin', badge: '', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&q=80', description: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones by James Clear.', is_active: true },
  { id: 5, sku: 'SC-GRO-001', name: 'Fresh Vegetable Pack', slug: 'fresh-vegetable-pack', category_id: 6, category: 'grocery', price: 1250, original_price: 1600, subtitle: 'Organic • 5kg', currency: 'LKR', stock_quantity: 35, rating: 4.7, reviews: 67, brand: 'Anchor', badge: 'FRESH', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&q=80', description: 'Freshly harvested farm-organic vegetable pack including carrots, potatoes, beans, and greens.', is_active: true },
  { id: 6, sku: 'SC-WAT-001', name: 'Apex Ultra Smart Watch', slug: 'apex-ultra-smart-watch', category_id: 1, category: 'electronics', price: 63997, original_price: 75271, subtitle: 'Fitness • Heart Rate • Waterproof', currency: 'LKR', stock_quantity: 20, rating: 4.3, reviews: 56, brand: 'Apex', badge: 'SALE', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80', description: 'AMOLED display, GPS, SpO2 sensor, heart tracking, and 7-day battery endurance.', is_active: true },
  { id: 7, sku: 'SC-CLO-001', name: "Men's Hoodie Jacket", slug: 'mens-hoodie-jacket', category_id: 2, category: 'clothing', price: 8999, original_price: 11999, subtitle: 'Winter • M-XL', currency: 'LKR', stock_quantity: 25, rating: 4.2, reviews: 48, brand: 'TrailForm', badge: '', image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&q=80', description: 'Warm brushed fleece pullover hoodie jacket with kangaroo pocket and ribbed cuffs.', is_active: true },
  { id: 8, sku: 'SC-STA-001', name: 'Notebook Set (5 pcs)', slug: 'notebook-set-5-pcs', category_id: 7, category: 'stationery', price: 1499, original_price: 1999, subtitle: 'A5 • 100 Pages', currency: 'LKR', stock_quantity: 50, rating: 4.5, reviews: 32, brand: 'Atlas', badge: '', image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&q=80', description: 'Premium spiral-bound A5 notebooks with 100 GSM cream lined paper.', is_active: true },
  { id: 9, sku: 'SC-SHO-002', name: 'Running Shoes', slug: 'running-shoes', category_id: 4, category: 'sports', price: 21999, original_price: 28000, subtitle: "Men's • Lightweight", currency: 'LKR', stock_quantity: 16, rating: 4.6, reviews: 73, brand: 'ActiveLife', badge: '', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80', description: 'Breathable engineered mesh running shoes with responsive foam cushioning.', is_active: true },
  { id: 10, sku: 'SC-BTY-001', name: 'Skin Care Set', slug: 'skin-care-set', category_id: 9, category: 'beauty', price: 12999, original_price: 16500, subtitle: 'Cleanser • Toner • Moisturizer', currency: 'LKR', stock_quantity: 30, rating: 4.4, reviews: 41, brand: 'PureCare', badge: '', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80', description: '3-step revitalizing skincare regimen featuring gentle cleanser, balancing toner, and hydrating lotion.', is_active: true },
  { id: 11, sku: 'SC-SPT-002', name: 'AeroCushion Volcanic Sprint Shoes', slug: 'aerocushion-volcanic-sprint-shoes', category_id: 4, category: 'sports', price: 28797, original_price: 36000, subtitle: 'Volcanic Dynamic Cushioning', currency: 'LKR', stock_quantity: 19, rating: 4.9, reviews: 523, brand: 'ActiveLife', badge: 'HOT', image: '/images/smart-rock-sneaker.jpg', description: 'Next-Gen Cushioning Architecture with 78% energy return dynamics on volcanic shock-absorbent composite chassis.', is_active: true },
  { id: 12, sku: 'SC-HOM-004', name: 'Barista Espresso & Coffee Maker', slug: 'barista-espresso-coffee-maker', category_id: 3, category: 'home', price: 25597, original_price: 32000, subtitle: '15-Bar Italian Pump • Frother', currency: 'LKR', stock_quantity: 16, rating: 4.7, reviews: 345, brand: 'BrightLiving', badge: '', image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=600&q=80', description: '15-bar Italian pump with professional milk frother wand for rich lattes and cappuccinos.', is_active: true },
  { id: 13, sku: 'SC-TEC-002', name: 'Dell UltraSharp 4K USB-C Monitor', slug: 'dell-ultrasharp-4k-monitor', category_id: 1, category: 'electronics', price: 145000, original_price: 175000, subtitle: '27-Inch 4K IPS • 99% sRGB', currency: 'LKR', stock_quantity: 10, rating: 4.8, reviews: 184, brand: 'Dell', badge: '', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&q=80', description: '4K UHD IPS display with USB-C hub connectivity, HDR400, and ultra-thin bezels.', is_active: true },
  { id: 14, sku: 'SC-WEA-004', name: 'Full-Grain Leather Travel Backpack', slug: 'full-grain-leather-travel-backpack', category_id: 2, category: 'clothing', price: 38397, original_price: 48000, subtitle: 'Genuine Leather • 16" Laptop', currency: 'LKR', stock_quantity: 15, rating: 4.9, reviews: 678, brand: 'TrailForm', badge: '', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80', description: 'Handcrafted genuine leather backpack with padded 16-inch laptop compartment.', is_active: true },
  { id: 15, sku: 'SC-BOK-002', name: 'Think Like a Monk', slug: 'think-like-a-monk', category_id: 5, category: 'books', price: 4797, original_price: 5999, subtitle: 'Jay Shetty', currency: 'LKR', stock_quantity: 35, rating: 4.8, reviews: 1089, brand: 'Penguin', badge: '', image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80', description: 'Train your mind for peace and purpose every day using timeless monastic wisdom.', is_active: true },
  { id: 16, sku: 'SC-HOM-005', name: 'Digital Air Fryer XL 6L', slug: 'digital-air-fryer-xl-6l', category_id: 3, category: 'home', price: 51197, original_price: 65000, subtitle: '6L Touch Screen • 8 Presets', currency: 'LKR', stock_quantity: 11, rating: 4.6, reviews: 892, brand: 'BrightLiving', badge: 'SALE', image: 'https://images.unsplash.com/photo-1611071536466-a4057a814b0c?w=600&q=80', description: 'Rapid 360-degree air circulation technology with 8 pre-programmed culinary presets.', is_active: true },
  { id: 17, sku: 'SC-TEC-003', name: 'Apex Wireless Noise-Cancelling Earbuds', slug: 'apex-wireless-earbuds', category_id: 1, category: 'electronics', price: 22397, original_price: 28000, subtitle: 'ANC • 32h Playtime • IPX5', currency: 'LKR', stock_quantity: 30, rating: 4.6, reviews: 556, brand: 'Apex', badge: '', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80', description: 'High-fidelity audio with active noise cancellation and crystal-clear microphone.', is_active: true },
  { id: 18, sku: 'SC-TEC-004', name: 'Dell Premier Wireless ANC Headset', slug: 'dell-premier-wireless-headset', category_id: 1, category: 'electronics', price: 45000, original_price: 55000, subtitle: 'Active Noise Cancellation • Teams', currency: 'LKR', stock_quantity: 15, rating: 4.7, reviews: 92, brand: 'Dell', badge: '', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80', description: 'Active noise cancellation wireless headset designed for high-clarity calls and music.', is_active: true },
  { id: 19, sku: 'SC-TEC-005', name: 'Apex Pro Mechanical Gaming Keyboard', slug: 'apex-pro-mechanical-keyboard', category_id: 1, category: 'electronics', price: 35197, original_price: 44000, subtitle: 'RGB Backlit • Hot-Swap Switches', currency: 'LKR', stock_quantity: 24, rating: 4.9, reviews: 763, brand: 'Apex', badge: '', image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&q=80', description: 'Customizable RGB per-key lighting, aircraft-grade aluminum top frame, and hot-swap switches.', is_active: true },
  { id: 20, sku: 'SC-BOK-003', name: 'The Alchemist', slug: 'the-alchemist', category_id: 5, category: 'books', price: 3837, original_price: 4999, subtitle: 'Paulo Coelho', currency: 'LKR', stock_quantity: 50, rating: 4.9, reviews: 4102, brand: 'Penguin', badge: '', image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80', description: 'The magical story of Santiago, an Andalusian shepherd boy who yearns to travel in search of worldly treasure.', is_active: true },
  { id: 21, sku: 'SC-HOM-006', name: 'Smart Robot Vacuum & Mop', slug: 'smart-robot-vacuum-mop', category_id: 3, category: 'home', price: 95997, original_price: 120000, subtitle: 'LiDAR Laser • 4000Pa Suction', currency: 'LKR', stock_quantity: 8, rating: 4.8, reviews: 892, brand: 'BrightLiving', badge: '', image: 'https://images.unsplash.com/photo-1543486958-d783bfbf7f8e?w=600&q=80', description: 'LiDAR laser navigation, 4000Pa suction power, auto carpet boost, and smart app control.', is_active: true },
  { id: 22, sku: 'SC-SPT-003', name: 'Adjustable Dumbbell Set 20 kg', slug: 'adjustable-dumbbell-set-20-kg', category_id: 4, category: 'sports', price: 23997, original_price: 30000, subtitle: 'Quick-Dial 2.5kg - 20kg', currency: 'LKR', stock_quantity: 17, rating: 4.7, reviews: 456, brand: 'ActiveLife', badge: '', image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&q=80', description: 'Quick-dial weight adjustment from 2.5kg to 20kg with anti-slip knurled grip.', is_active: true },
  { id: 23, sku: 'SC-GRO-002', name: 'Anchor Pure Salted Butter 227g', slug: 'anchor-salted-butter-227g', category_id: 6, category: 'grocery', price: 1450, original_price: 1800, subtitle: 'New Zealand Pure Dairy Cream', currency: 'LKR', stock_quantity: 60, rating: 4.9, reviews: 312, brand: 'Anchor', badge: 'FRESH', image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=600&q=80', description: 'Creamy New Zealand dairy butter crafted from grass-fed cows milk.', is_active: true },
  { id: 24, sku: 'SC-GRO-003', name: 'Anchor Processed Cheese Slices 200g', slug: 'anchor-cheese-slices-200g', category_id: 6, category: 'grocery', price: 1250, original_price: 1550, subtitle: '12 Individually Wrapped Slices', currency: 'LKR', stock_quantity: 50, rating: 4.8, reviews: 290, brand: 'Anchor', badge: '', image: 'https://images.unsplash.com/photo-1624806992066-5ffcf7ca186b?w=600&q=80', description: 'Rich and creamy processed cheddar cheese slices, high in calcium.', is_active: true },
  { id: 25, sku: 'SC-GRO-004', name: 'Anchor Full Cream Milk Powder 400g', slug: 'anchor-milk-powder-400g', category_id: 6, category: 'grocery', price: 1180, original_price: 1400, subtitle: 'Vitamins A & D Fortified', currency: 'LKR', stock_quantity: 45, rating: 4.8, reviews: 489, brand: 'Anchor', badge: '', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&q=80', description: '100% pure New Zealand dairy fortified with Vitamins A & D3 for daily family nutrition.', is_active: true },
  { id: 26, sku: 'SC-SPT-004', name: 'ActiveLife Yoga & Pilates Mat 8mm', slug: 'activelife-yoga-mat-8mm', category_id: 4, category: 'sports', price: 9597, original_price: 12500, subtitle: 'High Density Non-Slip • Strap', currency: 'LKR', stock_quantity: 35, rating: 4.5, reviews: 180, brand: 'ActiveLife', badge: '', image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&q=80', description: 'Extra thick 8mm high density alignment yoga mat with carrying strap.', is_active: true },
  { id: 27, sku: 'SC-STA-002', name: 'Executive Journal & Metal Pen Set', slug: 'executive-journal-pen-set', category_id: 7, category: 'stationery', price: 2850, original_price: 3600, subtitle: 'A5 Dotted • Rollerball Pen', currency: 'LKR', stock_quantity: 30, rating: 4.7, reviews: 140, brand: 'Atlas', badge: '', image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&q=80', description: 'A5 leatherette dotted notebook with ribbon marker and matching weighted rollerball pen.', is_active: true },
  { id: 28, sku: 'SC-HOM-002', name: 'Ceramic Plant Pot Set (3-Pack)', slug: 'ceramic-plant-pot-set', category_id: 3, category: 'home', price: 7997, original_price: 10000, subtitle: 'Glazed Ceramic • Bamboo Trays', currency: 'LKR', stock_quantity: 22, rating: 4.6, reviews: 93, brand: 'BrightLiving', badge: '', image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&q=80', description: 'Modern minimalist glazed ceramic planter set with bamboo drainage trays.', is_active: true },
  { id: 29, sku: 'SC-HLT-001', name: 'Link Natural Samahan Herbal Tea (30 Sachets)', slug: 'link-natural-samahan-tea', category_id: 8, category: 'health', price: 1450, original_price: 1800, subtitle: '14 Authentic Herbal Formula', currency: 'LKR', stock_quantity: 60, rating: 5.0, reviews: 1420, brand: 'Link Natural', badge: 'BEST SELLER', image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&q=80', description: 'Authentic Sri Lankan 14-herb formulation for rapid relief from cold, catarrh, and immunity boost.', is_active: true },
  { id: 30, sku: 'SC-HLT-002', name: 'Baraka Organic Extra Virgin Coconut Oil 500ml', slug: 'baraka-virgin-coconut-oil-500ml', category_id: 8, category: 'health', price: 1850, original_price: 2300, subtitle: '100% Pure Cold-Pressed Ceylon', currency: 'LKR', stock_quantity: 40, rating: 4.9, reviews: 380, brand: 'Baraka', badge: '', image: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=600&q=80', description: '100% pure cold-pressed unrefined Ceylon virgin coconut oil rich in Lauric Acid and MCTs.', is_active: true },
  { id: 31, sku: 'SC-HLT-003', name: 'Siddhalepa Herbal Ayurvedic Balm 50g', slug: 'siddhalepa-ayurvedic-balm-50g', category_id: 8, category: 'health', price: 420, original_price: 550, subtitle: 'Traditional Herbal Pain Relief', currency: 'LKR', stock_quantity: 120, rating: 4.9, reviews: 2100, brand: 'Siddhalepa', badge: '', image: 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=600&q=80', description: 'Traditional herbal pain relief balm crafted from clove, cinnamon, eucalyptus and citronella essence.', is_active: true },
  { id: 32, sku: 'SC-BTY-002', name: 'Spa Ceylon Cinnamon & Honey Facial Cleanser', slug: 'spa-ceylon-cinnamon-honey-cleanser', category_id: 9, category: 'beauty', price: 3850, original_price: 4900, subtitle: 'Organic Ceylon Cinnamon • 150ml', currency: 'LKR', stock_quantity: 35, rating: 4.8, reviews: 310, brand: 'PureCare', badge: '', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80', description: 'Ayurvedic brightening face wash infused with pure organic Ceylon cinnamon and raw forest bee honey.', is_active: true },
  { id: 33, sku: 'SC-BTY-003', name: 'Pure Aloe Vera Soothing Hydration Gel 250ml', slug: 'pure-aloe-vera-soothing-gel', category_id: 9, category: 'beauty', price: 1250, original_price: 1600, subtitle: '99% Pure Hydration Formula', currency: 'LKR', stock_quantity: 50, rating: 4.8, reviews: 490, brand: 'PureCare', badge: '', image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&q=80', description: '99% pure soothing gel for instant skin cooling, deep daily moisture, and sun damage recovery.', is_active: true },
  { id: 34, sku: 'SC-HOM-003', name: 'Modern Smart LED Desk Lamp with Qi Charger', slug: 'modern-smart-led-desk-lamp', category_id: 3, category: 'home', price: 12797, original_price: 16000, subtitle: 'Touch Dimming • 10W Wireless Qi', currency: 'LKR', stock_quantity: 34, rating: 4.4, reviews: 178, brand: 'BrightLiving', badge: '', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80', description: 'Touch-sensitive dimming with 5 color modes and integrated 10W wireless charging base.', is_active: true },
  { id: 35, sku: 'SC-TOY-001', name: 'STEM Robotic Science & Coding Kit for Kids', slug: 'stem-robotic-science-kit', category_id: 10, category: 'toys', price: 8750, original_price: 11000, subtitle: '14-in-1 Solar Powered • Ages 8+', currency: 'LKR', stock_quantity: 20, rating: 4.9, reviews: 185, brand: 'SmartKidz', badge: 'NEW', image: 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=600&q=80', description: 'Solar-powered 14-in-1 programmable robot building kit to develop engineering and logic skills.', is_active: true },
  { id: 36, sku: 'SC-TOY-002', name: 'Eco Wooden Geometric Puzzle Board & Blocks', slug: 'eco-wooden-geometric-puzzle', category_id: 10, category: 'toys', price: 3250, original_price: 4200, subtitle: 'Montessori Organic Sensory Wood', currency: 'LKR', stock_quantity: 30, rating: 4.8, reviews: 160, brand: 'SmartKidz', badge: '', image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&q=80', description: 'Non-toxic organic wooden sorting and stacking Montessori sensory educational toy for toddlers.', is_active: true },
  { id: 37, sku: 'SC-TOY-003', name: 'High-Speed 4WD All-Terrain Remote Control Stunt Car', slug: '4wd-remote-control-stunt-car', category_id: 10, category: 'toys', price: 6850, original_price: 8800, subtitle: '360° Double-Sided Tumbling', currency: 'LKR', stock_quantity: 22, rating: 4.7, reviews: 240, brand: 'Turborun', badge: '', image: 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=600&q=80', description: '360-degree double-sided tumbling RC stunt car with shockproof tires and USB rechargeable battery.', is_active: true }
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
      const tokens = q.split(/\s+/).filter(Boolean);
      list = list.filter((p) => {
        const full = `${p.name} ${p.description || ''} ${p.brand || ''} ${p.category || ''}`.toLowerCase();
        return full.includes(q) || tokens.every((t) => full.includes(t)) || (tokens.length > 1 && tokens.some((t) => t.length > 2 && full.includes(t)));
      });
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
        // Featured default (Best Match by curated sequence)
        list.sort((a, b) => a.id - b.id);
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
