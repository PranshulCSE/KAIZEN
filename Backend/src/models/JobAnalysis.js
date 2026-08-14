const mongoose= require ('mongoose');

const jobAnalysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume'
  },
  jobDescription: {
    type: String,
    required: true
  },
  jobTitle: String,
  company: String,
  jobLink: String,
  analysis: {
    requiredSkills: [String],
    preferredSkills: [String],
    softSkills: [String],
    keywords: [String],
    roleResponsibilities: [String],
    companyCulture: [String],
    experienceLevel: String,
    educationRequirements: String,
    keyAchievements: [String],
    atsTips: [String]
  },
  matchScore: {
    overall: { type: Number, default: 0 },
    skillMatch: { type: Number, default: 0 },
    experienceMatch: { type: Number, default: 0 },
    educationMatch: { type: Number, default: 0 }
  },
  recommendations: [{
    type: String,
    priority: {
      type: String,
      enum: ['high', 'medium', 'low']
    },
    category: String,
    details: String
  }],
  interviewQuestions: {
    technical: [String],
    behavioral: [String],
    situational: [String],
    questionsForInterviewer: [String]
  }
}, {
  timestamps: true
});

jobAnalysisSchema.index({ userId: 1, createdAt: -1 });
jobAnalysisSchema.index({ resumeId: 1 });

const JobAnalysisModel= mongoose.model('JobAnalysis', jobAnalysisSchema);

module.exports={JobAnalysisModel};