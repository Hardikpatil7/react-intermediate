import React, { useState, useEffect, useCallback } from "react";
import StoreCard from './StoreCard';
import axios from 'axios';

const fetchStores = async (params) => {
  const response = await axios.get('http://localhost:3001/stores', { params });
  const total = response.headers['x-total-count'];
  return { data: response.data, total };
};

const AllStores = ({ className, selectedCategory, sort, page, setPage, search,
  setSearch,
  alphabetFilter,
  setAlphabetFilter }) => {

  const [stores, setStores] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [bookmarkedStores, setBookmarkedStores] = useState(() => {
    const saved = localStorage.getItem('bookmarkedStores');
    return saved ? JSON.parse(saved) : [];
  });

  const loadStores = useCallback(async () => {
    const sortParams = (() => {
      switch (sort) {
        case 'featured':
          return { _sort: 'featured', _order: 'desc' };
        case 'popularity':
          return { _sort: 'clicks', _order: 'desc' };
        case 'cashback':
          return { _sort: 'cashback_amount', _order: 'desc', cashback_enabled: 1 };
        case 'name':
          return { _sort: 'name', _order: 'asc' };
        default:
          return {};
      }
    })();

    const filterParams = {
      _page: page,
      _limit: 20,
      ...sortParams,
      name_like: alphabetFilter && !search ? `^${alphabetFilter}` : search ? `${search}` : undefined,
      category: selectedCategory ? `${selectedCategory}` : undefined,
    };

    const response = await fetchStores(filterParams);
    setStores(response.data);
    setTotalPages(Math.ceil(response.total / 20));
  }, [page, sort, search, selectedCategory, alphabetFilter]);

  useEffect(() => {
    loadStores();
  }, [loadStores]);

  const toggleBookmark = (storeId) => {
    let updatedBookmarks;
    if (bookmarkedStores.includes(storeId)) {
      updatedBookmarks = bookmarkedStores.filter((id) => id !== storeId);
    } else {
      updatedBookmarks = [...bookmarkedStores, storeId];
    }
    setBookmarkedStores(updatedBookmarks);
    localStorage.setItem('bookmarkedStores', JSON.stringify(updatedBookmarks));
  };

  const alphabet = ['All', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')];

  return (
    <div className={`my-[50px] ${className}`}>
      <div className="mb-4">
        <div className="flex space-x-2 mb-2">
          {alphabet.map((letter) => (
            <button
              key={letter}
              className={`p-2 ${alphabetFilter === letter ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-800'} rounded`}
              onClick={() => {
                setAlphabetFilter(letter === 'All' ? '' : letter);
                setPage(1);
              }}
            >
              {letter}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search stores..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="p-2 border border-gray-300 rounded-md"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stores.map((store) => (
          <StoreCard
            key={store.id}
            store={store}
            bookmarked={bookmarkedStores.includes(store.id)}
            toggleBookmark={toggleBookmark}
          />
        ))}
      </div>
      <div className="mt-4 flex justify-between items-center">
        <button
          className={`p-2 ${page === 1 ? 'bg-gray-300' : 'bg-indigo-500 text-white'} rounded`}
          onClick={() => page > 1 && setPage(page - 1)}
          disabled={page === 1}
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          className={`p-2 ${page === totalPages ? 'bg-gray-300' : 'bg-indigo-500 text-white'} rounded`}
          onClick={() => page < totalPages && setPage(page + 1)}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AllStores;
