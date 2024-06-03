import React, { useState, useEffect } from "react";
import { fetchCategories } from '../Services/api';


const Categories = ({ className, selectedCategory, setSelectedCategory }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const getCategories = async () => {
      const response = await fetchCategories();
      setCategories(response.data);
    };
    getCategories();
  }, []);

  return (
    <div className={`${className} my-[50px]`}>
      <h2 className="text-xl font-bold mb-4">Categories</h2>
      <ul className="space-y-2">
        {categories.map((category) => (
          <li key={category.id}
            className={`p-2 rounded cursor-pointer ${selectedCategory === category.name
              ? 'bg-indigo-500 text-white'
              : 'bg-gray-200 text-gray-800'
              }`}
            onClick={() => setSelectedCategory(category.name)}
          >
            {category.name}
          </li>
        ))}
      </ul>
    </div >
  );
};

export default Categories;
