const Resume = require('../models/Resume.js');
const AuditLog = require('../models/AuditLog.js');
const resumeParser = require('../services/resumeParser.js');
const cloudinary = require('../config/cloudinary.js');
const { generateResumePDFBuffer } = require('../services/resumePdfService.js');

// Uploads a buffer to Cloudinary using an upload_stream (needed because we
// never write the file to local disk — it only ever exists in memory).
const uploadBufferToCloudinary = (buffer, originalName) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: 'kaizen/resumes',
                resource_type: 'raw', // PDFs/DOCX are not images, so 'raw' is required
                public_id: `${Date.now()}-${originalName.replace(/\.[^/.]+$/, '')}`
            },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );
        stream.end(buffer);
    });
};

// @desc    Upload a resume file (PDF/DOCX), parse it, and save it as a new Resume
// @route   POST /api/resumes/upload
const uploadResume = async (req, res) => {
    try {
        const { buffer, mimetype, originalname, size } = req.file;

        // 1. Parse the file into structured resume content
        let parsedContent;
        if (mimetype === 'application/pdf') {
            parsedContent = await resumeParser.parsePDF(buffer);
        } else {
            // application/msword or .docx mimetype
            parsedContent = await resumeParser.parseDOCX(buffer);
        }

        // 2. Push the original file to Cloudinary so it can be re-downloaded later.
        //    If Cloudinary isn't configured (e.g. local dev without creds), don't
        //    fail the whole upload — just skip storing the original file.
        let fileUrl, filePublicId;
        try {
            const uploadResult = await uploadBufferToCloudinary(buffer, originalname);
            fileUrl = uploadResult.secure_url;
            filePublicId = uploadResult.public_id;
        } catch (cloudErr) {
            console.error('Cloudinary upload skipped/failed:', cloudErr.message);
        }

        // 3. Ensure candidate name defaults to user's registered name if unparsed
        if (!parsedContent.personalInfo) {
            parsedContent.personalInfo = {};
        }
        if (!parsedContent.personalInfo.name || parsedContent.personalInfo.name === 'Unknown') {
            parsedContent.personalInfo.name = req.user.name || 'Candidate';
        }
        if (!parsedContent.personalInfo.fullName) {
            parsedContent.personalInfo.fullName = parsedContent.personalInfo.name;
        }

        // 4. Save the parsed resume
        const resume = await Resume.create({
            userId: req.user._id,
            title: req.body.title || originalname.replace(/\.[^/.]+$/, ''),
            content: parsedContent,
            metadata: {
                fileUrl,
                filePublicId,
                originalName: originalname,
                fileSize: size,
                mimeType: mimetype,
                parsedAt: new Date()
            }
        });

        // 4. Update user stats + audit log
        req.user.stats.resumesCreated = (req.user.stats.resumesCreated || 0) + 1;
        await req.user.save();

        await AuditLog.create({
            userId: req.user._id,
            action: 'resume_upload',
            resource: 'Resume',
            resourceId: resume._id,
            details: { originalName: originalname, fileSize: size },
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
            status: 'success'
        });

        res.status(201).json({
            success: true,
            message: 'Resume uploaded and parsed successfully',
            data: resume
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload and parse resume',
            error: error.message
        });
    }
};

// @desc    Create resume
// @route   POST /api/resumes
const createResume = async (req, res) => {
    try {
        const { title, content } = req.body;

        const resume = await Resume.create({
            userId: req.user._id,
            title: title || 'My Resume',
            content
        });

        // Log audit
        await AuditLog.create({
            userId: req.user._id,
            action: 'resume_upload',
            resource: 'Resume',
            resourceId: resume._id,
            details: { title: resume.title },
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
            status: 'success'
        });

        res.status(201).json({
            success: true,
            message: 'Resume created successfully',
            data: resume
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

// @desc    Get user resumes
// @route   GET /api/resumes
const getUserResumes = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const resumes = await Resume.find({ userId: req.user._id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Resume.countDocuments({ userId: req.user._id });

        res.status(200).json({
            success: true,
            data: {
                resumes,
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

// @desc    Get resume by ID
// @route   GET /api/resumes/:id
const getResumeById = async (req, res) => {
    try {
        const resume = await Resume.findById(req.params.id);

        if (!resume) {
            return res.status(404).json({
                success: false,
                message: 'Resume not found'
            });
        }

        // Check ownership
        if (resume.userId.toString() !== req.user._id.toString() && req.user.role === 'user') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this resume'
            });
        }

        res.status(200).json({
            success: true,
            data: resume
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

// @desc    Update resume
// @route   PUT /api/resumes/:id
const updateResume = async (req, res) => {
    try {
        const resume = await Resume.findById(req.params.id);

        if (!resume) {
            return res.status(404).json({
                success: false,
                message: 'Resume not found'
            });
        }

        // Check ownership
        if (resume.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this resume'
            });
        }

        Object.assign(resume, req.body);
        await resume.save();

        res.status(200).json({
            success: true,
            message: 'Resume updated successfully',
            data: resume
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

// @desc    Delete resume
// @route   DELETE /api/resumes/:id
const deleteResume = async (req, res) => {
    try {
        const resume = await Resume.findById(req.params.id);

        if (!resume) {
            return res.status(404).json({
                success: false,
                message: 'Resume not found'
            });
        }

        // Check ownership
        if (resume.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this resume'
            });
        }

        await Resume.findByIdAndDelete(req.params.id);

        // Log audit
        await AuditLog.create({
            userId: req.user._id,
            action: 'resume_delete',
            resource: 'Resume',
            resourceId: resume._id,
            details: { title: resume.title },
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
            status: 'success'
        });

        res.status(200).json({
            success: true,
            message: 'Resume deleted successfully'
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

// @desc    Download a resume as a PDF. If an `optimization` object (from a
//          prior POST /api/ai/optimize-resume call) is included in the body,
//          its revised bullet points and summary are baked into the PDF
//          instead of the resume's stored (un-optimized) wording.
// @route   POST /api/resumes/:id/download
const downloadResume = async (req, res) => {
    try {
        const resume = await Resume.findById(req.params.id);

        if (!resume) {
            return res.status(404).json({
                success: false,
                message: 'Resume not found'
            });
        }

        // Check ownership
        if (resume.userId.toString() !== req.user._id.toString() && req.user.role === 'user') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to download this resume'
            });
        }

        const { optimization, template = 'modern', accentColor = '#4F46E5' } = req.body || {};
        const pdfBuffer = await generateResumePDFBuffer(resume, optimization, { template, accentColor });

        await AuditLog.create({
            userId: req.user._id,
            action: 'resume_download',
            resource: 'Resume',
            resourceId: resume._id,
            details: { title: resume.title, optimized: Boolean(optimization), template, accentColor },
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
            status: 'success'
        });

        const safeFilename = resume.title.replace(/[^\w\- ]+/g, '') || 'resume';
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}.pdf"`);
        res.send(pdfBuffer);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate resume PDF',
            error: error.message
        });
    }
};

module.exports = {
    uploadResume,
    createResume,
    getUserResumes,
    getResumeById,
    updateResume,
    deleteResume,
    downloadResume
}