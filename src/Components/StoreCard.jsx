import React from 'react';

const StoreCard = ({ store, bookmarked, toggleBookmark }) => {
    const cashbackString = store.cashback_enabled
        ? `${store.rate_type} ${store.amount_type === 'fixed' ? `$${store.cashback_amount.toFixed(2)}` : `${store.cashback_amount.toFixed(2)}%`}`
        : 'No cashback available';

    return (
        <div className="p-4 border rounded-lg shadow-lg">
            <a href={store.homepage} target="_blank" rel="noopener noreferrer">
                <div className="flex flex-col items-center">
                    <img src={store.logo} alt={`${store.name} logo`} className="h-24 w-24 mb-4" />
                    <h2 className="text-xl font-bold mb-2">{store.name}</h2>
                    <p className="text-gray-600">{cashbackString}</p>
                </div>
            </a>
            <button
                className={`mt-2 ${bookmarked ? 'text-red-500' : 'text-gray-400'} hover:text-red-500`}
                onClick={() => toggleBookmark(store.id)}
            >
                {bookmarked ? '❤️' : '♡'}
            </button>
        </div>
    );
};

export default StoreCard;






