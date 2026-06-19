import { useState, useEffect, useCallback, useRef } from "react";
import { useCart } from "../context/CartContext";
import { getAddonsByCategory, spiceLevels, crustTypes, spiceCategories } from "../data/menuData";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../utils/translations";
import { CaloriesBadge, AvailabilityBadge } from "../components/product/ProductBadges";
import { AddonChip, SpiceChip, CrustChip } from "../components/product/ProductChips";
import {
  translateName,
  translateDescription,
  translateAddon,
  translateSpice,
  translateCrust,
} from "../utils/i18n";

export default function ProductDetails({ product, onClose }) {
  const { addToCart } = useCart();
  const { language }  = useLanguage();
  const t = translations[language];

  const [quantity,             setQuantity]             = useState(1);
  const [selectedSize,         setSelectedSize]         = useState(null);
  const [selectedAddons,       setSelectedAddons]       = useState([]);
  const [selectedSpice,        setSelectedSpice]        = useState("medium");
  const [selectedCrust,        setSelectedCrust]        = useState("thin");
  const [specialInstructions,  setSpecialInstructions]  = useState("");
  const [activeImage,          setActiveImage]          = useState(0);
  const [isWishlisted,         setIsWishlisted]         = useState(false);
  const [visible,              setVisible]              = useState(false);

  useEffect(() => { requestAnimationFrame(() => setVisible(true)); }, []);

  useEffect(() => {
    if (!product) return;
    const fromCart = !!product._key;
    if (fromCart) {
      setQuantity(product.qty || 1);
      setSelectedAddons(product.addons || []);
      setSelectedSpice(product.selectedSpice || "medium");
      setSelectedCrust(product.selectedCrust || "thin");
      setSpecialInstructions(product.specialInstructions || "");
      setSelectedSize(product.selectedSize || Object.keys(product.sizes || {})[0] || null);
    } else {
      setQuantity(1); setSelectedAddons([]); setSelectedSpice("medium");
      setSelectedCrust("thin"); setSpecialInstructions(""); setActiveImage(0);
      setSelectedSize(Object.keys(product.sizes || {})[0] || null);
    }
  }, [product]);

  const handleClose = useCallback(() => {
    setVisible(false);
    setTimeout(onClose, 320);
  }, [onClose]);

  const handleCloseRef = useRef(handleClose);
  useEffect(() => { handleCloseRef.current = handleClose; }, [handleClose]);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") handleCloseRef.current(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  if (!product) return null;

  // ── ترجمة (3 أسطر بدل 200 سطر) ──────────────────────
  const originalName   = product.originalName || product.name;
  const translatedName = translateName(originalName, t, language);
  const translatedDesc = translateDescription(originalName, product.description, t, language);

  const isPizza      = product.category === "Italian Kitchen" && product.name?.includes("Pizza");
  const showSpice    = spiceCategories.includes(product.category);
  const availAddons  = getAddonsByCategory(product.category);
  const hasSizes     = !!product.sizes;
  const sizes        = hasSizes ? Object.keys(product.sizes) : [];
  const isOutOfStock = product.availability === "out_of_stock";

  const images = [
    product.image,
    product.image?.replace("?w=400", "?w=400&crop=center"),
    product.image?.replace("?w=400", "?w=400&crop=entropy"),
  ].filter(Boolean);

  const basePrice   = hasSizes ? product.sizes[selectedSize] ?? product.price : product.price ?? 0;
  const crustExtra  = isPizza ? crustTypes.find(c => c.id === selectedCrust)?.price ?? 0 : 0;
  const addonsExtra = selectedAddons.reduce((s, a) => s + a.price, 0);
  const unitPrice   = basePrice + crustExtra + addonsExtra;
  const total       = unitPrice * quantity;

  const toggleAddon = (addon) =>
    setSelectedAddons(prev =>
      prev.find(a => a.id === addon.id)
        ? prev.filter(a => a.id !== addon.id)
        : [...prev, addon]
    );

  const triggerFly = (buttonEl) => {
    const cartIcon = document.querySelector(".cart-btn-modern");
    if (!cartIcon) return;
    const rect     = buttonEl.getBoundingClientRect();
    const cartRect = cartIcon.getBoundingClientRect();
    const el = document.createElement("div");
    el.className = "flying-item";
    el.textContent = ({
      "Japanese Kitchen":"🍣","Chinese Kitchen":"🥢","Korean Kitchen":"🇰🇷",
      "Italian Kitchen":"🍕","Seafood":"🦐","Asian Specials":"🍜",
      "Healthy Choices":"🥗","Drinks":"🍹","Desserts":"🍰",
    })[product.category] || "🍕";
    const sx = rect.left + rect.width/2 - 20, sy = rect.top + rect.height/2 - 20;
    const ex = cartRect.left + cartRect.width/2 - 20, ey = cartRect.top + cartRect.height/2 - 20;
    el.style.left = sx+"px"; el.style.top = sy+"px";
    el.style.setProperty("--start-x", sx+"px"); el.style.setProperty("--start-y", sy+"px");
    el.style.setProperty("--end-x",   ex+"px"); el.style.setProperty("--end-y",   ey+"px");
    document.body.appendChild(el);
    requestAnimationFrame(() => el.classList.add("flying"));
    setTimeout(() => el.remove(), 800);
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    let productName = translatedName;
    if (isPizza) {
      const crust = crustTypes.find(c => c.id === selectedCrust);
      productName += ` (${translateCrust(selectedCrust, language) || crust?.name || "Thin"})`;
    }
    if (showSpice && selectedSpice !== "medium") {
      productName += ` — ${translateSpice(selectedSpice, language)}`;
    }

    const addBtn = document.querySelector(".drawer-add-btn");
    if (addBtn) triggerFly(addBtn);

    setTimeout(() => {
      addToCart({
        ...product,
        name:                productName,
        originalName:        product.originalName || product.name,
        price:               unitPrice,
        qty:                 quantity,
        selectedSize:        hasSizes ? selectedSize : null,
        selectedCrust:       isPizza ? selectedCrust : null,
        selectedSpice:       showSpice ? selectedSpice : null,
        addons:              selectedAddons.map(a => ({ ...a, name: a.originalName || a.name, originalName: a.originalName || a.name })),
        addonsList:          selectedAddons.map(a => a.originalName || a.name).join(", "),
        addonsPrice:         addonsExtra,
        specialInstructions,
        category:            product.category,
        _key:                product._key || undefined,
      });
    }, 400);

    setTimeout(() => handleClose(), 800);
  };

  const isRTL = language === "ar";

  const S = {
    overlay:    { position:"fixed", inset:0, zIndex:1000, background: visible ? "rgba(0,0,0,0.55)" : "rgba(0,0,0,0)", transition:"background 0.32s ease", display:"flex", alignItems:"flex-end", justifyContent:"center" },
    drawer:     { width:"100%", maxWidth:640, maxHeight:"92dvh", background:"#faf8f6", borderRadius:"22px 22px 0 0", overflow:"hidden", display:"flex", flexDirection:"column", transform: visible ? "translateY(0)" : "translateY(100%)", transition:"transform 0.32s cubic-bezier(0.4,0,0.2,1)", boxShadow:"0 -8px 40px rgba(0,0,0,0.12)" },
    scrollArea: { overflowY:"auto", flex:1 },
    handle:     { width:38, height:4, background:"#ddd", borderRadius:2, margin:"12px auto 0", cursor:"pointer", flexShrink:0 },
    imgWrap:    { position:"relative", height:260, background:"#f0ece8", flexShrink:0 },
    mainImg:    { width:"100%", height:"100%", objectFit:"cover", display:"block" },
    thumbRow:   { position:"absolute", bottom:12, left:"50%", transform:"translateX(-50%)", display:"flex", gap:6 },
    ratingBadge:{ position:"absolute", top:12, left:12, background:"rgba(255,255,255,0.92)", backdropFilter:"blur(6px)", padding:"4px 10px", borderRadius:20, fontSize:12, fontWeight:700, color:"#2d1a0e" },
    closeBtn:   { position:"absolute", top:12, right:12, width:32, height:32, borderRadius:"50%", background:"rgba(0,0,0,0.35)", border:"none", color:"white", fontSize:16, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" },
    wishBtn:    { position:"absolute", top:12, right:52, width:32, height:32, borderRadius:"50%", background:"rgba(0,0,0,0.35)", border:"none", fontSize:15, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" },
    content:    { padding:"16px 20px 8px" },
    catTag:     { display:"inline-block", padding:"3px 12px", background:"#fff4e5", color:"#cc6f00", borderRadius:20, fontSize:11, fontWeight:600, marginBottom:6 },
    productName:{ fontSize:22, fontWeight:800, color:"#2d1a0e", margin:"0 0 6px", lineHeight:1.2, textAlign: isRTL ? "right" : "left" },
    productDesc:{ fontSize:13, color:"#8a7a6a", lineHeight:1.6, margin:"0 0 16px", textAlign: isRTL ? "right" : "left" },
    priceRow:   { display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 14px", background:"white", borderRadius:12, marginBottom:16, border:"1px solid #f0ece8" },
    priceVal:   { fontSize:22, fontWeight:800, color:"#e07800" },
    sizeRow:    { display:"flex", gap:6, flexWrap:"wrap" },
    sizeBtn: (active) => ({ padding:"5px 12px", border: active ? "1.5px solid #e07800":"1.5px solid #e8e0d8", borderRadius:8, background: active ? "#e07800":"white", color: active ? "white":"#2d1a0e", fontWeight:700, fontSize:12, cursor:"pointer", transition:"all 0.2s", display:"flex", flexDirection:"column", alignItems:"center" }),
    sectionLabel:{ fontSize:11, fontWeight:700, color:"#8a7a6a", textTransform:"uppercase", letterSpacing:"0.6px", marginBottom:8, textAlign: isRTL ? "right":"left" },
    spiceRow:   { display:"flex", gap:6, flexWrap:"wrap", marginBottom:16 },
    crustRow:   { display:"flex", gap:6, flexWrap:"wrap", marginBottom:16 },
    addonsGrid: { display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(80px,1fr))", gap:6, marginBottom:16 },
    textarea:   { width:"100%", padding:"10px 12px", border:"1.5px solid #e8e0d8", borderRadius:10, resize:"vertical", fontFamily:"inherit", fontSize:13, background:"white", color:"#2d1a0e", minHeight:60, boxSizing:"border-box", outline:"none", textAlign: isRTL ? "right":"left" },
    addonsSummary:{ display:"flex", flexWrap:"wrap", gap:5, padding:"8px 12px", background:"#fff4e5", borderRadius:10, marginBottom:16, alignItems:"center" },
    addonTag:   { display:"inline-flex", alignItems:"center", gap:3, padding:"3px 9px", background:"white", borderRadius:20, fontSize:11, fontWeight:600, color:"#2d1a0e", border:"1px solid #f0e8d8" },
    actionBar:  { display:"flex", alignItems:"center", gap:10, padding:"14px 20px", background:"white", borderTop:"1.5px solid #f0ece8", flexShrink:0 },
    qtyCtrl:    { display:"flex", alignItems:"center", border:"1.5px solid #e8e0d8", borderRadius:10, overflow:"hidden" },
    qtyBtn:     { width:36, height:36, border:"none", background:"transparent", fontSize:18, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#2d1a0e" },
    qtyNum:     { minWidth:34, textAlign:"center", fontWeight:700, fontSize:15, color:"#2d1a0e" },
    addBtn:     { flex:1, height:44, background:"linear-gradient(135deg,#ff8a00,#e07000)", border:"none", borderRadius:12, color:"white", fontSize:14, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:7 },
    addBtnDis:  { flex:1, height:44, background:"#ccc", border:"none", borderRadius:12, color:"#999", fontSize:14, fontWeight:700, cursor:"not-allowed", display:"flex", alignItems:"center", justifyContent:"center", gap:7, opacity:0.7 },
  };

  return (
    <div style={S.overlay} onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div style={S.drawer} role="dialog" aria-modal="true" aria-label={translatedName}>
        <div style={S.handle} onClick={handleClose} />

        <div style={S.scrollArea}>
          <div style={S.imgWrap}>
            <img src={images[activeImage]} alt={translatedName} style={S.mainImg} />
            {product.rating && <div style={S.ratingBadge}>⭐ {product.rating}</div>}
            <button style={S.wishBtn} onClick={() => setIsWishlisted(w => !w)} aria-label={t.wishlist}>
              {isWishlisted ? "❤️" : "🤍"}
            </button>
            <button style={S.closeBtn} onClick={handleClose} aria-label={t.close}>✕</button>
            {images.length > 1 && (
              <div style={S.thumbRow}>
                {images.map((_, i) => (
                  <span key={i} onClick={() => setActiveImage(i)} style={{
                    width: i === activeImage ? 18 : 6, height:6, borderRadius:3,
                    background: i === activeImage ? "#ff8a00" : "rgba(255,255,255,0.55)",
                    cursor:"pointer", transition:"all 0.3s",
                  }} />
                ))}
              </div>
            )}
          </div>

          <div style={S.content}>
            <span style={S.catTag}>{product.category}</span>
            <h2 style={S.productName}>{translatedName}</h2>
            <CaloriesBadge calories={product.calories} />
            <AvailabilityBadge availability={product.availability} />
            {translatedDesc && <p style={S.productDesc}>{translatedDesc}</p>}

            <div style={S.priceRow}>
              <div>
                <div style={{ fontSize:10, color:"#8a7a6a", textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:2 }}>
                  {hasSizes ? `${t.size} ${selectedSize}` : t.price}
                </div>
                <div style={S.priceVal}>${basePrice?.toFixed(2)}</div>
              </div>
              {hasSizes && (
                <div style={S.sizeRow}>
                  {sizes.map(sz => (
                    <button key={sz} style={S.sizeBtn(selectedSize === sz)} onClick={() => setSelectedSize(sz)}>
                      <span>{sz}</span>
                      <span style={{ fontSize:9, opacity:0.75 }}>${product.sizes[sz]}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {showSpice && (
              <>
                <div style={S.sectionLabel}>{t.temperatureLevel}</div>
                <div style={S.spiceRow}>
                  {spiceLevels.map(s => (
                    <SpiceChip key={s.id} spice={s} selected={selectedSpice===s.id} onSelect={setSelectedSpice} />
                  ))}
                </div>
              </>
            )}

            {isPizza && (
              <>
                <div style={S.sectionLabel}>🍕 {t.crustType}</div>
                <div style={S.crustRow}>
                  {crustTypes.map(c => (
                    <CrustChip key={c.id} crust={c} selected={selectedCrust===c.id} onSelect={setSelectedCrust} />
                  ))}
                </div>
              </>
            )}

            <div style={S.sectionLabel}>✨ {t.addons}</div>
            <div style={S.addonsGrid}>
              {availAddons.map(a => (
                <AddonChip key={a.id} addon={a} selected={!!selectedAddons.find(x => x.id===a.id)} onToggle={toggleAddon} />
              ))}
            </div>

            {selectedAddons.length > 0 && (
              <div style={S.addonsSummary}>
                <span style={{ fontSize:11, fontWeight:600, color:"#8a7a6a", marginRight:2 }}>{t.added}:</span>
                {selectedAddons.map(a => (
                  <span key={a.id} style={S.addonTag}>
                    {a.emoji} {translateAddon(a.originalName || a.name, language)}
                    <span style={{ color:"#e07800" }}> +${a.price.toFixed(2)}</span>
                  </span>
                ))}
              </div>
            )}

            <div style={{ marginBottom:8 }}>
              <div style={{ ...S.sectionLabel, marginBottom:6 }}>📝 {t.specialInstructions}</div>
              <textarea
                style={S.textarea}
                placeholder={t.anyRequests}
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                rows={2}
              />
            </div>
          </div>
        </div>

        <div style={S.actionBar}>
          <div style={S.qtyCtrl}>
            <button style={S.qtyBtn} onClick={() => setQuantity(q => Math.max(1,q-1))} disabled={isOutOfStock}>−</button>
            <span style={S.qtyNum}>{quantity}</span>
            <button style={S.qtyBtn} onClick={() => setQuantity(q => q+1)} disabled={isOutOfStock}>+</button>
          </div>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", minWidth:56 }}>
            <span style={{ fontSize:9, color:"#8a7a6a", textTransform:"uppercase", letterSpacing:"0.4px" }}>{t.total}</span>
            <span style={{ fontSize:17, fontWeight:800, color:"#e07800" }}>${total.toFixed(2)}</span>
          </div>
          {isOutOfStock
            ? <button style={S.addBtnDis} disabled>❌ {t.outOfStock}</button>
            : <button className="drawer-add-btn" style={S.addBtn} onClick={handleAddToCart}>🛒 {t.addToCart}</button>
          }
        </div>
      </div>
    </div>
  );
}
