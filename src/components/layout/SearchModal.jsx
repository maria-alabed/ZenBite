import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { menuData } from '../../data/menuData';
import "../../styles/searchmodal.css";

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      return;
    }

    const allDishes = Object.values(menuData).flat();
    const filtered = allDishes.filter(dish =>
      dish.name.toLowerCase().includes(query.toLowerCase()) ||
      dish.description.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered.slice(0, 8));
  }, [query]);

  // 🔴 دالة عند الضغط على نتيجة البحث
  const handleResultClick = (dish) => {
    onClose();
    
    // 🔴 الانتقال لصفحة المنيو مع تمرير المنتج لفتح الـ Drawer
    navigate('/menu', { 
      state: { 
        selectedCategory: dish.category,
        openProduct: dish // تمرير المنتج لفتحه مباشرة
      } 
    });
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="search-modal-overlay" onClick={onClose}>
      <div className="search-modal" onClick={(e) => e.stopPropagation()}>
        <div className="search-modal-header">
          <Search size={20} className="search-modal-icon" />
          <input
            ref={inputRef}
            type="text"
            className="search-modal-input"
            placeholder="Search for dishes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="search-modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {results.length > 0 && (
          <div className="search-modal-results">
            {results.map((dish) => (
              <div
                key={dish.id}
                className="search-result-item"
                onClick={() => handleResultClick(dish)}
              >
                <img src={dish.image} alt={dish.name} />
                <div className="search-result-info">
                  <h4>{dish.name}</h4>
                  <p>{dish.description}</p>
                  <span className="search-result-price">${dish.price}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {query && results.length === 0 && (
          <div className="search-no-results">
            <span>🔍</span>
            <p>No dishes found</p>
          </div>
        )}
      </div>
    </div>
  );
}