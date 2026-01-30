import React, { useState, useEffect } from 'react';

const CategorySelector = ({ documentId, currentCategory, onCategoryUpdate }) => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(currentCategory || 'Uncategorized');
    const [loading, setLoading] = useState(false);

    const API_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL || "https://docscanner-and-organizer.onrender.com";

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const userId = localStorage.getItem('user_id') || 'test_user_id';
                const response = await fetch(`${API_BASE_URL}/api/documents/categories?user_id=${userId}`);
                if (response.ok) {
                    const data = await response.json();
                    // Extract just names for the selector
                    setCategories(data.categories.map(c => c.name));
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        setSelectedCategory(currentCategory || 'Uncategorized');
    }, [currentCategory]);

    const handleChange = async (e) => {
        const newCategory = e.target.value;
        setSelectedCategory(newCategory);
        setLoading(true);

        try {
            const userId = localStorage.getItem('user_id') || 'test_user_id';
            const response = await fetch(`${API_BASE_URL}/api/documents/${documentId}/category?user_id=${userId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ category: newCategory }),
            });

            if (response.ok) {
                if (onCategoryUpdate) {
                    onCategoryUpdate(newCategory);
                }
            } else {
                console.error("Failed to update category");
                // Revert on failure
                setSelectedCategory(currentCategory);
            }
        } catch (error) {
            console.error("Error updating category:", error);
            setSelectedCategory(currentCategory);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative">
            <select
                className={`block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                value={selectedCategory}
                onChange={handleChange}
                disabled={loading}
            >
                {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                ))}
            </select>
            {loading && (
                <div className="absolute inset-y-0 right-8 flex items-center">
                    <div className="animate-spin h-4 w-4 border-2 border-indigo-500 rounded-full border-t-transparent"></div>
                </div>
            )}
        </div>
    );
};

export default CategorySelector;
