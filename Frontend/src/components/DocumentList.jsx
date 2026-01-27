import React, { useState, useEffect } from 'react';
import DocumentCard from './DocumentCard';

const DocumentList = ({ searchQuery = '', selectedCategory = 'All Categories' }) => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDocuments = async () => {
        try {
            setLoading(true);
            // Using a dummy user_id or one from context if available in future
            const userId = localStorage.getItem('user_id') || 'test_user_id';
            const response = await fetch(`http://localhost:8000/api/documents?user_id=${userId}`);

            if (!response.ok) {
                throw new Error('Failed to fetch documents');
            }

            const data = await response.json();
            setDocuments(data.documents);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();

        // Setup polling or refresh mechanism could go here
        // For now, simpler refresh on mount
    }, []);

    // Filter documents based on query and category (Frontend filtering for now as per requirements)
    const filteredDocuments = documents.filter((doc) => {
        const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All Categories' || doc.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm h-64 animate-pulse p-4">
                        <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-10 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-200 dark:border-red-800/30">
                <p className="text-red-500 dark:text-red-400">Error loading documents: {error}</p>
                <button onClick={fetchDocuments} className="mt-4 text-sm text-indigo-600 hover:text-indigo-500 font-medium">Try again</button>
            </div>
        );
    }

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
