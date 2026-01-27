
import React, { useState, useRef } from 'react';
import { X, Upload, FileText, Image as ImageIcon, AlertCircle, CheckCircle } from 'lucide-react';

const UploadModal = ({ isOpen, onClose, onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const fileInputRef = useRef(null);

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        validateAndSetFile(selectedFile);
    };

    const validateAndSetFile = (selectedFile) => {
        setError(null);
        setSuccess(false);

        if (!selectedFile) return;

        const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        if (!validTypes.includes(selectedFile.type)) {
            setError('Invalid file type. Please upload an image (JPG, PNG) or a PDF.');
            return;
        }

        if (selectedFile.size > 10 * 1024 * 1024) { // 10MB
            setError('File size too large. Maximum 10MB allowed.');
            return;
        }

        setFile(selectedFile);

        if (selectedFile.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(selectedFile);
        } else {
            setPreview(null);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        validateAndSetFile(droppedFile);
    };

    const handleSubmit = async () => {
        if (!file) return;

        setUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('file', file);

        const userId = localStorage.getItem('user_id');
        if (!userId) {
            setError("User not authenticated");
            setUploading(false);
            return;
        }
        formData.append('user_id', userId);

        try {
            const response = await fetch('http://localhost:8000/api/documents', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Upload failed');
            }

            setSuccess(true);
            setFile(null);
            setPreview(null);
            if (onUploadSuccess) onUploadSuccess();

            // Auto close after success? Or let user close.
            // Let's keep it open to show success message briefly or let user close.
            setTimeout(() => {
                onClose();
                setSuccess(false); // Reset for next time
            }, 2000);

        } catch (err) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleClose = () => {
        if (uploading) return;
        onClose();
        setFile(null);
        setPreview(null);
        setError(null);
        setSuccess(false);
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900">Upload Document</h3>
                    <button
                        onClick={handleClose}
                        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                        disabled={uploading}
                    >
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {!file ? (
                        <div
                            className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-colors"
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                        >
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4 text-purple-600">
                                <Upload size={24} />
                            </div>
                            <p className="text-sm font-medium text-gray-900">Click to upload or drag and drop</p>
                            <p className="text-xs text-gray-500 mt-1">PDF, PNG, JPG (max 10MB)</p>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept=".pdf,.png,.jpg,.jpeg"
                            />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center mr-3 overflow-hidden flex-shrink-0">
                                    {preview ? (
                                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <FileText size={20} className="text-gray-500" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                                    <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                                <button
                                    onClick={() => { setFile(null); setPreview(null); }}
                                    className="p-1 hover:bg-gray-200 rounded-full text-gray-400 hover:text-red-500"
                                    disabled={uploading}
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            {uploading && (
                                <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4 dark:bg-gray-700">
                                    <div className="bg-purple-600 h-1.5 rounded-full animate-pulse w-full"></div>
                                </div>
                            )}
                        </div>
                    )}

                    {error && (
                        <div className="flex items-center gap-2 mt-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                            <AlertCircle size={16} />
                            <span>{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className="flex items-center gap-2 mt-4 text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                            <CheckCircle size={16} />
                            <span>Upload successful!</span>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                        disabled={uploading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!file || uploading}
                        className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-all flex items-center gap-2
              ${!file || uploading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-sm'
                            }`}
                    >
                        {uploading ? 'Uploading...' : 'Upload File'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UploadModal;
