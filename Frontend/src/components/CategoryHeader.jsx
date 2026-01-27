
const CategoryHeader = ({ category, count, onClear }) => {
    if (!category || category === "All Categories") return null;

    return (
        <div className="flex items-center justify-between bg-indigo-50 dark:bg-indigo-900/20 px-6 py-4 rounded-xl border border-indigo-100 dark:border-indigo-800/30 mb-8 animate-fade-in">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-800/50 rounded-lg">
                    <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{category}</h2>
                    <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                        {count} {count === 1 ? 'document' : 'documents'} found
                    </p>
                </div>
            </div>
            <button
                onClick={onClear}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm transition-all duration-200 hover:shadow"
            >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear Filter
            </button>
        </div>
    );
};

export default CategoryHeader;
