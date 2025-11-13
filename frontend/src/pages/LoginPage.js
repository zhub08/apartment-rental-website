import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { adminLogin } from '../services/api';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Add state for password visibility
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await adminLogin({ email, password });
      // Assuming the API returns a token
      localStorage.setItem('adminToken', response.data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      // Error is handled globally
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-20">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h1 className="text-2xl font-bold text-center mb-6">Admin Login</h1>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-6 relative">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type={showPassword ? 'text' : 'password'} // Toggle input type
            placeholder="******************"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-600 hover:text-gray-800 focus:outline-none"
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
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            type="submit"
          >
            Sign In
          </button>
        </div>
        <div className="text-center mt-4">
            <Link to="/forgot-password"
            className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
            >
                Forgot password?
            </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
