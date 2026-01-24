import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { auth } from '../firebase/config';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const SignupForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            navigate('/login');
        } catch (err) {
            console.error(err.code, err.message);
            switch (err.code) {
                case 'auth/email-already-in-use':
                    setError('This email is already registered.');
                    break;
                case 'auth/invalid-email':
                    setError('Invalid email address.');
                    break;
                case 'auth/weak-password':
                    setError('Password must be at least 6 characters.');
                    break;
                default:
                    setError('Failed to create an account. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md backdrop-blur-xl bg-white/70 dark:bg-gray-800/50 rounded-2xl shadow-2xl overflow-hidden border border-white/20 dark:border-gray-700/30">
            <div className="px-8 py-10">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                        Create Account
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">
                        Join us to organize your digital life
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">
                            Email Address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white/50 dark:bg-gray-900/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transaction-all duration-200"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 pl-1">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="new-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white/50 dark:bg-gray-900/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transaction-all duration-200"
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform hover:-translate-y-0.5 transition-all duration-200 ${loading ? 'opacity-70 cursor-not-allowed transform-none' : ''}`}
                        >
                            {loading ? 'Creating account...' : 'Sign Up'}
                        </button>
                    </div>
                </form>

                <div className="mt-8 text-center border-t border-gray-200 dark:border-gray-700/50 pt-6">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Already have an account?{' '}
                        <Link to="/login" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors duration-200">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignupForm;
