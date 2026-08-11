const { GoogleGenerativeAI } = require('@google/generative-ai');

class AIService {
    constructor() {
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    }

    // Analyze Job Description
    async analyzeJobDescription(jobDescription) {
        const prompt = `
      You are an expert HR and recruitment specialist. Analyze this job description and provide:
      
      Job Description:
      ${jobDescription}
      
      Please provide the following in JSON format:
      1. requiredSkills: Array of required technical skills
      2. preferredSkills: Array of preferred/nice-to-have skills
      3. softSkills: Array of required soft skills
      4. keywords: Array of top 20 important keywords for ATS
      5. roleResponsibilities: Array of main responsibilities
      6. companyCulture: Key indicators about company culture
      7. experienceLevel: Required experience level (Entry, Mid, Senior, Lead)
      8. educationRequirements: Required education
      9. keyAchievements: What achievements would make a candidate stand out
      10. atsTips: Array of tips for ATS optimization
      
      Return ONLY valid JSON, no additional text.
    `;

        try {
            const result = await this.model.generateContent(prompt);
            const response = result.response;
            const text = response.text();

            // Parse JSON from response
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
        const prompt = `
      You are an expert resume writer and ATS optimization specialist.
      
      Resume Content:
      ${JSON.stringify(resumeContent, null, 2)}
      
      Job Analysis:
      ${JSON.stringify(jobAnalysis, null, 2)}
      
      Please optimize this resume for the job and provide:
      
      1. optimizedBulletPoints: Array of optimized bullet points for each experience entry
      2. skillImprovements: {
          add: [skills to add],
          remove: [skills to remove],
          emphasize: [skills to highlight]
        }
      3. summaryRewrite: A new, compelling professional summary
      4. keywordOptimization: How to incorporate key keywords naturally
      5. achievementMetrics: Suggestions for adding metrics to achievements
      6. atsScore: Predicted ATS score (0-100)
      7. improvements: Array of specific improvement suggestions
      8. beforeAfter: Array of before/after examples for bullet points
      
      Return ONLY valid JSON, no additional text.
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

    // Generate ATS-Friendly Resume
    async generateATSResume(resumeContent, jobAnalysis) {
        const prompt = `
      You are an ATS optimization expert. Create an ATS-friendly version of this resume.
      
      Original Resume:
      ${JSON.stringify(resumeContent, null, 2)}
      
      Job Requirements:
      ${JSON.stringify(jobAnalysis, null, 2)}
      
      Create an optimized version that:
      1. Uses standard section headers (Experience, Education, Skills, etc.)
      2. Incorporates relevant keywords naturally
      3. Uses action verbs and quantifies achievements
      4. Has clean, scannable formatting
      5. Eliminates any formatting that confuses ATS
      
      Return the optimized resume in the same structure with:
      1. atsOptimizedContent: The full optimized resume content
      2. keywordDensity: Keyword usage statistics
      3. improvements: List of changes made
      
      Return ONLY valid JSON, no additional text.
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
            console.error('ATS Generation Error:', error);
            throw new Error('Failed to generate ATS-friendly resume');
        }
    }

    // Generate Interview Questions
    async generateInterviewQuestions(resume, jobDescription) {
        const prompt = `
      Based on this resume and job description, generate potential interview questions.
      
      Resume: ${JSON.stringify(resume)}
      Job Description: ${jobDescription}
      
      Generate:
      1. technicalQuestions: 5-7 technical questions
      2. behavioralQuestions: 5-7 behavioral questions
      3. situationalQuestions: 5-7 situational questions
      4. questionsForInterviewer: 3-5 questions the candidate should ask
      
      Return ONLY valid JSON.
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

    // Calculate ATS Score
    async calculateATSScore(resume, jobDescription) {
        const prompt = `
      You are an ATS scoring expert. Calculate an ATS compatibility score.
      
      Resume: ${JSON.stringify(resume)}
      Job Description: ${jobDescription}
      
      Provide a comprehensive score analysis:
      1. overallScore: 0-100
      2. keywordMatch: 0-100
      3. formatScore: 0-100
      4. experienceMatch: 0-100
      5. educationMatch: 0-100
      6. skillMatch: 0-100
      7. recommendations: Array of specific recommendations to improve score
      8. missingKeywords: Array of important keywords missing
      9. formattingIssues: Array of formatting issues found
      
      Return ONLY valid JSON.
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
}

module.exports = new AIService();