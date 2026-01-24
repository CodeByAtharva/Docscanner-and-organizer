const CategoryFilter = ({ category, setCategory }) => {
    return (
        <div className="relative">
            <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-2 pl-4 pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer"
            >
                <option value="All Categories">All Categories</option>
                <option value="Finance">Finance</option>
                <option value="Legal">Legal</option>
                <option value="Health">Health</option>
                <option value="Personal">Personal</option>
                <option value="Education">Education</option>
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
