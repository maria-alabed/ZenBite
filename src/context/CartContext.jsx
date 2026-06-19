import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [isAnimating, setIsAnimating] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState(null);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.qty, 0);
  };

  // 🔴 دالة لتوليد معرف فريد للمنتج بناءً على مواصفاته
  const getItemKey = (item) => {
    // بناء معرف فريد يشمل: id + الحجم + الإضافات + نوع العجينة + درجة الحرارة
    const parts = [
      item.id,
      item.selectedSize || 'default',
      item.selectedCrust || 'default',
      item.selectedSpice || 'default',
      // نرتب الإضافات حسب id عشان يكون المعرف ثابت
      ...(item.addons ? [...item.addons].sort((a, b) => a.id.localeCompare(b.id)).map(a => a.id) : [])
    ];
    return parts.join('|');
  };

  const addToCart = (item) => {
    // تفعيل الأنيميشن
    setLastAddedItem(item);
    setIsAnimating(true);
    
    setTimeout(() => {
      setIsAnimating(false);
      setLastAddedItem(null);
    }, 800);

    setCart((prev) => {
      // 🔴 نبحث باستخدام المفتاح الفريد بدلاً من id فقط
      const itemKey = getItemKey(item);
      const exists = prev.find((p) => getItemKey(p) === itemKey);

      if (exists) {
        // إذا وجد نفس المواصفات، نزيد الكمية
        return prev.map((p) =>
          getItemKey(p) === itemKey ? { ...p, qty: p.qty + 1 } : p
        );
      }

      // إذا لم يوجد، نضيف منتج جديد مع المفتاح
      return [...prev, { ...item, qty: 1, _key: itemKey }];
    });
  };

  const removeFromCart = (id, itemKey) => {
    setCart((prev) => {
      // إذا كان لدينا المفتاح، نحذف به
      if (itemKey) {
        return prev.filter((p) => p._key !== itemKey);
      }
      // وإلا نحذف بأول id يتطابق (للتوافق مع الإصدارات القديمة)
      return prev.filter((p) => p.id !== id);
    });
  };

  const updateQty = (id, amount, itemKey) => {
    setCart((prev) =>
      prev.map((p) => {
        // نستخدم المفتاح إذا كان موجوداً
        const matchKey = itemKey ? p._key === itemKey : p.id === id;
        if (matchKey) {
          return { ...p, qty: Math.max(1, p.qty + amount) };
        }
        return p;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQty,
        total,
        getTotalItems,
        clearCart,
        isAnimating,
        lastAddedItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);