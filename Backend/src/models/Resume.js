const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        default: 'My Resume'
    },
    content: {
        personalInfo: {
            name: String,
            email: String,
            phone: String,
            location: String,
            linkedin: String,
            portfolio: String,
            summary: String
        },
        skills: [String],
        experience: [{
            company: String,
            role: String,
            location: String,
            startDate: Date,
            endDate: Date,
            isCurrent: Boolean,
            bulletPoints: [String],
            achievements: [{
                description: String,
                metrics: String
            }]
        }],
        education: [{
            institution: String,
            degree: String,
            field: String,
            startYear: String,
            endYear: String,
            gpa: Number,
            achievements: [String]
        }],
        certifications: [{
            name: String,
            issuer: String,
            date: Date,
            expiryDate: Date,
            credentialId: String,
            url: String
        }],
        projects: [{
            name: String,
            description: String,
            technologies: [String],
            link: String,
            github: String
        }],
        languages: [{
            name: String,
            proficiency: {
                type: String,
                enum: ['Native', 'Fluent', 'Professional', 'Intermediate', 'Basic']
            }
        }],
        interests: [String],
        references: [{
            name: String,
            title: String,
            company: String,
            email: String,
            phone: String
        }]
    },
    metadata: {
        fileUrl: String,
        filePublicId: String,
        originalName: String,
        fileSize: Number,
        mimeType: String,
        parsedAt: Date
    },
    versions: [{
        content: mongoose.Schema.Types.Mixed,
        version: Number,
        createdAt: Date,
        createdBy: {
            type: String,
            enum: ['user', 'ai', 'system']
        }
    }],
    currentVersion: {
        type: Number,
        default: 0
    },
    optimization: {
        atsScore: {
            type: Number,
            min: 0,
            max: 100,
            default: 0
        },
        keywordMatch: Number,
        readability: Number,
        formatScore: Number,
        suggestions: [String],
        lastOptimized: Date
    },
    isActive: {
        type: Boolean,
        default: true
    },
    shareToken: {
        type: String,
        unique: true,
        sparse: true
    },
    analytics: {
        views: { type: Number, default: 0 },
        downloads: { type: Number, default: 0 },
        lastViewed: Date
    }
}, {
    timestamps: true
});

// Indexes for performance
resumeSchema.index({ userId: 1, createdAt: -1 });
resumeSchema.index({ 'content.skills': 1 });
resumeSchema.index({ 'optimization.atsScore': -1 });

module.exports = mongoose.model('Resume', resumeSchema);