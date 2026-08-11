const User = require('../models/User');
const AuditLog = require('../models/AuditLog');

// Check if user is admin
exports.isAdmin = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Not authenticated'
            });
        }

        if (req.user.role !== 'admin' && req.user.role !== 'super-admin') {
            return res.status(403).json({
                success: false,
                message: 'Admin access required'
            });
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Check if user is super admin
exports.isSuperAdmin = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Not authenticated'
            });
        }

        if (req.user.role !== 'super-admin') {
            return res.status(403).json({
                success: false,
                message: 'Super admin access required'
            });
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Log admin actions
exports.logAdminAction = (action) => {
    return async (req, res, next) => {
        try {
            const result = await AuditLog.create({
                userId: req.user._id,
                action: 'admin_action',
                resource: 'Admin',
                details: {
                    action,
                    endpoint: req.originalUrl,
                    method: req.method,
                    body: req.body,
                    params: req.params,
                    query: req.query
                },
                ipAddress: req.ip,
                userAgent: req.headers['user-agent']
            });

            req.auditLog = result;
            next();
        } catch (error) {
            console.error('Audit log error:', error);
            next();
        }
    };
};