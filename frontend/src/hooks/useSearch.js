import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const STORAGE_KEY = 'nitya_recent_searches';

export function useSearch(initialQuery = '') {
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [recentSearches, setRecentSearches] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      } else {
        setRecentSearches(['Philips Air Fryer', 'Air Fryer under ₹5000', 'Wireless Earbuds']);
      }
    } catch (e) {
      setRecentSearches(['Philips Air Fryer', 'Air Fryer under ₹5000', 'Wireless Earbuds']);
    }
  }, []);

  const addRecentSearch = (query) => {
    if (!query || !query.trim()) return;
    const clean = query.trim();
    try {
      const existing = recentSearches.filter((item) => item.toLowerCase() !== clean.toLowerCase());
      const updated = [clean, ...existing].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving recent searches:', e);
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Error clearing recent searches:', e);
    }
  };

  const handleSearchSubmit = (e, customQuery) => {
    if (e) e.preventDefault();
    const queryToUse = customQuery !== undefined ? customQuery : searchTerm;
    if (!queryToUse || !queryToUse.trim()) return;
    
    const cleanQuery = queryToUse.trim();
    addRecentSearch(cleanQuery);
    setSearchTerm(cleanQuery);
    navigate(`/search?q=${encodeURIComponent(cleanQuery)}`);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  return {
    searchTerm,
    setSearchTerm,
    handleSearchSubmit,
    clearSearch,
    recentSearches,
    clearRecentSearches,
  };
}

export default useSearch;
