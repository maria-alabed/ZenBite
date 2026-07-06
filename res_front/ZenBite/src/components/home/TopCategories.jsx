import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { translations } from "../../utils/translations";
import { useRef, useState, useEffect } from "react";

const getImageUrl = (image) => {
  if (!image) return "";
  if (image.startsWith("http")) return image;

  return `http://localhost:5000/uploads/categories/${image}`;
};

const TopCategories = ({ selectedCategory, onSelectCategory }) => {
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language];
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/categories");

        setCategories(res.data.data || res.data || []);
      } catch (err) {
        console.log(err);
      }
    };

    fetchCategories();
  }, []);

  // 🔴 دالة للحصول على اسم القسم المترجم
  const getCategoryName = (categoryKey) => {
    if (!t.categories) {
      return categoryKey;
    }

    const categoryMap = {
      "Japanese Kitchen": t.categories.japanese || "Japanese Kitchen",
      "Chinese Kitchen": t.categories.chinese || "Chinese Kitchen",
      "Korean Kitchen": t.categories.korean || "Korean Kitchen",
      "Italian Kitchen": t.categories.italian || "Italian Kitchen",
      Seafood: t.categories.seafood || "Seafood",
      "Asian Specials": t.categories.asian || "Asian Specials",
      "Healthy Choices": t.categories.healthy || "Healthy Choices",
      Drinks: t.categories.drinks || "Drinks",
      Desserts: t.categories.desserts || "Desserts",
    };
    return categoryMap[categoryKey] || categoryKey;
  };

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  const goToMenu = (categoryName) => {
    navigate("/menu", {
      state: { selectedCategory: categoryName },
    });
  };

  // 🔴 تقسيم النص المترجم إلى جزئين للحفاظ على اللون البرتقالي
  const getTitleParts = () => {
    const fullTitle = t.topCategoriesTitle || "Top Categories";
    // في العربية: "أفضل التصنيفات" - نريد تلوين كلمة "التصنيفات"
    // في الإنجليزية: "Top Categories" - نريد تلوين كلمة "Categories"

    if (language === "ar") {
      // للعربية: "أفضل التصنيفات" -> نلون "التصنيفات"
      return {
        first: "أفضل ",
        highlighted: "التصنيفات",
      };
    } else {
      // للإنجليزية: "Top Categories" -> نلون "Categories"
      return {
        first: "Top ",
        highlighted: "Categories",
      };
    }
  };

  const titleParts = getTitleParts();

  return (
    <section id="categories" className="categories-section">
      <div className="categories-header">
        <div>
          <h2>
            {titleParts.first}
            <span className="orange">{titleParts.highlighted}</span>
          </h2>
          <h4>
            {t.topCategoriesDesc ||
              "Explore our most loved Asian food categories"}
          </h4>
        </div>

        <div className="category-arrows">
          <button onClick={scrollLeft}>←</button>
          <button onClick={scrollRight}>→</button>
        </div>
      </div>

      <div className="categories-container" ref={scrollRef}>
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="category-card"
            onClick={() => goToMenu(cat)}
          >
            <div className="category-image">
              <img src={getImageUrl(cat.image)} alt={cat.name} />{" "}
            </div>
            <p>{getCategoryName(cat.name)}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TopCategories;
