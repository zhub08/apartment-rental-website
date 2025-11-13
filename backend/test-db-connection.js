const mongoose = require('mongoose');
require('dotenv').config();

const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
    console.error('MONGO_URI not found in .env file. Please make sure it is set.');
    process.exit(1);
}

console.log('Attempting to connect to MongoDB Atlas...');
console.log('URI:', mongoUri.replace(/:([^:@\s]+)@/, ':<password>@')); // Print URI without password

mongoose.connect(mongoUri)
    .then(() => {
        console.log('\nSUCCESS: MongoDB connection established successfully!');
        mongoose.connection.close();
        process.exit(0);
    })
    .catch(err => {
        console.error('\nERROR: Could not connect to MongoDB.');
        console.error('Error Details:', err);
        process.exit(1);
    });
