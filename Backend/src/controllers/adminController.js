const User = require('../models/User.js');
const Resume = require('../models/Resume.js');
const AuditLog = require('../models/AuditLog.js');
const mongoose = require('mongoose');

// @desc    Get all users with filtering and pagination
// @route   GET /api/admin/users
const getAllUsers = async (req, res) => {
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

        res.status(200).json({
            success: true,
            data: {
                users,
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

// @desc    Get user by ID with all details
// @route   GET /api/admin/users/:id
const getUserById = async (req, res) => {
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
                    averageATSScore: resumes.length > 0
                        ? (resumes.reduce((acc, r) => acc + (r.optimization?.atsScore || 0), 0) / resumes.length).toFixed(2)
                        : 0,
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
const updateUserRole = async (req, res) => {
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
            userAgent: req.headers['user-agent'],
            status: 'success'
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

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
const getDashboardStats = async (req, res) => {
    try {
        const [
            totalUsers,
            totalResumes,
            recentUsers,
            recentResumes,
            activityLogs
        ] = await Promise.all([
            User.countDocuments(),
            Resume.countDocuments(),
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

        res.status(200).json({
            success: true,
            data: {
                overview: {
                    totalUsers,
                    totalResumes,
                    conversionRate: totalUsers > 0 ? (totalResumes / totalUsers * 100).toFixed(2) : 0
                },
                recent: {
                    users: recentUsers,
                    resumes: recentResumes,
                    activity: activityLogs
                },
                analytics: {
                    dailyActivity
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

const toggleUserVerification = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        user.isVerified = !user.isVerified;
        await user.save();
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

const getAllResumes = async (req, res) => {
    try {
        const resumes = await Resume.find().populate('userId', 'name email').sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: resumes });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};



module.exports = { getAllUsers, getUserById, updateUserRole, getDashboardStats , toggleUserVerification, getAllResumes };