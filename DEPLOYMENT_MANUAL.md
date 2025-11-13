# Deployment Manual

This document provides a step-by-step guide for deploying the Apartment Sales & Rental Website.

---

## 1. Overview

The deployment process involves three main components that must be deployed in order:
1.  **Database:** A cloud-hosted MongoDB database.
2.  **Backend:** The Node.js/Express API.
3.  **Frontend:** The React client application.

---

## 2. Prerequisites

Before you begin, ensure you have the following:
-   **Node.js and npm:** Installed on your local machine.
-   **Git:** Installed and the project is a Git repository.
-   **GitHub Account:** And the project is pushed to a GitHub repository.
-   **MongoDB Atlas Account:** For the cloud database.
-   **Backend Hosting Account:** Such as [Render](https://render.com/) or [Heroku](https://www.heroku.com/).
-   **Frontend Hosting Account:** Such as [Netlify](https://www.netlify.com/) or [Vercel](https://vercel.com/).

---

## 3. Environment Variables

This application requires environment variables to run correctly. These are set differently for local development versus production.

-   **Local Development:** Create a `.env` file in both the `backend` and `frontend` directories.
-   **Production:** Set the environment variables in the dashboard of your chosen hosting provider (Render, Netlify, etc.).

### Backend Environment Variables
Create a `.env` file in the `backend` directory with the following variables:

| Variable | Description | Example Value (Local) | Example Value (Production) |
|---|---|---|---|
| `MONGO_URI` | The connection string for your MongoDB database. | `mongodb://localhost:27017/apartmentApp` | `mongodb+srv://<user>:<password>@cluster.mongodb.net/` |
| `JWT_SECRET` | A long, random, secret string for signing authentication tokens. | `a_very_long_and_secret_string_for_dev` | A newly generated random string. |
| `PORT` | The port the backend server will run on. Usually set by the provider. | `5000` | (Provider Defined) |
| `FRONTEND_URL` | The URL of your frontend application. **Crucial for CORS security.** | `http://localhost:3001` | `https://www.your-app-name.com` |

### Frontend Environment Variables
Create a `.env` file in the `frontend` directory with the following variable:

| Variable | Description | Example Value (Local) | Example Value (Production) |
|---|---|---|---|
| `REACT_APP_API_BASE_URL` | The base URL for your backend API. | `http://localhost:5000/api` | `https://your-backend-api.onrender.com/api` |

---

## 4. Deployment Steps

### Part 1: Deploy the Database (MongoDB Atlas)
1.  **Create a Cluster:** Log in to your MongoDB Atlas account and create a new free-tier cluster.
2.  **Whitelist IP Address:** In the "Network Access" tab, add your current IP address for development access. For production, add `0.0.0.0/0` to allow access from anywhere (your backend server's IP will change).
3.  **Create a Database User:** In the "Database Access" tab, create a new user with a secure password.
4.  **Get Connection String:** Click "Connect" on your cluster, select "Connect your application," and copy the connection string. Replace `<password>` with the user password you just created. This is your `MONGO_URI`.

### Part 2: Deploy the Backend (Example: Render)
1.  **Create a New Web Service:** In your Render dashboard, create a new "Web Service" and connect it to your project's GitHub repository.
2.  **Configure Settings:**
    -   **Runtime:** Node
    -   **Build Command:** `npm install`
    -   **Start Command:** `node server.js`
3.  **Add Environment Variables:** Go to the "Environment" tab and add all the backend environment variables (`MONGO_URI`, `JWT_SECRET`, `FRONTEND_URL`) with their **production** values.
4.  **Deploy:** Click "Create Web Service". Render will automatically build and deploy your application. Copy the live URL of your backend (e.g., `https://your-backend-api.onrender.com`).

### Part 3: Deploy the Frontend (Example: Netlify)
1.  **Create a New Site:** In your Netlify dashboard, create a "New site from Git" and connect it to your project's GitHub repository.
2.  **Configure Settings:**
    -   **Base directory:** `frontend`
    -   **Build command:** `npm run build`
    -   **Publish directory:** `frontend/build`
3.  **Add Environment Variables:** Go to "Site settings" > "Build & deploy" > "Environment" and add the `REACT_APP_API_BASE_URL` variable. Set its value to your live backend URL (e.g., `https://your-backend-api.onrender.com/api`).
4.  **Deploy:** Click "Deploy site". Netlify will build and deploy your React application.

---

## 5. Post-Deployment Checks
-   Visit your live frontend URL.
-   Test creating, editing, and deleting a listing from the admin panel.
-   Test the search and filter functionality.
-   Ensure images are loading correctly.
-   Test the password reset functionality.

---

## 6. Post-Deployment: Creating the First Admin

For security, the public admin registration endpoint was removed. You must create your first admin user manually in the database.

**How to Generate a Hashed Password:**
You will need to generate a bcrypt hash for your desired password. You can do this with an online generator or by running a small Node.js script locally. **Never hash passwords in an untrusted environment.**

Example script (run with `node hash-password.js`):
```javascript
// hash-password.js
const bcrypt = require('bcryptjs');
const password = 'YourSecurePasswordHere';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, function(err, hash) {
    if (err) {
        console.error(err);
        return;
    }
    console.log('Hashed Password:', hash);
});
```

**Steps to Create Admin User:**
1.  **Connect to your Database:** In MongoDB Atlas, navigate to your cluster and click the "Browse Collections" button.
2.  **Select the Collection:** Find the `admins` collection in your database.
3.  **Insert a Document:** Click the "Insert Document" button and paste the following structure, replacing the values with your own email and the hashed password you generated:
    ```json
    {
        "email": "your-email@example.com",
        "password": "your_generated_bcrypt_hash_here"
    }
    ```
4.  **Save:** Click "Insert". Your admin user is now created. You can log in with the email and the plain-text password you chose before hashing it.