const express = require('express');
const { protect } = require('../middleware/auth.js');
const {
    getJobAnalyses,
    getJobAnalysisById,
    deleteJobAnalysis
} = require ('../controllers/jobController.js');

const router = express.Router();

router.use(protect);

router.get('/', getJobAnalyses);
router.get('/:id', getJobAnalysisById);
router.delete('/:id', deleteJobAnalysis);

module.exports= router;
