// ─────────────────────────────────────────────────────────
// مركز الترجمة الوحيد للمشروع — استورد منه بكل مكان
// ─────────────────────────────────────────────────────────

// ── 1. خريطة: الاسم الإنجليزي → مفتاح الترجمة ──────────
export const PRODUCT_KEY_MAP = {
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

// ── 2. ترجمة أسماء العروض ───────────────────────────────
export const OFFER_NAMES_AR = {
  'Pizza & Fries Combo':    'بيتزا وبطاطا مقلية',
  'Double Burger Combo':    'برغر مزدوج',
  'Pasta Special':          'باستا خاصة',
  'Sushi Family Pack':      'علبة سوشي عائلية',
  'Korean BBQ Feast':       'وليمة باربيكيو كورية',
  'Seafood Delight':        'لذة المأكولات البحرية',
  'Bubble Tea & Mochi Box': 'شاي الفقاعات وموتشي',
  'Pad Thai & Spring Rolls':'باد تاي ولفائف الربيع',
};

export const OFFER_DESCS_AR = {
  'Pizza & Fries Combo':    'بيتزا كبيرة · بطاطا مقلية · مشروب غازي',
  'Double Burger Combo':    'برغر مزدوج · بطاطا · مشروب',
  'Pasta Special':          'باستا كريمية · خبز بالثوم · مشروب',
  'Sushi Family Pack':      'سوشي مشكل · شوربة ميسو · إدامامي',
  'Korean BBQ Feast':       'لحم متبل · كيمتشي · أرز · جانشان',
  'Seafood Delight':        'سلمون مشوي · جمبري · خضار',
  'Bubble Tea & Mochi Box': '2 شاي فقاعات · 3 آيس كريم موتشي',
  'Pad Thai & Spring Rolls':'باد تاي مقلي · لفائف مقرمشة · صلصة حارة',
};

// ── 3. ترجمة الإضافات ───────────────────────────────────
export const ADDON_MAP_AR = {
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

// ── 4. ترجمة الحرارة والعجينة ───────────────────────────
export const SPICE_MAP_AR  = { mild:'خفيف', medium:'متوسط', hot:'حار', extra_hot:'حار جداً' };
export const SPICE_MAP_EN  = { mild:'Mild', medium:'Medium', hot:'Hot', extra_hot:'Extra Hot' };
export const CRUST_MAP_AR  = { thin:'رقيقة', thick:'سميكة', stuffed:'محشوة', gluten_free:'خالي من الجلوتين' };
export const CRUST_MAP_EN  = { thin:'Thin', thick:'Thick', stuffed:'Stuffed', gluten_free:'Gluten Free' };

// ── 5. الدوال المركزية ──────────────────────────────────

/**
 * ترجم اسم منتج أو عرض
 * @param {string} originalName - الاسم الإنجليزي الأصلي
 * @param {object} t - كائن الترجمة من translations[language]
 * @param {string} language - 'en' | 'ar'
 */
export function translateName(originalName, t, language) {
  if (!originalName) return '';

  // عروض أولاً
  if (language === 'ar' && OFFER_NAMES_AR[originalName]) {
    return OFFER_NAMES_AR[originalName];
  }

  // منتجات المنيو
  const key = PRODUCT_KEY_MAP[originalName];
  if (key && t.products?.[key]) return t.products[key];

  // fallback
  return originalName;
}

/**
 * ترجم وصف منتج
 * @param {string} originalName - اسم المنتج الإنجليزي (مش الوصف)
 * @param {string} fallbackDesc - الوصف الإنجليزي من الـ data
 * @param {object} t - كائن الترجمة
 * @param {string} language
 */
export function translateDescription(originalName, fallbackDesc, t, language) {
  if (language === 'ar' && OFFER_DESCS_AR[originalName]) {
    return OFFER_DESCS_AR[originalName];
  }

  // ابحث بمفتاح الوصف: dragonRollDesc
  const key = PRODUCT_KEY_MAP[originalName];
  if (key) {
    const desc = t.products?.descriptions?.[`${key}Desc`];
    if (desc) return desc;
  }

  return fallbackDesc;
}

/**
 * ترجم اسم إضافة
 */
export function translateAddon(name, language) {
  if (language === 'ar') return ADDON_MAP_AR[name] || name;
  return name;
}

/**
 * ترجم مستوى الحرارة
 */
export function translateSpice(spiceId, language) {
  if (!spiceId) return '';
  return language === 'ar'
    ? (SPICE_MAP_AR[spiceId] || spiceId)
    : (SPICE_MAP_EN[spiceId] || spiceId);
}

/**
 * ترجم نوع العجينة
 */
export function translateCrust(crustId, language) {
  if (!crustId) return '';
  return language === 'ar'
    ? (CRUST_MAP_AR[crustId] || crustId)
    : (CRUST_MAP_EN[crustId] || crustId);
}

/**
 * ترجم اسم عنصر السلة كامل (مع الحجم ومستوى الحرارة)
 * هذه الدالة تُستخدم في CartSidebar فقط
 */
export function translateCartItemName(item, t, language) {
  const original = item.originalName || item.name;

  // نزيل الـ suffix مثل "(M)" و"— Hot"
  const baseName = original
    .replace(/\s*\([SML]\)\s*/, '')
    .replace(/\s*—\s*.+$/, '')
    .trim();

  const translatedBase = translateName(baseName, t, language);

  // نعيد اللاحقات
  const sizeMatch  = original.match(/\(([SML])\)/);
  const sizePart   = sizeMatch ? ` (${sizeMatch[1]})` : '';

  let spicePart = '';
  if (item.selectedSpice && item.selectedSpice !== 'medium') {
    spicePart = ` — ${translateSpice(item.selectedSpice, language)}`;
  }

  return translatedBase + sizePart + spicePart;
}