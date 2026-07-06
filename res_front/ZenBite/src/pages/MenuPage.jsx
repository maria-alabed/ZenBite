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
import { translateName, translateDescription } from "../utils/i18n";
import "../styles/menu.css";
import { Search, Filter, X } from "lucide-react";
import axios from "axios";
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
      ❌ Out of Stock
    </span>
  );
}

export default function MenuPage() {
  const location = useLocation();
  const { addToCart } = useCart();
  const { language } = useLanguage();
  const t = translations[language];
  const navbarRef = useRef(null);

  const [addedItemId, setAddedItemId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [pizzaSizes, setPizzaSizes] = useState({});
  const [openCart, setOpenCart] = useState(false);
  const [drawerProduct, setDrawerProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100 });
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("default");
  const [categories, setCategories] = useState([]);
  const [dishes, setDishes] = useState([]);
  const theme = selectedCategory?.id ? themes[selectedCategory.id] : null;
  const getTranslatedProduct = (dish) => ({
    name: translateName(dish.name, t, language),
    description: translateDescription(dish.name, dish.description, t, language),
  });

  const getCategoryName = (key) =>
    ({
      "Japanese Kitchen": t.categories?.japanese,
      "Chinese Kitchen": t.categories?.chinese,
      "Korean Kitchen": t.categories?.korean,
      "Italian Kitchen": t.categories?.italian,
      Seafood: t.categories?.seafood,
      "Asian Specials": t.categories?.asian,
      "Healthy Choices": t.categories?.healthy,
      Drinks: t.categories?.drinks,
      Desserts: t.categories?.desserts,
    })[key] || key;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/categories");
        setCategories(res.data); // 👈 مهم لأنه array مباشر
      } catch (err) {
        console.error(err);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (categories.length > 0 && !selectedCategory?.id) {
      setSelectedCategory(categories[0]);
    }
  }, [categories]);

  useEffect(() => {
    if (!selectedCategory?.id) return;

    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/products/by-category/${selectedCategory.id}`,
        );

        setDishes(res.data || []);
      } catch (err) {
        console.log(err);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  const filteredDishes = dishes.filter((dish) => {
    const { name, description } = getTranslatedProduct(dish);
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      name?.toLowerCase().includes(q) ||
      dish.description?.toLowerCase().includes(q);

    const dishPrice = dish.sizes?.length
      ? Math.min(...dish.sizes.map((s) => Number(s.price)))
      : Number(dish.price);
    return (
      matchesSearch &&
      dishPrice >= priceRange.min &&
      dishPrice <= priceRange.max
    );
  });

  const sortedDishes = [...filteredDishes].sort((a, b) => {
    const pa = a.sizes
      ? Math.min(...a.sizes.map((s) => Number(s.price)))
      : a.price;
    const pb = b.sizes
      ? Math.min(...a.sizes.map((s) => Number(s.price)))
      : b.price;
    switch (sortBy) {
      case "price_low":
        return pa - pb;
      case "price_high":
        return pb - pa;
      case "rating":
        return parseFloat(b.rating) - parseFloat(a.rating);
      case "name":
        return getTranslatedProduct(a).name.localeCompare(
          getTranslatedProduct(b).name,
        );
      default:
        return 0;
    }
  });

  useEffect(() => {
    const cat = location.state?.selectedCategory;
    if (cat && categories.length > 0) {
      const found = categories.find((c) => c.id === cat.id);
      if (found) setSelectedCategory(found);
    }
  }, [location.state, categories]);

  useEffect(() => {
    const productToOpen = location.state?.openProduct;
    if (!productToOpen) return;

    setDrawerProduct(productToOpen);
  }, [location.state]);

  useEffect(() => {
    if (theme) applyThemeVars(theme);
  }, [selectedCategory, theme]);

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {
      document.documentElement.style.cssText = "";
    };
  }, []);

  const handleCategoryChange = (category) => {
    if (category.id === selectedCategory?.id) return;

    setIsTransitioning(true);
    applyThemeVars(themes[category.id]);

    setSearchQuery("");
    setPriceRange({ min: 0, max: 100 });
    setSortBy("default");

    setTimeout(() => {
      setSelectedCategory({
        id: category.id,
        name: category.name,
        name_ar: category.name_ar,
      });
      setTimeout(() => setIsTransitioning(false), 100);
    }, 250);
  };
  const getSizePriceMap = (dish) => {
    if (!dish.sizes || !Array.isArray(dish.sizes)) return {};

    return dish.sizes.reduce((acc, s) => {
      acc[s.size_name] = Number(s.price);
      return acc;
    }, {});
  };
  const getSelectedSize = (id) => pizzaSizes[id] || "M";
  const getCurrentPrice = (dish) => {
    const basePrice = Number(dish.price);

    const size = getSelectedSize(dish.id);

    if (!dish.sizes) return basePrice;

    switch (size) {
      case "S":
        return basePrice - 2;
      case "L":
        return basePrice + 2;
      default:
        return basePrice; // M
    }
  };

  const handleProductClick = (dish) =>
    setDrawerProduct({ ...dish, category: selectedCategory });

  const handleQuickAdd = (e, dish) => {
    e.stopPropagation();
    setAddedItemId(dish.id);
    const isItalian = selectedCategory?.id === 14;
    const selectedSize = getSelectedSize(dish.id);
    const currentPrice = getCurrentPrice(dish);
    const { name: translatedName } = getTranslatedProduct(dish);

    triggerFlyAnimation(e.currentTarget, selectedCategory);

    setTimeout(() => {
      addToCart(
        isItalian && dish.sizes
          ? {
              ...dish,
              category: selectedCategory,
              selectedSize,
              price: currentPrice,
              name: `${translatedName} (${selectedSize})`,
              originalName: dish.name,
            }
          : {
              ...dish,
              category: selectedCategory,
              name: translatedName,
              originalName: dish.name,
            },
      );
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
      d.sizes ? Math.min(...Object.values(d.sizes)) : d.price,
    ),
  ).toFixed(2);
  const maxPriceOverall = Math.max(
    ...dishes.map((d) =>
      d.sizes ? Math.max(...Object.values(d.sizes)) : d.price,
    ),
  );

  return (
    <>
      <Navbar ref={navbarRef} />

      <section
        className={`menu-page ${isTransitioning ? "page-transition" : ""}`}
      >
        <div className="glow-effect" />

        <div className="category-strip">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`cat-strip-btn ${selectedCategory?.id === cat.id ? "active" : ""}`}
              onClick={() => handleCategoryChange(cat)}
            >
              <span className="cat-icon"></span>
              <span className="cat-name">
                {language === "ar" ? cat.name_ar : cat.name}
              </span>{" "}
            </button>
          ))}
        </div>

        <div className="menu-hero-strip">
          <div className="menu-hero-flag">{theme?.flag || ""}</div>
          <div className="menu-hero-text">
            <h1 className="menu-hero-title">
              {language === "ar"
                ? selectedCategory?.name_ar
                : selectedCategory?.name}
            </h1>
            <p className="menu-hero-desc">{theme?.desc || ""}</p>
          </div>
          <div className="menu-deco-element">{theme?.deco || "🌸"}</div>
        </div>

        <div className="menu-stats-row">
          <span className="menu-stat-chip">
            {dishes.length} {t.dishes}
          </span>
          <span className="menu-stat-chip">⭐ {avgRating} avg</span>
          <span className="menu-stat-chip">
            {t.from} ${minPrice}
          </span>
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
              <button
                className="clear-search"
                onClick={() => setSearchQuery("")}
              >
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
              <option value="default">
                {t.sortBy}: {t.default}
              </option>
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
                      onChange={(e) =>
                        setPriceRange({
                          ...priceRange,
                          min: Number(e.target.value) || 0,
                        })
                      }
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
                      onChange={(e) =>
                        setPriceRange({
                          ...priceRange,
                          max: Number(e.target.value) || 100,
                        })
                      }
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
                  onChange={(e) =>
                    setPriceRange({
                      ...priceRange,
                      max: Number(e.target.value),
                    })
                  }
                  className="price-slider"
                  style={{
                    background: `linear-gradient(to right,#ff8a00 0%,#ff8a00 ${(priceRange.max / (maxPriceOverall || 100)) * 100}%,#e0d6ce ${(priceRange.max / (maxPriceOverall || 100)) * 100}%,#e0d6ce 100%)`,
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
                const isItalian = dish.category_id === 14;
                const currentPrice = getCurrentPrice(dish);
                const selectedSize = getSelectedSize(dish.id);
                const isOutOfStock = dish.availability === "out_of_stock";
                const {
                  name: translatedName,
                  description: translatedDescription,
                } = getTranslatedProduct(dish);

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
                      <img
                        src={dish.image}
                        alt={translatedName}
                        loading="lazy"
                      />
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
                                setPizzaSizes((prev) => ({
                                  ...prev,
                                  [dish.id]: size,
                                }));
                              }}
                            >
                              {size}{" "}
                              <small>
                                {size === "S"
                                  ? t.small
                                  : size === "M"
                                    ? t.medium
                                    : t.large}
                              </small>
                            </button>
                          ))}
                        </div>
                      )}

                      <div className="dish-footer">
                        <span className="dish-price">
                          ${Number(currentPrice).toFixed(2)}
                        </span>
                        <button
                          className={`add-cart-btn ${isOutOfStock ? "out-of-stock" : ""}`}
                          onClick={(e) => {
                            if (!isOutOfStock) handleQuickAdd(e, dish);
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
