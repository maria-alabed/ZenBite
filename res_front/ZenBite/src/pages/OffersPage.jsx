import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { useCart } from "../context/CartContext";
import ProductDetails from "./ProductDetails";
import Ticker from "../components/offers/Ticker";
import Sparks from "../components/offers/Sparks";
import { toHMS, pad, getFeaturedOffers } from "../utils/helpers";
import { triggerFlyAnimation } from "../utils/flyAnimation";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../utils/translations";
import "../styles/offers.css";
import heroFood from "../assets/images/food_transparent.png";
import axios from "axios";
/* ─── Translation maps (outside component, defined once) ─── */
const OFFER_NAMES_AR = {
  "Pizza & Fries Combo": "بيتزا وبطاطا مقلية",
  "Double Burger Combo": "برغر مزدوج",
  "Pasta Special": "باستا خاصة",
  "Sushi Family Pack": "علبة سوشي عائلية",
  "Korean BBQ Feast": "وليمة باربيكيو كورية",
  "Seafood Delight": "لذة المأكولات البحرية",
  "Bubble Tea & Mochi Box": "شاي الفقاعات وموتشي",
  "Pad Thai & Spring Rolls": "باد تاي ولفائف الربيع",
};

const OFFER_DESCS_AR = {
  "Pizza & Fries Combo": "بيتزا كبيرة · بطاطا مقلية · مشروب غازي",
  "Double Burger Combo": "برغر مزدوج · بطاطا · مشروب",
  "Pasta Special": "باستا كريمية · خبز بالثوم · مشروب",
  "Sushi Family Pack": "سوشي مشكل · شوربة ميسو · إدامامي",
  "Korean BBQ Feast": "لحم متبل · كيمتشي · أرز · جانشان",
  "Seafood Delight": "سلمون مشوي · جمبري · خضار",
  "Bubble Tea & Mochi Box": "2 شاي فقاعات · 3 آيس كريم موتشي",
  "Pad Thai & Spring Rolls": "باد تاي مقلي · لفائف مقرمشة · صلصة حارة",
};

/* ─── Main ───────────────────────────────────── */
export default function OffersPage() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { language } = useLanguage();
  const t = translations[language];

  const [liked, setLiked] = useState({});
  const [offers, setOffers] = useState([]);
  const [times, setTimes] = useState({});
  const [heroVis, setHeroVis] = useState(false);
  const [addedId, setAddedId] = useState(null);
  const [drawerProduct, setDrawerProduct] = useState(null);
  const heroRef = useRef(null);
  const navbarRef = useRef(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/offers");

        setOffers(res.data);

        const timerData = {};
        res.data.forEach((offer) => {
          timerData[offer.id] = 3600;
        });

        setTimes(timerData);
      } catch (err) {
        console.log(err);
      }
    };

    fetchOffers();
  }, []);

  /* ── Translation helpers (use originalTitle as key) ── */
  const getTranslatedName = (originalTitle) =>
    language === "ar"
      ? OFFER_NAMES_AR[originalTitle] || originalTitle
      : originalTitle;

  const getTranslatedDesc = (originalTitle, fallbackDesc) =>
    language === "ar"
      ? OFFER_DESCS_AR[originalTitle] || fallbackDesc
      : fallbackDesc;

  const getTranslatedCategory = (category) =>
    ({
      "Pizza Deals": t.categories?.pizzaDeals || "Pizza Deals",
      "Burger Deals": t.categories?.burgerDeals || "Burger Deals",
      "Sushi Deals": t.categories?.sushiDeals || "Sushi Deals",
      "Combo Deals": t.categories?.comboDeals || "Combo Deals",
      Desserts: t.categories?.desserts || "Desserts",
    })[category] || category;

  /* ── Countdown ── */
  useEffect(() => {
    const timer = setInterval(
      () =>
        setTimes((prev) =>
          Object.fromEntries(
            Object.entries(prev).map(([k, v]) => [k, Math.max(0, v - 1)]),
          ),
        ),
      1000,
    );
    return () => clearInterval(timer);
  }, []);

  /* ── Hero entrance ── */
  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setHeroVis(true);
      },
      { threshold: 0.1 },
    );
    if (heroRef.current) io.observe(heroRef.current);
    return () => io.disconnect();
  }, []);

  const toggleLike = (id, e) => {
    e.stopPropagation();
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  /* ── Add to cart ────────────────────────────────────── */
  const handleAddToCart = (e, offer) => {
    e.stopPropagation();
    setAddedId(offer.id);
    triggerFlyAnimation(e.currentTarget, offer.category);

    setTimeout(() => {
      addToCart({
        id: offer.id,
        name: offer.title,
        originalName: offer.title,
        price: Number(offer.new_price) || 0,
        image: offer.image,
        category: offer.category,
        description: offer.description,
        qty: 1,
      });
    }, 400);

    setTimeout(() => setAddedId(null), 800);
  };

  /* ── Open drawer ── */
  const handleProductClick = (offer) => {
    setDrawerProduct({
      ...offer,
      name: offer.title,
      originalName: offer.title,
      description: offer.description,
      price: Number(offer.newPrice) || 0,
      newPrice: Number(offer.newPrice) || 0,
      oldPrice: Number(offer.oldPrice) || 0,
      category: offer.category,
    });
  };

  const featured = getFeaturedOffers(offers);
  const bigSecs = times[1] ?? 0;

  return (
    <>
      <Navbar ref={navbarRef} />

      <div className="op-page">
        {/* ══ HERO ══════════════════════════════════ */}
        <section className="op-hero" ref={heroRef}>
          <Sparks />

          <div className={`op-hero-copy ${heroVis ? "op-vis" : ""}`}>
            <div className="op-hero-tag">
              <span className="op-dot" />
              {t.limitedTimeDeals}
            </div>
            <h1>
              {t.deliciousOffers}.<br />
              <span className="op-h1-accent">
                <em>{t.justForYou}</em>
              </span>
            </h1>
            <p>{t.enjoyBestCombos}</p>
            <div className="op-hero-row">
              <button
                className="op-cta-red"
                onClick={() =>
                  document
                    .getElementById("op-grid")
                    .scrollIntoView({ behavior: "smooth" })
                }
              >
                {t.seeAllDeals}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
              <button
                className="op-cta-ghost"
                onClick={() => navigate("/menu")}
              >
                {t.fullMenu}
              </button>
            </div>
          </div>

          <div className={`op-hero-visual ${heroVis ? "op-vis" : ""}`}>
            <div className="op-hero-img-wrap">
              <img src={heroFood} alt="food" />
              <div className="op-float op-float-1">
                <span className="op-float-num">-32%</span>
                <span className="op-float-sub">Mochi box</span>
              </div>
              <div className="op-float op-float-2">
                <span className="op-float-num">-30%</span>
                <span className="op-float-sub">Burger combo</span>
              </div>
            </div>
          </div>
        </section>

        {/* ══ FEATURED TRIO ═════════════════════════ */}
        <section className="op-featured">
          <div className="op-feat-head">
            <div>
              <p className="op-section-label">⭐ {t.featuredRightNow}</p>
              <h2>{t.topPicksThisWeek}</h2>
              <p className="op-feat-desc">{t.featuredDesc}</p>
            </div>
            <button
              className="op-see-all"
              onClick={() =>
                document
                  .getElementById("op-grid")
                  .scrollIntoView({ behavior: "smooth" })
              }
            >
              {t.allDeals} →
            </button>
          </div>

          <div className="op-feat-grid">
            {featured.map((offer, index) => {
              const spotlight = index === 1;
              const isAdded = addedId === offer.id;
              const displayName = getTranslatedName(offer.title);
              const displayDesc = getTranslatedDesc(
                offer.title,
                offer.description,
              );

              return (
                <article
                  key={offer.id}
                  className={`op-feat-card ${spotlight ? "op-feat-spot" : ""}`}
                  onClick={() => handleProductClick(offer)}
                >
                  <div className="op-feat-img">
                    <img src={offer.image} alt={displayName} />
                    <span className="op-feat-disc">
                      -{offer.discount_percent}%
                    </span>{" "}
                    {spotlight && (
                      <span className="op-feat-crown">👑 {t.topDeal}</span>
                    )}
                  </div>
                  <div className="op-feat-body">
                    <div className="op-feat-header">
                      <h3>{displayName}</h3>
                      <div className="op-feat-rating">⭐ {offer.rating}</div>
                    </div>
                    <p>{displayDesc}</p>
                    <div className="op-feat-footer">
                      <div className="op-price-stack">
                        <span className="op-old-sm">${offer.old_price}</span>

                        <span className="op-new-lg">${offer.new_price}</span>
                      </div>
                      <button
                        className={`op-add-btn ${isAdded ? "op-added" : ""}`}
                        onClick={(e) => handleAddToCart(e, offer)}
                      >
                        {t.add}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* ══ COUNTDOWN BANNER ══════════════════════ */}
        <section className="op-cd-banner">
          <div className="op-cd-left">
            <div className="op-cd-icon">
              <svg
                className="op-cd-clock-svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div className="op-cd-text">
              <span className="op-cd-tag">🔥 {t.hurryUp}</span>
              <h3>{t.limitedTimeOffer}</h3>
              <p>{t.grabDeals}</p>
            </div>
          </div>
          <Ticker secs={bigSecs} />
          <button
            className="op-cta-red"
            onClick={() =>
              document
                .getElementById("op-grid")
                .scrollIntoView({ behavior: "smooth" })
            }
          >
            {t.orderNow}
          </button>
        </section>

        {/* ══ ALL DEALS GRID ════════════════════════ */}
        <section id="op-grid" className="op-grid-section">
          <div className="op-grid-head">
            <p className="op-section-label">🎯 {t.allDeals}</p>
            <h2>
              {offers.length} {t.dealsAvailable}
            </h2>
          </div>

          <div className="op-grid">
            {offers.map((offer) => {
              const tLeft = times[offer.id];
              const expired = tLeft <= 0;
              const cd = toHMS(tLeft);
              const isLiked = liked[offer.id];
              const isAdded = addedId === offer.id;
              const displayName = getTranslatedName(offer.title);
              const displayDesc = getTranslatedDesc(
                offer.title,
                offer.description,
              );
              const displayCat = getTranslatedCategory(offer.category);

              return (
                <article
                  key={offer.id}
                  className={`op-card ${expired ? "op-card-exp" : ""}`}
                  onClick={() => handleProductClick(offer)}
                >
                  <div className="op-card-img">
                    <img src={offer.image} alt={displayName} loading="lazy" />
                    <span className="op-card-disc">
                      -{offer.discount_percent}%
                    </span>
                    <button
                      className={`op-like ${isLiked ? "op-lk-on" : ""}`}
                      onClick={(e) => toggleLike(offer.id, e)}
                      aria-label="wishlist"
                    >
                      {isLiked ? "❤️" : "🤍"}
                    </button>
                    {!expired && cd && (
                      <div className="op-card-cd">
                        <span>
                          {pad(cd.h)}:{pad(cd.m)}:{pad(cd.s)}
                        </span>
                      </div>
                    )}
                    {expired && (
                      <div className="op-card-overlay">{t.expired}</div>
                    )}
                  </div>

                  <div className="op-card-body">
                    <div className="op-card-top">
                      <span className="op-card-cat">{displayCat}</span>
                      <span className="op-card-stars">
                        {"★".repeat(Math.round(offer.rating))}{" "}
                        <b>{offer.rating}</b>
                      </span>
                    </div>
                    <h3>{displayName}</h3>
                    <p>{displayDesc}</p>

                    <div className="op-card-foot">
                      <div className="op-card-prices">
                        <div className="op-card-prices">
                          <span className="op-old-sm">${offer.old_price}</span>

                          <span className="op-new-lg">${offer.new_price}</span>
                        </div>
                      </div>
                      <button
                        className={`op-add-btn ${isAdded ? "op-added" : ""} ${expired ? "op-add-exp" : ""}`}
                        disabled={expired}
                        onClick={(e) => {
                          if (!expired) handleAddToCart(e, offer);
                        }}
                      >
                        {expired ? t.expired : t.add}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* ══ BOTTOM CTA ════════════════════════════ */}
        <section className="op-bottom-cta">
          <div className="op-bcta-inner">
            <p
              className="op-section-label"
              style={{ color: "rgba(255,255,255,.65)" }}
            >
              {t.stillHungry}
            </p>
            <h2>{t.exploreFullMenu}</h2>
            <p>{t.bottomCTADesc}</p>
            <div className="op-bcta-btns">
              <button
                className="op-bcta-primary"
                onClick={() => navigate("/menu")}
              >
                {t.browseMenu}
              </button>
              <button
                className="op-bcta-ghost"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                {t.backToDeals}
              </button>
            </div>
          </div>
        </section>
      </div>

      {drawerProduct && (
        <ProductDetails
          product={drawerProduct}
          onClose={() => setDrawerProduct(null)}
        />
      )}

      <Footer />
    </>
  );
}
