const multer = require('multer');
const path = require('path');

// Set up storage engine
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: function(req, file, cb){
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Check file type
function checkFileType(file, cb){
    // Allowed extensions
    const filetypes = /jpeg|jpg|png|gif/;
    // Check extension
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime type
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

// Initialize multer upload instance
const multerUpload = multer({
    storage: storage,
    limits: {fileSize: 10000000}, // 10MB limit
    fileFilter: function(req, file, cb){
        checkFileType(file, cb);
    }
}).array('images', 10); // 'images' is the field name, 10 is the max number of files

// Custom middleware to wrap multer and normalize paths
const customUpload = (req, res, next) => {
    console.log('Entering customUpload middleware...'); // Debugging line
    multerUpload(req, res, function (err) {
        if (err) {
            console.error('Multer error:', err); // Debugging line
            return res.status(400).send({ error: err.message || err });
        }

        console.log('Multer upload successful.'); // Debugging line
        // Normalize paths after upload
        if (req.files) {
            req.files.forEach(file => {
                file.path = file.path.replace(/\\/g, '/');
            });
        }
        next();
    });
};

module.exports = customUpload;
