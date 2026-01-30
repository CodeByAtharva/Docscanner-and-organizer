import React, { useState, useEffect } from 'react';
import DocumentCard from './DocumentCard';

const DocumentList = ({ searchQuery = '', selectedCategory = 'All Categories', refreshTrigger = 0, onDocumentsLoaded }) => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL || "https://docscanner-and-organizer.onrender.com";

    const fetchDocuments = async (isBackground = false) => {
        try {
            if (!isBackground) setLoading(true);
            const userId = localStorage.getItem('user_id');

            if (!userId) {
                // Should ideally be handled by RequireAuth, but safety check
                setDocuments([]);
                setLoading(false);
                return;
            }

            let url = `${API_BASE_URL}/api/documents?user_id=${userId}`;

            // If searching, search API takes precedence (global search)
            if (searchQuery) {
                url = `${API_BASE_URL}/api/search?q=${encodeURIComponent(searchQuery)}&user_id=${userId}`;
            }
            // If not searching but filtering by category
            else if (selectedCategory && selectedCategory !== 'All Categories') {
                url = `${API_BASE_URL}/api/documents?user_id=${userId}&category=${encodeURIComponent(selectedCategory)}`;
            }

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Failed to fetch documents');
            }

            const data = await response.json();

            if (searchQuery) {
                // Map search results to document format
                // Search results have 'snippet' which we use as 'preview'
                const searchResults = data.results.map(result => ({
                    ...result,
                    preview: result.snippet // Use snippet for preview
                }));
                setDocuments(searchResults);
                if (onDocumentsLoaded) onDocumentsLoaded(searchResults.length);
            } else {
                setDocuments(data.documents);
                if (onDocumentsLoaded) onDocumentsLoaded(data.count || data.documents.length);
            }

            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            if (!isBackground) setLoading(false);
        }
    };

    useEffect(() => {
        // Debounce search
        const timerId = setTimeout(() => {
            fetchDocuments();
        }, 300);

        return () => clearTimeout(timerId);
    }, [searchQuery, selectedCategory, refreshTrigger]); // Added selectedCategory to dependencies

    // Polling logic: Check every 5 seconds if any document is processing, ONLY if not searching
    useEffect(() => {
        if (searchQuery) return; // Don't poll while searching to avoid overwriting results

        const hasProcessing = documents.some(doc => doc.status === 'processing');
        let intervalId;

        if (hasProcessing) {
            intervalId = setInterval(() => {
                console.log("Polling for updates...");
                fetchDocuments(true);
            }, 5000);
        }

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [documents, searchQuery]);

    // No client-side filtering needed anymore
    const filteredDocuments = documents;

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
