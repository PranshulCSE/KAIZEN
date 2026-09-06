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

module.exports = {
    analyzeJob,
    optimizeResume,
    calculateATSScore,
    generateInterviewQuestions
};