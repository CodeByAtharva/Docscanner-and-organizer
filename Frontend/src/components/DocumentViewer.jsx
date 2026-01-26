import React from 'react';

const DocumentViewer = ({ fileUrl, type, title }) => {
    // If we're on localhost, we might need absolute URL, but relative usually works if proxy or same origin
    // For now assume full URL or relative path handled by backend/frontend setup
    // Since backend is on port 8001 and frontend 5173, we need full URL if not proxied.
    // Let's assume fileUrl passed in is the endpoint URL.

    const isPdf = type === 'application/pdf' || (title && title.toLowerCase().endsWith('.pdf'));

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col h-full min-h-[500px]">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
                <h3 className="font-semibold text-gray-700 dark:text-gray-200">Original Document</h3>
                <a
                    href={fileUrl}
                    download
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-900/50"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <svg className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download
                </a>
            </div>
            <div className="flex-1 bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4 overflow-hidden">
                {isPdf ? (
                    <iframe
                        src={`${fileUrl}#toolbar=0`}
                        className="w-full h-full rounded-lg border border-gray-200 dark:border-gray-700"
                        title="PDF Viewer"
                    ></iframe>
                ) : (
                    <div className="relative w-full h-full flex items-center justify-center">
                        <img
                            src={fileUrl}
                            alt={title}
                            className="max-w-full max-h-full object-contain rounded-lg shadow-sm"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default DocumentViewer;
