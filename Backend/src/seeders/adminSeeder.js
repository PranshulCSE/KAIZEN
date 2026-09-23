const mongoose = require( 'mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User.js');

require('dotenv').config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Check if admin exists
        const adminExists = await User.findOne({ email: 'admin@kaizen.com' });

        if (adminExists) {
            console.log('Admin user already exists');
            process.exit(0);
        }

        // Create admin user
        const admin = await User.create({
            name: 'Super Admin',
            email: 'admin@kaizen.com',
            password: 'Admin@2026',
            role: 'super-admin',
            isVerified: true
        });

        console.log('✓ Admin user created successfully!');
        console.log('Email: admin@kaizen.com');
        console.log('Password: Admin@2026'); // FIX Bug #4: was 'Admin@2026!' (extra ! caused login failure)
        console.log('\n⚠️  IMPORTANT: Change the password immediately after first login!');

        process.exit(0);
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();
