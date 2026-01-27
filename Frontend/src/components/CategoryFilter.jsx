import { useState, useEffect } from 'react';

const CategoryFilter = ({ category, setCategory }) => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const userId = localStorage.getItem('user_id') || 'test_user_id';
                const response = await fetch(`http://localhost:8000/api/documents/categories?user_id=${userId}`);
                if (response.ok) {
                    const data = await response.json();
                    setCategories(data.categories);
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
        // Set up interval to refresh counts periodically (e.g., every 10 seconds)
        const intervalId = setInterval(fetchCategories, 10000);
        return () => clearInterval(intervalId);

    }, []);

    return (
        <div className="relative">
            <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-2 pl-4 pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer"
            >
                <option value="All Categories">All Categories</option>
                {categories.map((cat) => (
                    <option key={cat.name} value={cat.name}>
                        {cat.name} {cat.count > 0 ? `(${cat.count})` : ''}
                    </option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </div>
    );
};

export default CategoryFilter;
