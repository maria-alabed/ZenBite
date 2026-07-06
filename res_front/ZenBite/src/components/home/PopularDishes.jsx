import { useCart } from "../../context/CartContext";
import { useLanguage } from "../../context/LanguageContext";
import { translations } from "../../utils/translations";
import { triggerFlyAnimation } from "../../utils/flyAnimation";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function PopularDishes() {
  const { addToCart } = useCart();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const t = translations[language];
  const [addedItemId, setAddedItemId] = useState(null);
  const [dishes, setDishes] = useState([]);

  const handleDishClick = (dish) => {
    navigate("/menu", {
      state: {
        selectedCategory: {
          id: dish.category_id,
          name: dish.category,
        },
        openProduct: dish, // 🔥 هذا أهم تعديل
      },
    });
  };

  useEffect(() => {
    console.log("PopularDishes mounted");

    const fetchPopular = async () => {
      try {
        console.log("Before request");

        const res = await axios.get("http://localhost:5000/api/home");

        console.log("After request");
        console.log(res.data);

        setDishes(res.data.data.topProducts);
      } catch (err) {
        console.log("ERROR:");
        console.log(err);
      }
    };

    fetchPopular();
  }, []);

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
    if (language === "ar") {
      return {
        first: "الأطباق ",
        highlighted: "الشهيرة",
      };
    } else {
      return {
        first: "Popular ",
        highlighted: "Dishes",
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

      <p className="section-desc">{t.popularDishesDesc}</p>

      <div className="dishes-grid">
        {dishes.map((dish) => (
          <div
            className="dish-card"
            key={dish.id}
            onClick={() => handleDishClick(dish)}
          >
            {" "}
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
                  className={`add-cart-btn ${addedItemId === dish.id ? "added" : ""}`}
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
