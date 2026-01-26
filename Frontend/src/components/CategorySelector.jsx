import React from 'react';

const CategorySelector = ({ currentCategory }) => {
    // Categories list - ideally fetched from backend later
    const categories = ['Uncategorized', 'Finance', 'Legal', 'Health', 'Personal', 'Work', 'Education'];

    return (
        <div className="relative">
            <select
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                defaultValue={currentCategory || 'Uncategorized'}
            >
                {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                ))}
            </select>
        </div>
    );
};

export default CategorySelector;
