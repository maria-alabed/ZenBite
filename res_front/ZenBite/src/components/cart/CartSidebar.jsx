import { useCart } from "../../context/CartContext";
import { useState } from "react";
import ProductDetails from "../../pages/ProductDetails";
import { useLanguage } from "../../context/LanguageContext";
import { translations } from "../../utils/translations";
import {
  translateCartItemName,
  translateAddon,
  translateCrust,
  translateSpice,
} from "../../utils/i18n";
import axios from "axios";
const SPICE_CATEGORIES = [
  "Japanese Kitchen",
  "Chinese Kitchen",
  "Korean Kitchen",
  "Italian Kitchen",
  "Asian Specials",
  "Seafood",
];

function CartSidebar({ isOpen, onClose }) {
  const { cart, removeFromCart, updateQty, total, clearCart } = useCart();
  const { language } = useLanguage();
  const t = translations[language];
  const [drawerProduct, setDrawerProduct] = useState(null);
  const table_id = 1;

  const handleCheckout = async () => {
    try {
      const orderData = {
        table_id,
        total_price: total,

        items: cart.map((item) => ({
          product_id: item.id,
          quantity: item.qty,
          price: item.price,
          note: item.specialInstructions || "",
          selected_s: item.selectedSize || null,

          addons:
            item.addons?.map((addon) => ({
              addon_id: addon.id,
              price: addon.price,
            })) || [],
        })),
      };

      const res = await axios.post(
        "http://localhost:5000/api/orders",
        orderData,
      );

      console.log("ORDER CREATED:", res.data);

      clearCart();

      alert("Order created successfully");
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  const handleProductClick = (item) => {
    onClose();
    setTimeout(() => {
      setDrawerProduct({
        ...item,
        category: item.category || "Japanese Kitchen",
        price: item.price || 0,
        selectedSize: item.selectedSize || null,
        selectedCrust: item.selectedCrust || null,
        selectedSpice: item.selectedSpice || "medium",
        addons: item.addons || [],
        addonsList: item.addonsList || "",
        addonsPrice: item.addonsPrice || 0,
        specialInstructions: item.specialInstructions || "",
        qty: item.qty || 1,
        _key: item._key,
      });
    }, 300);
  };

  return (
    <>
      <div className={`cart-overlay ${isOpen ? "open" : ""}`} onClick={onClose}>
        <div className="cart-sidebar" onClick={(e) => e.stopPropagation()}>
          <div className="cart-header">
            <h2>🛒 {t.yourCart || "Your Cart"}</h2>
            <button className="close-btn" onClick={onClose}>
              ✕
            </button>
          </div>

          <div className="cart-items">
            {cart.length === 0 ? (
              <div className="empty-cart">
                <span>🛍️</span>
                <p>{t.emptyCart || "Your cart is empty"}</p>
                <button className="browse-menu-btn" onClick={onClose}>
                  {t.browseMenu || "Browse Menu"}
                </button>
              </div>
            ) : (
              cart.map((item) => {
                // ── كل الترجمة هنا عند العرض فقط ──────────────
                const displayName = translateCartItemName(item, t, language);
                const displayAddons = (item.addons || []).map((a) => ({
                  ...a,
                  displayName: translateAddon(
                    a.originalName || a.name,
                    language,
                  ),
                }));
                const showSpice =
                  SPICE_CATEGORIES.includes(item.category) &&
                  item.selectedSpice &&
                  item.selectedSpice !== "medium";

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
                      <p>${Number(item.price || 0).toFixed(2)}</p>
                      {displayAddons.length > 0 && (
                        <div className="cart-item-addons">
                          <small>
                            ➕{" "}
                            {displayAddons.map((a) => a.displayName).join(", ")}
                          </small>
                        </div>
                      )}

                      {item.selectedSize && (
                        <div className="cart-item-size">
                          <small>
                            📏 {t.size || "Size"}: {item.selectedSize}
                          </small>
                        </div>
                      )}

                      {item.selectedCrust &&
                        item.category === "Italian Kitchen" && (
                          <div className="cart-item-crust">
                            <small>
                              🍕 {t.crustType || "Crust"}:{" "}
                              {translateCrust(item.selectedCrust, language)}
                            </small>
                          </div>
                        )}

                      {showSpice && (
                        <div className="cart-item-spice">
                          <small>
                            🌶️ {t.temperatureLevel || "Spice"}:{" "}
                            {translateSpice(item.selectedSpice, language)}
                          </small>
                        </div>
                      )}

                      {item.specialInstructions && (
                        <div className="cart-item-notes">
                          <small>📝 {item.specialInstructions}</small>
                        </div>
                      )}
                    </div>

                    <div
                      className="cart-item-actions"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="qty">
                        <button
                          onClick={() => updateQty(item.id, -1, item._key)}
                        >
                          −
                        </button>
                        <span>{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.id, 1, item._key)}
                        >
                          +
                        </button>
                        <button
                          className="remove-btn"
                          onClick={() => removeFromCart(item.id, item._key)}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {cart.length > 0 && (
            <div className="cart-footer">
              <h3>
                {t.total || "Total"}:{" "}
                <span>${Number(total || 0).toFixed(2)}</span>
              </h3>
              <div className="cart-actions">
                <button className="clear-cart-btn" onClick={clearCart}>
                  {t.clearCart || "Clear Cart"}
                </button>
                <button className="checkout-btn" onClick={handleCheckout}>
                  {t.checkout || "Checkout"} →
                </button>
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
