const bcrypt = require('bcryptjs');
const password = 'YOUR_PASSWORD_HERE'; // <-- IMPORTANT: Replace with your desired password
const saltRounds = 10;

if (password === 'H@dereje') {
    console.error('Please edit hash-password.js and replace YOUR_PASSWORD_HERE with your actual password.');
} else {
    bcrypt.hash(password, saltRounds, function(err, hash) {
        if (err) {
            console.error(err);
            return;
        }
        console.log('Your Hashed Password:', hash);
    });
}
