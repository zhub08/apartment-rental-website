import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useNotification } from '../context/NotificationContext';

const ResetPasswordPage = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // Add state for password visibility
    const { token } = useParams();
    const navigate = useNavigate();
    const { addNotification } = useNotification();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            addNotification('Passwords do not match.', 'error');
            return;
        }
        try {
            const response = await api.post(`/admin/reset-password/${token}`, { password });
            addNotification(response.data.message, 'success');
            navigate('/login');
        } catch (error) {
            // Error is handled globally by the API interceptor
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-900">Reset Password</h2>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="relative">
                        <label htmlFor="password" name="password" className="block text-sm font-medium text-gray-700">
                            New Password
                        </label>
                        <div className="mt-1">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'} // Toggle input type
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-600 hover:text-gray-800 focus:outline-none"
                                style={{ top: '1.75rem' }} // Adjust position to align with input
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.981 8.75C4.45 10.007 5.444 11.71 6.75 12.5c1.306.79 2.87 1.25 4.375 1.25s3.069-.46 4.375-1.25c1.306-.79 2.299-2.493 2.768-3.75M9.75 12a2.25 2.25 0 114.5 0 2.25 2.25 0 01-4.5 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75c-3.069 0-5.943-.714-8.375-1.971M12 5.25c3.069 0 5.943.714 8.375 1.971" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="relative">
                        <label htmlFor="confirm-password" name="confirm-password" className="block text-sm font-medium text-gray-700">
                            Confirm New Password
                        </label>
                        <div className="mt-1">
                            <input
                                id="confirm-password"
                                name="confirm-password"
                                type={showPassword ? 'text' : 'password'} // Toggle input type
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-600 hover:text-gray-800 focus:outline-none"
                                style={{ top: '1.75rem' }} // Adjust position to align with input
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.981 8.75C4.45 10.007 5.444 11.71 6.75 12.5c1.306.79 2.87 1.25 4.375 1.25s3.069-.46 4.375-1.25c1.306-.79 2.299-2.493 2.768-3.75M9.75 12a2.25 2.25 0 114.5 0 2.25 2.25 0 01-4.5 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75c-3.069 0-5.943-.714-8.375-1.971M12 5.25c3.069 0 5.943.714 8.375 1.971" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Reset Password
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
