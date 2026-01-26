import React from 'react';

const ExtractedTextView = ({ text, status }) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col h-full min-h-[500px]">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                <h3 className="font-semibold text-gray-700 dark:text-gray-200">Extracted Text</h3>
            </div>
            <div className="flex-1 p-6 overflow-auto">
                {status === 'processing' ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-3">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                        <p>Processing text extraction...</p>
                    </div>
                ) : status === 'failed' ? (
                    <div className="flex flex-col items-center justify-center h-full text-red-500">
                        <svg className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p>Text extraction failed.</p>
                    </div>
                ) : !text ? (
                    <div className="flex items-center justify-center h-full text-gray-400 italic">
                        No text found.
                    </div>
                ) : (
                    <pre className="whitespace-pre-wrap font-mono text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {text}
                    </pre>
                )}
            </div>
        </div>
    );
};

export default ExtractedTextView;
