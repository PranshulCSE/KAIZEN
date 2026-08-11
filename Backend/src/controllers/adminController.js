const User = require('../models/User');
const Resume = require('../models/Resume');
const AuditLog = require('../models/AuditLog');
const mongoose = require('mongoose');

// @desc    Get all users with filtering and pagination
// @route   GET /api/admin/users
exports.getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const filter = {};
        if (req.query.role) filter.role = req.query.role;
        if (req.query.isVerified !== undefined) filter.isVerified = req.query.isVerified === 'true';
        if (req.query.search) {
            filter.$or = [
                { name: { $regex: req.query.search, $options: 'i' } },
                { email: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        const users = await User.find(filter)
            .select('-password -refreshTokens')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await User.countDocuments(filter);

        // Get user stats
        const userStats = await User.aggregate([
            { $match: {} },
            {
                $group: {
                    _id: '$role',
                    count: { $sum: 1 }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: {
                users,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                },
                stats: {
                    totalUsers: total,
                    roleDistribution: userStats,
                    verifiedUsers: await User.countDocuments({ isVerified: true }),
                    unverifiedUsers: await User.countDocuments({ isVerified: false })
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

// @desc    Get user by ID with all details
// @route   GET /api/admin/users/:id
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select('-password -refreshTokens');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Get user's resumes
        const resumes = await Resume.find({ userId: user._id })
            .select('title optimization.atsScore createdAt')
            .sort({ createdAt: -1 });

        // Get user's activity logs
        const logs = await AuditLog.find({ userId: user._id })
            .sort({ createdAt: -1 })
            .limit(50);

        res.status(200).json({
            success: true,
            data: {
                user,
                stats: {
                    totalResumes: resumes.length,
                    averageATSScore: resumes.reduce((acc, r) => acc + (r.optimization?.atsScore || 0), 0) / resumes.length || 0,
                    resumes
                },
                recentActivity: logs
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

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
exports.updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;

        if (!['user', 'admin', 'super-admin'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role'
            });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true, runValidators: true }
        ).select('-password -refreshTokens');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Log admin action
        await AuditLog.create({
            userId: req.user._id,
            action: 'admin_action',
            resource: 'User',
            resourceId: user._id,
            details: {
                action: 'update_role',
                newRole: role,
                targetUser: user.email
            },
            ipAddress: req.ip,
            userAgent: req.headers['user-agent']
        });

        res.status(200).json({
            success: true,
            message: 'User role updated successfully',
            data: user
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

// @desc    Toggle user verification status
// @route   PUT /api/admin/users/:id/verify
exports.toggleUserVerification = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        user.isVerified = !user.isVerified;
        await user.save();

        await AuditLog.create({
            userId: req.user._id,
            action: 'admin_action',
            resource: 'User',
            resourceId: user._id,
            details: {
                action: 'toggle_verification',
                newStatus: user.isVerified,
                targetUser: user.email
            },
            ipAddress: req.ip,
            userAgent: req.headers['user-agent']
        });

        res.status(200).json({
            success: true,
            message: `User verification status updated to ${user.isVerified}`,
            data: {
                userId: user._id,
                isVerified: user.isVerified
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

// @desc    Get all resumes with filtering
// @route   GET /api/admin/resumes
exports.getAllResumes = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const filter = {};
        if (req.query.userId) filter.userId = mongoose.Types.ObjectId(req.query.userId);
        if (req.query.minScore) filter['optimization.atsScore'] = { $gte: parseInt(req.query.minScore) };
        if (req.query.search) {
            filter.$or = [
                { title: { $regex: req.query.search, $options: 'i' } },
                { 'content.personalInfo.name': { $regex: req.query.search, $options: 'i' } }
            ];
        }

        const resumes = await Resume.find(filter)
            .populate('userId', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Resume.countDocuments(filter);

        // Get resume stats
        const stats = await Resume.aggregate([
            { $match: {} },
            {
                $group: {
                    _id: null,
                    totalResumes: { $sum: 1 },
                    averageATSScore: { $avg: '$optimization.atsScore' },
                    totalOptimizations: { $sum: '$optimization.optimizations' },
                    resumesWithLowScore: {
                        $sum: { $cond: [{ $lt: ['$optimization.atsScore', 60] }, 1, 0] }
                    }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: {
                resumes,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                },
                stats: stats[0] || {
                    totalResumes: 0,
                    averageATSScore: 0,
                    totalOptimizations: 0,
                    resumesWithLowScore: 0
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

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
exports.getDashboardStats = async (req, res) => {
    try {
        const [
            totalUsers,
            totalResumes,
            totalOptimizations,
            recentUsers,
            recentResumes,
            activityLogs
        ] = await Promise.all([
            User.countDocuments(),
            Resume.countDocuments(),
            Resume.aggregate([
                { $group: { _id: null, total: { $sum: '$optimization.optimizations' } } }
            ]),
            User.find().sort({ createdAt: -1 }).limit(10).select('name email role createdAt'),
            Resume.find().sort({ createdAt: -1 }).limit(10).populate('userId', 'name email'),
            AuditLog.find()
                .sort({ createdAt: -1 })
                .limit(20)
                .populate('userId', 'name email')
        ]);

        // Get daily activity for last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const dailyActivity = await AuditLog.aggregate([
            { $match: { createdAt: { $gte: sevenDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id': 1 } }
        ]);

        // Get resume score distribution
        const scoreDistribution = await Resume.aggregate([
            {
                $bucket: {
                    groupBy: '$optimization.atsScore',
                    boundaries: [0, 20, 40, 60, 80, 100],
                    default: 'Other',
                    output: { count: { $sum: 1 } }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: {
                overview: {
                    totalUsers,
                    totalResumes,
                    totalOptimizations: totalOptimizations[0]?.total || 0,
                    conversionRate: totalUsers > 0 ? (totalResumes / totalUsers * 100).toFixed(2) : 0
                },
                recent: {
                    users: recentUsers,
                    resumes: recentResumes,
                    activity: activityLogs
                },
                analytics: {
                    dailyActivity,
                    scoreDistribution
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