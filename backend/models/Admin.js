const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AdminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    resetPasswordToken: {
        type: String,
        required: false
    },
    resetPasswordExpires: {
        type: Date,
        required: false
    }
});

// Hash the password before saving the admin user
AdminSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Method to compare passwords
AdminSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const Admin = mongoose.model('Admin', AdminSchema);

module.exports = Admin;
