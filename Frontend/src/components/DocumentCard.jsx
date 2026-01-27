import { useNavigate } from 'react-router-dom';

const DocumentCard = ({ id, title, category, date, preview, status }) => {
    const navigate = useNavigate();

    const formattedDate = new Date(date).toLocaleDateString();

    // Generate a consistent gradient based on category or ID
    const getGradient = (cat) => {
        const gradients = {
            'Invoice': 'from-blue-500 to-indigo-600',
            'Receipt': 'from-emerald-400 to-teal-600',
            'Contract': 'from-purple-500 to-violet-600',
            'Note': 'from-amber-400 to-orange-500',
            'Letter': 'from-pink-500 to-rose-600',
            'Form': 'from-cyan-400 to-blue-500',
            'Other': 'from-gray-400 to-gray-600',
            'Uncategorized': 'from-slate-400 to-slate-500',
        };
        return gradients[cat] || gradients['Other'];
    };

    const gradientClass = getGradient(category);

    return (
        <div
            onClick={() => navigate(`/documents/${id}`)}
            className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 cursor-pointer overflow-hidden flex flex-col h-full transform hover:-translate-y-1"
        >
            {/* Thumbnail Section */}
            <div className={`h-40 relative overflow-hidden bg-gradient-to-br ${gradientClass} p-4 flex flex-col justify-between`}>

                {/* Abstract Pattern overlay */}
                <div className="absolute inset-0 opacity-10 bg-white"></div>

                {/* Top Badge */}
                <div className="flex justify-between items-start z-10">
                    <div className="bg-white/20 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider">
                        {category}
                    </div>
                    {status === 'processing' && (
                        <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-2 py-1 rounded-full border border-white/10">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></div>
                            <span className="text-[10px] font-medium text-white/90">Processing</span>
                        </div>
                    )}
                </div>

                {/* Central Icon or Mini Preview */}
                <div className="flex-1 flex items-center justify-center z-10">
                    {preview && status === 'completed' ? (
                        <div className="w-full h-24 bg-white/90 dark:bg-gray-900/90 rounded-lg shadow-lg p-3 transform group-hover:scale-105 transition-transform duration-300 relative overflow-hidden">
                            {/* Mini formatted text look */}
                            <div className="space-y-1.5 opacity-60">
                                <div className="h-1.5 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                                <div className="h-1.5 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
                                <div className="h-1.5 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
                                <div className="h-1.5 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                            </div>
                            <p className="mt-2 text-[8px] text-gray-800 dark:text-gray-200 line-clamp-3 font-mono leading-tight">
                                {preview}
                            </p>
                        </div>
                    ) : (
                        <svg className="h-16 w-16 text-white/80 drop-shadow-md transform group-hover:rotate-6 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    )}
                </div>
            </div>

            {/* Content Section */}
            <div className="p-4 flex-1 flex flex-col justify-between bg-white dark:bg-gray-800">
                <div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" title={title}>
                        {title}
                    </h3>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 font-medium flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        {formattedDate}
                    </p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    <span className="text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
                        {category}
                    </span>
                    <div className="w-6 h-6 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 transition-colors">
                        <svg className="w-3 h-3 text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentCard;
