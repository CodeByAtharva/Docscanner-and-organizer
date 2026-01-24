const DocumentCard = ({ title, category, date, previewColor }) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100 dark:border-gray-700 overflow-hidden group cursor-pointer">
            <div className={`h-32 bg-gradient-to-br ${previewColor || 'from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30'} flex items-center justify-center relative overflow-hidden`}>
                {/* Placeholder Preview Icon */}
                <svg className="h-12 w-12 text-gray-400 dark:text-gray-500 opacity-50 group-hover:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div className="absolute top-2 right-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-white/80 dark:bg-gray-900/80 text-gray-800 dark:text-gray-200 backdrop-blur-sm">
                        PDF
                    </span>
                </div>
            </div>
            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate" title={title}>
                    {title}
                </h3>
                <div className="mt-1 flex items-center justify-between">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
                        {category}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        {date}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default DocumentCard;
