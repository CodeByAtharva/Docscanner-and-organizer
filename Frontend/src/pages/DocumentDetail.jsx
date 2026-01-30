import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ExtractedTextView from '../components/ExtractedTextView';
import CategorySelector from '../components/CategorySelector';

// Simple Navbar placeholder if we don't have the main one accessible/exported easily yet.
// Ideally usage: <Navbar /> if it exists. 
// Assuming it's in ../components/Navbar based on project structure.
import Navbar from '../components/Navbar';

const DocumentDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [document, setDocument] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDocument = async () => {
            try {
                setLoading(true);
                const userId = localStorage.getItem('user_id') || 'test_user_id';
                const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/documents/${id}?user_id=${userId}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch document details');
                }

                const data = await response.json();
                setDocument(data.document);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchDocument();
        }
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this document? This action cannot be undone.")) {
            try {
                const userId = localStorage.getItem('user_id') || 'test_user_id';
                const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/documents/${id}?user_id=${userId}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    navigate('/dashboard');
                } else {
                    const data = await response.json();
                    alert(`Failed to delete: ${data.detail || 'Unknown error'}`);
                }
            } catch (err) {
                console.error("Error deleting document:", err);
                alert("An error occurred while deleting the document.");
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error || !document) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
                <div className="text-red-500 mb-4 text-lg font-medium">{error || 'Document not found'}</div>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                >
                    Back to Dashboard
                </button>
            </div>
        );
    }

    const fileUrl = `${import.meta.env.VITE_BACKEND_BASE_URL}/api/documents/file/${document.id}?user_id=${localStorage.getItem('user_id') || 'test_user_id'}`;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
            <Navbar />
            <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 pt-24">
                {/* Header */}
                <div className="md:flex md:items-center md:justify-between mb-8">
                    <div className="flex-1 min-w-0">
                        <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
                            {document.title}
                        </h2>
                        <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                            <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                                <span className="mr-1.5">📅</span>
                                {new Date(document.date).toLocaleDateString()}
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                                <span className="mr-1.5">💾</span>
                                {(document.file_size / 1024).toFixed(1)} KB
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 flex md:mt-0 md:ml-4">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                        >
                            Back
                        </button>
                        <div className="ml-3">
                            <CategorySelector
                                documentId={document.id}
                                currentCategory={document.category}
                                onCategoryUpdate={(newCategory) => setDocument({ ...document, category: newCategory })}
                            />
                        </div>
                        <button
                            onClick={handleDelete}
                            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            Delete
                        </button>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="h-full">
                    {/* Full Width: Extracted Text */}
                    <div className="flex flex-col h-full">
                        <ExtractedTextView
                            text={document.extracted_text}
                            status={document.status}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentDetail;
