import JobAnalysis from '../models/JobAnalysis.js';
import AuditLog from '../models/AuditLog.js';

// @desc    Get job analyses
// @route   GET /api/jobs
const getJobAnalyses = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const analyses = await JobAnalysis.find({ userId: req.user._id })
            .populate('resumeId', 'title')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await JobAnalysis.countDocuments({ userId: req.user._id });

        res.status(200).json({
            success: true,
            data: {
                analyses,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Get job analysis by ID
// @route   GET /api/jobs/:id
const getJobAnalysisById = async (req, res) => {
    try {
        const analysis = await JobAnalysis.findById(req.params.id)
            .populate('userId', 'name email')
            .populate('resumeId', 'title content');

        if (!analysis) {
            return res.status(404).json({
                success: false,
                message: 'Job analysis not found'
            });
        }

        // Check ownership
        if (analysis.userId._id.toString() !== req.user._id.toString() && req.user.role === 'user') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this analysis'
            });
        }

        res.status(200).json({
            success: true,
            data: analysis
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Delete job analysis
// @route   DELETE /api/jobs/:id
 const deleteJobAnalysis = async (req, res) => {
    try {
        const analysis = await JobAnalysis.findById(req.params.id);

        if (!analysis) {
            return res.status(404).json({
                success: false,
                message: 'Job analysis not found'
            });
        }

        // Check ownership
        if (analysis.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this analysis'
            });
        }

        await JobAnalysis.findByIdAndDelete(req.params.id);

        // Log audit
        await AuditLog.create({
            userId: req.user._id,
            action: 'job_analyze',
            resource: 'JobAnalysis',
            resourceId: analysis._id,
            details: { jobTitle: analysis.jobTitle },
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
            status: 'success'
        });

        res.status(200).json({
            success: true,
            message: 'Job analysis deleted successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

module.exports = { deleteJobAnalysis, getJobAnalyses, getJobAnalysisById };
