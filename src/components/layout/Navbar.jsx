import "../../styles/layout.css";
import { useState, forwardRef, useImperativeHandle, useRef, useEffect } from "react";
import CartSidebar from "../cart/CartSidebar";
import SearchModal from "./SearchModal"; 
import { NavLink } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useLanguage } from "../../context/LanguageContext";
import { translations } from "../../utils/translations"; 

const Navbar = forwardRef((props, ref) => {
  const [openCart, setOpenCart] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { getTotalItems, isAnimating } = useCart();
  const { language, toggleLanguage, isRTL } = useLanguage();
  const [animate, setAnimate] = useState(false);
  const cartIconRef = useRef(null);
  const itemCount = getTotalItems();

  const t = translations[language];

  useImperativeHandle(ref, () => ({
    getCartIconRef: () => cartIconRef.current
  }));

  useEffect(() => {
    if (isAnimating) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  const handleCartClick = () => {
    setOpenCart(true);
  };

  // دالة استدعاء النادل
  const handleCallWaiter = () => {
    alert("🔔 Waiter has been notified! They'll be with you shortly.");
  };

  // 🔴 دالة فتح مودال البحث
  const handleSearchClick = () => {
    setIsSearchOpen(true);
  };

  return (
    <>
      <nav className="navbar-modern">
        <div className="nav-container">
          {/* اللوجو */}
          <div className="logo-modern">
            <div className="logo-icon">🍜</div>
            <div className="logo-text">
              Zen<span>Bite</span>
            </div>
          </div>

          {/* الروابط */}
          <ul className="nav-links-modern" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
            <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
              <span className="nav-name">{t.home}</span>
            </NavLink>
            
            <NavLink to="/menu" className={({ isActive }) => (isActive ? "active" : "")}>
              <span className="nav-name">{t.menu}</span>
            </NavLink>
            
            {/* 🆕 OffersPage */}
            <NavLink to="/offer" className={({ isActive }) => (isActive ? "active" : "")}>
              <span className="nav-name">🔥 {t.offers}</span>
            </NavLink>
            
            {/* 🆕 Call Waiter */}
            <li 
              className="call-waiter-btn"
              onClick={handleCallWaiter}
            >
              <span className="nav-name">🔔 {t.callWaiter}</span>
            </li>
          </ul>

          {/* الأزرار */}
          <div className="nav-actions">
            {/* 🔴 زر تبديل اللغة */}
            <button 
              className="lang-btn"
              onClick={toggleLanguage}
              aria-label="Toggle language"
              style={{
                background: 'none',
                border: '1px solid #e0d6ce',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600',
                color: '#2d1a0e',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {language === 'en' ? '🇸🇦' : '🇬🇧'}
            </button>

            {/* 🔴 زر البحث - يفتح المودال */}
            <button 
              className="search-btn" 
              aria-label="Search"
              onClick={handleSearchClick}
            >
              <svg className="search-icon" viewBox="0 0 24 24">
                <path
                  d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
                />
              </svg>
            </button>

            <button 
              className="cart-btn-modern" 
              onClick={handleCartClick}
              ref={cartIconRef}
            >
              🛒
              {itemCount > 0 && (
                <span className={`cart-count ${animate ? "pulse" : ""}`}>
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* 🔴 مودال البحث */}
      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />

      <CartSidebar isOpen={openCart} onClose={() => setOpenCart(false)} />
    </>
  );
});

export default Navbar;