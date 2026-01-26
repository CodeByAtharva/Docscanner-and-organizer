const DocumentCard = ({ title, category, date, preview, status }) => {
    // Format date if needed, assuming ISO string from backend
    const formattedDate = new Date(date).toLocaleDateString();

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100 dark:border-gray-700 overflow-hidden group cursor-pointer flex flex-col h-full">
            <div className={`h-32 bg-gray-100 dark:bg-gray-700 flex items-center justify-center relative overflow-hidden p-4`}>
                {/* Preview Text or Icon */}
                {preview ? (
                    <p className="text-[10px] text-gray-500 overflow-hidden break-words w-full h-full leading-tight opacity-70">
                        {preview}
                    </p>
                ) : (
                    <svg className="h-12 w-12 text-gray-400 dark:text-gray-500 opacity-50 group-hover:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                )}

                <div className="absolute top-2 right-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-white/80 dark:bg-gray-900/80 text-gray-800 dark:text-gray-200 backdrop-blur-sm shadow-sm">
                        PDF
                    </span>
                </div>
                {status === 'processing' && (
                    <div className="absolute bottom-2 left-2 right-2">
                        <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 animate-pulse w-full"></div>
                        </div>
                    </div>
                )}
            </div>
            <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate mb-auto" title={title}>
                    {title}
                </h3>
                <div className="mt-3 flex items-center justify-between">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
                        {category}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formattedDate}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default DocumentCard;
