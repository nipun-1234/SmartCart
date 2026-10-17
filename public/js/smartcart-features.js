/**
 * SmartCart - Interactive Features Module
 * Supports 11 Core Storefront Capabilities:
 * 1. Tri-lingual i18n (EN / SI / TA)
 * 2. Wishlist Management & Drawer
 * 3. AI Shopping Assistant (Sri Lanka Presets)
 * 4. Live Budget Mode Slider & Meter
 * 5. Smart Grocery List Raw Text Parser
 * 6. Seasonal Deals & Countdown Ticker
 * 7. Seasonal Bundles & "Reorder Last Order"
 * 8. 25-District Sri Lanka Delivery Estimator
 * 9. Product Comparison Drawer
 * 10. WhatsApp / Email VIP Signup & Voucher Generator
 * 11. FAQ & Merchant "Sell with Us" Modals
 */

// ==================== 1. TRI-LINGUAL I18N DICTIONARY ====================
const i18nData = {
  en: {
    navHome: "Home",
    navCatalog: "Catalog",
    navCart: "Cart",
    navWishlist: "Wishlist",
    navSignIn: "Sign In",
    searchPlaceholder: "What are you looking for today? (e.g. Shoes, Rice, Tea...)",
    heroPretitle: 'SMART CHOICES, BETTER <span class="pretitle-highlight">LIVING</span>',
    heroHeadline1: "Everything You Need,",
    heroHeadline2: "All in One Place",
    heroSubtext: "Discover quality products, amazing deals and a seamless shopping experience — only at SmartCart.",
    heroShopNow: "Shop now",
    trustCod: "Cash on Delivery Available",
    trustCodSub: "Pay safely with cash or card right at your doorstep",
    trustDelivery: "Island-Wide Fast Delivery",
    trustDeliverySub: "24-48 hours delivery across all 25 districts",
    trustPayment: "100% Secure Checkout",
    trustPaymentSub: "PayHere, LankaQR & 256-bit SSL encryption",
    trustGuarantee: "30-Day Money Back",
    trustGuaranteeSub: "Authentic products with manufacturer warranty",
    catTitle: "Shop by Category",
    catSub: "Select a category to jump straight into tailored catalog filters",
    dealsTitle: "Flash Sale & Seasonal Deals",
    dealsSub: "Urgent limited-time offers with special holiday voucher discounts",
    featuredTitle: "Featured & Trending Products",
    featuredSub: "Top-rated Sri Lankan bestsellers backed by SmartCart quality guarantee",
    smartTitle: "Smart Features Highlight",
    smartSub: "Intelligent tools designed to make online shopping effortless and budget-friendly",
    bundlesTitle: "Seasonal Value Bundles",
    bundlesSub: "Handpicked festive hampers and household packs with exclusive bundled discounts",
    deliveryTitle: "Delivery & Payment Information",
    deliverySub: "Check delivery times for your district and explore accepted payment channels",
    reviewsTitle: "What Our Shoppers Say",
    reviewsSub: "Over 2,800+ verified 5-star reviews from customers all across the island",
    newsletterTitle: "Unlock 10% Off Your Next Order",
    newsletterSub: "Subscribe via Email or WhatsApp for instant flash drops, secret deals, and price alerts.",
    newsletterBtn: "Get My 10% Voucher",
    footerAbout: "About SmartCart",
    footerAboutText: "Sri Lanka's premiere smart e-commerce platform blending intelligent AI discovery, transparent pricing, and trusted doorstep fulfillment.",
    footerSellWithUs: "Sell with Us",
    footerContact: "Contact Support",
    footerReturn: "Return Policy",
    footerFaq: "FAQ",
    footerRights: "© 2026 SmartCart Sri Lanka. All rights reserved."
  },
  si: {
    navHome: "මුල් පිටුව",
    navCatalog: "භාණ්ඩ නාමාවලිය",
    navCart: "කරත්තය",
    navWishlist: "පැතුම් ලැයිස්තුව",
    navSignIn: "ඇතුල් වන්න",
    searchPlaceholder: "ඔබ සොයන්නේ කුමක්ද? (උදා: පාවහන්, සහල්, තේ...)",
    heroPretitle: 'ස්මාර්ට් තේරීම්, උසස් <span class="pretitle-highlight">ජීවිතයක්</span>',
    heroHeadline1: "ඔබට අවශ්‍ය සියල්ල,",
    heroHeadline2: "එකම තැනකින්",
    heroSubtext: "විශිෂ්ට නිෂ්පාදන, ආකර්ෂණීය දීමනා සහ පහසුම සාප්පු සවාරි අත්දැකීම — SmartCart වෙතින් පමණි.",
    heroShopNow: "දැන්ම මිලදී ගන්න",
    trustCod: "ලැබුණු පසු මුදල් ගෙවන්න (COD)",
    trustCodSub: "නිවසටම භාණ්ඩ ලැබුණු පසු මුදලින් හෝ කාඩ්පතින් ගෙවන්න",
    trustDelivery: "දිවයින පුරා කඩිනම් බෙදාහැරීම",
    trustDeliverySub: "දිස්ත්‍රික්ක 25 පුරාම පැය 24-48 අතර බෙදාහැරීම",
    trustPayment: "100% ආරක්ෂිත ගෙවීම්",
    trustPaymentSub: "PayHere, LankaQR සහ සුරක්ෂිත SSL ගෙවීම් පද්ධති",
    trustGuarantee: "දින 30ක වගකීමක්",
    trustGuaranteeSub: "100% නියම භාණ්ඩ සහ මුදල් ආපසු ලබාදීමේ සහතිකය",
    catTitle: "වර්ගීකරණය අනුව සොයන්න",
    catSub: "ඔබට අවශ්‍ය අංශය තෝරා පහසුවෙන්ම භාණ්ඩ තෝරාගන්න",
    dealsTitle: "විශේෂ සෘතුමය දීමනා (Flash Deals)",
    dealsSub: "සීමිත කාලයක් සඳහා පමණක් වලංගු වට්ටම් සහ වවුචර් කේත",
    featuredTitle: "ජනප්‍රියම සහ විශේෂිත භාණ්ඩ",
    featuredSub: "පාරිභෝගිකයින්ගේ ඉහළම ඇගයීම ලත් උසස් තත්ත්වයේ නිෂ්පාදන",
    smartTitle: "SmartCart හි ස්මාර්ට් විශේෂාංග",
    smartSub: "ඔබගේ සාප්පු සවාරිය වඩාත් පහසු සහ ලාභදායී කරන බුද්ධිමත් මෙවලම්",
    bundlesTitle: "සෘතුමය පැකේජ (Bundles)",
    bundlesSub: "අවුරුදු, පාසල් සහ මාසික ගෘහස්ථ වියදම් අඩුකරන විශේෂ එකතු",
    deliveryTitle: "බෙදාහැරීම් සහ ගෙවීම් විස්තර",
    deliverySub: "ඔබගේ දිස්ත්‍රික්කයට බෙදාහැරීමේ කාලය සහ ගෙවීම් ක්‍රම මෙතැනින් පරීක්ෂා කරන්න",
    reviewsTitle: "පාරිභෝගික අදහස්",
    reviewsSub: "දිවයින පුරා සෑහීමකට පත් පාරිභෝගිකයින් 2,800+ කගේ තරු 5 අදහස්",
    newsletterTitle: "ඔබගේ ඊළඟ ඇණවුමට 10%ක වට්ටමක්",
    newsletterSub: "Email හෝ WhatsApp මඟින් සම්බන්ධ වී විශේෂ දීමනා සහ වවුචර් ක්ෂණිකව ලබාගන්න.",
    newsletterBtn: "10% වවුචරය ලබාගන්න",
    footerAbout: "SmartCart ගැන",
    footerAboutText: "ශ්‍රී ලාංකිකයින්ට උසස් තාක්ෂණයෙන් යුත්, විශ්වාසදායක සහ වේගවත්ම මාර්ගගත සාප්පු සවාරි අත්දැකීම.",
    footerSellWithUs: "අප සමඟ වෙළඳාම් කරන්න",
    footerContact: "සම්බන්ධතා සහ සහාය",
    footerReturn: "ආපසු ලබාදීමේ ප්‍රතිපත්තිය",
    footerFaq: "නිතර අසන ප්‍රශ්න (FAQ)",
    footerRights: "© 2026 SmartCart ශ්‍රී ලංකා. සියලු හිමිකම් ඇවිරිණි."
  },
  ta: {
    navHome: "முகப்பு",
    navCatalog: "பொருட்கள் பட்டியல்",
    navCart: "கூடை",
    navWishlist: "விருப்பப் பட்டியல்",
    navSignIn: "உள்நுழைக",
    searchPlaceholder: "நீங்கள் என்ன தேடுகிறீர்கள்? (எ.கா: பாதணிகள், அரிசி, தேயிலை...)",
    heroPretitle: 'புத்திசாலித்தனமான தேர்வுகள், சிறந்த <span class="pretitle-highlight">வாழ்க்கை</span>',
    heroHeadline1: "உங்களுக்கு தேவையான அனைத்தும்,",
    heroHeadline2: "ஒரே இடத்தில்",
    heroSubtext: "தரமான பொருட்கள், அற்புதமான சலுகைகள் மற்றும் சிறந்த கொள்வனவு அனுபவம் — SmartCart இல் மட்டுமே.",
    heroShopNow: "இப்போதே வாங்க",
    trustCod: "வீட்டில் செலுத்தும் வசதி (COD)",
    trustCodSub: "பொருட்களைப் பெற்றதும் பணமாக அல்லது அட்டையில் செலுத்தலாம்",
    trustDelivery: "தீவு தழுவிய விரைவு விநியோகம்",
    trustDeliverySub: "25 மாவட்டங்களிலும் 24-48 மணிநேரத்திற்குள் விரைவு விநியோகம்",
    trustPayment: "100% பாதுகாப்பான கொடுப்பனவு",
    trustPaymentSub: "PayHere, LankaQR மற்றும் 256-bit பாதுகாப்பான தளம்",
    trustGuarantee: "30 நாட்கள் உத்தரவாதம்",
    trustGuaranteeSub: "100% அசல் தயாரிப்புகள் மற்றும் பணம் திரும்பப்பெறும் உத்தரவாதம்",
    catTitle: "பிரிவுகள் வாரியாக ஆராய்க",
    catSub: "விருப்பமான பகுதியைத் தேர்ந்தெடுத்து தேவையான பொருட்களை சுலபமாக பெறுக",
    dealsTitle: "சிறப்பு அதிரடி சலுகைகள்",
    dealsSub: "குறிப்பிட்ட காலத்திற்கு மட்டுமே செல்லுபடியாகும் சிறப்புக் கூப்பன்கள்",
    featuredTitle: "பிரபலமான முன்னணி தயாரிப்புகள்",
    featuredSub: "நுகர்வோரின் மிக உயர்ந்த மதிப்பீட்டைப் பெற்ற அசல் பொருட்கள்",
    smartTitle: "ஸ்மார்ட் விசேட அம்சங்கள்",
    smartSub: "உங்கள் கொள்வனவை இலகுவாகவும் சிக்கனமாகவும் மாற்றும் நவீன கருவிகள்",
    bundlesTitle: "பருவகால சிறப்பு தொகுப்புகள்",
    bundlesSub: "புதுவருட மற்றும் மாதாந்த குடும்பத் தேவைகளுக்கான குறைந்த விலை பொதிகள்",
    deliveryTitle: "விநியோகம் & கொடுப்பனவு தகவல்கள்",
    deliverySub: "உங்கள் மாவட்டத்திற்கான விநியோக நேரம் மற்றும் கொடுப்பனவு முறைகளை அறியவும்",
    reviewsTitle: "வாடிக்கையாளர் கருத்துகள்",
    reviewsSub: "இலங்கை முழுவதிலுமிருந்து 2,800+ க்கும் மேற்பட்ட திருப்திகரமான 5-நட்சத்திர மதிப்பீடுகள்",
    newsletterTitle: "அடுத்த ஆர்டருக்கு 10% தள்ளுபடி பெறுங்கள்",
    newsletterSub: "மின்னஞ்சல் அல்லது WhatsApp மூலம் இணைந்து பிரத்தியேக சலுகைகளை உடனே பெறுங்கள்.",
    newsletterBtn: "10% கூப்பனைப் பெறுக",
    footerAbout: "SmartCart பற்றி",
    footerAboutText: "இலங்கையின் முன்னணி நவீன இணைய வர்த்தக தளம். அதிநவீன AI தொழில்நுட்பம் மற்றும் நம்பகமான விநியோகம்.",
    footerSellWithUs: "எங்களுடன் இணையுங்கள் (வணிகர்)",
    footerContact: "தொடர்பு & உதவி",
    footerReturn: "பொருட்களை திருப்பியளிக்கும் கொள்கை",
    footerFaq: "அடிக்கடி கேட்கப்படும் கேள்விகள்",
    footerRights: "© 2026 SmartCart இலங்கை. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை."
  }
};

let currentLang = localStorage.getItem('smartcart_lang') || 'en';

function setLanguage(lang) {
  if (!i18nData[lang]) lang = 'en';
  currentLang = lang;
  localStorage.setItem('smartcart_lang', lang);

  // Update active pill styling
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
  });

  // Apply translations to all DOM elements with data-i18n
  const dict = i18nData[lang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      if (dict[key].includes('<')) {
        el.innerHTML = dict[key];
      } else {
        el.textContent = dict[key];
      }
    }
  });

  // Update inputs with data-i18n-ph
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const key = el.getAttribute('data-i18n-ph');
    if (dict[key]) {
      el.placeholder = dict[key];
    }
  });

  if (typeof showToast === 'function') {
    const langNames = { en: 'English', si: 'සිංහල', ta: 'தமிழ்' };
    showToast('Language Changed', `Switched display language to ${langNames[lang]}`, 'info');
  }
}

// ==================== 2. WISHLIST MANAGEMENT ====================
const SMARTCART_WISHLIST_KEY = 'smartcart_wishlist';

function getWishlist() {
  try {
    const raw = localStorage.getItem(SMARTCART_WISHLIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (_e) {
    return [];
  }
}

function saveWishlist(items) {
  localStorage.setItem(SMARTCART_WISHLIST_KEY, JSON.stringify(items));
  updateWishlistBadge();
}

function updateWishlistBadge() {
  const items = getWishlist();
  const count = items.length;
  document.querySelectorAll('#wishlistBadge, .wishlist-badge').forEach(badge => {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'inline-block' : 'none';
  });
}

function isInWishlist(productId) {
  const list = getWishlist();
  return list.some(item => Number(item.id) === Number(productId));
}

function toggleWishlist(product) {
  if (!product || !product.id) return;
  let list = getWishlist();
  const existingIdx = list.findIndex(i => Number(i.id) === Number(product.id));

  if (existingIdx > -1) {
    list.splice(existingIdx, 1);
    saveWishlist(list);
    if (typeof showToast === 'function') {
      showToast('Wishlist Updated', `Removed "${product.name}" from your Wishlist.`, 'info');
    }
  } else {
    list.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      brand: product.brand || 'SmartCart'
    });
    saveWishlist(list);
    if (typeof showToast === 'function') {
      showToast('Saved to Wishlist ❤️', `"${product.name}" added to your Wishlist!`, 'success');
    }
  }

  // Update heart icons on cards
  updateWishlistHearts();
  renderWishlistDrawer();
}

function updateWishlistHearts() {
  document.querySelectorAll('.btn-wishlist-heart').forEach(btn => {
    const pid = Number(btn.getAttribute('data-product-id'));
    const inWish = isInWishlist(pid);
    btn.classList.toggle('active', inWish);
    btn.innerHTML = `<i class="${inWish ? 'fas fa-heart' : 'far fa-heart'}"></i>`;
    btn.style.color = inWish ? '#FF3B30' : 'rgba(255,255,255,0.7)';
  });
}

function openWishlistDrawer() {
  renderWishlistDrawer();
  const drawer = document.getElementById('wishlistDrawer');
  const backdrop = document.getElementById('wishlistBackdrop');
  if (drawer && backdrop) {
    drawer.classList.add('open');
    backdrop.classList.add('active');
  }
}

function closeWishlistDrawer() {
  const drawer = document.getElementById('wishlistDrawer');
  const backdrop = document.getElementById('wishlistBackdrop');
  if (drawer && backdrop) {
    drawer.classList.remove('open');
    backdrop.classList.remove('active');
  }
}

function renderWishlistDrawer() {
  const container = document.getElementById('wishlistDrawerContent');
  if (!container) return;
  const list = getWishlist();

  if (list.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 48px 20px; color: rgba(255,255,255,0.5);">
        <i class="far fa-heart" style="font-size: 3rem; margin-bottom: 16px; color: rgba(255,255,255,0.2);"></i>
        <h4 style="color: #fff; margin-bottom: 6px;">Your Wishlist is Empty</h4>
        <p style="font-size: 0.85rem;">Click the heart icon on any product to save items you love for later.</p>
        <button class="btn btn-primary" onclick="closeWishlistDrawer(); scrollToShop();" style="margin-top: 18px; padding: 10px 20px;">
          Explore Products
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 12px;">
      ${list.map(item => `
        <div class="wishlist-drawer-item">
          <img src="${item.image}" alt="${item.name}">
          <div style="flex: 1; min-width: 0;">
            <div style="font-size: 0.72rem; color: var(--electric-blue); font-weight: 700; text-transform: uppercase;">${item.category}</div>
            <div style="font-size: 0.88rem; font-weight: 600; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.name}</div>
            <div style="font-size: 0.95rem; font-weight: 700; color: var(--lime-green);">${fmtLKR(item.price)}</div>
          </div>
          <div style="display: flex; gap: 6px; align-items: center;">
            <button class="btn-wishlist-cart" onclick="addWishlistItemToCart(${item.id})" title="Move to Cart">
              <i class="fas fa-cart-plus"></i>
            </button>
            <button class="btn-wishlist-del" onclick="toggleWishlist({id: ${item.id}, name: '${item.name.replace(/'/g, "\\'")}'})" title="Remove">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </div>
      `).join('')}
    </div>
    <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.1); display: flex; gap: 10px;">
      <button class="btn btn-outline" onclick="clearAllWishlist()" style="flex: 1; font-size: 0.85rem; padding: 10px;">
        Clear All
      </button>
      <button class="btn btn-primary" onclick="addAllWishlistToCart()" style="flex: 2; font-size: 0.85rem; padding: 10px;">
        <i class="fas fa-cart-arrow-down"></i> Move All to Cart
      </button>
    </div>
  `;
}

async function addWishlistItemToCart(productId) {
  try {
    const res = await fetch(`/api/products/${productId}`);
    const data = await res.json();
    if (data.success && data.product) {
      addToCart(data.product, 1);
    }
  } catch (_e) {
    showToast('Error', 'Could not add item to cart', 'error');
  }
}

function clearAllWishlist() {
  saveWishlist([]);
  renderWishlistDrawer();
  updateWishlistHearts();
  showToast('Wishlist Cleared', 'All saved items have been cleared.', 'info');
}

async function addAllWishlistToCart() {
  const list = getWishlist();
  if (list.length === 0) return;
  for (const item of list) {
    try {
      const res = await fetch(`/api/products/${item.id}`);
      const data = await res.json();
      if (data.success && data.product) {
        addToCart(data.product, 1);
      }
    } catch (_e) {}
  }
  closeWishlistDrawer();
  showToast('All Items Added', `${list.length} wishlist items added to cart!`, 'success');
}

// ==================== 3. AI SHOPPING ASSISTANT ====================
const aiKnowledgeBase = [
  {
    keywords: ['5000', 'gift', 'present', 'parissal', 'thagiya', 'තෑගි', 'podda', 'cheap', 'budget gift'],
    responseSi: "රු. 5,000 ට අඩු විශිෂ්ට තෑගි සඳහා: අපගේ Atlas Executive Hardcover Journal Set (Rs. 2,850), The Alchemist Classic Book (Rs. 3,837), සහ Think Like a Monk (Rs. 4,797) සුපිරි තේරීම් වේ!",
    responseEn: "For thoughtful gifts under Rs. 5,000: We recommend the Atlas Executive Journal & Pen Set (Rs. 2,850), The Alchemist Classic Book (Rs. 3,837), and Think Like a Monk (Rs. 4,797)!",
    productIds: [27, 20, 18]
  },
  {
    keywords: ['headphone', 'audio', 'earphone', 'music', 'sound', 'gaming audio'],
    responseSi: "ඉහළම ශබ්ද ගුණාත්මකභාවය සඳහා: Active Noise Cancellation සහිත SoundPeak Wireless Headphones Pro (Rs. 25,597) සහ IPX7 Rugged Bluetooth Speaker (Rs. 28,797) අංක 1 නිර්දේශයයි!",
    responseEn: "For premium acoustic clarity: SoundPeak Wireless Headphones Pro (Rs. 25,597) with Active Noise Cancelling and IPX7 Rugged Bluetooth Speaker (Rs. 28,797) are our #1 top picks!",
    productIds: [1, 8]
  },
  {
    keywords: ['grocery', 'food', 'rice', 'tea', 'milk', 'badu', 'household', 'kema', 'සහල්', 'කෑම'],
    responseSi: "ගෘහස්ථ මාසික ආහාර ද්‍රව්‍ය සඳහා: අරලිය කීරි සම්බා සහල් 5kg (Rs. 1,650), දිල්මා පිරිසිදු ලංකා තේ 400g (Rs. 1,250), ඇන්කර් කිරිපිටි 400g (Rs. 1,180) සහ මන්චි සුපර් ක්‍රීම් ක්‍රැකර් (Rs. 650) ඔබගේ ලැයිස්තුවට හොඳින්ම ගැලපේ!",
    responseEn: "For household grocery essentials: Araliya Keeri Samba 5kg (Rs. 1,650), Dilmah Pure Ceylon Tea 400g (Rs. 1,250), Anchor Milk Powder 400g (Rs. 1,180), and Munchee Cream Crackers (Rs. 650) are available for express islandwide delivery!",
    productIds: [23, 24, 25, 26]
  },
  {
    keywords: ['shoe', 'running', 'fitness', 'sneaker', 'volcanic', 'aerocushion', 'gym', 'workout'],
    responseSi: "ක්‍රීඩා සහ ධාවන ශක්තිය සඳහා: 78% energy return සහිත AeroCushion Volcanic Sprint Shoes (Rs. 28,797) සහ Quick-Dial Adjustable Dumbbell Set (Rs. 23,997) නිර්දේශ කරමු!",
    responseEn: "For elite athletic performance: AeroCushion Volcanic Sprint Shoes (Rs. 28,797) featuring 78% energy return cushioning and Adjustable Dumbbell Set (Rs. 23,997) deliver unbeatable comfort and durability!",
    productIds: [11, 22, 9]
  },
  {
    keywords: ['tech', 'workspace', 'laptop', 'smart', 'watch', 'keyboard', 'office'],
    responseSi: "කාර්යාල සහ ස්මාර්ට් උපාංග සඳහා: Apex Ultra Smart Watch (Rs. 63,997), Mechanical RGB Hot-Swap Keyboard (Rs. 35,197), සහ Aluminum Ergonomic Laptop Stand (Rs. 11,197) පරිපූර්ණයි!",
    responseEn: "For state-of-the-art tech workspaces: Apex Ultra AMOLED Smart Watch (Rs. 63,997), Mechanical RGB Keyboard (Rs. 35,197), and Aluminum Laptop Stand (Rs. 11,197) are top-rated by professionals!",
    productIds: [5, 19, 4]
  }
];

async function handleAiAssistantSubmit(customQuery) {
  const input = document.getElementById('aiAssistantInput');
  const query = (customQuery || (input ? input.value : '')).trim().toLowerCase();
  if (!query) return;

  const resultBox = document.getElementById('aiAssistantResults');
  const loader = document.getElementById('aiAssistantLoader');
  if (loader) loader.style.display = 'block';
  if (resultBox) resultBox.innerHTML = '';

  setTimeout(async () => {
    if (loader) loader.style.display = 'none';

    // Match query against knowledge base
    let matched = aiKnowledgeBase.find(kb => kb.keywords.some(k => query.includes(k)));
    if (!matched) matched = aiKnowledgeBase[0]; // fallback to gift guide

    const explanation = currentLang === 'si' ? matched.responseSi : matched.responseEn;

    // Fetch product details
    const productCardsHtml = [];
    for (const pid of matched.productIds) {
      try {
        const res = await fetch(`/api/products/${pid}`);
        const data = await res.json();
        if (data.success && data.product) {
          const p = data.product;
          productCardsHtml.push(`
            <div class="ai-rec-card">
              <img src="${p.image}" alt="${p.name}">
              <div class="ai-rec-info">
                <span class="ai-rec-brand">${p.brand || 'SmartCart'} • ★ ${p.rating}</span>
                <h4 class="ai-rec-title" onclick="openQuickView(${p.id})">${p.name}</h4>
                <div class="ai-rec-price">${fmtLKR(p.price)}</div>
              </div>
              <button class="btn-ai-add" onclick="addToCart(${JSON.stringify(p).replace(/"/g, '&quot;')})" title="Add to Cart">
                <i class="fas fa-cart-plus"></i> Add
              </button>
            </div>
          `);
        }
      } catch (_e) {}
    }

    if (resultBox) {
      resultBox.innerHTML = `
        <div class="ai-response-bubble">
          <div class="ai-badge-row">
            <span class="ai-badge"><i class="fas fa-sparkles"></i> SmartCart AI Assistant</span>
            <span style="font-size: 0.75rem; color: rgba(255,255,255,0.5);">Verified Match</span>
          </div>
          <p class="ai-response-text">${explanation}</p>
          <div class="ai-rec-grid">
            ${productCardsHtml.join('')}
          </div>
        </div>
      `;
    }
  }, 450);
}

// ==================== 4. BUDGET MODE SLIDER & METER ====================
let userBudget = Number(localStorage.getItem('smartcart_budget')) || 35000;

function setupBudgetMode() {
  const slider = document.getElementById('budgetSlider');
  const valDisplay = document.getElementById('budgetValueDisplay');
  if (!slider) return;

  slider.value = userBudget;
  if (valDisplay) valDisplay.textContent = fmtLKR(userBudget);

  slider.addEventListener('input', (e) => {
    userBudget = Number(e.target.value);
    localStorage.setItem('smartcart_budget', userBudget);
    if (valDisplay) valDisplay.textContent = fmtLKR(userBudget);
    updateBudgetCalculations();
  });

  updateBudgetCalculations();
}

function updateBudgetCalculations() {
  const cartItems = getLocalCart();
  const cartTotal = cartItems.reduce((sum, item) => sum + (Number(item.price) * (item.quantity || 1)), 0);

  const cartTotalEl = document.getElementById('budgetCartTotal');
  const remainingEl = document.getElementById('budgetRemaining');
  const barEl = document.getElementById('budgetProgressBar');
  const statusEl = document.getElementById('budgetStatusTag');

  if (cartTotalEl) cartTotalEl.textContent = fmtLKR(cartTotal);

  const remaining = userBudget - cartTotal;
  if (remainingEl) {
    remainingEl.textContent = fmtLKR(Math.abs(remaining));
    remainingEl.style.color = remaining >= 0 ? 'var(--lime-green)' : '#ff4d6d';
  }

  const pct = Math.min(100, Math.round((cartTotal / userBudget) * 100));
  if (barEl) {
    barEl.style.width = `${pct}%`;
    if (pct < 70) {
      barEl.style.background = 'linear-gradient(90deg, #E8702A, #FFB800)';
    } else if (pct < 95) {
      barEl.style.background = 'linear-gradient(90deg, #FFD600, #FF6B35)';
    } else {
      barEl.style.background = 'linear-gradient(90deg, #FF6B35, #FF3B30)';
    }
  }

  if (statusEl) {
    if (cartTotal === 0) {
      statusEl.textContent = "Cart is Empty — Plenty of Room!";
      statusEl.className = "budget-tag safe";
    } else if (remaining >= 0) {
      statusEl.textContent = `${pct}% Used • You have ${fmtLKR(remaining)} left in your budget`;
      statusEl.className = "budget-tag safe";
    } else {
      statusEl.textContent = `⚠️ Over Budget by ${fmtLKR(Math.abs(remaining))}! Review items to save`;
      statusEl.className = "budget-tag alert";
    }
  }
}

// ==================== 5. SMART GROCERY LIST PARSER ====================
const groceryKeywordMap = [
  { match: ['rice', 'keeri samba', 'samba', 'hal', 'සහල්'], productId: 23 },
  { match: ['tea', 'dilmah', 'ceylon tea', 'the', 'තේ'], productId: 24 },
  { match: ['milk', 'anchor', 'kiri', 'කිරි'], productId: 25 },
  { match: ['cracker', 'munchee', 'biscuit', 'cream cracker', 'බිස්කට්'], productId: 26 },
  { match: ['coffee', 'espresso', 'barista', 'කෝපි'], productId: 12 },
  { match: ['notebook', 'journal', 'pen', 'atlas', 'stationery', 'පොත්'], productId: 27 },
  { match: ['markers', 'colors', 'paint', 'art'], productId: 28 },
  { match: ['shoes', 'sneakers', 'sprint'], productId: 11 },
  { match: ['headphones', 'earphones', 'soundpeak'], productId: 1 }
];

async function parseSmartGroceryList() {
  const textarea = document.getElementById('smartGroceryText');
  const resultsContainer = document.getElementById('groceryMatchResults');
  if (!textarea || !resultsContainer) return;

  const rawText = textarea.value.trim().toLowerCase();
  if (!rawText) {
    showToast('Empty List', 'Please paste or write your grocery list items first.', 'warning');
    return;
  }

  resultsContainer.innerHTML = '<div style="padding: 16px; color: var(--electric-blue); font-size: 0.9rem;"><i class="fas fa-spinner fa-spin"></i> Smart parsing items and matching with catalog...</div>';

  const tokens = rawText.split(/[\n,;]+/).map(t => t.trim()).filter(Boolean);
  const matchedProductIds = new Set();

  tokens.forEach(token => {
    groceryKeywordMap.forEach(rule => {
      if (rule.match.some(m => token.includes(m))) {
        matchedProductIds.add(rule.productId);
      }
    });
  });

  if (matchedProductIds.size === 0) {
    resultsContainer.innerHTML = `
      <div style="padding: 20px; text-align: center; color: rgba(255,255,255,0.7); background: rgba(255,255,255,0.03); border-radius: 12px; margin-top: 12px;">
        <i class="fas fa-search" style="font-size: 1.8rem; color: var(--sunset-orange); margin-bottom: 8px;"></i>
        <p>No exact catalog matches found for that list. Try including popular essentials like "Keeri Samba Rice", "Dilmah Tea", "Anchor Milk", or "Munchee Biscuits".</p>
      </div>
    `;
    return;
  }

  const matchedProducts = [];
  for (const pid of matchedProductIds) {
    try {
      const res = await fetch(`/api/products/${pid}`);
      const data = await res.json();
      if (data.success && data.product) {
        matchedProducts.push(data.product);
      }
    } catch (_e) {}
  }

  resultsContainer.innerHTML = `
    <div class="grocery-matches-card">
      <div class="gm-header">
        <div>
          <h4 style="margin: 0; color: #fff; font-size: 1rem;"><i class="fas fa-check-circle" style="color: var(--lime-green);"></i> Matched ${matchedProducts.length} Items from your List</h4>
          <span style="font-size: 0.8rem; color: rgba(255,255,255,0.6);">Ready for 1-click addition directly to your SmartCart</span>
        </div>
        <button class="btn btn-primary" onclick="addAllGroceryMatchesToCart(${JSON.stringify(matchedProducts).replace(/"/g, '&quot;')})" style="padding: 8px 16px; font-size: 0.85rem;">
          <i class="fas fa-cart-arrow-down"></i> Add All (${matchedProducts.length}) to Cart
        </button>
      </div>
      <div class="gm-grid">
        ${matchedProducts.map(p => `
          <div class="gm-item">
            <img src="${p.image}" alt="${p.name}">
            <div style="flex: 1; min-width: 0;">
              <div style="font-size: 0.85rem; font-weight: 600; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${p.name}</div>
              <div style="font-size: 0.85rem; font-weight: 700; color: var(--lime-green);">${fmtLKR(p.price)}</div>
            </div>
            <button class="btn-gm-add" onclick="addToCart(${JSON.stringify(p).replace(/"/g, '&quot;')})" title="Add to Cart">
              <i class="fas fa-plus"></i>
            </button>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function addAllGroceryMatchesToCart(products) {
  if (!Array.isArray(products) || products.length === 0) return;
  products.forEach(p => addToCart(p, 1));
  showToast('Grocery Items Added!', `Added ${products.length} matched grocery items to your cart.`, 'success');
}

// ==================== 6. SEASONAL DEALS & COUNTDOWN TICKER ====================
const seasonalDealsData = {
  avurudu: {
    badge: "🌸 Sinhala & Tamil New Year Mega Offers",
    title: "Avurudu Special Gift Hampers & Festive Discounts",
    desc: "Celebrate the auspicious season with up to 50% discount on sweet hampers, traditional groceries, and family apparel.",
    code: "AVURUDU50",
    discount: "50% OFF",
    endsInHours: 72,
    claimedPct: 84
  },
  poya: {
    badge: "🌕 Monthly Poya Merit Special",
    title: "Poya Day Serenity & Household Essentials",
    desc: "Special flat 25% discount on white apparel, meditation mats, organic Ceylon teas, and household staples.",
    code: "POYA25",
    discount: "25% OFF",
    endsInHours: 24,
    claimedPct: 62
  },
  vesak: {
    badge: "🪔 Vesak Festival Illuminations & Offers",
    title: "Vesak Festival Lanterns, Lighting & Sweet Packs",
    desc: "Illuminate your home with energy-saving smart lamps and enjoy special bundle pricing on community gifts.",
    code: "VESAK30",
    discount: "30% OFF",
    endsInHours: 48,
    claimedPct: 91
  },
  mega: {
    badge: "⚡ Cyber Super Flash Deals",
    title: "Flat Rs. 1,000 Off Islandwide Orders",
    desc: "Enjoy immediate Rs. 1,000 off any purchase over Rs. 5,000 across all electronics, audio, fashion, and home appliances.",
    code: "SMART10",
    discount: "FLAT RS. 1,000",
    endsInHours: 18,
    claimedPct: 78
  }
};

let currentDealKey = 'avurudu';

function switchDealTab(key, btn) {
  const deal = seasonalDealsData[key];
  if (!deal) return;
  currentDealKey = key;

  document.querySelectorAll('.deal-tab-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  const badgeEl = document.getElementById('dealBadge');
  const titleEl = document.getElementById('dealTitle');
  const descEl = document.getElementById('dealDesc');
  const codeEl = document.getElementById('dealVoucherCode');
  const discEl = document.getElementById('dealDiscountBadge');
  const claimedEl = document.getElementById('dealClaimedBar');
  const claimedTextEl = document.getElementById('dealClaimedText');

  if (badgeEl) badgeEl.textContent = deal.badge;
  if (titleEl) titleEl.textContent = deal.title;
  if (descEl) descEl.textContent = deal.desc;
  if (codeEl) codeEl.textContent = deal.code;
  if (discEl) discEl.textContent = deal.discount;
  if (claimedEl) claimedEl.style.width = `${deal.claimedPct}%`;
  if (claimedTextEl) claimedTextEl.textContent = `${deal.claimedPct}% Claimed • Limited Stock`;
}

function startFlashSaleCountdown() {
  const targetDate = new Date();
  targetDate.setHours(targetDate.getHours() + 38);

  function tick() {
    const now = new Date();
    const diff = targetDate - now;

    if (diff <= 0) return;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / 1000 / 60) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    const dEl = document.getElementById('flashDays');
    const hEl = document.getElementById('flashHours');
    const mEl = document.getElementById('flashMinutes');
    const sEl = document.getElementById('flashSeconds');

    if (dEl) dEl.textContent = days.toString().padStart(2, '0');
    if (hEl) hEl.textContent = hours.toString().padStart(2, '0');
    if (mEl) mEl.textContent = mins.toString().padStart(2, '0');
    if (sEl) sEl.textContent = secs.toString().padStart(2, '0');
  }

  setInterval(tick, 1000);
  tick();
}

// ==================== 7. SEASONAL BUNDLES & REORDER LAST ORDER ====================
const seasonalBundlesData = [
  {
    id: 'bundle-avurudu',
    name: 'Sinhala & Tamil Avurudu Family Sweet & Gift Hamper',
    badge: '🌸 Avurudu Exclusive',
    price: 12500,
    regularPrice: 15500,
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&q=80',
    description: '5kg Keeri Samba Rice, Dilmah Ceylon Tea 400g, Munchee Cream Crackers, Kithul Treacle, and traditional sweets gift box.',
    items: ['Keeri Samba Rice 5kg', 'Dilmah Pure Ceylon Tea 400g', 'Munchee Cream Cracker 500g', 'Handcrafted Sweet Treats Box']
  },
  {
    id: 'bundle-school',
    name: 'Back-to-School Master Art & Stationery Backpack Bundle',
    badge: '🎒 School Reopening',
    price: 8900,
    regularPrice: 11500,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80',
    description: 'Atlas Executive Dotted Journal, 24 Dual-Tip Art Marker Set, Full-Grain Padded Backpack, and Stainless Water Bottle.',
    items: ['Executive Journal & Pen Set', 'Dual-Tip Art Markers 24 Pack', 'Ergonomic Backpack', 'Stainless Water Flask']
  },
  {
    id: 'bundle-groceries',
    name: 'Monthly Household Grocery Essentials Box',
    badge: '🛒 Household Essentials',
    price: 18500,
    regularPrice: 22000,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80',
    description: 'Complete family bundle: 10kg Aged Samba Rice, 2x 400g Anchor Milk Powder, Pure Ceylon Tea, and Tea-time Crackers.',
    items: ['2x Keeri Samba 5kg (10kg Total)', '2x Anchor Milk Powder 400g', 'Dilmah Tea 400g', 'Munchee Family Cracker Pack']
  }
];

function addBundleToCart(bundleIndex) {
  const b = seasonalBundlesData[bundleIndex];
  if (!b) return;

  const bundleProduct = {
    id: 900 + bundleIndex,
    name: b.name,
    price: b.price,
    image: b.image,
    category: 'Seasonal Bundle',
    sku: `BUNDLE-${bundleIndex + 1}`,
    quantity: 1
  };

  addToCart(bundleProduct, 1);
  showToast('Bundle Added! 🎁', `"${b.name}" added to your cart with exclusive bundled savings!`, 'success');
}

function handleReorderLastOrder() {
  // Recurring staples
  const pastOrderItems = [
    { id: 23, name: 'Keeri Samba Premium Rice 5kg', price: 1650, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80', category: 'grocery', quantity: 2 },
    { id: 24, name: 'Dilmah Premium Pure Ceylon Black Tea 400g', price: 1250, image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&q=80', category: 'grocery', quantity: 1 },
    { id: 25, name: 'Anchor Full Cream Milk Powder 400g', price: 1180, image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&q=80', category: 'grocery', quantity: 2 },
    { id: 26, name: 'Munchee Super Cream Cracker 500g', price: 650, image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=600&q=80', category: 'grocery', quantity: 2 }
  ];

  pastOrderItems.forEach(item => addToCart(item, item.quantity));

  showToast('Order Re-populated! 🔄', 'Added 4 repeat items from your previous household order into your cart.', 'success');

  // Trigger quick modal or notification
  setTimeout(() => {
    if (confirm('Previous items re-added to cart! Would you like to view your cart now?')) {
      window.location.href = 'products.html#cart';
    }
  }, 600);
}

// ==================== 8. 25-DISTRICT SRI LANKA DELIVERY ESTIMATOR ====================
const districtDeliverySchedule = {
  colombo: { name: 'Colombo', province: 'Western Province', days: '12 - 24 Hours (Next-Day)', fee: 250, hub: 'Colombo Central Fulfillment Hub' },
  gampaha: { name: 'Gampaha', province: 'Western Province', days: '12 - 24 Hours (Next-Day)', fee: 250, hub: 'Kelaniya Express Hub' },
  kalutara: { name: 'Kalutara', province: 'Western Province', days: '24 Hours', fee: 300, hub: 'Panadura Regional Hub' },
  kandy: { name: 'Kandy', province: 'Central Province', days: '24 - 48 Hours', fee: 350, hub: 'Peradeniya Central Hub' },
  matale: { name: 'Matale', province: 'Central Province', days: '24 - 48 Hours', fee: 350, hub: 'Matale Town Hub' },
  nuwaraeliya: { name: 'Nuwara Eliya', province: 'Central Province', days: '24 - 48 Hours', fee: 400, hub: 'Hatton Express Hub' },
  galle: { name: 'Galle', province: 'Southern Province', days: '24 - 48 Hours', fee: 350, hub: 'Galle Karapitiya Hub' },
  matara: { name: 'Matara', province: 'Southern Province', days: '24 - 48 Hours', fee: 350, hub: 'Matara Fort Hub' },
  hambantota: { name: 'Hambantota', province: 'Southern Province', days: '24 - 48 Hours', fee: 400, hub: 'Tangalle Express Hub' },
  jaffna: { name: 'Jaffna', province: 'Northern Province', days: '48 - 72 Hours', fee: 450, hub: 'Jaffna Town Hub' },
  kilinochchi: { name: 'Kilinochchi', province: 'Northern Province', days: '48 - 72 Hours', fee: 450, hub: 'Kilinochchi Hub' },
  mannar: { name: 'Mannar', province: 'Northern Province', days: '48 - 72 Hours', fee: 450, hub: 'Mannar Pier Hub' },
  vavuniya: { name: 'Vavuniya', province: 'Northern Province', days: '48 - 72 Hours', fee: 400, hub: 'Vavuniya Junction Hub' },
  mullaitivu: { name: 'Mullaitivu', province: 'Northern Province', days: '48 - 72 Hours', fee: 450, hub: 'Mullaitivu Regional Hub' },
  batticaloa: { name: 'Batticaloa', province: 'Eastern Province', days: '48 - 72 Hours', fee: 450, hub: 'Batticaloa Central Hub' },
  ampara: { name: 'Ampara', province: 'Eastern Province', days: '48 - 72 Hours', fee: 450, hub: 'Kalmunai Regional Hub' },
  trincomalee: { name: 'Trincomalee', province: 'Eastern Province', days: '48 - 72 Hours', fee: 450, hub: 'Trinco Harbor Hub' },
  kurunegala: { name: 'Kurunegala', province: 'North Western Province', days: '24 - 48 Hours', fee: 350, hub: 'Kurunegala Central Hub' },
  puttalam: { name: 'Puttalam', province: 'North Western Province', days: '24 - 48 Hours', fee: 350, hub: 'Chilaw Express Hub' },
  anuradhapura: { name: 'Anuradhapura', province: 'North Central Province', days: '24 - 48 Hours', fee: 400, hub: 'New Town Hub' },
  polonnaruwa: { name: 'Polonnaruwa', province: 'North Central Province', days: '48 Hours', fee: 400, hub: 'Kaduruwela Hub' },
  badulla: { name: 'Badulla', province: 'Uva Province', days: '48 - 72 Hours', fee: 400, hub: 'Badulla Main Hub' },
  monaragala: { name: 'Monaragala', province: 'Uva Province', days: '48 - 72 Hours', fee: 450, hub: 'Wellawaya Hub' },
  ratnapura: { name: 'Ratnapura', province: 'Sabaragamuwa Province', days: '24 - 48 Hours', fee: 350, hub: 'Ratnapura Gem City Hub' },
  kegalle: { name: 'Kegalle', province: 'Sabaragamuwa Province', days: '24 Hours', fee: 300, hub: 'Mawanella Hub' }
};

function handleDistrictChange() {
  const select = document.getElementById('districtSelect');
  const resultCard = document.getElementById('districtDeliveryResult');
  if (!select || !resultCard) return;

  const key = select.value;
  const d = districtDeliverySchedule[key];
  if (!d) return;

  resultCard.innerHTML = `
    <div class="district-info-box">
      <div class="di-row">
        <span class="di-tag"><i class="fas fa-map-marker-alt"></i> ${d.name} (${d.province})</span>
        <span class="di-speed"><i class="fas fa-bolt"></i> Fast Dispatch</span>
      </div>
      <div class="di-main">
        <div class="di-stat">
          <label>Estimated Delivery Time</label>
          <div class="di-val" style="color: var(--lime-green);">${d.days}</div>
        </div>
        <div class="di-stat">
          <label>Standard Shipping Rate</label>
          <div class="di-val">${fmtLKR(d.fee)}</div>
        </div>
      </div>
      <div class="di-hub">
        <i class="fas fa-warehouse" style="color: var(--electric-blue);"></i>
        <span>Dispatched via <strong>${d.hub}</strong> with live SMS & WhatsApp tracking</span>
      </div>
    </div>
  `;
}

// ==================== 9. PRODUCT COMPARISON DRAWER ====================
let compareList = [];

function toggleCompareProduct(product) {
  if (!product || !product.id) return;
  const idx = compareList.findIndex(p => p.id === product.id);

  if (idx > -1) {
    compareList.splice(idx, 1);
    showToast('Comparison Updated', `Removed "${product.name}" from comparison.`, 'info');
  } else {
    if (compareList.length >= 3) {
      showToast('Limit Reached', 'You can compare up to 3 products at a time.', 'warning');
      return;
    }
    compareList.push(product);
    showToast('Added to Compare', `"${product.name}" added to comparison.`, 'success');
  }

  updateCompareDrawer();
}

function openCompareDrawer() {
  updateCompareDrawer();
  const drawer = document.getElementById('compareDrawer');
  const backdrop = document.getElementById('compareBackdrop');
  if (drawer && backdrop) {
    drawer.classList.add('open');
    backdrop.classList.add('active');
  }
}

function closeCompareDrawer() {
  const drawer = document.getElementById('compareDrawer');
  const backdrop = document.getElementById('compareBackdrop');
  if (drawer && backdrop) {
    drawer.classList.remove('open');
    backdrop.classList.remove('active');
  }
}

function updateCompareDrawer() {
  const container = document.getElementById('compareDrawerContent');
  if (!container) return;

  if (compareList.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 48px 20px; color: rgba(255,255,255,0.5);">
        <i class="fas fa-scale-balanced" style="font-size: 3rem; margin-bottom: 16px; color: rgba(255,255,255,0.2);"></i>
        <h4 style="color: #fff; margin-bottom: 6px;">No Products to Compare</h4>
        <p style="font-size: 0.85rem;">Click the compare button on any product card to see side-by-side technical specs, pricing, and ratings.</p>
        <button class="btn btn-primary" onclick="loadDefaultComparisonPreset()" style="margin-top: 18px; padding: 10px 20px;">
          Load Popular Comparison
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="compare-table-wrap">
      <table class="compare-table">
        <thead>
          <tr>
            <th style="width: 140px;">Feature</th>
            ${compareList.map(p => `
              <th>
                <div style="text-align: center;">
                  <img src="${p.image}" alt="${p.name}" style="width: 70px; height: 70px; object-fit: cover; border-radius: 8px; margin-bottom: 6px;">
                  <div style="font-size: 0.85rem; font-weight: 700; color: #fff; line-height: 1.2;">${p.name}</div>
                  <button class="btn-comp-rem" onclick="toggleCompareProduct({id: ${p.id}, name: '${p.name.replace(/'/g, "\\'")}'})">Remove</button>
                </div>
              </th>
            `).join('')}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Price</td>
            ${compareList.map(p => `<td style="font-weight: 700; color: var(--lime-green);">${fmtLKR(p.price)}</td>`).join('')}
          </tr>
          <tr>
            <td>Category</td>
            ${compareList.map(p => `<td>${(p.category || 'General').toUpperCase()}</td>`).join('')}
          </tr>
          <tr>
            <td>Customer Rating</td>
            ${compareList.map(p => `<td>★ ${p.rating || '4.8'} (${p.reviews || 120})</td>`).join('')}
          </tr>
          <tr>
            <td>Stock Status</td>
            ${compareList.map(p => `<td><span class="stock-badge ${p.stock_quantity > 0 ? 'in' : 'out'}">${p.stock_quantity > 0 ? 'In Stock' : 'Pre-order'}</span></td>`).join('')}
          </tr>
          <tr>
            <td>COD Islandwide</td>
            ${compareList.map(() => `<td><i class="fas fa-check" style="color: var(--lime-green);"></i> Available</td>`).join('')}
          </tr>
          <tr>
            <td>Action</td>
            ${compareList.map(p => `
              <td>
                <button class="btn btn-primary" style="padding: 6px 14px; font-size: 0.8rem;" onclick="addToCart(${JSON.stringify(p).replace(/"/g, '&quot;')})">
                  Add to Cart
                </button>
              </td>
            `).join('')}
          </tr>
        </tbody>
      </table>
    </div>
  `;
}

async function loadDefaultComparisonPreset() {
  try {
    const res = await fetch('/api/products?limit=3');
    const data = await res.json();
    if (data.success && data.products) {
      compareList = data.products.slice(0, 3);
      updateCompareDrawer();
      showToast('Comparison Loaded', 'Loaded 3 top products for comparison.', 'info');
    }
  } catch (_e) {}
}

// ==================== 10. WHATSAPP & EMAIL VIP NEWSLETTER SIGNUP ====================
let newsletterChannel = 'email';

function switchNewsletterChannel(channel, btn) {
  newsletterChannel = channel;
  document.querySelectorAll('.nl-pill-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  const input = document.getElementById('newsletterContactInput');
  if (input) {
    if (channel === 'whatsapp') {
      input.type = 'tel';
      input.placeholder = '+94 77 123 4567 (WhatsApp Number)';
    } else {
      input.type = 'email';
      input.placeholder = 'Enter your email address (e.g. name@domain.lk)...';
    }
  }
}

function handleVipNewsletterSubmit(e) {
  if (e) e.preventDefault();
  const input = document.getElementById('newsletterContactInput');
  const val = input ? input.value.trim() : '';

  if (!val) {
    showToast('Input Required', 'Please enter your email or WhatsApp number.', 'warning');
    return;
  }

  // Open celebratory voucher modal
  openVipVoucherModal(val);
  if (input) input.value = '';
}

function openVipVoucherModal(subscriber) {
  const modal = document.getElementById('vipVoucherModal');
  const subText = document.getElementById('vipSubscriberText');
  if (modal) {
    if (subText) subText.textContent = `A confirmation has been queued for: ${subscriber}`;
    modal.classList.add('active');
  }
}

function closeVipVoucherModal() {
  document.getElementById('vipVoucherModal')?.classList.remove('active');
}

// ==================== 11. FAQ & MERCHANT SELL WITH US MODALS ====================
function openMerchantModal() {
  document.getElementById('merchantModal')?.classList.add('active');
}

function closeMerchantModal() {
  document.getElementById('merchantModal')?.classList.remove('active');
}

function handleMerchantSubmit(e) {
  if (e) e.preventDefault();
  closeMerchantModal();
  showToast('Application Submitted! 🤝', 'Thank you for your interest! Our Merchant Onboarding team will contact you within 24 hours.', 'success');
}

function openFaqModal() {
  document.getElementById('faqModal')?.classList.add('active');
}

function closeFaqModal() {
  document.getElementById('faqModal')?.classList.remove('active');
}

// ==================== 12. QUICK VIEW MODAL ====================
let currentQuickViewProduct = null;
let quickViewQuantity = 1;

async function openQuickView(productId) {
  try {
    const res = await fetch(`/api/products/${productId}`);
    const data = await res.json();
    if (!data.success || !data.product) return;

    const p = data.product;
    currentQuickViewProduct = p;
    quickViewQuantity = 1;

    const modal = document.getElementById('quickViewModal');
    const content = document.getElementById('quickViewContent');
    if (!modal || !content) return;

    content.innerHTML = `
      <div class="qv-grid">
        <div class="qv-image-box">
          <img src="${p.image}" alt="${p.name}">
        </div>
        <div>
          <div class="qv-brand">${p.brand || 'SmartCart Certified'} • SKU: ${p.sku || 'SC-PRD'}</div>
          <h2 class="qv-title">${p.name}</h2>
          <div class="qv-rating">
            ${'★'.repeat(Math.floor(p.rating || 5))}${(p.rating || 5) % 1 !== 0 ? '½' : ''}
            <span style="color:var(--text-main); font-weight:700;">${p.rating || '5.0'}</span>
            <span style="color:var(--text-dim); font-size:12px;">(${p.reviews || 0} customer reviews)</span>
          </div>
          <div class="qv-price">${fmtLKR(p.price)}</div>
          <p class="qv-desc">${p.description || 'Premium quality merchandise backed by SmartCart 30-day warranty, authentic serial tracking, and express islandwide dispatch.'}</p>
          
          <div style="font-size:12px; margin-bottom:14px; color:${p.stock_quantity > 0 ? 'var(--primary-glow)' : '#ff4d6d'}; font-weight:700;">
            <i class="fas ${p.stock_quantity > 0 ? 'fa-check-circle' : 'fa-times-circle'}"></i> 
            ${p.stock_quantity > 0 ? `In Stock (${p.stock_quantity} units available)` : 'Out of Stock'}
          </div>

          <div class="qv-qty-row">
            <div class="qv-qty-picker">
              <button type="button" onclick="adjustQuickViewQty(-1)">-</button>
              <span class="qv-qty-val" id="qvQtyVal">1</span>
              <button type="button" onclick="adjustQuickViewQty(1)">+</button>
            </div>
            <button type="button" class="btn btn-primary" style="flex:1; padding: 12px 24px;" onclick="handleQuickViewAddToCart()">
              <i class="fas fa-cart-plus"></i> Add to Cart
            </button>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid rgba(255,255,255,0.08); padding-top:14px;">
            <a href="products.html" style="font-size:13px; color:var(--accent-cyan); text-decoration:none; font-weight:600;">
              <i class="fas fa-arrow-up-right-from-square"></i> Open in Catalog
            </a>
            <span style="font-size:11px; color:var(--text-dim);"><i class="fas fa-shield-halved"></i> Islandwide COD Available</span>
          </div>
        </div>
      </div>
    `;

    modal.classList.add('active');
  } catch (_err) {
    if (typeof showToast === 'function') {
      showToast('Error', 'Unable to load product preview', 'error');
    }
  }
}

function adjustQuickViewQty(delta) {
  quickViewQuantity = Math.max(1, quickViewQuantity + delta);
  const valEl = document.getElementById('qvQtyVal');
  if (valEl) valEl.textContent = quickViewQuantity;
}

function handleQuickViewAddToCart() {
  if (!currentQuickViewProduct) return;
  addToCart(currentQuickViewProduct, quickViewQuantity);
  closeQuickViewModal();
}

function closeQuickViewModal() {
  document.getElementById('quickViewModal')?.classList.remove('active');
}

// ==================== 13. DEMO SHOWCASE TOUR MODAL ====================
const demoTourData = {
  catalog: {
    title: "Smart Catalog & Real-Time Filtering",
    icon: "fa-layer-group",
    description: "Explore items effortlessly with high-speed instant search, category filtering (Electronics, Grocery, Fashion, Home, Sports, Books), brand selectors, and price range sliders.",
    points: [
      "Instant dynamic search with thumbnail previews & live stock",
      "Automated sorting: Low-to-High, High-to-Low, Top Rated, and Latest",
      "Prices automatically formatted in Sri Lankan Rupees (Rs. / LKR)"
    ]
  },
  cart: {
    title: "Persistent Hybrid Cart & Coupons",
    icon: "fa-shopping-cart",
    description: "Your cart never gets lost! Items are seamlessly preserved in browser storage for guests and synchronized with your user account upon login.",
    points: [
      "Automatic guest-to-account cart merging upon authentication",
      "Instant promo coupon redemption (e.g. AVURUDU50, SMART10, SMARTVIP10)",
      "Transparent breakdown of Subtotal, Islandwide Delivery, and Savings"
    ]
  },
  checkout: {
    title: "Islandwide Flexible Checkout",
    icon: "fa-credit-card",
    description: "Shop with peace of mind. Select between Cash on Delivery (COD) islandwide across Sri Lanka, PayHere, LankaQR, or Koko / Mintpay interest-free installment plans.",
    points: [
      "Zero-risk Cash on Delivery across all 25 Sri Lankan districts",
      "Certified PayHere and LankaQR payment channels",
      "Instant automated HTML receipt and order confirmation"
    ]
  },
  tracking: {
    title: "Live Order Status Tracking",
    icon: "fa-route",
    description: "Keep complete control over your purchases. Track the live delivery journey from Pending ➔ Paid ➔ Shipped ➔ Delivered right from your account.",
    points: [
      "Real-time status updates directly from PromptX / Koombiyo courier dispatch",
      "Complete itemized purchase history and delivery addresses",
      "One-click repeat order convenience"
    ]
  }
};

function openDemoModal() {
  showDemoTab('catalog');
  document.getElementById('demoModal')?.classList.add('active');
}

function closeDemoModal() {
  document.getElementById('demoModal')?.classList.remove('active');
}

function showDemoTab(tabKey) {
  const item = demoTourData[tabKey];
  if (!item) return;

  document.querySelectorAll('.demo-tabs .deal-tab-btn').forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-tab') === tabKey);
  });

  const container = document.getElementById('demoTabContent');
  if (!container) return;

  container.innerHTML = `
    <div class="demo-feature-card">
      <div class="demo-feature-icon"><i class="fas ${item.icon}"></i></div>
      <div class="demo-feature-info">
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        <ul class="demo-feature-points">
          ${item.points.map(pt => `<li><i class="fas fa-circle-check"></i> ${pt}</li>`).join('')}
        </ul>
      </div>
    </div>
  `;
}

// ==================== 14. SOCIAL PROOF TICKER ====================
const socialProofActivities = [
  { name: "Kavindu from Colombo", item: "AeroCushion Volcanic Sprint Shoes", time: "2 minutes ago" },
  { name: "Nipuna from Kandy", item: "Apex Ultra Smart Watch", time: "4 minutes ago" },
  { name: "Amaya from Galle", item: "Dilmah Ceylon Tea & Samba Rice Box", time: "7 minutes ago" },
  { name: "Dinuka from Negombo", item: "Mechanical RGB Hot-Swap Keyboard", time: "11 minutes ago" },
  { name: "Sachini from Kurunegala", item: "Smart Robot Vacuum & Mop", time: "15 minutes ago" },
  { name: "Roshan from Matara", item: "Atomic Habits by James Clear", time: "19 minutes ago" }
];

let spTickerTimer;
function startSocialProofTicker() {
  const toast = document.getElementById('socialProofToast');
  const textEl = document.getElementById('spText');
  const timeEl = document.getElementById('spTime');
  if (!toast || !textEl || !timeEl) return;

  let currentIndex = 0;
  function showNextActivity() {
    const act = socialProofActivities[currentIndex];
    textEl.innerHTML = `<strong>${act.name}</strong> just purchased <strong>${act.item}</strong>`;
    timeEl.textContent = `${act.time} • Verified Order ⚡`;
    toast.classList.add('visible');

    setTimeout(() => {
      toast.classList.remove('visible');
    }, 5500);

    currentIndex = (currentIndex + 1) % socialProofActivities.length;
  }

  setTimeout(showNextActivity, 4000);
  spTickerTimer = setInterval(showNextActivity, 20000);
}

function dismissSocialProof() {
  document.getElementById('socialProofToast')?.classList.remove('visible');
  clearInterval(spTickerTimer);
}

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  // Set initial language
  setLanguage(currentLang);

  // Initialize wishlist badge
  updateWishlistBadge();

  // Initialize budget mode
  setupBudgetMode();

  // Initialize flash countdown
  startFlashSaleCountdown();

  // Initialize live social proof ticker
  startSocialProofTicker();

  // Listen to cart changes to refresh budget meter
  window.addEventListener('storage', (e) => {
    if (e.key === 'smartcart_cart' || e.key === 'smartcart_budget') {
      updateBudgetCalculations();
      updateWishlistBadge();
    }
  });

  // Intercept addToCart calls to trigger budget updates
  const origSaveCart = window.saveLocalCart;
  if (typeof origSaveCart === 'function') {
    window.saveLocalCart = function(items) {
      origSaveCart(items);
      updateBudgetCalculations();
    };
  }
});
