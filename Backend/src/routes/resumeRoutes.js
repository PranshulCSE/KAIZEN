const express = require ( 'express');
const { protect } = require ('../middleware/auth.js');
const { uploadResumeMiddleware } = require('../middleware/upload.js');
const {  
    createResume,
    uploadResume,
    getUserResumes,
    getResumeById,
    updateResume,
    deleteResume,
    downloadResume
} = require ('../controllers/resumeController.js');

const router = express.Router();

router.use(protect);

router.post('/upload', uploadResumeMiddleware, uploadResume);
router.post('/', createResume);
router.get('/', getUserResumes);
router.get('/:id', getResumeById);
router.put('/:id', updateResume);
router.delete('/:id', deleteResume);
router.post('/:id/download', downloadResume);

module.exports= router;
