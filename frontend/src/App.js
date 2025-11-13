import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout'; // Import Layout component
import './App.css';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useApiErrorHandler } from './hooks/useApiErrorHandler';

// Lazy-loaded pages
const HomePage = lazy(() => import('./pages/HomePage'));
const ListingDetailPage = lazy(() => import('./pages/ListingDetailPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const CreateListingPage = lazy(() => import('./pages/CreateListingPage'));
const EditListingPage = lazy(() => import('./pages/EditListingPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));


function App() {
  useApiErrorHandler(); // Initialize global API error handling

  return (
    <Router>
      <Layout> {/* Wrap content with Layout component */}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <Suspense fallback={<div className="flex justify-center items-center h-screen"><div>Loading...</div></div>}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/listings/:id" element={<ListingDetailPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            
            {/* Admin Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin/dashboard" element={<ProtectedRoute />}>
              <Route path="" element={<AdminDashboard />} />
            </Route>
            <Route path="/admin/new" element={<ProtectedRoute />}>
              <Route path="" element={<CreateListingPage />} />
            </Route>
            <Route path="/admin/edit/:id" element={<ProtectedRoute />}>
              <Route path="" element={<EditListingPage />} />
            </Route>

          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
}

export default App;
