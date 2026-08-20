const { GoogleGenerativeAI } = require('@google/generative-ai');
const logger = require('../utils/logger.js');
require('dotenv').config();


class AIService {
  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      // Don't crash the whole server just because AI isn't configured yet —
      // log a clear warning instead, and fail loudly only when an AI method is actually called.
      logger.warn('GEMINI_API_KEY is not set — AI features will not work until it is configured.');
    }
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    this.model = this.genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || 'gemini-3.6-flash'
    });
  }

  _ensureConfigured() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('AI features are not available: GEMINI_API_KEY is not configured on the server.');
    }
  }

  // Analyze Job Description
  async analyzeJobDescription(jobDescription) {
    this._ensureConfigured();
    const prompt = `
      You are an expert HR and recruitment specialist. Analyze this job description and provide ONLY valid JSON format:
      
      Job Description:
      ${jobDescription}
      
      Return ONLY this JSON structure, no markdown or extra text:
      {
        "requiredSkills": ["skill1", "skill2"],
        "preferredSkills": ["skill3"],
        "softSkills": ["communication", "leadership"],
        "keywords": ["keyword1", "keyword2"],
        "roleResponsibilities": ["responsibility1"],
        "companyCulture": ["value1"],
        "experienceLevel": "Mid",
        "educationRequirements": "Bachelor's degree",
        "keyAchievements": ["achievement1"],
        "atsTips": ["tip1"]
      }
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return JSON.parse(text);
    } catch (error) {
      console.error('AI Analysis Error:', error);
      throw new Error('Failed to analyze job description');
    }
  }

  // Optimize Resume for Job
  async optimizeResumeForJob(resumeContent, jobAnalysis) {
    this._ensureConfigured();
    const prompt = `
      You are an expert resume writer. Optimize this resume for the job requirements. Return ONLY valid JSON:
      
      Resume: ${JSON.stringify(resumeContent)}
      Job Analysis: ${JSON.stringify(jobAnalysis)}
      
      Return this JSON structure:
      {
        "optimizedBulletPoints": ["point1", "point2"],
        "skillImprovements": {
          "add": ["skill1"],
          "remove": ["skill2"],
          "emphasize": ["skill3"]
        },
        "summaryRewrite": "new summary",
        "keywordOptimization": "how to add keywords",
        "achievementMetrics": "suggestions for metrics",
        "atsScore": 75,
        "improvements": ["improvement1"],
        "beforeAfter": [{"before": "old", "after": "new"}]
      }
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return JSON.parse(text);
    } catch (error) {
      console.error('Optimization Error:', error);
      throw new Error('Failed to optimize resume');
    }
  }

  // Calculate ATS Score
  async calculateATSScore(resume, jobDescription) {
    this._ensureConfigured();
    const prompt = `
      You are an ATS scoring expert. Calculate a comprehensive ATS compatibility score. Return ONLY valid JSON:
      
      Resume: ${JSON.stringify(resume)}
      Job Description: ${jobDescription}
      
      Return this JSON:
      {
        "overallScore": 75,
        "keywordMatch": 80,
        "formatScore": 70,
        "experienceMatch": 75,
        "educationMatch": 60,
        "skillMatch": 85,
        "recommendations": ["recommendation1"],
        "missingKeywords": ["keyword1"],
        "formattingIssues": ["issue1"]
      }
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return JSON.parse(text);
    } catch (error) {
      console.error('ATS Score Error:', error);
      throw new Error('Failed to calculate ATS score');
    }
  }

  // Generate Interview Questions
  async generateInterviewQuestions(resume, jobDescription) {
    this._ensureConfigured();
    const prompt = `
      Generate interview questions based on this resume and job. Return ONLY valid JSON:
      
      Resume: ${JSON.stringify(resume)}
      Job Description: ${jobDescription}
      
      Return this JSON:
      {
        "technicalQuestions": ["question1"],
        "behavioralQuestions": ["question2"],
        "situationalQuestions": ["question3"],
        "questionsForInterviewer": ["question4"]
      }
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return JSON.parse(text);
    } catch (error) {
      console.error('Interview Questions Error:', error);
      throw new Error('Failed to generate interview questions');
    }
  }
}

const AI = new AIService();
module.exports = AI;