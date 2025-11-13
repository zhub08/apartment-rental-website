const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const listingRoutes = require('./routes/listings');
const adminRoutes = require('./routes/admin');
require('./models/Admin'); // Ensure Admin model is loaded

const app = express();
const port = process.env.PORT || 5000;

// Security Middleware
app.use(helmet({ crossOriginResourcePolicy: false }));

const adminLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // Limit each IP to 20 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: 'Too many requests from this IP, please try again after 15 minutes'
});

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/listings', listingRoutes);
app.use('/api/admin', adminLimiter, adminRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err));

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
