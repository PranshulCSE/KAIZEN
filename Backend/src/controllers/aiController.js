const aiService = require('../services/aiService.js');
const JobAnalysis = require('../models/JobAnalysis.js');
const Resume = require('../models/Resume.js');
const AuditLog = require('../models/AuditLog.js');

// @desc    Analyze job description
// @route   POST /api/ai/analyze-job
const analyzeJob = async (req, res) => {
    try {
        const { jobDescription, jobTitle, company, resumeId } = req.body;

        // Analyze with AI
        const analysis = await aiService.analyzeJobDescription(jobDescription);

        // Create job analysis record
        const jobAnalysis = await JobAnalysis.create({
            userId: req.user._id,
            resumeId,
            jobDescription,
            jobTitle,
            company,
            analysis
        });

        // Log audit
        await AuditLog.create({
            userId: req.user._id,
            action: 'job_analyze',
            resource: 'JobAnalysis',
            resourceId: jobAnalysis._id,
            details: { jobTitle, company },
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
            status: 'success'
        });

        res.status(200).json({
            success: true,
            message: 'Job analyzed successfully',
            data: jobAnalysis
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Failed to analyze job',
            error: error.message
        });
    }
};

// @desc    Optimize resume for job
// @route   POST /api/ai/optimize-resume
const optimizeResume = async (req, res) => {
    try {
        const { resumeId, jobAnalysisId, jobDescription } = req.body;

        const resume = await Resume.findById(resumeId);
        if (!resume || (resume.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin' && req.user.role !== 'super-admin')) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to optimize this resume'
            });
        }

        let targetJobAnalysis;

        // If jobAnalysisId was passed, find it
        if (jobAnalysisId) {
            targetJobAnalysis = await JobAnalysis.findById(jobAnalysisId);
        }

        // If jobAnalysisId is missing or not found, but a raw jobDescription was sent, analyze on the fly
        if (!targetJobAnalysis && jobDescription) {
            try {
                const parsedAnalysis = await aiService.analyzeJobDescription(jobDescription);
                targetJobAnalysis = await JobAnalysis.create({
                    userId: req.user._id,
                    resumeId: resume._id,
                    jobDescription,
                    jobTitle: req.body.jobTitle || 'Target Role',
                    company: req.body.company || 'Target Company',
                    analysis: parsedAnalysis
                });
            } catch (err) {
                // Fallback structured job analysis if AI fails
                targetJobAnalysis = {
                    analysis: {
                        requiredSkills: [],
                        keywords: [],
                        roleResponsibilities: [jobDescription.slice(0, 300)]
                    }
                };
            }
        }

        if (!targetJobAnalysis) {
            return res.status(400).json({
                success: false,
                message: 'Please provide either a valid jobAnalysisId or jobDescription.'
            });
        }

        // Optimize with AI
        const optimization = await aiService.optimizeResumeForJob(
            resume.content,
            targetJobAnalysis.analysis
        );

        // Update resume
        resume.optimization = {
            atsScore: optimization.atsScore || 85,
            suggestions: (optimization.improvements || []).map(imp => typeof imp === 'string' ? imp : imp?.reason || JSON.stringify(imp)),
            lastOptimized: new Date()
        };
        await resume.save();

        // Log audit
        await AuditLog.create({
            userId: req.user._id,
            action: 'resume_optimize',
            resource: 'Resume',
            resourceId: resumeId,
            details: { optimizationScore: optimization.atsScore },
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
            status: 'success'
        });

        res.status(200).json({
            success: true,
            message: 'Resume optimized successfully',
            data: {
                resume,
                optimization
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Failed to optimize resume',
            error: error.message
        });
    }
};

// @desc    Calculate ATS score
// @route   POST /api/ai/calculate-ats
const calculateATSScore = async (req, res) => {
    try {
        const { resumeId, jobDescription } = req.body;

        const resume = await Resume.findById(resumeId);
        if (!resume || (resume.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin' && req.user.role !== 'super-admin')) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this resume'
            });
        }

        // Calculate ATS score
        const atsScore = await aiService.calculateATSScore(
            resume.content,
            jobDescription
        );

        res.status(200).json({
            success: true,
            message: 'ATS score calculated successfully',
            data: atsScore
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Failed to calculate ATS score',
            error: error.message
        });
    }
};

// @desc    Generate interview questions
// @route   POST /api/ai/generate-questions
const generateInterviewQuestions = async (req, res) => {
    try {
        const { resumeId, jobDescription } = req.body;

        const resume = await Resume.findById(resumeId);
        if (!resume || (resume.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin' && req.user.role !== 'super-admin')) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this resume'
            });
        }

        // Generate questions
        const questions = await aiService.generateInterviewQuestions(
            resume.content,
            jobDescription
        );

        res.status(200).json({
            success: true,
            message: 'Interview questions generated successfully',
            data: questions
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate interview questions',
            error: error.message
        });
    }
};

// @desc    Generate tailored Cover Letter
// @route   POST /api/ai/cover-letter
const generateCoverLetter = async (req, res) => {
    try {
        const { resumeId, jobAnalysisId, jobDescription, tone, target, company, jobTitle, extraNotes } = req.body;

        const resume = await Resume.findById(resumeId);
        if (!resume || (resume.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin' && req.user.role !== 'super-admin')) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this resume'
            });
        }

        let targetJobAnalysis;
        if (jobAnalysisId) {
            targetJobAnalysis = await JobAnalysis.findById(jobAnalysisId);
        }

        if (!targetJobAnalysis && jobDescription) {
            targetJobAnalysis = {
                jobTitle: jobTitle || 'Target Role',
                company: company || 'Target Company',
                jobDescription,
                analysis: { requiredSkills: [], keywords: [] }
            };
        }

        if (!targetJobAnalysis) {
            return res.status(400).json({
                success: false,
                message: 'Please provide either a valid jobAnalysisId or jobDescription.'
            });
        }

        const coverLetterData = await aiService.generateCoverLetter(
            resume.content,
            targetJobAnalysis.analysis || targetJobAnalysis,
            { tone, target, company: company || targetJobAnalysis.company, jobTitle: jobTitle || targetJobAnalysis.jobTitle, extraNotes }
        );

        // Audit Log
        await AuditLog.create({
            userId: req.user._id,
            action: 'job_analyze',
            resource: 'Resume',
            resourceId: resume._id,
            details: { action: 'cover_letter_generated', company, jobTitle },
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
            status: 'success'
        });

        res.status(200).json({
            success: true,
            message: 'Cover letter generated successfully',
            data: coverLetterData
        });
    } catch (error) {
        console.error('Cover letter generation error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate cover letter',
            error: error.message
        });
    }
};

// @desc    Generate Cold Outreach & LinkedIn Messages
// @route   POST /api/ai/cold-outreach
const generateColdOutreach = async (req, res) => {
    try {
        const { resumeId, jobAnalysisId, jobDescription, platform, recipientRole, company, jobTitle } = req.body;

        const resume = await Resume.findById(resumeId);
        if (!resume || (resume.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin' && req.user.role !== 'super-admin')) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this resume'
            });
        }

        let targetJobAnalysis;
        if (jobAnalysisId) {
            targetJobAnalysis = await JobAnalysis.findById(jobAnalysisId);
        }

        if (!targetJobAnalysis && jobDescription) {
            targetJobAnalysis = {
                jobTitle: jobTitle || 'Target Role',
                company: company || 'Target Company',
                jobDescription,
                analysis: {}
            };
        }

        const outreachData = await aiService.generateColdOutreach(
            resume.content,
            targetJobAnalysis?.analysis || targetJobAnalysis || {},
            { platform, recipientRole, company, jobTitle }
        );

        res.status(200).json({
            success: true,
            message: 'Cold outreach generated successfully',
            data: outreachData
        });
    } catch (error) {
        console.error('Cold outreach generation error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate cold outreach',
            error: error.message
        });
    }
};

// @desc    Fetch GitHub User Profile and Repositories
// @route   POST /api/ai/github-repos
const getGitHubRepos = async (req, res) => {
    try {
        const { username } = req.body;
        const githubService = require('../services/githubService.js');
        const data = await githubService.fetchUserRepos(username);

        res.status(200).json({
            success: true,
            message: 'GitHub profile fetched successfully',
            data
        });
    } catch (error) {
        console.error('GitHub fetch error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch GitHub data',
            error: error.message
        });
    }
};

// @desc    Generate Quantified Resume Project Bullets from Selected GitHub Repos
// @route   POST /api/ai/github-bullets
const generateGitHubBullets = async (req, res) => {
    try {
        const { repositories, targetRole } = req.body;
        if (!repositories || !Array.isArray(repositories) || repositories.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Please provide at least one repository to generate bullets for.'
            });
        }

        const result = await aiService.generateGitHubProjectBullets(repositories, targetRole);

        res.status(200).json({
            success: true,
            message: 'Project bullets generated successfully',
            data: result
        });
    } catch (error) {
        console.error('GitHub bullets generation error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate project bullets from GitHub repositories',
            error: error.message
        });
    }
};

// @desc    Scrape Job Description from Public URL
// @route   POST /api/ai/scrape-job-url
const scrapeJobUrl = async (req, res) => {
    try {
        const { url } = req.body;
        const scraperService = require('../services/scraperService.js');
        const result = await scraperService.scrapeJobUrl(url);

        res.status(200).json({
            success: true,
            message: 'Job posting scraped successfully',
            data: result
        });
    } catch (error) {
        console.error('Scraper error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to scrape job URL',
            error: error.message
        });
    }
};

// @desc    AI Inline Bullet Point Copilot
// @route   POST /api/ai/improve-bullet
const improveBullet = async (req, res) => {
    try {
        const { bulletText, action, targetRole, extraContext } = req.body;
        const result = await aiService.improveBulletPoint(bulletText, action, { targetRole, extraContext });

        res.status(200).json({
            success: true,
            message: 'Bullet point improved successfully',
            data: result
        });
    } catch (error) {
        console.error('Improve bullet error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to improve bullet point',
            error: error.message
        });
    }
};

module.exports = {
    analyzeJob,
    optimizeResume,
    calculateATSScore,
    generateInterviewQuestions,
    generateCoverLetter,
    generateColdOutreach,
    getGitHubRepos,
    generateGitHubBullets,
    scrapeJobUrl,
    improveBullet
};