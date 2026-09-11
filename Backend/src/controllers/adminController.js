const User = require('../models/User.js');
const Resume = require('../models/Resume.js');
const AuditLog = require('../models/AuditLog.js');
const mongoose = require('mongoose');
const { join } = require('path');
const { readFileSync } = require('fs');

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

const getSystemLogs = async (req, res) => {
  try {
    const { level, search, limit = 100 } = req.query;
    const numericLimit = parseInt(limit, 10) || 100;

    // FIXED: AuditLog has no `level`/`timestamp`/`message` field, and `details`
    // is Schema.Types.Mixed (an object) — running $regex on it throws
    // "$regex has to be a string" and 500s the request the moment anyone
    // searches. Fetch on real fields only, derive/filter the rest in JS.
    const auditLogs = await AuditLog.find({})
      .sort({ createdAt: -1 })
      .limit(numericLimit * 5)
      .populate('userId', 'name email') // NEW: readable user instead of raw ObjectId
      .lean();

    const levelFromStatus = (status) =>
      status === 'failed' ? 'error' : status === 'pending' ? 'warn' : 'info';

    let normalized = auditLogs.map((log) => ({
      _id: String(log._id),
      timestamp: log.createdAt, // FIXED: was `log.timestamp`, which never existed
      level: levelFromStatus(log.status), // FIXED: was querying a nonexistent `level` field (always 0 matches)
      service: log.action,
      message: `${log.action} on ${log.resource}${log.resourceId ? ` #${log.resourceId}` : ''}`,
      statusCode: log.status === 'failed' ? 500 : 200,
      ipAddress: log.ipAddress,
      userId: log.userId?.email || log.userId?.name || log.userId,
      detailsText: typeof log.details === 'string' ? log.details : JSON.stringify(log.details || {}),
    }));

    if (level && level !== 'all') {
      normalized = normalized.filter((log) => log.level === level.toLowerCase());
    }

    if (search) {
      const s = search.toLowerCase();
      normalized = normalized.filter(
        (log) =>
          log.message?.toLowerCase().includes(s) ||
          log.ipAddress?.toLowerCase().includes(s) ||
          log.detailsText?.toLowerCase().includes(s)
      );
    }

    normalized = normalized.slice(0, numericLimit);

    // Winston file logs — optional supplementary source
    let fileLogs = [];
    try {
      const logsDir = join(process.cwd(), 'logs');
      let fileContent = '';
      try {
        fileContent = readFileSync(join(logsDir, 'combined.log'), 'utf8');
      } catch {
        // File doesn't exist yet, skip
      }

      if (fileContent) {
        fileLogs = fileContent
          .split('\n')
          .filter((line) => line.trim())
          .reverse()
          .slice(0, Math.max(numericLimit - normalized.length, 0))
          .map((line, idx) => {
            // FIXED: winston writes JSON lines (format.json()) — was dumping
            // the raw JSON string into Message instead of parsing it.
            try {
              const parsed = JSON.parse(line);
              return {
                _id: `file-${idx}`,
                message: parsed.message || line,
                level: (parsed.level || 'info').toLowerCase(),
                service: parsed.service || 'winston',
                timestamp: parsed.timestamp || new Date(),
              };
            } catch {
              return { _id: `file-${idx}`, message: line, level: 'info', service: 'winston', timestamp: new Date() };
            }
          });
      }
    } catch (err) {
      console.warn('Could not read log files:', err.message);
    }

    const allLogs = [...normalized, ...fileLogs].sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );

    res.json({ success: true, logs: allLogs, total: allLogs.length });
  } catch (error) {
    console.error('Get System Logs Error:', error);
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
};

module.exports = { getAllUsers, getUserById, updateUserRole, getDashboardStats , toggleUserVerification, getAllResumes, getSystemLogs };