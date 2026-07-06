// src/components/offers/Ticker.jsx

import { pad, toHMS } from '../../utils/helpers';

export default function Ticker({ secs }) {
  const t = toHMS(secs);
  if (!t) return <span className="op-expired-tag">Expired</span>;
  
  return (
    <div className="op-ticker">
      {[
        ['H', t.h],
        ['M', t.m],
        ['S', t.s],
      ].map(([label, value]) => (
        <span key={label} className="op-tick-cell">
          <span className="op-tick-num">{pad(value)}</span>
          <span className="op-tick-lbl">{label}</span>
        </span>
      ))}
    </div>
  );
}