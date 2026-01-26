import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DocumentList from '../components/DocumentList';
import UploadButton from '../components/UploadButton';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import UploadModal from '../components/UploadModal';

const Dashboard = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All Categories');
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    const handleUploadSuccess = () => {
        // Refresh document list here if needed (e.g. valid refetch or context)
        // For now just console log, user will see success in modal.
        console.log("Upload successful, refreshing list...");
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <Navbar />

            <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 animate-fade-in-up">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Documents</h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage and organize your scanned files</p>
                    </div>
                    <UploadButton onClick={() => setIsUploadModalOpen(true)} />
                </div>

                {/* Controls Section */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 mb-8">
                    <div className="flex flex-col md:flex-row gap-4 justify-between">
                        <SearchBar query={searchQuery} setQuery={setSearchQuery} />
                        <div className="flex gap-4">
                            <CategoryFilter category={selectedCategory} setCategory={setSelectedCategory} />
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <DocumentList searchQuery={searchQuery} selectedCategory={selectedCategory} />
            </main>

            <UploadModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                onUploadSuccess={handleUploadSuccess}
            />

            <Footer />
        </div>
    );
};

export default Dashboard;
