const express = require('express');
const { protect } = require ('../middleware/auth.js');
const {
  analyzeJob,
  optimizeResume,
  calculateATSScore,
  generateInterviewQuestions,
  generateCoverLetter,
  generateColdOutreach,
  getGitHubRepos,
  generateGitHubBullets,
  scrapeJobUrl
} = require ('../controllers/aiController.js');

const router = express.Router();

router.use(protect);

router.post('/analyze-job', analyzeJob);
router.post('/optimize-resume', optimizeResume);
router.post('/calculate-ats', calculateATSScore);
router.post('/generate-questions', generateInterviewQuestions);

// NEW: Phase 1 AI Endpoints
router.post('/cover-letter', generateCoverLetter);
router.post('/cold-outreach', generateColdOutreach);
router.post('/github-repos', getGitHubRepos);
router.post('/github-bullets', generateGitHubBullets);
router.post('/scrape-job-url', scrapeJobUrl);

module.exports=router;
