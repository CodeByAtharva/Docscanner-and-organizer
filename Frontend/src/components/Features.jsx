const features = [
    {
        name: 'AI Text Extraction',
        description: 'Instantly extract text from images and PDFs using advanced vision models. No more manual typing.',
        icon: (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        ),
        gradient: 'from-blue-500 to-cyan-500'
    },
    {
        name: 'Smart Categorization',
        description: 'Automatically sorts your documents into categories like Invoices, Receipts, and Contracts.',
        icon: (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
        ),
        gradient: 'from-purple-500 to-pink-500'
    },
    {
        name: 'Full-Text Search',
        description: 'Find any document instantly by searching for keywords contained within the extracted text.',
        icon: (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        ),
        gradient: 'from-amber-500 to-orange-500'
    },
    {
        name: 'Secure Storage',
        description: 'Your documents are encrypted and stored securely, accessible only by you.',
        icon: (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
        ),
        gradient: 'from-emerald-500 to-green-500'
    },
    {
        name: 'Cloud Sync',
        description: 'Access your documents from any device, anywhere. Your data is always in sync.',
        icon: (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
        ),
        gradient: 'from-indigo-500 to-blue-500'
    },
    {
        name: 'Dark Mode',
        description: 'Easy on the eyes day or night. Switch seamlessly between light and dark themes.',
        icon: (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
        ),
        gradient: 'from-gray-700 to-gray-900'
    }
];

const Features = () => {
    return (
        <div className="py-24 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-base text-indigo-600 dark:text-indigo-400 font-semibold tracking-wide uppercase">Features</h2>
                    <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                        Everything you need
                    </p>
                    <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 mx-auto">
                        Powerful tools to organize your digital life.
                    </p>
                </div>

                <div className="mt-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature) => (
                            <div key={feature.name} className="relative group bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
                                <div className={`absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-br ${feature.gradient} opacity-20 blur-2xl rounded-full group-hover:opacity-40 transition-opacity`}></div>

                                <div className={`inline-flex items-center justify-center p-3 bg-gradient-to-br ${feature.gradient} text-white rounded-xl shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    {feature.icon}
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                                    {feature.name}
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Features;
