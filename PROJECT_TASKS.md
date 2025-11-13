# Project Tasks

This file tracks the high-level tasks for each phase of the project.

---

## Phase 1: Planning & Design

- [x] Define Core Features
- [x] Choose Technology Stack
- [x] Create Wireframes
- [x] Create Mockups

---

## Phase 2: Back-End Development

- [x] Set Up Server Environment
- [x] Design Database Schema
- [x] Build the API Endpoints
- [x] Handle Media Uploads
- [x] Build the Admin Panel

---

## Phase 3: Front-End Development

- [x] Set Up React Project
- [x] Build Reusable Components
- [x] Create Pages (Views)
- [x] Add Styling

---

## Phase 4: Testing & Deployment

- [x] Manual Testing
- [ ] Deploy Database
- [ ] Deploy Back-End
- [ ] Deploy Front-End

---

## Phase 5: Refinements & Missing Features

- [x] **Admin Panel UI:** Build the frontend for admin login and listing management.
- [x] **Full Listing Details:** Display all data on the detail page (description, amenities, map).
- [x] **Price Range Filter:** Add a filter for price range to the search functionality.
- [x] **Pagination:** Implement a "Load More" button or page numbers for the listings.
- [x] **UI Polish:** Complete a final styling pass to remove wireframe look and feel.

---

## Phase 6: Backend Refactoring & Security Audit

- [x] **Secure JWT Secret:** Move the hardcoded JWT secret to a `.env` file.
- [x] **Protect Admin Routes:** Implement authentication middleware to secure all admin API endpoints.
- [x] **Remove Public Admin Registration:** Delete the temporary `/api/admin/register` endpoint.
- [x] **Refactor Duplicate Code:** Consolidate listing creation/update logic between admin and public controllers.
- [x] **Standardize Error Handling:** Prevent leaking detailed error objects to the client.
- [x] **Centralize Path Handling:** Manage file path normalization in a single location.

---

## Phase 7: Frontend Refactoring & UX Improvements

- [x] **Global Error Handling:** Implement a global system for catching and displaying API errors to the user (e.g., toasts).
- [x] **Create Layout Component:** Abstract repeating page structure (Navbar, Footer, container) into a reusable Layout component.
- [x] **Use Environment Variables:** Move hardcoded URLs (API base, image paths) to a `.env` file for easier configuration.
- [x] **Remove Redundant Code:** Clean up unused API functions and other obsolete code.
- [x] **Styled Modals & Confirmations:** Replace native browser `alert()` and `confirm()` with styled modals.
- [x] **Admin Dashboard Pagination:** Add pagination to the admin listings table to handle large datasets.
- [x] **Dynamic Filter Options:** Make search filter options (e.g., property types) dynamic if needed.

---

## Phase 8: Advanced Security & Performance Optimizations

### Critical Vulnerabilities:

- [x] **Fix Mass Assignment & Stored XSS:** Refactor `listingController.js` to manually pick and validate expected fields from `req.body`. Sanitize all string inputs using a library like `dompurify` before storing them to prevent Stored XSS.
- [x] **Secure File Uploads:** (SKIPPED - User prefers public accessibility for all uploaded files.)

### High-Priority Vulnerabilities:

- [x] **Prevent Information Disclosure:** Modify `adminLogin` in `adminController.js` to return only a curated user object, excluding the password hash and other sensitive data.
- [x] **Add Essential Security Middleware:** Add and configure `helmet()` for security headers and `express-rate-limit` to protect authentication routes from brute-force attacks in `server.js`.

### Medium-Priority Vulnerabilities:

- [x] **Secure Password Resets:** Hash password reset tokens before storing them in the database in `adminController.js`. When verifying, compare the user-provided token with the stored hash.
- [x] **Strengthen CORS Policy:** (SKIPPED - User prefers to defer this task for now.)

### Low-Priority Vulnerabilities:

- [x] **Increase Hashing Strength:** Increase the bcrypt work factor from 8 to at least 10 (12 is recommended) in `models/Admin.js`.
- [x] **Implement Password Complexity:** Add validation in `adminController.js` during password reset (and potentially registration) to enforce minimum password complexity rules (e.g., length, special characters, numbers).