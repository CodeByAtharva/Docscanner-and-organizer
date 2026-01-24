import DocumentCard from './DocumentCard';

// Temporary mock data until backend is ready
const mockDocuments = [
    { id: 1, title: 'Invoice #1023', category: 'Finance', date: 'Oct 24, 2023', previewColor: 'from-emerald-100 to-emerald-200' },
    { id: 2, title: 'Contract Agreement', category: 'Legal', date: 'Oct 22, 2023', previewColor: 'from-amber-100 to-amber-200' },
    { id: 3, title: 'Medical Report', category: 'Health', date: 'Oct 20, 2023', previewColor: 'from-rose-100 to-rose-200' },
    { id: 4, title: 'Utility Bill', category: 'Personal', date: 'Oct 18, 2023', previewColor: 'from-cyan-100 to-cyan-200' },
];

const DocumentList = ({ searchQuery = '', selectedCategory = 'All Categories' }) => {
    // Filter documents based on query and category
    const filteredDocuments = mockDocuments.filter((doc) => {
        const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All Categories' || doc.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    if (filteredDocuments.length === 0) {
        return (
            <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No documents found</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {searchQuery || selectedCategory !== 'All Categories' ? "Try adjusting your search or filter." : "Get started by uploading a new document."}
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDocuments.map((doc) => (
                <DocumentCard key={doc.id} {...doc} />
            ))}
        </div>
    );
};

export default DocumentList;
