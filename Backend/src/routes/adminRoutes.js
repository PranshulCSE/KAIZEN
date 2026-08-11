const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { isAdmin, isSuperAdmin, logAdminAction } = require('../middleware/admin');
const {
  getAllUsers,
  getUserById,
  updateUserRole,
  toggleUserVerification,
  getAllResumes,
  getDashboardStats
} = require('../controllers/adminController');

// All admin routes require authentication and admin role
router.use(protect);
router.use(isAdmin);

// Dashboard
router.get('/dashboard', logAdminAction('view_dashboard'), getDashboardStats);

// User management
router.get('/users', logAdminAction('view_users'), getAllUsers);
router.get('/users/:id', logAdminAction('view_user_details'), getUserById);
router.put('/users/:id/role', logAdminAction('update_user_role'), updateUserRole);
router.put('/users/:id/verify', logAdminAction('toggle_user_verification'), toggleUserVerification);

// Resume management
router.get('/resumes', logAdminAction('view_resumes'), getAllResumes);

// Super admin only routes
router.use(isSuperAdmin);
// Add super admin specific routes here

module.exports = router;