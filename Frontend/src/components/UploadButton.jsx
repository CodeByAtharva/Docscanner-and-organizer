const UploadButton = () => {
    return (
        <button
            onClick={() => alert("Upload functionality coming in Issue #9")}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 gap-2 font-medium"
        >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Upload Document</span>
        </button>
    );
};

export default UploadButton;
