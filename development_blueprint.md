# Development Blueprint: Apartment Sales & Rental Website

This document outlines the complete development plan for this project, broken down into four distinct phases.

---

## Phase 1: Planning & Design (The Blueprint)

**Objective:** To establish a clear project plan, define all features, and create a complete visual design before starting development.

**Tasks:**

1.  **Define Core Features:**
    *   **Public (User-Facing):**
        *   **Homepage:** Features top listings, search bar.
        *   **Listings Page:** A gallery of all apartments with search (by location) and filtering (by price, rent/sale, # of bedrooms).
        *   **Listing Detail Page:** Includes title/address, photo gallery, embedded video player, price/rent, detailed description, and a prominent contact phone number.
    *   **Admin (Private):**
        *   Secure login page.
        *   A dashboard to create, edit, and delete apartment listings.
        *   A form to upload photos and add a video link.

2.  **Choose Technology Stack:**
    *   **Front-End:** React.js
    *   **Back-End:** Node.js with Express.js
    *   **Database:** MongoDB with Mongoose
    *   **Media Storage:** Local File System (for photos)
    *   **Video Hosting:** YouTube/Vimeo (for videos)

3.  **Design the User Experience (UX/UI):**
    *   **Wireframes:** Create simple, black-and-white layouts for each page.
    *   **Mockups:** Develop high-fidelity, full-color designs using a tool like Figma.
    *   **Mobile-First Approach:** Design for mobile devices first, then adapt for desktops.

---

## Phase 2: Back-End Development (The Engine)

**Objective:** To build the server, database, and API that will power the website, adhering to a modular structure for maintainability and file size limits (max 600 lines per file).

**Architectural Approach:**

*   **`server.js` (or `index.js`):** Main entry point, responsible for server initialization, database connection, and loading middleware/routes. Kept minimal.
*   **`routes/` directory:** Contains files defining API endpoints (e.g., `routes/listings.js`). These files will delegate logic to controllers.
*   **`controllers/` directory:** Houses the business logic for each route (e.g., `controllers/listingController.js`).
*   **`models/` directory:** Stores Mongoose schema definitions (e.g., `models/Listing.js`).

**Tasks:**

1.  **Set Up Server Environment:**
    *   Install Node.js, npm, and `nodemon`.
    *   Initialize the project and install `express`, `mongoose`, `dotenv`, and `cors`.

2.  **Design Database Schema (`models/`):**
    *   Define the `Listing` schema in Mongoose with the following fields: `title`, `description`, `address`, `price`, `bedrooms`, `bathrooms`, `squareFootage`, `propertyType`, `listingType`, `images`, `amenities`, and `contactInfo` (with `name`, `email`, and `phone`).

3.  **Build the API Endpoints (`routes/` and `controllers/`):** (DONE)
    *   `POST /api/listings`: Create a new listing.
    *   `GET /api/listings`: Get all listings.
    *   `GET /api/listings/:id`: Get a single listing.
    *   `PUT /api/listings/:id`: Update a listing.
    *   `DELETE /api/listings/:id`: Delete a listing.

4.  **Handle Media Uploads:**
    *   Implement photo uploads to the local file system using `multer`.
    *   Save the file path to the database.
    *   For videos, save the YouTube/Vimeo embed link.

5.  **Build the Admin Panel:**
    *   Create secure routes for the admin dashboard.
    *   Build simple HTML forms to interact with the API endpoints.

---

## Phase 3: Front-End Development (The "Storefront")

**Objective:** To build the user-facing website that interacts with the back-end API, following a component-based architecture to ensure maintainability and file size limits (max 600 lines per component/file).

**Architectural Approach:**

*   **Component-Based:** Break down the UI into small, reusable components, each in its own file.
*   **Separation of Concerns:** Keep JSX (the "HTML part") clean and focused on rendering; extract logic into hooks or utility functions.
*   **`services/` directory:** Centralize API calls in a dedicated file (e.g., `services/api.js`).

**Tasks:**

1.  **Set Up React Project:**
    *   Create a new React app using `create-react-app`.
    *   Install `react-router-dom` for navigation and `axios` for API requests.

2.  **Build Reusable Components:**
    *   `<Navbar>`
    *   `<Footer>`
    *   `<ListingCard>`
    *   `<PhotoGallery>`
    *   `<VideoPlayer>`
    *   `<FilterBar>`

3.  **Create Pages (Views):**
    *   **ListingsPage.js:** Fetch and display all listings.
    *   **ListingDetailPage.js:** Fetch and display a single listing's details.
    *   Implement a "click-to-call" link for the contact number.

4.  **Add Styling:**
    *   Use Tailwind CSS to style the application and match the mockups.
    *   Ensure the design is responsive using media queries.

---

## Phase 4: Testing & Deployment (Going Live)

**Objective:** To thoroughly test the application and deploy it to the web.

**Tasks:**

1.  **Manual Testing:**
    *   Test all links, forms, and functionality on multiple browsers and devices.
    *   Verify that search, filtering, and media loading work correctly.
    *   Test the complete admin workflow (create, edit, delete).

2.  **Deployment:**
    *   **Database:** Deploy to MongoDB Atlas.
    *   **Back-End (API):** Deploy to Render or Heroku.
    *   **Front-End (React App):** Deploy to Netlify or Vercel.
    *   Configure all environment variables for the deployed services.

---

## Phase 5: Backend Security & Refactoring Audit

**Objective:** To address critical security vulnerabilities and improve the quality and maintainability of the backend codebase based on a detailed audit.

**Audit Findings & Action Plan:**

1.  **High-Priority Security Issues:**
    *   **Hardcoded JWT Secret:**
        *   **Issue:** The JWT secret key is hardcoded in `adminController.js`, posing a severe security risk.
        *   **Action:** Relocate the secret to a `.env` file and load it via `process.env`.
    *   **Unprotected Admin Routes:**
        *   **Issue:** Admin-only endpoints (create, update, delete) are publicly accessible.
        *   **Action:** Create an authentication middleware to verify the JWT token and protect these routes.
    *   **Public Admin Registration:**
        *   **Issue:** The `/api/admin/register` endpoint allows anyone to become an admin.
        *   **Action:** Remove this endpoint entirely. Future admin creation will be handled via a secure, separate script or direct database access.

2.  **Code Quality & Refactoring:**
    *   **Code Duplication:**
        *   **Issue:** Listing creation and update logic is duplicated across `adminController.js` and `listingController.js`.
        *   **Action:** Abstract the core logic into the `listingController` and have the `adminController` call those functions after authentication.
    *   **Inconsistent Error Handling:**
        *   **Issue:** Raw database errors are sometimes sent to the client, which can leak internal server details.
        *   **Action:** Implement a standard error response format that provides a generic message to the client while logging the detailed error on the server.
    *   **Path Normalization:**
        *   **Issue:** File path manipulation (`\` to `/`) is repeated in controllers.
        *   **Action:** Centralize this logic into a single utility or within the `upload` middleware.

---

## Phase 6: Frontend Refactoring & UX Improvements

**Objective:** To enhance the user experience and improve the structure and maintainability of the frontend codebase.

**Key Areas of Improvement:**

1.  **Global Error Handling & Notifications:**
    *   **Issue:** The current use of `alert()` for error messages is disruptive and provides a poor user experience.
    *   **Action:** Implement a global error handling system using an Axios response interceptor and a React Context to display user-friendly toast notifications for all API errors.

2.  **Code Structure & Reusability:**
    *   **Issue:** Page wrappers and layout elements are duplicated across multiple components.
    *   **Action:** Create a reusable `Layout` component that includes the `Navbar`, `Footer`, and consistent page padding to enforce a standard page structure.

3.  **Configuration & Environment Management:**
    *   **Issue:** Hardcoded URLs (e.g., for the API endpoint and image paths) make it difficult to switch between development and production environments.
    *   **Action:** Move all environment-specific variables to a `.env` file and access them using `process.env.REACT_APP_*`.

4.  **User Experience (UX) Enhancements:**
    *   **Issue:** Native browser `confirm()` and `alert()` dialogs are visually inconsistent with the application's design.
    *   **Action:** Replace all instances of `window.confirm` and `window.alert` with custom, styled modal components that match the application's aesthetic.

5.  **Performance & Scalability:**
    *   **Issue:** The admin dashboard currently fetches all listings at once, which will be slow with a large amount of data.
    *   **Action:** Implement pagination on the admin dashboard to improve performance and scalability.

---

## Phase 8: Advanced Security & Performance Optimizations

**Objective:** To harden the application against security threats, improve overall performance, and ensure robust data integrity.

**Prioritized Actionable Recommendations:**

### Critical Vulnerabilities:

1.  **Fix Mass Assignment & Stored XSS:**
    *   **Issue:** The `createListing` and `updateListing` functions in `listingController.js` use `JSON.parse(req.body.listing)`, which allows attackers to inject malicious data or overwrite unintended fields.
    *   **Action:** Refactor `listingController.js` to manually pick and validate expected fields from `req.body`. Sanitize all string inputs using a library like `dompurify` before storing them to prevent Stored XSS.
2.  **Secure File Uploads:** (SKIPPED - User prefers public accessibility for all uploaded files.)
    *   **Issue:** The `uploads` directory is publicly exposed in `server.js` (`app.use('/uploads', express.static('uploads'))`), allowing unauthorized access to all uploaded files.
    *   **Action:** (No action required as per user's preference.)

### High-Priority Vulnerabilities:

1.  **Prevent Information Disclosure:**
    *   **Issue:** The `adminLogin` function in `adminController.js` returns the entire admin object, including the password hash, to the client.
    *   **Action:** Modify `adminLogin` to return only a curated user object, excluding the password hash and other sensitive data.
2.  **Add Essential Security Middleware:**
    *   **Issue:** `server.js` lacks crucial security middleware.
    *   **Action:** Add and configure `helmet()` for security headers and `express-rate-limit` to protect authentication routes from brute-force attacks.

### Medium-Priority Vulnerabilities:

1.  **Secure Password Resets:**
    *   **Issue:** Password reset tokens are stored in plain text in the database (`adminController.js`).
    *   **Action:** Hash password reset tokens before storing them in the database. When verifying, compare the user-provided token with the stored hash.
2.  **Strengthen CORS Policy:** (SKIPPED - User prefers to defer this task for now.)
    *   **Issue:** The `cors()` configuration in `server.js` is overly permissive, allowing requests from any origin (`*`).
    *   **Action:** (No action required as per user's preference.)

### Low-Priority Vulnerabilities:

1.  **Increase Hashing Strength:**
    *   **Issue:** The bcrypt work factor in `models/Admin.js` is set to 8, which is below the recommended strength.
    *   **Action:** Increase the bcrypt work factor from 8 to at least 10 (12 is recommended).
2.  **Implement Password Complexity:**
    *   **Issue:** There are no validation rules to enforce minimum password complexity.
    *   **Action:** Add validation in `adminController.js` during password reset (and potentially registration) to enforce minimum password complexity rules (e.g., length, special characters, numbers).

---