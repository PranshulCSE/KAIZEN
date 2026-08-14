const express = require('express');
const { protect } = require ('../middleware/auth.js');
const {
  analyzeJob,
  optimizeResume,
  calculateATSScore,
  generateInterviewQuestions
} = require ('../controllers/aiController.js');

const router = express.Router();

router.use(protect);

router.post('/analyze-job', analyzeJob);
router.post('/optimize-resume', optimizeResume);
router.post('/calculate-ats', calculateATSScore);
router.post('/generate-questions', generateInterviewQuestions);

module.exports=router;
