import React, { useState } from 'react';
import api from '../services/api';
import { useNotification } from '../context/NotificationContext';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const { addNotification } = useNotification();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/admin/forgot-password', { email });
            addNotification(response.data.message, 'success');
        } catch (error) {
            const message = error.response?.data?.error || 'An error occurred.';
            addNotification(message, 'error');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-900">Forgot Password</h2>
                <p className="text-center text-sm text-gray-600">
                    Enter your email address and we will send you a link to reset your password.
                </p>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email address
                        </label>
                        <div className="mt-1">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Send Password Reset Link
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
