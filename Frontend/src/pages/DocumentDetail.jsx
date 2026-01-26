import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DocumentViewer from '../components/DocumentViewer';
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
                const response = await fetch(`http://localhost:8001/api/documents/${id}?user_id=${userId}`);

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

    const fileUrl = `http://localhost:8001/api/documents/file/${document.id}?user_id=${localStorage.getItem('user_id') || 'test_user_id'}`;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
            <Navbar />
            <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
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
                            <CategorySelector currentCategory={document.category} />
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                    {/* Left Column: File Viewer */}
                    <div className="flex flex-col h-full">
                        <DocumentViewer
                            fileUrl={fileUrl}
                            type={document.content_type}
                            title={document.title}
                        />
                    </div>

                    {/* Right Column: Extracted Text */}
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
