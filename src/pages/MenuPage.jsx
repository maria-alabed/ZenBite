import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import CartSidebar from "../components/cart/CartSidebar";
import { useCart } from "../context/CartContext";
import ProductDetails from "./ProductDetails";
import { themes, menuData, categoryIcons } from "../data/menuData";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../utils/translations";
import { triggerFlyAnimation } from "../utils/flyAnimation";
import "../styles/menu.css";
import { Search, Filter, X } from "lucide-react";

/* =========================
   APPLY THEME CSS VARIABLES
========================= */
function applyThemeVars(t) {
  if (!t) return;
  const root = document.documentElement;
  root.style.setProperty("--menu-bg", t.bg);
  root.style.setProperty("--menu-header-bg", t.headerBg);
  root.style.setProperty("--menu-border", t.border);
  root.style.setProperty("--menu-card-bg", t.cardBg);
  root.style.setProperty("--menu-card-border", t.cardBorder);
  root.style.setProperty("--menu-text", t.text);
  root.style.setProperty("--menu-subtext", t.subtext);
  root.style.setProperty("--menu-accent", t.accent);
  root.style.setProperty("--menu-accent-text", t.accentText);
  root.style.setProperty("--menu-btn-bg", t.btnBg);
  root.style.setProperty("--menu-btn-text", t.btnText);
  root.style.setProperty("--menu-price-co", t.priceCo);
  root.style.setProperty("--menu-badge-bg", t.badgeBg);
  root.style.setProperty("--menu-badge-text", t.badgeText);
  root.style.setProperty("--menu-title-font", t.titleFont);
  root.style.setProperty("--menu-stat-bg", t.statBg);
  root.style.setProperty("--menu-stat-border", t.statBorder);
  root.style.setProperty("--menu-stat-text", t.statText);
  root.style.setProperty("--menu-card-radius", t.cardRadius);
  root.style.setProperty("--menu-card-border-style", t.cardBorderStyle);
}

/* =========================
   AVAILABILITY BADGE
========================= */
function AvailabilityBadge({ availability }) {
  if (availability !== "out_of_stock") return null;

  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 10px",
        borderRadius: "12px",
        fontSize: "10px",
        fontWeight: 600,
        color: "#e74c3c",
        background: "#fde8e8",
        border: "1px solid #e74c3c",
        marginTop: "4px",
      }}
    >
      ❌ {translations.en.outOfStock}
    </span>
  );
}

/* =========================
   COMPONENT
========================= */
export default function MenuPage() {
  const location = useLocation();
  const { addToCart } = useCart();
  const { language } = useLanguage();
  const t = translations[language];
  const navbarRef = useRef(null);
  const [addedItemId, setAddedItemId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(() => {
    return location.state?.selectedCategory || "Japanese Kitchen";
  });

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [pizzaSizes, setPizzaSizes] = useState({});
  const [openCart, setOpenCart] = useState(false);
  const [drawerProduct, setDrawerProduct] = useState(null);

  // حالات البحث والفلترة
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100 });
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("default");

  const dishes = menuData[selectedCategory] || [];
  const theme = themes[selectedCategory];

  // 🔴 دالة ترجمة المنتج بالكامل (الاسم والوصف)
 // في MenuPage.jsx - استبدل دالة getTranslatedProduct بهذه النسخة

const getTranslatedProduct = (dish) => {
  // خريطة يدوية لأسماء المنتجات (كما هي)
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
  
  // ترجمة الاسم
  let translatedName = manualTranslationMap[dish.name];
  if (!translatedName) {
    const key = dish.name
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/[&/\\#,+()$~%.'":*?<>{}]/g, '')
    translatedName = t.products?.[key] || dish.name;
  }
  
  // 🔴🔴🔴 ترجمة الوصف - نسخة محسنة 🔴🔴🔴
  let translatedDescription = dish.description;
  
  // طريقة 1: باستخدام مفتاح الوصف
  const descKey = dish.name
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[&/\\#,+()$~%.'":*?<>{}]/g, '') + 'Desc';
  
  const descTranslation = t.products?.descriptions?.[descKey];
  if (descTranslation) {
    translatedDescription = descTranslation;
  } else {
    // طريقة 2: البحث المباشر في كل المفاتيح
    const descriptions = t.products?.descriptions || {};
    for (const [key, value] of Object.entries(descriptions)) {
      // نزيل 'Desc' من المفتاح للمقارنة
      const keyWithoutDesc = key.toLowerCase().replace('desc', '');
      const dishNameLower = dish.name.toLowerCase().replace(/\s+/g, '');
      if (dishNameLower.includes(keyWithoutDesc) || keyWithoutDesc.includes(dishNameLower)) {
        translatedDescription = value;
        break;
      }
    }
  }
  
  // طريقة 3: خريطة يدوية للوصف (حل أخير)
  if (translatedDescription === dish.description) {
    // 🔴 خريطة الوصف المباشرة - نفس اللي في PopularDishes
    const descManualMap = {
      'en': {
        // Japanese Kitchen
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
        // Chinese Kitchen
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
        // Korean Kitchen
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
        // Italian Kitchen
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
        // Seafood
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
        // Asian Specials
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
        // Healthy Choices
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
        // Drinks
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
        // Desserts
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
        // Japanese Kitchen
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
        // Chinese Kitchen
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
        // Korean Kitchen
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
        // Italian Kitchen
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
        // Seafood
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
        // Asian Specials
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
        // Healthy Choices
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
        // Drinks
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
        // Desserts
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
    
    const manualDesc = descManualMap[language]?.[dish.description];
    if (manualDesc) {
      translatedDescription = manualDesc;
    }
  }
  
  return {
    name: translatedName,
    description: translatedDescription
  };
};
  // 🔴 دالة ترجمة اسم القسم
  const getCategoryName = (categoryKey) => {
    const categoryMap = {
      'Japanese Kitchen': t.categories?.japanese || 'Japanese Kitchen',
      'Chinese Kitchen': t.categories?.chinese || 'Chinese Kitchen',
      'Korean Kitchen': t.categories?.korean || 'Korean Kitchen',
      'Italian Kitchen': t.categories?.italian || 'Italian Kitchen',
      'Seafood': t.categories?.seafood || 'Seafood',
      'Asian Specials': t.categories?.asian || 'Asian Specials',
      'Healthy Choices': t.categories?.healthy || 'Healthy Choices',
      'Drinks': t.categories?.drinks || 'Drinks',
      'Desserts': t.categories?.desserts || 'Desserts',
    };
    return categoryMap[categoryKey] || categoryKey;
  };

  const filteredDishes = dishes.filter((dish) => {
    const { name: dishName, description: dishDesc } = getTranslatedProduct(dish);
    const matchesSearch = dishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          dishDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          dish.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const dishPrice = dish.sizes 
      ? Math.min(...Object.values(dish.sizes))
      : dish.price;
    const matchesPrice = dishPrice >= priceRange.min && dishPrice <= priceRange.max;
    
    return matchesSearch && matchesPrice;
  });

  const sortedDishes = [...filteredDishes].sort((a, b) => {
    const priceA = a.sizes ? Math.min(...Object.values(a.sizes)) : a.price;
    const priceB = b.sizes ? Math.min(...Object.values(b.sizes)) : b.price;
    
    switch (sortBy) {
      case "price_low":
        return priceA - priceB;
      case "price_high":
        return priceB - priceA;
      case "rating":
        return parseFloat(b.rating) - parseFloat(a.rating);
      case "name":
        const nameA = getTranslatedProduct(a).name;
        const nameB = getTranslatedProduct(b).name;
        return nameA.localeCompare(nameB);
      default:
        return 0;
    }
  });

  useEffect(() => {
    const category = location.state?.selectedCategory;
    if (category && category !== selectedCategory) {
      setSelectedCategory(category);
      const newTheme = themes[category];
      if (newTheme) {
        applyThemeVars(newTheme);
      }
    }
  }, [location.state]);

  useEffect(() => {
    const productToOpen = location.state?.openProduct;
    if (productToOpen) {
      let foundDish = null;
      let foundCategory = null;
      
      for (const [category, dishes] of Object.entries(menuData)) {
        const dish = dishes.find(d => d.id === productToOpen.id);
        if (dish) {
          foundDish = dish;
          foundCategory = category;
          break;
        }
      }
      
      if (foundDish && foundCategory) {
        setSelectedCategory(foundCategory);
        const newTheme = themes[foundCategory];
        if (newTheme) {
          applyThemeVars(newTheme);
        }
        setDrawerProduct({ ...foundDish, category: foundCategory });
      }
    }
  }, [location.state]);

  useEffect(() => {
    if (theme) {
      applyThemeVars(theme);
    }
  }, [selectedCategory, theme]);

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {
      document.documentElement.style.cssText = "";
    };
  }, []);

  const handleCategoryChange = (category) => {
    if (category === selectedCategory) return;
    setIsTransitioning(true);
    const newTheme = themes[category];
    if (newTheme) {
      applyThemeVars(newTheme);
    }
    setSearchQuery("");
    setPriceRange({ min: 0, max: 100 });
    setSortBy("default");
    setTimeout(() => {
      setSelectedCategory(category);
      setTimeout(() => setIsTransitioning(false), 100);
    }, 250);
  };

  const getSelectedSize = (dishId) => pizzaSizes[dishId] || "M";

  const getCurrentPrice = (dish) => {
    if (dish.sizes) {
      const size = getSelectedSize(dish.id);
      return dish.sizes[size] ?? dish.sizes.M;
    }
    return dish.price;
  };

  const handleProductClick = (dish) => {
    setDrawerProduct({ ...dish, category: selectedCategory });
  };

  const handleQuickAdd = (e, dish) => {
    e.stopPropagation();
    setAddedItemId(dish.id);
    const isItalian = selectedCategory === "Italian Kitchen";
    const selectedSize = getSelectedSize(dish.id);
    const currentPrice = getCurrentPrice(dish);
    const { name: translatedName } = getTranslatedProduct(dish);

    // 🔴 استخدم الدالة المستوردة من flyAnimation.js
    triggerFlyAnimation(e.currentTarget, selectedCategory);

    setTimeout(() => {
      if (isItalian && dish.sizes) {
        addToCart({
          ...dish,
          category: selectedCategory,
          selectedSize,
          price: currentPrice,
          name: `${translatedName} (${selectedSize})`,
          originalName: dish.name,
        });
      } else {
        addToCart({ 
          ...dish, 
          category: selectedCategory,
          name: translatedName,
          originalName: dish.name,
        });
      }
    }, 800);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setPriceRange({ min: 0, max: 100 });
    setSortBy("default");
  };

  const avgRating = (
    dishes.reduce((a, d) => a + parseFloat(d.rating), 0) / dishes.length
  ).toFixed(1);

  const minPrice = Math.min(
    ...dishes.map((d) =>
      d.sizes ? Math.min(...Object.values(d.sizes)) : d.price
    )
  ).toFixed(2);

  const maxPriceOverall = Math.max(
    ...dishes.map((d) =>
      d.sizes ? Math.max(...Object.values(d.sizes)) : d.price
    )
  );

  return (
    <>
      <Navbar ref={navbarRef} />

      <section className={`menu-page ${isTransitioning ? "page-transition" : ""}`}>
        <div className="glow-effect" />

        <div className="category-strip">
          {Object.keys(menuData).map((cat) => (
            <button
              key={cat}
              className={`cat-strip-btn ${selectedCategory === cat ? "active" : ""}`}
              onClick={() => handleCategoryChange(cat)}
            >
              <span className="cat-icon">{categoryIcons[cat]}</span>
              <span className="cat-name">{getCategoryName(cat)}</span>
            </button>
          ))}
        </div>

        <div className="menu-hero-strip">
          <div className="menu-hero-flag">{theme?.flag || "🇯🇵"}</div>
          <div className="menu-hero-text">
            <h1 className="menu-hero-title">{getCategoryName(selectedCategory)}</h1>
            <p className="menu-hero-desc">{theme?.desc || ""}</p>
          </div>
          <div className="menu-deco-element">{theme?.deco || "🌸"}</div>
        </div>

        <div className="menu-stats-row">
          <span className="menu-stat-chip">{dishes.length} {t.dishes}</span>
          <span className="menu-stat-chip">⭐ {avgRating} avg</span>
          <span className="menu-stat-chip">{t.from} ${minPrice}</span>
          <span className="menu-stat-chip">{theme?.mood || ""}</span>
          <span className="menu-stat-chip">
            🔍 {sortedDishes.length} {t.found}
          </span>
        </div>

        <div className="search-filter-bar">
          <div className="search-container">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              className="search-input"
              placeholder={t.searchForDishes}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="clear-search" onClick={() => setSearchQuery("")}>
                <X size={18} />
              </button>
            )}
          </div>

          <div className="filter-controls">
            <button 
              className={`filter-toggle-btn ${showFilters ? "active" : ""}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={18} />
              <span>{t.filters}</span>
            </button>

            <select 
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="default">{t.sortBy}: {t.default}</option>
              <option value="price_low">{t.priceLow}</option>
              <option value="price_high">{t.priceHigh}</option>
              <option value="rating">{t.rating}</option>
              <option value="name">{t.name}</option>
            </select>
          </div>
        </div>

        {showFilters && (
          <div className="filter-panel">
            <div className="filter-section">
              <h4>{t.priceRange}</h4>
              <div className="price-range">
                <div className="price-inputs">
                  <div className="price-input-group">
                    <label>{t.min}</label>
                    <input
                      type="number"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) || 0 })}
                      min={0}
                      max={priceRange.max}
                    />
                  </div>
                  <span className="price-dash">—</span>
                  <div className="price-input-group">
                    <label>{t.max}</label>
                    <input
                      type="number"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) || 100 })}
                      min={priceRange.min}
                      max={maxPriceOverall || 100}
                    />
                  </div>
                </div>
                <input
                  type="range"
                  min={0}
                  max={maxPriceOverall || 100}
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                  className="price-slider"
                  style={{
                    background: `linear-gradient(to right, #ff8a00 0%, #ff8a00 ${(priceRange.max / (maxPriceOverall || 100)) * 100}%, #e0d6ce ${(priceRange.max / (maxPriceOverall || 100)) * 100}%, #e0d6ce 100%)`
                  }}
                />
              </div>
            </div>

            <div className="filter-actions">
              <button className="reset-filters-btn" onClick={resetFilters}>
                {t.resetFilters}
              </button>
            </div>
          </div>
        )}

        <div className="dishes-section">
          {sortedDishes.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h2>{t.noDishesFound}</h2>
              <p>{t.tryAdjusting}</p>
              <button className="reset-filters-btn" onClick={resetFilters}>
                {t.resetFilters}
              </button>
            </div>
          ) : (
            <div className="dishes-grid">
              {sortedDishes.map((dish, index) => {
                const isItalian = selectedCategory === "Italian Kitchen";
                const currentPrice = getCurrentPrice(dish);
                const selectedSize = getSelectedSize(dish.id);
                const isOutOfStock = dish.availability === "out_of_stock";
                const { name: translatedName, description: translatedDescription } = getTranslatedProduct(dish);

                return (
                  <div
                    key={dish.id}
                    className="dish-card"
                    data-category={selectedCategory}
                    style={{ animationDelay: `${index * 0.07}s` }}
                    onClick={() => handleProductClick(dish)}
                  >
                    {isItalian && <div className="pizza-arch" />}

                    <div className="dish-img-wrap">
                      <img src={dish.image} alt={translatedName} loading="lazy" />
                      <div className="dish-badge">⭐ {dish.rating}</div>
                    </div>

                    <div className="dish-info">
                      <div className="dish-header">
                        <h3>{translatedName}</h3>
                        <AvailabilityBadge availability={dish.availability} />
                      </div>
                      <p>{translatedDescription}</p>

                      {isItalian && dish.sizes && (
                        <div className="pizza-size-selector">
                          {["S", "M", "L"].map((size) => (
                            <button
                              key={size}
                              className={`pizza-size-btn ${selectedSize === size ? "active" : ""}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setPizzaSizes((prev) => ({ ...prev, [dish.id]: size }));
                              }}
                            >
                              {size}{" "}
                              <small>
                                {size === "S" ? t.small : size === "M" ? t.medium : t.large}
                              </small>
                            </button>
                          ))}
                        </div>
                      )}

                      <div className="dish-footer">
                        <span className="dish-price">${currentPrice.toFixed(2)}</span>
                        <button
  className={`add-cart-btn ${isOutOfStock ? "out-of-stock" : ""}`}
  onClick={(e) => {
    if (isOutOfStock) return;
    handleQuickAdd(e, dish);
  }}
  disabled={isOutOfStock}
>
  {isOutOfStock ? t.outOfStock : t.add}
</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />

      <CartSidebar isOpen={openCart} onClose={() => setOpenCart(false)} />

      {drawerProduct && (
        <ProductDetails
          product={drawerProduct}
          onClose={() => setDrawerProduct(null)}
        />
      )}
    </>
  );
}