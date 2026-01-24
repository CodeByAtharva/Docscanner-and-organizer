import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { auth } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

const Hero = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    return (
        <div className="relative overflow-hidden bg-gray-50 dark:bg-gray-900 pt-32 pb-32 space-y-24">
            {/* Background Gradients */}
            <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
                <h1 className="text-5xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-6xl md:text-7xl mb-6">
                    <span className="block">Transform your documents</span>
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                        into digital assets
                    </span>
                </h1>
                <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300 mx-auto">
                    Unlock the power of your physical documents. Automatically extract text, categorize, and search through your scanned files with our AI-powered privacy platform.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                    {user ? (
                        <Link
                            to="/dashboard"
                            className="inline-flex items-center justify-center px-8 py-3 dark:text-white border border-transparent text-base font-medium rounded-full text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10 shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 transform hover:-translate-y-1"
                        >
                            Go to Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                to="/signup"
                                className="inline-flex items-center justify-center px-8 py-3 dark:text-white border border-transparent text-base font-medium rounded-full text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10 shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 transform hover:-translate-y-1"
                            >
                                Get Started Free
                            </Link>
                            <Link
                                to="/login"
                                className="inline-flex items-center justify-center px-8 py-3 border border-gray-300 dark:border-gray-600 dark:text-gray-200 text-base font-medium rounded-full text-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 md:py-4 md:text-lg md:px-10 shadow-sm hover:shadow-md transition-all duration-300"
                            >
                                Log in
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Hero;
