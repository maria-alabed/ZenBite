import { useState, useEffect, useCallback, useRef } from "react";
import { useCart } from "../context/CartContext";
import {
  getAddonsByCategory,
  spiceLevels,
  crustTypes,
  spiceCategories,
} from "../data/menuData";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../utils/translations";
import { CaloriesBadge, AvailabilityBadge } from "../components/product/ProductBadges";
import { AddonChip, SpiceChip, CrustChip } from "../components/product/ProductChips";

export default function ProductDetails({ product, onClose }) {
  const { addToCart } = useCart();
  const { language } = useLanguage();
  const t = translations[language];
  
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [selectedSpice, setSelectedSpice] = useState("medium");
  const [selectedCrust, setSelectedCrust] = useState("thin");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [visible, setVisible] = useState(false);

  // 🔴 دالة ترجمة الإضافات
  const getTranslatedAddonName = (addonName) => {
    const addonMap = {
      'Extra Cheese': language === 'ar' ? 'جبن إضافي' : 'Extra Cheese',
      'Extra Sauce': language === 'ar' ? 'صلصة إضافية' : 'Extra Sauce',
      'Extra Spicy': language === 'ar' ? 'حار إضافي' : 'Extra Spicy',
      'Garlic Sauce': language === 'ar' ? 'صلصة الثوم' : 'Garlic Sauce',
      'Olive Oil Drizzle': language === 'ar' ? 'رشة زيت زيتون' : 'Olive Oil Drizzle',
      'Fresh Basil': language === 'ar' ? 'ريحان طازج' : 'Fresh Basil',
      'Parmesan': language === 'ar' ? 'بارميزان' : 'Parmesan',
      'Chili Flakes': language === 'ar' ? 'رقائق الفلفل الحار' : 'Chili Flakes',
      'Extra Wasabi': language === 'ar' ? 'واسابي إضافي' : 'Extra Wasabi',
      'Pickled Ginger': language === 'ar' ? 'زنجبيل مخلل' : 'Pickled Ginger',
      'Extra Soy Sauce': language === 'ar' ? 'صلصة صويا إضافية' : 'Extra Soy Sauce',
      'Sesame Seeds': language === 'ar' ? 'حبوب السمسم' : 'Sesame Seeds',
      'Extra Kimchi': language === 'ar' ? 'كيمتشي إضافي' : 'Extra Kimchi',
      'Gochujang Sauce': language === 'ar' ? 'صلصة غوتشوجانغ' : 'Gochujang Sauce',
      'Sesame Oil': language === 'ar' ? 'زيت السمسم' : 'Sesame Oil',
      'Lemon Butter': language === 'ar' ? 'زبدة الليمون' : 'Lemon Butter',
      'Garlic Herb': language === 'ar' ? 'أعشاب بالثوم' : 'Garlic Herb',
      'Tartar Sauce': language === 'ar' ? 'صلصة التارتار' : 'Tartar Sauce',
      'Peanut Sauce': language === 'ar' ? 'صلصة الفول السوداني' : 'Peanut Sauce',
      'Fresh Herbs': language === 'ar' ? 'أعشاب طازجة' : 'Fresh Herbs',
      'Lime Wedges': language === 'ar' ? 'شرائح الليمون' : 'Lime Wedges',
      'Extra Avocado': language === 'ar' ? 'أفوكادو إضافي' : 'Extra Avocado',
      'Quinoa': language === 'ar' ? 'كينوا' : 'Quinoa',
      'Chia Seeds': language === 'ar' ? 'بذور الشيا' : 'Chia Seeds',
      'Extra Chocolate': language === 'ar' ? 'شوكولاتة إضافية' : 'Extra Chocolate',
      'Whipped Cream': language === 'ar' ? 'كريمة مخفوقة' : 'Whipped Cream',
      'Caramel Drizzle': language === 'ar' ? 'رشة كراميل' : 'Caramel Drizzle',
      'Chopped Nuts': language === 'ar' ? 'مكسرات مفرومة' : 'Chopped Nuts',
      'Extra Ice': language === 'ar' ? 'ثلج إضافي' : 'Extra Ice',
      'Extra Sweet': language === 'ar' ? 'سكر إضافي' : 'Extra Sweet',
      'Boba Pearls': language === 'ar' ? 'كريات التابيوكا' : 'Boba Pearls',
    };
    return addonMap[addonName] || addonName;
  };

  // 🔴 دالة ترجمة المنتج (الاسم والوصف) - تشمل المنيو والعروض
  const getTranslatedProduct = (prod) => {
    // 🔴 خريطة العروض (يتم التحقق منها أولاً)
    const offerNameMap = {
      'Pizza & Fries Combo': language === 'ar' ? 'بيتزا وبطاطا مقلية' : 'Pizza & Fries Combo',
      'Double Burger Combo': language === 'ar' ? 'برغر مزدوج' : 'Double Burger Combo',
      'Pasta Special': language === 'ar' ? 'باستا خاصة' : 'Pasta Special',
      'Sushi Family Pack': language === 'ar' ? 'علبة سوشي عائلية' : 'Sushi Family Pack',
      'Korean BBQ Feast': language === 'ar' ? 'وليمة باربيكيو كورية' : 'Korean BBQ Feast',
      'Seafood Delight': language === 'ar' ? 'لذة المأكولات البحرية' : 'Seafood Delight',
      'Bubble Tea & Mochi Box': language === 'ar' ? 'شاي الفقاعات وموتشي' : 'Bubble Tea & Mochi Box',
      'Pad Thai & Spring Rolls': language === 'ar' ? 'باد تاي ولفائف الربيع' : 'Pad Thai & Spring Rolls',
    };
    
    const offerDescMap = {
      'Pizza & Fries Combo': language === 'ar' ? 'بيتزا كبيرة · بطاطا مقلية · مشروب غازي' : 'Large pizza · seasoned fries · soft drink',
      'Double Burger Combo': language === 'ar' ? 'برغر مزدوج · بطاطا · مشروب' : 'Double smash burger · fries · drink',
      'Pasta Special': language === 'ar' ? 'باستا كريمية · خبز بالثوم · مشروب' : 'Creamy pasta · garlic bread · drink',
      'Sushi Family Pack': language === 'ar' ? 'سوشي مشكل · شوربة ميسو · إدامامي' : 'Assorted sushi · miso soup · edamame',
      'Korean BBQ Feast': language === 'ar' ? 'لحم متبل · كيمتشي · أرز · جانشان' : 'Marinated beef · kimchi · rice · banchan',
      'Seafood Delight': language === 'ar' ? 'سلمون مشوي · جمبري · خضار' : 'Grilled salmon · tiger shrimp · vegetables',
      'Bubble Tea & Mochi Box': language === 'ar' ? '2 شاي فقاعات · 3 آيس كريم موتشي' : '2 bubble teas · 3 mochi ice creams',
      'Pad Thai & Spring Rolls': language === 'ar' ? 'باد تاي مقلي · لفائف مقرمشة · صلصة حارة' : 'Wok pad thai · crispy rolls · chilli sauce',
    };

    // 🔴 التحقق من وجود العرض في خريطة العروض
    const nameToCheck = prod.originalName || prod.name;
    if (offerNameMap[nameToCheck]) {
      return {
        name: offerNameMap[nameToCheck],
        description: offerDescMap[nameToCheck] || prod.description
      };
    }

    // 🔴 خريطة أسماء منتجات المنيو
    const manualTranslationMap = {
      'Dragon Roll': t.products?.dragonRoll || 'Dragon Roll',
      'Rainbow Roll': t.products?.rainbowRoll || 'Rainbow Roll',
      'Spicy Tuna Roll': t.products?.spicyTunaRoll || 'Spicy Tuna Roll',
      'Wagyu Yaki': t.products?.wagyuYaki || 'Wagyu Yaki',
      'Yakitori Skewers': t.products?.yakitoriSkewers || 'Yakitori Skewers',
      'Grilled Salmon': t.products?.grilledSalmon || 'Grilled Salmon',
      'Tempura Shrimp': t.products?.tempuraShrimp || 'Tempura Shrimp',
      'Miso Ramen': t.products?.misoRamen || 'Miso Ramen',
      'Gyoza Dumplings': t.products?.gyozaDumplings || 'Gyoza Dumplings',
      'Chicken Katsu': t.products?.chickenKatsu || 'Chicken Katsu',
      'Okonomiyaki': t.products?.okonomiyaki || 'Okonomiyaki',
      'Unagi Don': t.products?.unagiDon || 'Unagi Don',
      'Japanese Curry': t.products?.japaneseCurry || 'Japanese Curry',
      'Sashimi Platter': t.products?.sashimiPlatter || 'Sashimi Platter',
      'Matcha Tiramisu': t.products?.matchaTiramisu || 'Matcha Tiramisu',
      'Kung Pao Chicken': t.products?.kungPaoChicken || 'Kung Pao Chicken',
      'Mapo Tofu': t.products?.mapoTofu || 'Mapo Tofu',
      'Peking Duck': t.products?.pekingDuck || 'Peking Duck',
      'Dim Sum Platter': t.products?.dimSumPlatter || 'Dim Sum Platter',
      'Sweet & Sour Pork': t.products?.sweetSourPork || 'Sweet & Sour Pork',
      'Beef Chow Mein': t.products?.beefChowMein || 'Beef Chow Mein',
      'Spring Rolls': t.products?.springRolls || 'Spring Rolls',
      'Hot & Sour Soup': t.products?.hotSourSoup || 'Hot & Sour Soup',
      'Szechuan Fish': t.products?.szechuanFish || 'Szechuan Fish',
      'Yangzhou Fried Rice': t.products?.yangzhouFriedRice || 'Yangzhou Fried Rice',
      'Mongolian Beef': t.products?.mongolianBeef || 'Mongolian Beef',
      'Wonton Soup': t.products?.wontonSoup || 'Wonton Soup',
      'Sesame Chicken': t.products?.sesameChicken || 'Sesame Chicken',
      'Eggplant with Garlic Sauce': t.products?.eggplantGarlic || 'Eggplant with Garlic Sauce',
      'Fortune Cookies': t.products?.fortuneCookies || 'Fortune Cookies',
      'Bibimbap': t.products?.bibimbap || 'Bibimbap',
      'Kimchi Jjigae': t.products?.kimchiJjigae || 'Kimchi Jjigae',
      'Korean BBQ Beef': t.products?.koreanBBQBeef || 'Korean BBQ Beef',
      'Tteokbokki': t.products?.tteokbokki || 'Tteokbokki',
      'Korean Fried Chicken': t.products?.koreanFriedChicken || 'Korean Fried Chicken',
      'Japchae': t.products?.japchae || 'Japchae',
      'Samgyeopsal': t.products?.samgyeopsal || 'Samgyeopsal',
      'Kimchi Pancake': t.products?.kimchiPancake || 'Kimchi Pancake',
      'Sundubu Jjigae': t.products?.sundubuJjigae || 'Sundubu Jjigae',
      'Bulgogi': t.products?.bulgogi || 'Bulgogi',
      'Kimbap': t.products?.kimbap || 'Kimbap',
      'Soondae': t.products?.soondae || 'Soondae',
      'Galbi Jjim': t.products?.galbiJjim || 'Galbi Jjim',
      'Hotteok': t.products?.hotteok || 'Hotteok',
      'Patbingsu': t.products?.patbingsu || 'Patbingsu',
      'Margherita Pizza': t.products?.margheritaPizza || 'Margherita Pizza',
      'Pepperoni Pizza': t.products?.pepperoniPizza || 'Pepperoni Pizza',
      'Quattro Stagioni': t.products?.quattroStagioni || 'Quattro Stagioni',
      'Pizza Napoletana': t.products?.pizzaNapoletana || 'Pizza Napoletana',
      'Pizza Funghi': t.products?.pizzaFunghi || 'Pizza Funghi',
      'Pizza Vegetariana': t.products?.pizzaVegetariana || 'Pizza Vegetariana',
      'Spaghetti Carbonara': t.products?.spaghettiCarbonara || 'Spaghetti Carbonara',
      'Fettuccine Alfredo': t.products?.fettuccineAlfredo || 'Fettuccine Alfredo',
      'Lasagna Bolognese': t.products?.lasagnaBolognese || 'Lasagna Bolognese',
      'Risotto ai Funghi': t.products?.risottoFunghi || 'Risotto ai Funghi',
      'Gnocchi al Pesto': t.products?.gnocchiPesto || 'Gnocchi al Pesto',
      'Ossobuco': t.products?.ossobuco || 'Ossobuco',
      'Caprese Salad': t.products?.capreseSalad || 'Caprese Salad',
      'Tiramisu': t.products?.tiramisu || 'Tiramisu',
      'Panna Cotta': t.products?.pannaCotta || 'Panna Cotta',
      'Spicy Seafood Soup': t.products?.spicySeafoodSoup || 'Spicy Seafood Soup',
      'Grilled Octopus': t.products?.grilledOctopus || 'Grilled Octopus',
      'Lobster Thermidor': t.products?.lobsterThermidor || 'Lobster Thermidor',
      'Seafood Paella': t.products?.seafoodPaella || 'Seafood Paella',
      'Crab Cakes': t.products?.crabCakes || 'Crab Cakes',
      'Miso Glazed Cod': t.products?.misoGlazedCod || 'Miso Glazed Cod',
      'Fried Calamari': t.products?.friedCalamari || 'Fried Calamari',
      'Oysters Rockefeller': t.products?.oystersRockefeller || 'Oysters Rockefeller',
      'Shrimp Scampi': t.products?.shrimpScampi || 'Shrimp Scampi',
      'Tuna Tartare': t.products?.tunaTartare || 'Tuna Tartare',
      'Moules Frites': t.products?.moulesFrites || 'Moules Frites',
      'Fish and Chips': t.products?.fishAndChips || 'Fish and Chips',
      'Seafood Ceviche': t.products?.seafoodCeviche || 'Seafood Ceviche',
      'Pad Thai': t.products?.padThai || 'Pad Thai',
      'Tom Yum Soup': t.products?.tomYumSoup || 'Tom Yum Soup',
      'Green Curry': t.products?.greenCurry || 'Green Curry',
      'Pho Bo': t.products?.phoBo || 'Pho Bo',
      'Satay Chicken': t.products?.satayChicken || 'Satay Chicken',
      'Mango Sticky Rice': t.products?.mangoStickyRice || 'Mango Sticky Rice',
      'Singapore Noodles': t.products?.singaporeNoodles || 'Singapore Noodles',
      'Massaman Curry': t.products?.massamanCurry || 'Massaman Curry',
      'Banh Mi': t.products?.banhMi || 'Banh Mi',
      'Roti Canai': t.products?.rotiCanai || 'Roti Canai',
      'Laksa': t.products?.laksa || 'Laksa',
      'Nasi Goreng': t.products?.nasiGoreng || 'Nasi Goreng',
      'Thai Iced Tea': t.products?.thaiIcedTea || 'Thai Iced Tea',
      'Pandan Cake': t.products?.pandanCake || 'Pandan Cake',
      'Buddha Bowl': t.products?.buddhaBowl || 'Buddha Bowl',
      'Seaweed Salad': t.products?.seaweedSalad || 'Seaweed Salad',
      'Steamed Vegetables': t.products?.steamedVegetables || 'Steamed Vegetables',
      'Grilled Salmon Bowl': t.products?.grilledSalmonBowl || 'Grilled Salmon Bowl',
      'Avocado Toast': t.products?.avocadoToast || 'Avocado Toast',
      'Fruit Smoothie Bowl': t.products?.fruitSmoothieBowl || 'Fruit Smoothie Bowl',
      'Kale Caesar Salad': t.products?.kaleCaesarSalad || 'Kale Caesar Salad',
      'Zucchini Noodles': t.products?.zucchiniNoodles || 'Zucchini Noodles',
      'Sweet Potato Bowl': t.products?.sweetPotatoBowl || 'Sweet Potato Bowl',
      'Acai Bowl': t.products?.acaiBowl || 'Acai Bowl',
      'Green Smoothie': t.products?.greenSmoothie || 'Green Smoothie',
      'Quinoa Salad': t.products?.quinoaSalad || 'Quinoa Salad',
      'Grilled Chicken Salad': t.products?.grilledChickenSalad || 'Grilled Chicken Salad',
      'Fresh Juice': t.products?.freshJuice || 'Fresh Juice',
      'Chia Pudding': t.products?.chiaPudding || 'Chia Pudding',
      'Japanese Sake': t.products?.japaneseSake || 'Japanese Sake',
      'Bubble Tea': t.products?.bubbleTea || 'Bubble Tea',
      'Green Matcha Latte': t.products?.greenMatchaLatte || 'Green Matcha Latte',
      'Fresh Coconut Water': t.products?.freshCoconutWater || 'Fresh Coconut Water',
      'Mango Lassi': t.products?.mangoLassi || 'Mango Lassi',
      'Lemonade': t.products?.lemonade || 'Lemonade',
      'Iced Coffee': t.products?.icedCoffee || 'Iced Coffee',
      'Smoothie': t.products?.smoothie || 'Smoothie',
      'Green Juice': t.products?.greenJuice || 'Green Juice',
      'Hot Chocolate': t.products?.hotChocolate || 'Hot Chocolate',
      'Chai Latte': t.products?.chaiLatte || 'Chai Latte',
      'Sparkling Water': t.products?.sparklingWater || 'Sparkling Water',
      'Milkshake': t.products?.milkshake || 'Milkshake',
      'Herbal Tea': t.products?.herbalTea || 'Herbal Tea',
      'Mochi Ice Cream': t.products?.mochiIceCream || 'Mochi Ice Cream',
      'Matcha Cheesecake': t.products?.matchaCheesecake || 'Matcha Cheesecake',
      'Banana Spring Rolls': t.products?.bananaSpringRolls || 'Banana Spring Rolls',
      'Chocolate Lava Cake': t.products?.chocolateLavaCake || 'Chocolate Lava Cake',
      'Crème Brûlée': t.products?.cremeBrulee || 'Crème Brûlée',
      'Apple Pie': t.products?.applePie || 'Apple Pie',
      'Cheesecake': t.products?.cheesecake || 'Cheesecake',
      'Brownie Sundae': t.products?.brownieSundae || 'Brownie Sundae',
      'Fruit Tart': t.products?.fruitTart || 'Fruit Tart',
      'Gelato': t.products?.gelato || 'Gelato',
      'Sorbet': t.products?.sorbet || 'Sorbet',
      'Donuts': t.products?.donuts || 'Donuts',
      'Macarons': t.products?.macarons || 'Macarons',
    };
    
    // ترجمة الاسم لمنتجات المنيو
    let translatedName = manualTranslationMap[prod.name];
    if (!translatedName) {
      const key = prod.name
        .toLowerCase()
        .replace(/\s+/g, '')
        .replace(/[&/\\#,+()$~%.'":*?<>{}]/g, '')
      translatedName = t.products?.[key] || prod.name;
    }
    
    // 🔴 ترجمة الوصف لمنتجات المنيو
    let translatedDescription = prod.description;
    
    // طريقة 1: باستخدام مفتاح الوصف
    const descKey = prod.name
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/[&/\\#,+()$~%.'":*?<>{}]/g, '')+ 'Desc';
    
    const descTranslation = t.products?.descriptions?.[descKey];
    if (descTranslation) {
      translatedDescription = descTranslation;
    } else {
      // طريقة 2: البحث المباشر في كل المفاتيح
      const descriptions = t.products?.descriptions || {};
      for (const [key, value] of Object.entries(descriptions)) {
        const keyWithoutDesc = key.toLowerCase().replace('desc', '');
        const prodNameLower = prod.name.toLowerCase().replace(/\s+/g, '');
        if (prodNameLower.includes(keyWithoutDesc) || keyWithoutDesc.includes(prodNameLower)) {
          translatedDescription = value;
          break;
        }
      }
    }
    
    // طريقة 3: خريطة يدوية للوصف (حل أخير)
    if (translatedDescription === prod.description) {
      const descManualMap = {
        'en': {
          'Fresh salmon & avocado sushi roll': 'Fresh salmon & avocado sushi roll',
          'Colorful sushi with assorted fish': 'Colorful sushi with assorted fish',
          'Fresh tuna with spicy mayo': 'Fresh tuna with spicy mayo',
          'Premium Japanese wagyu grilled': 'Premium Japanese wagyu grilled',
          'Grilled chicken skewers with tare sauce': 'Grilled chicken skewers with tare sauce',
          'Fresh salmon with miso glaze': 'Fresh salmon with miso glaze',
          'Crispy battered shrimp with dipping sauce': 'Crispy battered shrimp with dipping sauce',
          'Rich pork broth with noodles and egg': 'Rich pork broth with noodles and egg',
          'Pan-fried pork and vegetable dumplings': 'Pan-fried pork and vegetable dumplings',
          'Breaded fried chicken cutlet with curry': 'Breaded fried chicken cutlet with curry',
          'Savory Japanese pancake with toppings': 'Savory Japanese pancake with toppings',
          'Grilled eel over rice with sweet sauce': 'Grilled eel over rice with sweet sauce',
          'Rich curry with vegetables and rice': 'Rich curry with vegetables and rice',
          'Fresh assorted premium fish slices': 'Fresh assorted premium fish slices',
          'Japanese twist on classic tiramisu': 'Japanese twist on classic tiramisu',
          'Spicy chicken with peanuts and chili peppers': 'Spicy chicken with peanuts and chili peppers',
          'Spicy tofu with chili sauce and black beans': 'Spicy tofu with chili sauce and black beans',
          'Famous Peking duck with Chinese bread and sauce': 'Famous Peking duck with Chinese bread and sauce',
          'Assortment of traditional Chinese appetizers': 'Assortment of traditional Chinese appetizers',
          'Fried pork with sweet and sour sauce': 'Fried pork with sweet and sour sauce',
          'Fried noodles with beef and vegetables': 'Fried noodles with beef and vegetables',
          'Crispy spring rolls filled with vegetables': 'Crispy spring rolls filled with vegetables',
          'Hot and sour soup with tofu and mushrooms': 'Hot and sour soup with tofu and mushrooms',
          'Spicy Szechuan-style fish with chili': 'Spicy Szechuan-style fish with chili',
          'Yangzhou-style fried rice with egg and meat': 'Yangzhou-style fried rice with egg and meat',
          'Beef with onions and Mongolian sauce': 'Beef with onions and Mongolian sauce',
          'Wonton soup with Chinese dumplings': 'Wonton soup with Chinese dumplings',
          'Fried chicken with sesame sauce': 'Fried chicken with sesame sauce',
          'Eggplant cooked with spicy garlic sauce': 'Eggplant cooked with spicy garlic sauce',
          'Traditional Chinese fortune cookies': 'Traditional Chinese fortune cookies',
          'Korean rice bowl with vegetables, meat and egg': 'Korean rice bowl with vegetables, meat and egg',
          'Spicy Korean stew with kimchi and tofu': 'Spicy Korean stew with kimchi and tofu',
          'Korean BBQ beef grilled at the table': 'Korean BBQ beef grilled at the table',
          'Spicy Korean rice cakes with chili sauce': 'Spicy Korean rice cakes with chili sauce',
          'Crispy Korean fried chicken with sweet and spicy sauce': 'Crispy Korean fried chicken with sweet and spicy sauce',
          'Stir-fried Korean glass noodles with vegetables': 'Stir-fried Korean glass noodles with vegetables',
          'Grilled Korean pork belly with lettuce leaves': 'Grilled Korean pork belly with lettuce leaves',
          'Korean pancake with kimchi and vegetables': 'Korean pancake with kimchi and vegetables',
          'Spicy Korean tofu stew with seafood': 'Spicy Korean tofu stew with seafood',
          'Marinated grilled Korean beef': 'Marinated grilled Korean beef',
          'Korean rice rolls with vegetables and meat': 'Korean rice rolls with vegetables and meat',
          'Korean sausage stuffed with rice and vermicelli': 'Korean sausage stuffed with rice and vermicelli',
          'Slow-cooked Korean beef short ribs': 'Slow-cooked Korean beef short ribs',
          'Sweet Korean pancakes filled with sugar and nuts': 'Sweet Korean pancakes filled with sugar and nuts',
          'Korean shaved ice dessert with red beans and fruit': 'Korean shaved ice dessert with red beans and fruit',
          'Classic Italian pizza with tomato, mozzarella and basil': 'Classic Italian pizza with tomato, mozzarella and basil',
          'Pizza with pepperoni, cheese and sauce': 'Pizza with pepperoni, cheese and sauce',
          'Four seasons pizza with a variety of toppings': 'Four seasons pizza with a variety of toppings',
          'Traditional Neapolitan pizza with tomato and garlic': 'Traditional Neapolitan pizza with tomato and garlic',
          'Pizza with fresh mushrooms and cheese': 'Pizza with fresh mushrooms and cheese',
          'Vegetarian pizza with fresh vegetables': 'Vegetarian pizza with fresh vegetables',
          'Classic Italian pasta with egg, cheese and pancetta': 'Classic Italian pasta with egg, cheese and pancetta',
          'Pasta with creamy butter and parmesan sauce': 'Pasta with creamy butter and parmesan sauce',
          'Italian lasagna with meat sauce and cheese': 'Italian lasagna with meat sauce and cheese',
          'Creamy Italian risotto with fresh mushrooms': 'Creamy Italian risotto with fresh mushrooms',
          'Italian gnocchi with pesto sauce': 'Italian gnocchi with pesto sauce',
          'Slow-cooked Italian veal shank with vegetables': 'Slow-cooked Italian veal shank with vegetables',
          'Fresh Italian salad with mozzarella, tomato and basil': 'Fresh Italian salad with mozzarella, tomato and basil',
          'Classic Italian dessert with coffee and cocoa': 'Classic Italian dessert with coffee and cocoa',
          'Creamy Italian dessert with berry sauce': 'Creamy Italian dessert with berry sauce',
          'Spicy and rich seafood soup': 'Spicy and rich seafood soup',
          'Grilled octopus with olive oil and lemon': 'Grilled octopus with olive oil and lemon',
          'Luxurious lobster with creamy cheese sauce': 'Luxurious lobster with creamy cheese sauce',
          'Spanish paella with seafood and rice': 'Spanish paella with seafood and rice',
          'Crispy crab cakes with tartar sauce': 'Crispy crab cakes with tartar sauce',
          'Cod fish with Japanese miso sauce': 'Cod fish with Japanese miso sauce',
          'Crispy fried calamari with marinara sauce': 'Crispy fried calamari with marinara sauce',
          'Baked oysters with spinach and cheese': 'Baked oysters with spinach and cheese',
          'Shrimp with garlic, butter and lemon juice': 'Shrimp with garlic, butter and lemon juice',
          'Fresh tuna tartare with avocado': 'Fresh tuna tartare with avocado',
          'Mussels with french fries': 'Mussels with french fries',
          'Crispy fried fish and chips': 'Crispy fried fish and chips',
          'Seafood marinated in lemon juice': 'Seafood marinated in lemon juice',
          'Thai fried noodles with shrimp and peanuts': 'Thai fried noodles with shrimp and peanuts',
          'Hot and sour Thai soup with shrimp': 'Hot and sour Thai soup with shrimp',
          'Thai green curry with coconut milk': 'Thai green curry with coconut milk',
          'Vietnamese soup with rice noodles and beef': 'Vietnamese soup with rice noodles and beef',
          'Grilled chicken skewers with peanut sauce': 'Grilled chicken skewers with peanut sauce',
          'Sticky rice with mango and coconut milk': 'Sticky rice with mango and coconut milk',
          'Singapore-style fried noodles with curry and shrimp': 'Singapore-style fried noodles with curry and shrimp',
          'Rich Thai curry with potatoes and peanuts': 'Rich Thai curry with potatoes and peanuts',
          'Vietnamese sandwich with meat and pickled vegetables': 'Vietnamese sandwich with meat and pickled vegetables',
          'Malaysian flatbread with curry sauce': 'Malaysian flatbread with curry sauce',
          'Spicy noodle soup with coconut milk': 'Spicy noodle soup with coconut milk',
          'Indonesian fried rice with egg and vegetables': 'Indonesian fried rice with egg and vegetables',
          'Thai iced tea with condensed milk': 'Thai iced tea with condensed milk',
          'Green pandan-flavored cake': 'Green pandan-flavored cake',
          'Healthy bowl with grains, vegetables and protein': 'Healthy bowl with grains, vegetables and protein',
          'Refreshing seaweed salad with sesame dressing': 'Refreshing seaweed salad with sesame dressing',
          'Seasonal steamed vegetables': 'Seasonal steamed vegetables',
          'Bowl with grilled salmon, quinoa and vegetables': 'Bowl with grilled salmon, quinoa and vegetables',
          'Toasted bread with avocado and tomato': 'Toasted bread with avocado and tomato',
          'Smoothie bowl with fresh fruits and nuts': 'Smoothie bowl with fresh fruits and nuts',
          'Healthy kale salad with light Caesar dressing': 'Healthy kale salad with light Caesar dressing',
          'Zucchini noodles with pesto sauce': 'Zucchini noodles with pesto sauce',
          'Bowl with sweet potato, chickpeas and vegetables': 'Bowl with sweet potato, chickpeas and vegetables',
          'Acai bowl with fruits and granola': 'Acai bowl with fruits and granola',
          'Green smoothie with spinach and banana': 'Green smoothie with spinach and banana',
          'Quinoa salad with fresh vegetables': 'Quinoa salad with fresh vegetables',
          'Salad with grilled chicken and fresh vegetables': 'Salad with grilled chicken and fresh vegetables',
          '100% fresh fruit juice': '100% fresh fruit juice',
          'Chia pudding with coconut milk and fruit': 'Chia pudding with coconut milk and fruit',
          'Traditional Japanese rice wine': 'Traditional Japanese rice wine',
          'Bubble tea with tapioca pearls': 'Bubble tea with tapioca pearls',
          'Latte with green matcha flavor': 'Latte with green matcha flavor',
          'Natural fresh coconut water': 'Natural fresh coconut water',
          'Refreshing Indian mango yogurt drink': 'Refreshing Indian mango yogurt drink',
          'Fresh and refreshing lemonade': 'Fresh and refreshing lemonade',
          'Rich and flavorful iced coffee': 'Rich and flavorful iced coffee',
          'Fresh and thick fruit smoothie': 'Fresh and thick fruit smoothie',
          'Healthy green juice with vegetables and fruits': 'Healthy green juice with vegetables and fruits',
          'Rich and creamy hot chocolate': 'Rich and creamy hot chocolate',
          'Tea latte with Indian spices': 'Tea latte with Indian spices',
          'Refreshing sparkling water': 'Refreshing sparkling water',
          'Creamy milkshake in favorite flavors': 'Creamy milkshake in favorite flavors',
          'Natural and soothing herbal tea': 'Natural and soothing herbal tea',
          'Japanese ice cream wrapped in mochi dough': 'Japanese ice cream wrapped in mochi dough',
          'Creamy cheesecake with matcha flavor': 'Creamy cheesecake with matcha flavor',
          'Crispy banana spring rolls with caramel sauce': 'Crispy banana spring rolls with caramel sauce',
          'Chocolate cake with liquid chocolate center': 'Chocolate cake with liquid chocolate center',
          'Creamy French dessert with crispy caramel top': 'Creamy French dessert with crispy caramel top',
          'Traditional apple pie with cinnamon': 'Traditional apple pie with cinnamon',
          'Creamy cheesecake with berry sauce': 'Creamy cheesecake with berry sauce',
          'Brownie with ice cream and chocolate sauce': 'Brownie with ice cream and chocolate sauce',
          'Fresh fruit tart with cream': 'Fresh fruit tart with cream',
          'Creamy and smooth Italian gelato': 'Creamy and smooth Italian gelato',
          'Refreshing fruit sorbet, fat-free': 'Refreshing fruit sorbet, fat-free',
          'Fresh donuts with sugar coating': 'Fresh donuts with sugar coating',
          'Colorful and crispy French macarons': 'Colorful and crispy French macarons',
        },
        'ar': {
          'Fresh salmon & avocado sushi roll': 'لفائف سوشي طازجة مع الأفوكادو والسلمون',
          'Colorful sushi with assorted fish': 'لفائف ملونة مع مجموعة متنوعة من الأسماك',
          'Fresh tuna with spicy mayo': 'تونة طازجة مع مايونيز حار',
          'Premium Japanese wagyu grilled': 'لحم واجيو ياباني فاخر مشوي',
          'Grilled chicken skewers with tare sauce': 'أسياخ دجاج مشوية مع صلصة ترياكي',
          'Fresh salmon with miso glaze': 'سلمون طازج مع صلصة ميسو',
          'Crispy battered shrimp with dipping sauce': 'روبيان مقلي مقرمش مع صلصة غمس',
          'Rich pork broth with noodles and egg': 'شوربة لحم غنية مع نودلز وبيض',
          'Pan-fried pork and vegetable dumplings': 'زلابية لحم وخضار مقلية',
          'Breaded fried chicken cutlet with curry': 'كستلاتة دجاج مقلية مع الكاري',
          'Savory Japanese pancake with toppings': 'فطيرة يابانية لذيذة مع الإضافات',
          'Grilled eel over rice with sweet sauce': 'ثعبان البحر المشوي مع الأرز والصلصة الحلوة',
          'Rich curry with vegetables and rice': 'كاري غني مع الخضار والأرز',
          'Fresh assorted premium fish slices': 'تشكيلة من شرائح السمك الطازج الفاخر',
          'Japanese twist on classic tiramisu': 'لمسة يابانية على التيراميسو الكلاسيكي',
          'Spicy chicken with peanuts and chili peppers': 'دجاج حار مع الفول السوداني والفلفل الحار',
          'Spicy tofu with chili sauce and black beans': 'توفو حار مع صلصة الفلفل والفاصوليا السوداء',
          'Famous Peking duck with Chinese bread and sauce': 'بط بكين الشهير مع الخبز الصيني والصلصة',
          'Assortment of traditional Chinese appetizers': 'تشكيلة من المقبلات الصينية التقليدية',
          'Fried pork with sweet and sour sauce': 'لحم خنزير مقلي مع صلصة حلوة وحامضة',
          'Fried noodles with beef and vegetables': 'نودلز مقلية مع لحم البقر والخضار',
          'Crispy spring rolls filled with vegetables': 'لفائف الربيع المقرمشة المحشوة بالخضار',
          'Hot and sour soup with tofu and mushrooms': 'شوربة حارة وحامضة مع التوفو والفطر',
          'Spicy Szechuan-style fish with chili': 'سمك حار على طريقة سيتشوان مع الفلفل',
          'Yangzhou-style fried rice with egg and meat': 'أرز مقلي على طريقة يانغتشو مع البيض واللحم',
          'Beef with onions and Mongolian sauce': 'لحم بقر مع البصل والصلصة المنغولية',
          'Wonton soup with Chinese dumplings': 'شوربة ونتون مع الزلابية الصينية',
          'Fried chicken with sesame sauce': 'دجاج مقلي مع صلصة السمسم',
          'Eggplant cooked with spicy garlic sauce': 'باذنجان مطهو مع صلصة الثوم الحارة',
          'Traditional Chinese fortune cookies': 'بسكويت الحظ الصيني التقليدي',
          'Korean rice bowl with vegetables, meat and egg': 'وعاء أرز كوري مع الخضار واللحم والبيض',
          'Spicy Korean stew with kimchi and tofu': 'حساء كوري حار مع الكيمتشي والتوفو',
          'Korean BBQ beef grilled at the table': 'لحم بقر كوري مشوي على الطاولة',
          'Spicy Korean rice cakes with chili sauce': 'كعك أرز كوري حار مع صلصة الفلفل',
          'Crispy Korean fried chicken with sweet and spicy sauce': 'دجاج كوري مقلي مقرمش مع صلصة حلوة حارة',
          'Stir-fried Korean glass noodles with vegetables': 'نودلز زجاجية كورية مقلية مع الخضار',
          'Grilled Korean pork belly with lettuce leaves': 'لحم خنزير كوري مشوي مع أوراق الخس',
          'Korean pancake with kimchi and vegetables': 'فطيرة كورية مع الكيمتشي والخضار',
          'Spicy Korean tofu stew with seafood': 'حساء توفو كوري حار مع المأكولات البحرية',
          'Marinated grilled Korean beef': 'لحم بقر كوري متبل مشوي',
          'Korean rice rolls with vegetables and meat': 'لفائف الأرز الكورية مع الخضار واللحم',
          'Korean sausage stuffed with rice and vermicelli': 'نقانق كورية محشوة بالأرز والشعيرية',
          'Slow-cooked Korean beef short ribs': 'أضلاع لحم بقري كورية مطهوة ببطء',
          'Sweet Korean pancakes filled with sugar and nuts': 'فطائر كورية حلوة محشوة بالسكر والمكسرات',
          'Korean shaved ice dessert with red beans and fruit': 'حلوى كورية مثلجة مع الفاصوليا الحمراء والفواكه',
          'Classic Italian pizza with tomato, mozzarella and basil': 'بيتزا إيطالية كلاسيكية مع الطماطم والموزاريلا والريحان',
          'Pizza with pepperoni, cheese and sauce': 'بيتزا مع البيبروني والجبن والصلصة',
          'Four seasons pizza with a variety of toppings': 'بيتزا أربعة مواسم مع تشكيلة من الإضافات',
          'Traditional Neapolitan pizza with tomato and garlic': 'بيتزا نابوليتانية تقليدية مع الطماطم والثوم',
          'Pizza with fresh mushrooms and cheese': 'بيتزا مع الفطر الطازج والجبن',
          'Vegetarian pizza with fresh vegetables': 'بيتزا نباتية مع الخضار الطازجة',
          'Classic Italian pasta with egg, cheese and pancetta': 'معكرونة إيطالية كلاسيكية مع البيض والجبن والبانشيتا',
          'Pasta with creamy butter and parmesan sauce': 'معكرونة مع صلصة كريمية من الزبدة والبارميزان',
          'Italian lasagna with meat sauce and cheese': 'لازانيا إيطالية مع صلصة اللحم والجبن',
          'Creamy Italian risotto with fresh mushrooms': 'ريزوتو إيطالي كريمي مع الفطر الطازج',
          'Italian gnocchi with pesto sauce': 'نيوكي إيطالي مع صلصة البيستو',
          'Slow-cooked Italian veal shank with vegetables': 'لحم عجل إيطالي مطهو ببطء مع الخضار',
          'Fresh Italian salad with mozzarella, tomato and basil': 'سلطة إيطالية طازجة مع الموزاريلا والطماطم والريحان',
          'Classic Italian dessert with coffee and cocoa': 'حلوى إيطالية كلاسيكية مع القهوة والكاكاو',
          'Creamy Italian dessert with berry sauce': 'حلوى إيطالية كريمية مع صلصة التوت',
          'Spicy and rich seafood soup': 'شوربة مأكولات بحرية حارة وغنية',
          'Grilled octopus with olive oil and lemon': 'أخطبوط مشوي مع زيت الزيتون والليمون',
          'Luxurious lobster with creamy cheese sauce': 'لوبستر فاخر مع صلصة كريمية وجبن',
          'Spanish paella with seafood and rice': 'باييلا إسبانية مع المأكولات البحرية والأرز',
          'Crispy crab cakes with tartar sauce': 'أقراص سلطعون مقرمشة مع صلصة التارتار',
          'Cod fish with Japanese miso sauce': 'سمك القد مع صلصة الميسو اليابانية',
          'Crispy fried calamari with marinara sauce': 'كالاماري مقلي مقرمش مع صلصة المارينارا',
          'Baked oysters with spinach and cheese': 'محار مشوي مع السبانخ والجبن',
          'Shrimp with garlic, butter and lemon juice': 'جمبري مع الثوم والزبدة وعصير الليمون',
          'Fresh tuna tartare with avocado': 'تارتار التونة الطازجة مع الأفوكادو',
          'Mussels with french fries': 'بلح البحر مع البطاطا المقلية',
          'Crispy fried fish and chips': 'سمك وبطاطا مقليون مقرمشون',
          'Seafood marinated in lemon juice': 'مأكولات بحرية متبلة بعصير الليمون',
          'Thai fried noodles with shrimp and peanuts': 'نودلز تايلاندية مقلية مع الروبيان والفول السوداني',
          'Hot and sour Thai soup with shrimp': 'شوربة تايلاندية حارة وحامضة مع الروبيان',
          'Thai green curry with coconut milk': 'كاري أخضر تايلاندي مع حليب جوز الهند',
          'Vietnamese soup with rice noodles and beef': 'شوربة فيتنامية مع نودلز الأرز ولحم البقر',
          'Grilled chicken skewers with peanut sauce': 'دجاج مشوي على أسياخ مع صلصة الفول السوداني',
          'Sticky rice with mango and coconut milk': 'أرز لزج مع المانجو وحليب جوز الهند',
          'Singapore-style fried noodles with curry and shrimp': 'نودلز سنغافورية مقلية مع الكاري والروبيان',
          'Rich Thai curry with potatoes and peanuts': 'كاري تايلاندي غني مع البطاطس والفول السوداني',
          'Vietnamese sandwich with meat and pickled vegetables': 'ساندويتش فيتنامي مع اللحم والخضار المخللة',
          'Malaysian flatbread with curry sauce': 'خبز مسطح ماليزي مع صلصة الكاري',
          'Spicy noodle soup with coconut milk': 'شوربة نودلز حارة مع حليب جوز الهند',
          'Indonesian fried rice with egg and vegetables': 'أرز مقلي إندونيسي مع البيض والخضار',
          'Thai iced tea with condensed milk': 'شاي تايلاندي مثلج مع الحليب المكثف',
          'Green pandan-flavored cake': 'كيك أخضر بنكهة الباندان',
          'Healthy bowl with grains, vegetables and protein': 'وعاء صحي مع الحبوب والخضار والبروتين',
          'Refreshing seaweed salad with sesame dressing': 'سلطة أعشاب بحرية منعشة مع صلصة السمسم',
          'Seasonal steamed vegetables': 'خضار موسمية مطهوة على البخار',
          'Bowl with grilled salmon, quinoa and vegetables': 'وعاء مع سلمون مشوي وكينوا وخضار',
          'Toasted bread with avocado and tomato': 'خبز محمص مع الأفوكادو والطماطم',
          'Smoothie bowl with fresh fruits and nuts': 'وعاء سموذي مع الفواكه الطازجة والمكسرات',
          'Healthy kale salad with light Caesar dressing': 'سلطة كيل صحية مع صلصة سيزر خفيفة',
          'Zucchini noodles with pesto sauce': 'نودلز الكوسا مع صلصة البيستو',
          'Bowl with sweet potato, chickpeas and vegetables': 'وعاء مع البطاطا الحلوة والحمص والخضار',
          'Acai bowl with fruits and granola': 'وعاء أكاي مع الفواكه والجرانولا',
          'Green smoothie with spinach and banana': 'سموذي أخضر مع السبانخ والموز',
          'Quinoa salad with fresh vegetables': 'سلطة الكينوا مع الخضار الطازجة',
          'Salad with grilled chicken and fresh vegetables': 'سلطة مع دجاج مشوي وخضار طازجة',
          '100% fresh fruit juice': 'عصير فواكه طازج 100%',
          'Chia pudding with coconut milk and fruit': 'بودينغ الشيا مع حليب جوز الهند والفواكه',
          'Traditional Japanese rice wine': 'نبيذ الأرز الياباني التقليدي',
          'Bubble tea with tapioca pearls': 'شاي الفقاعات مع الكريات التابيوكا',
          'Latte with green matcha flavor': 'لاتيه بنكهة الماتشا الأخضر',
          'Natural fresh coconut water': 'ماء جوز الهند الطبيعي الطازج',
          'Refreshing Indian mango yogurt drink': 'مشروب هندي منعش بالمانجو واللبن',
          'Fresh and refreshing lemonade': 'ليموناضة طازجة ومنعشة',
          'Rich and flavorful iced coffee': 'قهوة مثلجة غنية بالنكهة',
          'Fresh and thick fruit smoothie': 'سموذي فواكه طازج وكثيف',
          'Healthy green juice with vegetables and fruits': 'عصير أخضر صحي مع الخضار والفواكه',
          'Rich and creamy hot chocolate': 'شوكولاتة ساخنة غنية وكريمية',
          'Tea latte with Indian spices': 'شاي لاتيه مع التوابل الهندية',
          'Refreshing sparkling water': 'ماء فوار منعش',
          'Creamy milkshake in favorite flavors': 'ميلك شيك كريمي بالنكهات المفضلة',
          'Natural and soothing herbal tea': 'شاي أعشاب طبيعي ومهدئ',
          'Japanese ice cream wrapped in mochi dough': 'آيس كريم ياباني مغلف بعجينة الموتشي',
          'Creamy cheesecake with matcha flavor': 'تشيزكيك كريمي بنكهة الماتشا',
          'Crispy banana spring rolls with caramel sauce': 'لفائف الموز المقرمشة مع صلصة الكراميل',
          'Chocolate cake with liquid chocolate center': 'كيك الشوكولاتة مع قلب سائل من الشوكولاتة',
          'Creamy French dessert with crispy caramel top': 'حلوى فرنسية كريمية مع طبقة كراميل مقرمشة',
          'Traditional apple pie with cinnamon': 'فطيرة التفاح التقليدية مع القرفة',
          'Creamy cheesecake with berry sauce': 'تشيزكيك كريمي مع صلصة التوت',
          'Brownie with ice cream and chocolate sauce': 'براوني مع آيس كريم وصلصة الشوكولاتة',
          'Fresh fruit tart with cream': 'تارت الفواكه الطازجة مع الكريمة',
          'Creamy and smooth Italian gelato': 'جيلاتو إيطالي كريمي وطري',
          'Refreshing fruit sorbet, fat-free': 'سوربيه فواكه منعش وخالي من الدهون',
          'Fresh donuts with sugar coating': 'دوناتس طازجة مع طبقة من السكر',
          'Colorful and crispy French macarons': 'معمول فرنسي ملون ومقرمش',
        }
      };
      
      const manualDesc = descManualMap[language]?.[prod.description];
      if (manualDesc) {
        translatedDescription = manualDesc;
      }
    }
    
    return {
      name: translatedName,
      description: translatedDescription
    };
  };

  // Animate in on mount
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  // Reset state when product changes
  useEffect(() => {
    if (!product) return;
    
    const isFromCart = !!product._key;
    
    if (isFromCart) {
      setQuantity(product.qty || 1);
      setSelectedAddons(product.addons || []);
      setSelectedSpice(product.selectedSpice || "medium");
      setSelectedCrust(product.selectedCrust || "thin");
      setSpecialInstructions(product.specialInstructions || "");
      setActiveImage(0);
      
      if (product.selectedSize) {
        setSelectedSize(product.selectedSize);
      } else {
        const sizes = product.sizes ? Object.keys(product.sizes) : [];
        setSelectedSize(sizes[0] || null);
      }
    } else {
      setQuantity(1);
      setSelectedAddons([]);
      setSelectedSpice("medium");
      setSelectedCrust("thin");
      setSpecialInstructions("");
      setActiveImage(0);
      const sizes = product.sizes ? Object.keys(product.sizes) : [];
      setSelectedSize(sizes[0] || null);
    }
  }, [product]);

  const handleClose = useCallback(() => {
    setVisible(false);
    setTimeout(onClose, 320);
  }, [onClose]);

  const handleCloseRef = useRef(handleClose);
  useEffect(() => {
    handleCloseRef.current = handleClose;
  }, [handleClose]);

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") handleCloseRef.current();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (!product) return null;

  // 🔴 ترجمة المنتج
  const { name: translatedName, description: translatedDescription } = getTranslatedProduct(product);

  const isPizza = product.category === "Italian Kitchen" && product.name?.includes("Pizza");
  const showSpice = spiceCategories.includes(product.category);
  const availableAddons = getAddonsByCategory(product.category);
  const hasSizes = !!product.sizes;
  const sizes = hasSizes ? Object.keys(product.sizes) : [];
  const isOutOfStock = product.availability === "out_of_stock";

  const images = [
    product.image,
    product.image?.replace("?w=400", "?w=400&crop=center"),
    product.image?.replace("?w=400", "?w=400&crop=entropy"),
  ].filter(Boolean);

  const basePrice = hasSizes ? product.sizes[selectedSize] ?? product.price : product.price ?? 0;
  const crustExtra = isPizza ? crustTypes.find((c) => c.id === selectedCrust)?.price ?? 0 : 0;
  const addonsExtra = selectedAddons.reduce((s, a) => s + a.price, 0);
  const unitPrice = basePrice + crustExtra + addonsExtra;
  const total = unitPrice * quantity;

  const toggleAddon = (addon) => {
    setSelectedAddons((prev) =>
      prev.find((a) => a.id === addon.id)
        ? prev.filter((a) => a.id !== addon.id)
        : [...prev, addon]
    );
  };

  const triggerFlyAnimation = (buttonEl) => {
    const cartIcon = document.querySelector('.cart-btn-modern');
    if (!cartIcon) return;

    const rect = buttonEl.getBoundingClientRect();
    const cartRect = cartIcon.getBoundingClientRect();
    const el = document.createElement("div");
    el.className = "flying-item";
    
    const iconMap = {
      "Japanese Kitchen": "🍣",
      "Chinese Kitchen": "🥢",
      "Korean Kitchen": "🇰🇷",
      "Italian Kitchen": "🍕",
      "Seafood": "🦐",
      "Asian Specials": "🍜",
      "Healthy Choices": "🥗",
      "Drinks": "🍹",
      "Desserts": "🍰",
    };
    el.textContent = iconMap[product.category] || "🍕";

    const startX = rect.left + rect.width / 2 - 20;
    const startY = rect.top + rect.height / 2 - 20;
    const endX = cartRect.left + cartRect.width / 2 - 20;
    const endY = cartRect.top + cartRect.height / 2 - 20;

    el.style.left = startX + "px";
    el.style.top = startY + "px";
    el.style.setProperty("--start-x", startX + "px");
    el.style.setProperty("--start-y", startY + "px");
    el.style.setProperty("--end-x", endX + "px");
    el.style.setProperty("--end-y", endY + "px");

    document.body.appendChild(el);
    requestAnimationFrame(() => el.classList.add("flying"));
    setTimeout(() => el.remove(), 800);
  };

const handleAddToCart = () => {
  if (isOutOfStock) return;

  let productName = translatedName;
  if (isPizza) {
    const crust = crustTypes.find((c) => c.id === selectedCrust);
    const crustName = language === 'ar' ? (crust?.name_ar || crust?.name || "Thin") : (crust?.name || "Thin");
    productName += ` (${crustName})`;
  }
  if (showSpice && selectedSpice !== "medium") {
    const spice = spiceLevels.find((s) => s.id === selectedSpice);
    const spiceName = language === 'ar' ? (spice?.name_ar || spice?.name || "Medium") : (spice?.name || "Medium");
    productName += ` — ${spiceName}`;
  }

  const addBtn = document.querySelector('.drawer-add-btn');
  if (addBtn) {
    triggerFlyAnimation(addBtn);
  }

  setTimeout(() => {
    // 🔴 حفظ الإضافات بالاسم الأصلي (الإنجليزي) فقط
    const addonsWithOriginalName = selectedAddons.map(a => ({
      ...a,
      name: a.originalName || a.name, // استخدم originalName إذا موجود
      originalName: a.originalName || a.name,
      // لا نخزن الاسم المترجم
    }));
    
    addToCart({
      ...product,
      name: productName,
      originalName: product.originalName || product.name,
      price: unitPrice,
      qty: quantity,
      selectedSize: hasSizes ? selectedSize : null,
      selectedCrust: isPizza ? selectedCrust : null,
      selectedSpice: showSpice ? selectedSpice : null,
      addons: addonsWithOriginalName, // الإضافات بالاسم الأصلي
      addonsList: selectedAddons.map((a) => a.originalName || a.name).join(", "),
      addonsPrice: addonsExtra,
      specialInstructions,
      category: product.category,
      _key: product._key || undefined,
    });
  }, 400);

  setTimeout(() => {
    handleClose();
  }, 800);
};

  // ─── Styles ─────────────────────────────────────────────
  const isRTL = language === 'ar';
  
  const S = {
    overlay: {
      position: "fixed",
      inset: 0,
      zIndex: 1000,
      background: visible ? "rgba(0,0,0,0.55)" : "rgba(0,0,0,0)",
      transition: "background 0.32s ease",
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "center",
    },
    drawer: {
      width: "100%",
      maxWidth: 640,
      maxHeight: "92dvh",
      background: "#faf8f6",
      borderRadius: "22px 22px 0 0",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      transform: visible ? "translateY(0)" : "translateY(100%)",
      transition: "transform 0.32s cubic-bezier(0.4, 0, 0.2, 1)",
      boxShadow: "0 -8px 40px rgba(0,0,0,0.12)",
    },
    scrollArea: { overflowY: "auto", flex: 1 },
    handle: { width: 38, height: 4, background: "#ddd", borderRadius: 2, margin: "12px auto 0", cursor: "pointer", flexShrink: 0 },
    imgWrap: { position: "relative", height: 260, background: "#f0ece8", flexShrink: 0 },
    mainImg: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
    thumbRow: { position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 6 },
    ratingBadge: { position: "absolute", top: 12, left: 12, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(6px)", padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700, color: "#2d1a0e" },
    closeBtn: { position: "absolute", top: 12, right: 12, width: 32, height: 32, borderRadius: "50%", background: "rgba(0,0,0,0.35)", border: "none", color: "white", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
    wishBtn: { position: "absolute", top: 12, right: 52, width: 32, height: 32, borderRadius: "50%", background: "rgba(0,0,0,0.35)", border: "none", fontSize: 15, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
    content: { padding: "16px 20px 8px" },
    catTag: { display: "inline-block", padding: "3px 12px", background: "#fff4e5", color: "#cc6f00", borderRadius: 20, fontSize: 11, fontWeight: 600, marginBottom: 6 },
    productName: { 
      fontSize: 22, 
      fontWeight: 800, 
      color: "#2d1a0e", 
      margin: "0 0 6px", 
      lineHeight: 1.2,
      textAlign: isRTL ? 'right' : 'left'
    },
    productDesc: { 
      fontSize: 13, 
      color: "#8a7a6a", 
      lineHeight: 1.6, 
      margin: "0 0 16px",
      textAlign: isRTL ? 'right' : 'left'
    },
    priceRow: { 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "space-between", 
      padding: "10px 14px", 
      background: "white", 
      borderRadius: 12, 
      marginBottom: 16, 
      border: "1px solid #f0ece8" 
    },
    priceVal: { fontSize: 22, fontWeight: 800, color: "#e07800" },
    sizeRow: { display: "flex", gap: 6, flexWrap: "wrap" },
    sizeBtn: (active) => ({ 
      padding: "5px 12px", 
      border: active ? "1.5px solid #e07800" : "1.5px solid #e8e0d8", 
      borderRadius: 8, 
      background: active ? "#e07800" : "white", 
      color: active ? "white" : "#2d1a0e", 
      fontWeight: 700, 
      fontSize: 12, 
      cursor: "pointer", 
      transition: "all 0.2s", 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center" 
    }),
    sectionLabel: { 
      fontSize: 11, 
      fontWeight: 700, 
      color: "#8a7a6a", 
      textTransform: "uppercase", 
      letterSpacing: "0.6px", 
      marginBottom: 8,
      textAlign: isRTL ? 'right' : 'left'
    },
    spiceRow: { display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 },
    crustRow: { display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 },
    addonsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))", gap: 6, marginBottom: 16 },
    textarea: { 
      width: "100%", 
      padding: "10px 12px", 
      border: "1.5px solid #e8e0d8", 
      borderRadius: 10, 
      resize: "vertical", 
      fontFamily: "inherit", 
      fontSize: 13, 
      background: "white", 
      color: "#2d1a0e", 
      minHeight: 60, 
      boxSizing: "border-box", 
      outline: "none",
      textAlign: isRTL ? 'right' : 'left'
    },
    addonsSummary: { 
      display: "flex", 
      flexWrap: "wrap", 
      gap: 5, 
      padding: "8px 12px", 
      background: "#fff4e5", 
      borderRadius: 10, 
      marginBottom: 16, 
      alignItems: "center" 
    },
    addonTag: { 
      display: "inline-flex", 
      alignItems: "center", 
      gap: 3, 
      padding: "3px 9px", 
      background: "white", 
      borderRadius: 20, 
      fontSize: 11, 
      fontWeight: 600, 
      color: "#2d1a0e", 
      border: "1px solid #f0e8d8" 
    },
    actionBar: { 
      display: "flex", 
      alignItems: "center", 
      gap: 10, 
      padding: "14px 20px", 
      background: "white", 
      borderTop: "1.5px solid #f0ece8", 
      flexShrink: 0 
    },
    qtyCtrl: { 
      display: "flex", 
      alignItems: "center", 
      border: "1.5px solid #e8e0d8", 
      borderRadius: 10, 
      overflow: "hidden" 
    },
    qtyBtn: { 
      width: 36, 
      height: 36, 
      border: "none", 
      background: "transparent", 
      fontSize: 18, 
      cursor: "pointer", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      color: "#2d1a0e" 
    },
    qtyNum: { minWidth: 34, textAlign: "center", fontWeight: 700, fontSize: 15, color: "#2d1a0e" },
    addBtn: { 
      flex: 1, 
      height: 44, 
      background: "linear-gradient(135deg,#ff8a00,#e07000)", 
      border: "none", 
      borderRadius: 12, 
      color: "white", 
      fontSize: 14, 
      fontWeight: 700, 
      cursor: "pointer", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      gap: 7, 
      letterSpacing: "0.3px" 
    },
    addBtnDisabled: { 
      flex: 1, 
      height: 44, 
      background: "#ccc", 
      border: "none", 
      borderRadius: 12, 
      color: "#999", 
      fontSize: 14, 
      fontWeight: 700, 
      cursor: "not-allowed", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      gap: 7, 
      letterSpacing: "0.3px", 
      opacity: 0.7 
    },
  };

  return (
    <div style={S.overlay} onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div style={S.drawer} role="dialog" aria-modal="true" aria-label={translatedName}>
        <div style={S.handle} onClick={handleClose} />

        <div style={S.scrollArea}>
          <div style={S.imgWrap}>
            <img src={images[activeImage]} alt={translatedName} style={S.mainImg} />
            {product.rating && <div style={S.ratingBadge}>⭐ {product.rating}</div>}
            <button style={S.wishBtn} onClick={() => setIsWishlisted((w) => !w)} aria-label={t.wishlist}>
              {isWishlisted ? "❤️" : "🤍"}
            </button>
            <button style={S.closeBtn} onClick={handleClose} aria-label={t.close}>✕</button>

            {images.length > 1 && (
              <div style={S.thumbRow}>
                {images.map((_, i) => (
                  <span
                    key={i}
                    onClick={() => setActiveImage(i)}
                    style={{
                      width: i === activeImage ? 18 : 6,
                      height: 6,
                      borderRadius: 3,
                      background: i === activeImage ? "#ff8a00" : "rgba(255,255,255,0.55)",
                      cursor: "pointer",
                      transition: "all 0.3s",
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          <div style={S.content}>
            <span style={S.catTag}>{product.category}</span>
            <h2 style={S.productName}>{translatedName}</h2>
            
            <CaloriesBadge calories={product.calories} />
            <AvailabilityBadge availability={product.availability} />
            
            {translatedDescription && <p style={S.productDesc}>{translatedDescription}</p>}

            <div style={S.priceRow}>
              <div>
                <div style={{ fontSize: 10, color: "#8a7a6a", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 2 }}>
                  {hasSizes ? `${t.size} ${selectedSize}` : t.price}
                </div>
                <div style={S.priceVal}>${basePrice?.toFixed(2)}</div>
              </div>
              {hasSizes && (
                <div style={S.sizeRow}>
                  {sizes.map((sz) => (
                    <button key={sz} style={S.sizeBtn(selectedSize === sz)} onClick={() => setSelectedSize(sz)}>
                      <span>{sz}</span>
                      <span style={{ fontSize: 9, opacity: 0.75 }}>${product.sizes[sz]}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {showSpice && (
              <>
                <div style={S.sectionLabel}>{t.temperatureLevel}</div>
                <div style={S.spiceRow}>
                  {spiceLevels.map((s) => (
                    <SpiceChip key={s.id} spice={s} selected={selectedSpice === s.id} onSelect={setSelectedSpice} />
                  ))}
                </div>
              </>
            )}

            {isPizza && (
              <>
                <div style={S.sectionLabel}>🍕 {t.crustType}</div>
                <div style={S.crustRow}>
                  {crustTypes.map((c) => (
                    <CrustChip key={c.id} crust={c} selected={selectedCrust === c.id} onSelect={setSelectedCrust} />
                  ))}
                </div>
              </>
            )}

            <div style={S.sectionLabel}>✨ {t.addons}</div>
            <div style={S.addonsGrid}>
              {availableAddons.map((a) => (
                <AddonChip key={a.id} addon={a} selected={!!selectedAddons.find((x) => x.id === a.id)} onToggle={toggleAddon} />
              ))}
            </div>

            {selectedAddons.length > 0 && (
              <div style={S.addonsSummary}>
                <span style={{ fontSize: 11, fontWeight: 600, color: "#8a7a6a", marginRight: 2 }}>{t.added}:</span>
                {selectedAddons.map((a) => (
                  <span key={a.id} style={S.addonTag}>
                    {a.emoji} {getTranslatedAddonName(a.name)} <span style={{ color: "#e07800" }}> +${a.price.toFixed(2)}</span>
                  </span>
                ))}
              </div>
            )}

            <div style={{ marginBottom: 8 }}>
              <div style={{ ...S.sectionLabel, marginBottom: 6 }}>📝 {t.specialInstructions}</div>
              <textarea
                style={S.textarea}
                placeholder={t.anyRequests}
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                rows={2}
              />
            </div>
          </div>
        </div>

        <div style={S.actionBar}>
          <div style={S.qtyCtrl}>
            <button style={S.qtyBtn} onClick={() => setQuantity((q) => Math.max(1, q - 1))} disabled={isOutOfStock}>−</button>
            <span style={S.qtyNum}>{quantity}</span>
            <button style={S.qtyBtn} onClick={() => setQuantity((q) => q + 1)} disabled={isOutOfStock}>+</button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 56 }}>
            <span style={{ fontSize: 9, color: "#8a7a6a", textTransform: "uppercase", letterSpacing: "0.4px" }}>{t.total}</span>
            <span style={{ fontSize: 17, fontWeight: 800, color: "#e07800" }}>${total.toFixed(2)}</span>
          </div>

          {isOutOfStock ? (
            <button style={S.addBtnDisabled} disabled>❌ {t.outOfStock}</button>
          ) : (
            <button className="drawer-add-btn" style={S.addBtn} onClick={handleAddToCart}>🛒 {t.addToCart}</button>
          )}
        </div>
      </div>
    </div>
  );
}