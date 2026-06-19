// src/utils/flyAnimation.js
import { categoryIcons } from '../data/menuData';
import { ICON_MAP } from '../data/offersData';

export function triggerFlyAnimation(buttonEl, category) {
  const cartIcon = document.querySelector('.cart-btn-modern');
  if (!cartIcon) return;

  const rect = buttonEl.getBoundingClientRect();
  const cartRect = cartIcon.getBoundingClientRect();

  // 🔴 حاول من ICON_MAP (للعروض) أولاً، ثم من categoryIcons (للمنيو)
  const icon = ICON_MAP[category] || categoryIcons[category] || '🛒';

  const el = document.createElement('div');
  el.className = 'flying-item';
  el.textContent = icon;

  const startX = rect.left + rect.width / 2 - 20;
  const startY = rect.top + rect.height / 2 - 20;
  const endX = cartRect.left + cartRect.width / 2 - 20;
  const endY = cartRect.top + cartRect.height / 2 - 20;

  el.style.left = startX + 'px';
  el.style.top = startY + 'px';
  el.style.setProperty('--start-x', startX + 'px');
  el.style.setProperty('--start-y', startY + 'px');
  el.style.setProperty('--end-x', endX + 'px');
  el.style.setProperty('--end-y', endY + 'px');

  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add('flying'));
  setTimeout(() => el.remove(), 800);
}