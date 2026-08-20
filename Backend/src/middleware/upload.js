const multer = require('multer');
const { FILE_SIZE_LIMITS, ALLOWED_FILE_TYPES } = require('../utils/constant.js');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (ALLOWED_FILE_TYPES.RESUME.includes(file.mimetype)) {
        return cb(null, true);
    }
    cb(new Error('Only PDF and Word (.doc/.docx) files are allowed for resumes'), false);
};

const uploadResumeFile = multer({
    storage,
    limits: { fileSize: FILE_SIZE_LIMITS.RESUME },
    fileFilter
}).single('resume'); // frontend must send the file under form-data field "resume"

const uploadResumeMiddleware = (req, res, next) => {
    uploadResumeFile(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    success: false,
                    message: `File too large. Max size is ${FILE_SIZE_LIMITS.RESUME / (1024 * 1024)}MB`
                });
            }
            return res.status(400).json({ success: false, message: err.message });
        }
        if (err) return res.status(400).json({ success: false, message: err.message });
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded. Send it as form-data field "resume".' });
        }
        next();
    });
};

module.exports = { uploadResumeMiddleware };