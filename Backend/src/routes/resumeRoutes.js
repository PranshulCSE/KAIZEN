const express = require ( 'express');
const { protect } = require ('../middleware/auth.js');
const {  
    createResume,
    getUserResumes,
    getResumeById,
    updateResume,
    deleteResume
} = require ('../controllers/resumeController.js');

const router = express.Router();

router.use(protect);

router.post('/', createResume);
router.get('/', getUserResumes);
router.get('/:id', getResumeById);
router.put('/:id', updateResume);
router.delete('/:id', deleteResume);

module.exports= router;
