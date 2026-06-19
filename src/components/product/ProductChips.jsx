// src/components/product/ProductChips.jsx

import { useLanguage } from "../../context/LanguageContext";

// 🔴 دالة مساعدة للحصول على الترجمة حسب اللغة
const getTranslation = (language) => {
  const translations = {
    en: {
      // Spice levels
      'Mild': 'Mild',
      'Medium': 'Medium',
      'Hot': 'Hot',
      'Extra Hot': 'Extra Hot',
      'No heat': 'No heat',
      'A little kick': 'A little kick',
      'Warm your soul': 'Warm your soul',
      'For the brave': 'For the brave',
      // Crust types
      'Thin Crust': 'Thin Crust',
      'Thick Crust': 'Thick Crust',
      'Stuffed Crust': 'Stuffed Crust',
      'Gluten Free': 'Gluten Free',
      // Addons
      'Extra Cheese': 'Extra Cheese',
      'Extra Sauce': 'Extra Sauce',
      'Extra Spicy': 'Extra Spicy',
      'Garlic Sauce': 'Garlic Sauce',
      'Olive Oil Drizzle': 'Olive Oil Drizzle',
      'Fresh Basil': 'Fresh Basil',
      'Parmesan': 'Parmesan',
      'Chili Flakes': 'Chili Flakes',
      'Extra Wasabi': 'Extra Wasabi',
      'Pickled Ginger': 'Pickled Ginger',
      'Extra Soy Sauce': 'Extra Soy Sauce',
      'Sesame Seeds': 'Sesame Seeds',
      'Extra Kimchi': 'Extra Kimchi',
      'Gochujang Sauce': 'Gochujang Sauce',
      'Sesame Oil': 'Sesame Oil',
      'Lemon Butter': 'Lemon Butter',
      'Garlic Herb': 'Garlic Herb',
      'Tartar Sauce': 'Tartar Sauce',
      'Peanut Sauce': 'Peanut Sauce',
      'Fresh Herbs': 'Fresh Herbs',
      'Lime Wedges': 'Lime Wedges',
      'Extra Avocado': 'Extra Avocado',
      'Quinoa': 'Quinoa',
      'Chia Seeds': 'Chia Seeds',
      'Extra Chocolate': 'Extra Chocolate',
      'Whipped Cream': 'Whipped Cream',
      'Caramel Drizzle': 'Caramel Drizzle',
      'Chopped Nuts': 'Chopped Nuts',
      'Extra Ice': 'Extra Ice',
      'Extra Sweet': 'Extra Sweet',
      'Boba Pearls': 'Boba Pearls',
      'Free': 'Free',
    },
    ar: {
      // Spice levels - مستويات الحرارة
      'Mild': 'خفيف',
      'Medium': 'متوسط',
      'Hot': 'حار',
      'Extra Hot': 'حار جداً',
      'No heat': 'بدون حرارة',
      'A little kick': 'لمسة خفيفة',
      'Warm your soul': 'يدفئ الروح',
      'For the brave': 'للشجعان',
      // Crust types - أنواع العجينة
      'Thin Crust': 'عجينة رقيقة',
      'Thick Crust': 'عجينة سميكة',
      'Stuffed Crust': 'عجينة محشوة',
      'Gluten Free': 'خالي من الجلوتين',
      // Addons - الإضافات
      'Extra Cheese': 'جبن إضافي',
      'Extra Sauce': 'صلصة إضافية',
      'Extra Spicy': 'حار إضافي',
      'Garlic Sauce': 'صلصة الثوم',
      'Olive Oil Drizzle': 'رشة زيت زيتون',
      'Fresh Basil': 'ريحان طازج',
      'Parmesan': 'بارميزان',
      'Chili Flakes': 'رقائق الفلفل الحار',
      'Extra Wasabi': 'واسابي إضافي',
      'Pickled Ginger': 'زنجبيل مخلل',
      'Extra Soy Sauce': 'صلصة صويا إضافية',
      'Sesame Seeds': 'حبوب السمسم',
      'Extra Kimchi': 'كيمتشي إضافي',
      'Gochujang Sauce': 'صلصة غوتشوجانغ',
      'Sesame Oil': 'زيت السمسم',
      'Lemon Butter': 'زبدة الليمون',
      'Garlic Herb': 'أعشاب بالثوم',
      'Tartar Sauce': 'صلصة التارتار',
      'Peanut Sauce': 'صلصة الفول السوداني',
      'Fresh Herbs': 'أعشاب طازجة',
      'Lime Wedges': 'شرائح الليمون',
      'Extra Avocado': 'أفوكادو إضافي',
      'Quinoa': 'كينوا',
      'Chia Seeds': 'بذور الشيا',
      'Extra Chocolate': 'شوكولاتة إضافية',
      'Whipped Cream': 'كريمة مخفوقة',
      'Caramel Drizzle': 'رشة كراميل',
      'Chopped Nuts': 'مكسرات مفرومة',
      'Extra Ice': 'ثلج إضافي',
      'Extra Sweet': 'سكر إضافي',
      'Boba Pearls': 'كريات التابيوكا',
      'Free': 'مجاني',
    }
  };
  return translations[language] || translations.en;
};

export function AddonChip({ addon, selected, onToggle }) {
  const { language } = useLanguage();
  const t = getTranslation(language);
  
  const translatedName = t[addon.name] || addon.name;
  
  return (
    <button
      onClick={() => onToggle(addon)}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 3,
        padding: "8px 6px",
        border: selected ? "1.5px solid #e07800" : "1.5px solid #e8e0d8",
        borderRadius: 10,
        background: selected ? "#fff4e5" : "white",
        cursor: "pointer",
        transition: "all 0.2s",
        fontSize: 10,
        fontWeight: 600,
        color: selected ? "#cc6f00" : "#2d1a0e",
      }}
    >
      <span style={{ fontSize: 16 }}>{addon.emoji}</span>
      <span style={{ textAlign: "center", lineHeight: 1.2 }}>{translatedName}</span>
      <span style={{ color: selected ? "#e07800" : "#aaa", fontWeight: 500 }}>
        {addon.price === 0 ? t['Free'] : `+$${addon.price.toFixed(2)}`}
      </span>
    </button>
  );
}

export function SpiceChip({ spice, selected, onSelect }) {
  const { language } = useLanguage();
  const t = getTranslation(language);
  
  const translatedName = t[spice.name] || spice.name;
  const translatedDesc = t[spice.desc] || spice.desc;
  
  return (
    <button
      onClick={() => onSelect(spice.id)}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        padding: "7px 5px",
        border: selected ? "1.5px solid #e07800" : "1.5px solid #e8e0d8",
        borderRadius: 10,
        background: selected ? "#fff4e5" : "white",
        cursor: "pointer",
        transition: "all 0.2s",
        fontSize: 10,
        fontWeight: 600,
        color: selected ? "#cc6f00" : "#2d1a0e",
        flex: 1,
      }}
    >
      <span style={{ fontSize: 16 }}>{spice.emoji}</span>
      <span>{translatedName}</span>
      <span style={{ fontWeight: 400, color: selected ? "#e07800" : "#aaa" }}>
        {translatedDesc}
      </span>
    </button>
  );
}

export function CrustChip({ crust, selected, onSelect }) {
  const { language } = useLanguage();
  const t = getTranslation(language);
  
  const translatedName = t[crust.name] || crust.name;
  
  return (
    <button
      onClick={() => onSelect(crust.id)}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        padding: "7px 5px",
        border: selected ? "1.5px solid #e07800" : "1.5px solid #e8e0d8",
        borderRadius: 10,
        background: selected ? "#fff4e5" : "white",
        cursor: "pointer",
        transition: "all 0.2s",
        fontSize: 10,
        fontWeight: 600,
        color: selected ? "#cc6f00" : "#2d1a0e",
        flex: 1,
      }}
    >
      <span style={{ fontSize: 16 }}>{crust.emoji}</span>
      <span>{translatedName}</span>
      {crust.price > 0 && (
        <span
          style={{
            color: selected ? "#fff" : "#e07800",
            background: selected ? "#e07800" : "#fff4e5",
            borderRadius: 8,
            padding: "1px 6px",
            fontSize: 9,
          }}
        >
          +${crust.price.toFixed(2)}
        </span>
      )}
    </button>
  );
}