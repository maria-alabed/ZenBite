import { useCart } from "../../context/CartContext";
import { useState } from "react";
import ProductDetails from "../../pages/ProductDetails";
import { useLanguage } from "../../context/LanguageContext";
import { translations } from "../../utils/translations";

/* ─── Translation maps (defined once, outside component) ─── */

const PRODUCT_NAME_MAP = {
  // Japanese
  'Dragon Roll':'dragonRoll','Rainbow Roll':'rainbowRoll','Spicy Tuna Roll':'spicyTunaRoll',
  'Wagyu Yaki':'wagyuYaki','Yakitori Skewers':'yakitoriSkewers','Grilled Salmon':'grilledSalmon',
  'Tempura Shrimp':'tempuraShrimp','Miso Ramen':'misoRamen','Gyoza Dumplings':'gyozaDumplings',
  'Chicken Katsu':'chickenKatsu','Okonomiyaki':'okonomiyaki','Unagi Don':'unagiDon',
  'Japanese Curry':'japaneseCurry','Sashimi Platter':'sashimiPlatter','Matcha Tiramisu':'matchaTiramisu',
  // Chinese
  'Kung Pao Chicken':'kungPaoChicken','Mapo Tofu':'mapoTofu','Peking Duck':'pekingDuck',
  'Dim Sum Platter':'dimSumPlatter','Sweet & Sour Pork':'sweetSourPork','Beef Chow Mein':'beefChowMein',
  'Spring Rolls':'springRolls','Hot & Sour Soup':'hotSourSoup','Szechuan Fish':'szechuanFish',
  'Yangzhou Fried Rice':'yangzhouFriedRice','Mongolian Beef':'mongolianBeef','Wonton Soup':'wontonSoup',
  'Sesame Chicken':'sesameChicken','Eggplant with Garlic Sauce':'eggplantGarlic','Fortune Cookies':'fortuneCookies',
  // Korean
  'Bibimbap':'bibimbap','Kimchi Jjigae':'kimchiJjigae','Korean BBQ Beef':'koreanBBQBeef',
  'Tteokbokki':'tteokbokki','Korean Fried Chicken':'koreanFriedChicken','Japchae':'japchae',
  'Samgyeopsal':'samgyeopsal','Kimchi Pancake':'kimchiPancake','Sundubu Jjigae':'sundubuJjigae',
  'Bulgogi':'bulgogi','Kimbap':'kimbap','Soondae':'soondae','Galbi Jjim':'galbiJjim',
  'Hotteok':'hotteok','Patbingsu':'patbingsu',
  // Italian
  'Margherita Pizza':'margheritaPizza','Pepperoni Pizza':'pepperoniPizza',
  'Quattro Stagioni':'quattroStagioni','Pizza Napoletana':'pizzaNapoletana',
  'Pizza Funghi':'pizzaFunghi','Pizza Vegetariana':'pizzaVegetariana',
  'Spaghetti Carbonara':'spaghettiCarbonara','Fettuccine Alfredo':'fettuccineAlfredo',
  'Lasagna Bolognese':'lasagnaBolognese','Risotto ai Funghi':'risottoFunghi',
  'Gnocchi al Pesto':'gnocchiPesto','Ossobuco':'ossobuco','Caprese Salad':'capreseSalad',
  'Tiramisu':'tiramisu','Panna Cotta':'pannaCotta',
  // Seafood
  'Spicy Seafood Soup':'spicySeafoodSoup','Grilled Octopus':'grilledOctopus',
  'Lobster Thermidor':'lobsterThermidor','Seafood Paella':'seafoodPaella',
  'Crab Cakes':'crabCakes','Miso Glazed Cod':'misoGlazedCod','Fried Calamari':'friedCalamari',
  'Oysters Rockefeller':'oystersRockefeller','Shrimp Scampi':'shrimpScampi',
  'Tuna Tartare':'tunaTartare','Moules Frites':'moulesFrites',
  'Fish and Chips':'fishAndChips','Seafood Ceviche':'seafoodCeviche',
  // Asian
  'Pad Thai':'padThai','Tom Yum Soup':'tomYumSoup','Green Curry':'greenCurry',
  'Pho Bo':'phoBo','Satay Chicken':'satayChicken','Mango Sticky Rice':'mangoStickyRice',
  'Singapore Noodles':'singaporeNoodles','Massaman Curry':'massamanCurry','Banh Mi':'banhMi',
  'Roti Canai':'rotiCanai','Laksa':'laksa','Nasi Goreng':'nasiGoreng',
  'Thai Iced Tea':'thaiIcedTea','Pandan Cake':'pandanCake',
  // Healthy
  'Buddha Bowl':'buddhaBowl','Seaweed Salad':'seaweedSalad','Steamed Vegetables':'steamedVegetables',
  'Grilled Salmon Bowl':'grilledSalmonBowl','Avocado Toast':'avocadoToast',
  'Fruit Smoothie Bowl':'fruitSmoothieBowl','Kale Caesar Salad':'kaleCaesarSalad',
  'Zucchini Noodles':'zucchiniNoodles','Sweet Potato Bowl':'sweetPotatoBowl',
  'Acai Bowl':'acaiBowl','Green Smoothie':'greenSmoothie','Quinoa Salad':'quinoaSalad',
  'Grilled Chicken Salad':'grilledChickenSalad','Fresh Juice':'freshJuice','Chia Pudding':'chiaPudding',
  // Drinks
  'Japanese Sake':'japaneseSake','Bubble Tea':'bubbleTea','Green Matcha Latte':'greenMatchaLatte',
  'Fresh Coconut Water':'freshCoconutWater','Mango Lassi':'mangoLassi','Lemonade':'lemonade',
  'Iced Coffee':'icedCoffee','Smoothie':'smoothie','Green Juice':'greenJuice',
  'Hot Chocolate':'hotChocolate','Chai Latte':'chaiLatte','Sparkling Water':'sparklingWater',
  'Milkshake':'milkshake','Herbal Tea':'herbalTea',
  // Desserts
  'Mochi Ice Cream':'mochiIceCream','Matcha Cheesecake':'matchaCheesecake',
  'Banana Spring Rolls':'bananaSpringRolls','Chocolate Lava Cake':'chocolateLavaCake',
  'Crème Brûlée':'cremeBrulee','Apple Pie':'applePie','Cheesecake':'cheesecake',
  'Brownie Sundae':'brownieSundae','Fruit Tart':'fruitTart','Gelato':'gelato',
  'Sorbet':'sorbet','Donuts':'donuts','Macarons':'macarons',
};

// 🔴 خريطة أسماء العروض
const OFFER_NAMES_AR = {
  'Pizza & Fries Combo':     'بيتزا وبطاطا مقلية',
  'Double Burger Combo':     'برغر مزدوج',
  'Pasta Special':           'باستا خاصة',
  'Sushi Family Pack':       'علبة سوشي عائلية',
  'Korean BBQ Feast':        'وليمة باربيكيو كورية',
  'Seafood Delight':         'لذة المأكولات البحرية',
  'Bubble Tea & Mochi Box':  'شاي الفقاعات وموتشي',
  'Pad Thai & Spring Rolls': 'باد تاي ولفائف الربيع',
};

const ADDON_MAP_AR = {
  'Extra Cheese':'جبن إضافي','Extra Sauce':'صلصة إضافية','Extra Spicy':'حار إضافي',
  'Garlic Sauce':'صلصة الثوم','Olive Oil Drizzle':'رشة زيت زيتون','Fresh Basil':'ريحان طازج',
  'Parmesan':'بارميزان','Chili Flakes':'رقائق الفلفل الحار','Extra Wasabi':'واسابي إضافي',
  'Pickled Ginger':'زنجبيل مخلل','Extra Soy Sauce':'صلصة صويا إضافية','Sesame Seeds':'حبوب السمسم',
  'Extra Kimchi':'كيمتشي إضافي','Gochujang Sauce':'صلصة غوتشوجانغ','Sesame Oil':'زيت السمسم',
  'Lemon Butter':'زبدة الليمون','Garlic Herb':'أعشاب بالثوم','Tartar Sauce':'صلصة التارتار',
  'Peanut Sauce':'صلصة الفول السوداني','Fresh Herbs':'أعشاب طازجة','Lime Wedges':'شرائح الليمون',
  'Extra Avocado':'أفوكادو إضافي','Quinoa':'كينوا','Chia Seeds':'بذور الشيا',
  'Extra Chocolate':'شوكولاتة إضافية','Whipped Cream':'كريمة مخفوقة',
  'Caramel Drizzle':'رشة كراميل','Chopped Nuts':'مكسرات مفرومة',
  'Extra Ice':'ثلج إضافي','Extra Sweet':'سكر إضافي','Boba Pearls':'كريات التابيوكا',
};

const SPICE_MAP_AR = { mild:'خفيف', medium:'متوسط', hot:'حار', extra_hot:'حار جداً' };
const CRUST_MAP_AR = { thin:'رقيقة', thick:'سميكة', stuffed:'محشوة', gluten_free:'خالي من الجلوتين' };

// 🔴 دالة ترجمة اسم العرض
const getTranslatedOfferName = (originalName, language) => {
  if (language === 'ar') {
    return OFFER_NAMES_AR[originalName] || originalName;
  }
  return originalName;
};

/* ─── Helper: translate a cart item name on-the-fly ─── */
function translateItemName(item, t, language) {
  // Always use the original English name as the source of truth
  const original = item.originalName || item.name;

  // 🔴 التحقق من أن المنتج عرض
  const isOffer = original && (
    original.includes('Pizza & Fries') ||
    original.includes('Double Burger') ||
    original.includes('Pasta Special') ||
    original.includes('Sushi Family') ||
    original.includes('Korean BBQ') ||
    original.includes('Seafood Delight') ||
    original.includes('Bubble Tea') ||
    original.includes('Pad Thai')
  );

  // 🔴 إذا كان عرض، استخدم ترجمة العروض
  if (isOffer) {
    const translatedName = getTranslatedOfferName(original, language);
    // نضيف الحجم إذا كان موجوداً
    const sizeMatch = original.match(/\(([SML])\)/);
    const sizePart = sizeMatch ? ` (${sizeMatch[1]})` : '';
    return translatedName + sizePart;
  }

  // 🔴 لمنتجات المنيو (الكود الموجود)
  // Strip size suffix like "(M)" to get the base name
  const baseNameRaw = original.replace(/\s*\([SML]\)\s*/,'').replace(/\s*—\s*.+$/,'').trim();

  // Translate the base name
  const tKey = PRODUCT_NAME_MAP[baseNameRaw];
  const translatedBase = (tKey && t.products?.[tKey]) || baseNameRaw;

  // Re-attach size
  const sizeMatch = original.match(/\(([SML])\)/);
  const sizePart = sizeMatch ? ` (${sizeMatch[1]})` : '';

  // Re-attach spice
  let spicePart = '';
  if (item.selectedSpice && item.selectedSpice !== 'medium') {
    if (language === 'ar') {
      spicePart = ` — ${SPICE_MAP_AR[item.selectedSpice] || item.selectedSpice}`;
    } else {
      const spiceLabels = { mild:'Mild', hot:'Hot', extra_hot:'Extra Hot' };
      spicePart = ` — ${spiceLabels[item.selectedSpice] || item.selectedSpice}`;
    }
  }

  return translatedBase + sizePart + spicePart;
}

function translateAddonName(name, language) {
  if (language === 'ar') return ADDON_MAP_AR[name] || name;
  return name; // always stored as English
}

function translateCrust(crustId, language) {
  if (!crustId) return '';
  if (language === 'ar') return CRUST_MAP_AR[crustId] || crustId;
  const en = { thin:'Thin', thick:'Thick', stuffed:'Stuffed', gluten_free:'Gluten Free' };
  return en[crustId] || crustId;
}

const SPICE_CATEGORIES = [
  "Japanese Kitchen","Chinese Kitchen","Korean Kitchen",
  "Italian Kitchen","Asian Specials","Seafood"
];

/* ─── Component ─── */
function CartSidebar({ isOpen, onClose }) {
  const { cart, removeFromCart, updateQty, total, clearCart } = useCart();
  const { language } = useLanguage();
  const t = translations[language];
  const [drawerProduct, setDrawerProduct] = useState(null);

  const handleProductClick = (item) => {
    onClose();
    setTimeout(() => {
      setDrawerProduct({
        ...item,
        category: item.category || "Japanese Kitchen",
        price: item.price || 0,
        selectedSize: item.selectedSize || null,
        selectedCrust: item.selectedCrust || null,
        selectedSpice: item.selectedSpice || 'medium',
        addons: item.addons || [],
        addonsList: item.addonsList || '',
        addonsPrice: item.addonsPrice || 0,
        specialInstructions: item.specialInstructions || '',
        qty: item.qty || 1,
        _key: item._key,
      });
    }, 300);
  };

  return (
    <>
      <div className={`cart-overlay ${isOpen ? "open" : ""}`} onClick={onClose}>
        <div className="cart-sidebar" onClick={(e) => e.stopPropagation()}>

          {/* Header */}
          <div className="cart-header">
            <h2>🛒 {t.yourCart || 'Your Cart'}</h2>
            <button className="close-btn" onClick={onClose}>✕</button>
          </div>

          {/* Items */}
          <div className="cart-items">
            {cart.length === 0 ? (
              <div className="empty-cart">
                <span>🛍️</span>
                <p>{t.emptyCart || 'Your cart is empty'}</p>
                <button className="browse-menu-btn" onClick={onClose}>
                  {t.browseMenu || 'Browse Menu'}
                </button>
              </div>
            ) : (
              cart.map((item) => {
                // ── Translate everything at render time ──
                const displayName  = translateItemName(item, t, language);
                const displayAddons = (item.addons || []).map(a => ({
                  ...a,
                  displayName: translateAddonName(a.originalName || a.name, language),
                }));
                const showSpice = SPICE_CATEGORIES.includes(item.category)
                  && item.selectedSpice
                  && item.selectedSpice !== 'medium';

                return (
                  <div
                    key={item._key || item.id}
                    className="cart-item"
                    onClick={() => handleProductClick(item)}
                  >
                    {item.image && (
                      <div className="cart-item-image">
                        <img src={item.image} alt={displayName} />
                      </div>
                    )}

                    <div className="cart-item-info">
                      <h4>{displayName}</h4>
                      <p>${item.price?.toFixed(2) || '0.00'}</p>

                      {displayAddons.length > 0 && (
                        <div className="cart-item-addons">
                          <small>➕ {displayAddons.map(a => a.displayName).join(', ')}</small>
                        </div>
                      )}

                      {item.selectedSize && (
                        <div className="cart-item-size">
                          <small>📏 {t.size || 'Size'}: {item.selectedSize}</small>
                        </div>
                      )}

                      {item.selectedCrust && item.category === "Italian Kitchen" && (
                        <div className="cart-item-crust">
                          <small>🍕 {t.crustType || 'Crust'}: {translateCrust(item.selectedCrust, language)}</small>
                        </div>
                      )}

                      {showSpice && (
                        <div className="cart-item-spice">
                          <small>
                            🌶️ {t.temperatureLevel || 'Spice'}:{' '}
                            {language === 'ar'
                              ? SPICE_MAP_AR[item.selectedSpice] || item.selectedSpice
                              : ({ mild:'Mild', hot:'Hot', extra_hot:'Extra Hot' })[item.selectedSpice] || item.selectedSpice}
                          </small>
                        </div>
                      )}

                      {item.specialInstructions && (
                        <div className="cart-item-notes">
                          <small>📝 {item.specialInstructions}</small>
                        </div>
                      )}
                    </div>

                    <div className="cart-item-actions" onClick={(e) => e.stopPropagation()}>
                      <div className="qty">
                        <button onClick={() => updateQty(item.id, -1, item._key)}>−</button>
                        <span>{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1, item._key)}>+</button>
                        <button className="remove-btn" onClick={() => removeFromCart(item.id, item._key)}>✕</button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="cart-footer">
              <h3>{t.total || 'Total'}: <span>${total.toFixed(2)}</span></h3>
              <div className="cart-actions">
                <button className="clear-cart-btn" onClick={clearCart}>
                  {t.clearCart || 'Clear Cart'}
                </button>
                <button className="checkout-btn">{t.checkout || 'Checkout'} →</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {drawerProduct && (
        <ProductDetails
          product={drawerProduct}
          onClose={() => setDrawerProduct(null)}
          isFromCart={true}
        />
      )}
    </>
  );
}

export default CartSidebar;