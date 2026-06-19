import { useCart } from "../../context/CartContext";
import { useLanguage } from "../../context/LanguageContext";
import { translations } from "../../utils/translations";
import { triggerFlyAnimation } from "../../utils/flyAnimation";
import { useState } from "react";

function PopularDishes() {
  const { addToCart } = useCart();
  const { language } = useLanguage();
  const t = translations[language];
  const [addedItemId, setAddedItemId] = useState(null);

  const dishes = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c",
      name: t.dragonRoll || "Dragon Roll",
      description: t.dragonRollDesc || "Fresh sushi roll with avocado and salmon.",
      price: 12.99,
      rating: "4.9",
      category: "Japanese Kitchen",
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1555126634-323283e090fa",
      name: t.spicyRamen || "Spicy Ramen",
      description: t.spicyRamenDesc || "Japanese noodles with rich spicy broth.",
      price: 10.99,
      rating: "4.9",
      category: "Asian Specials",
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143",
      name: t.koreanChicken || "Korean Chicken",
      description: t.koreanChickenDesc || "Crispy fried chicken with spicy sauce.",
      price: 11.99,
      rating: "4.8",
      category: "Korean Kitchen",
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
      name: t.healthyBowl || "Healthy Bowl",
      description: t.healthyBowlDesc || "Fresh vegetables with Asian dressing.",
      price: 9.99,
      rating: "4.7",
      category: "Healthy Choices",
    },
  ];

  // 🔴 دالة إضافة إلى السلة مع تأثير الطيران
  const handleAddToCart = (e, dish) => {
    e.stopPropagation();
    setAddedItemId(dish.id);
    
    // 🔴 تشغيل تأثير الطيران
    triggerFlyAnimation(e.currentTarget, dish.category);
    
    // إضافة إلى السلة بعد 400ms (مزامنة مع تأثير الطيران)
    setTimeout(() => {
      addToCart({
        ...dish,
        originalName: dish.name,
      });
    }, 400);
    
    setTimeout(() => setAddedItemId(null), 800);
  };

  // 🔴 تعديل العنوان حسب اللغة
  const getTitle = () => {
    if (language === 'ar') {
      return {
        first: 'الأطباق ',
        highlighted: 'الشهيرة'
      };
    } else {
      return {
        first: 'Popular ',
        highlighted: 'Dishes'
      };
    }
  };

  const titleParts = getTitle();

  return (
    <section id="menu" className="popular-dishes">
      <h2>
        {titleParts.first}
        <span className="orange">{titleParts.highlighted}</span>
      </h2>

      <p className="section-desc">
        {t.popularDishesDesc}
      </p>

      <div className="dishes-grid">
        {dishes.map((dish) => (
          <div className="dish-card" key={dish.id}>
            <img src={dish.image} alt={dish.name} />
            <div className="dish-info">
              <div className="dish-header">
                <h3>{dish.name}</h3>
                <div className="dish-rating">⭐ {dish.rating}</div>
              </div>
              <p>{dish.description}</p>
              <div className="dish-footer">
                <span>${dish.price}</span>
                <button 
                  className={`add-cart-btn ${addedItemId === dish.id ? 'added' : ''}`}
                  onClick={(e) => handleAddToCart(e, dish)}
                >
                  {t.add}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default PopularDishes;