const { GoogleGenerativeAI } = require('@google/generative-ai');
const logger = require('../utils/logger.js');
require('dotenv').config();

// NEW: shared ATS writing/scoring standard, injected into every prompt that
// touches resume content so generation and scoring both use the same rubric.
const ATS_RESUME_STANDARD = `
ATS-FRIENDLY RESUME STANDARD (apply strictly):
- Reverse-chronological order, standard section names only (Summary, Experience, Education, Skills, Projects, Certifications) — never invent creative section headers.
- Every bullet starts with a strong action verb in past tense for past roles, present tense for current roles (Built, Led, Reduced, Automated, Designed, Architected) — never "Responsible for" / "Worked on" / "Helped with".
- Quantify wherever the source material supports it: numbers, %, time saved, users/requests handled, team size, revenue/cost impact (e.g. "Reduced API p95 latency by 40% by introducing Redis caching across 3 high-traffic endpoints").
- Bullets are 1-2 lines, no personal pronouns ("I", "my"), no filler words.
- Naturally mirror the exact keywords/tools/certifications the job description uses — each keyword must appear inside a real, coherent sentence. Never keyword-stuff a list.
- A resume summary is 2-4 lines: role/title + (years of experience, only if derivable from the resume's own dates) + top 2-3 skills relevant to the target job + one standout, quantified achievement.
- Never use vague, unverifiable adjectives ("hardworking", "team player", "passionate") unless immediately backed by a concrete, specific example in the same sentence.
`;

// NEW: the single hard rule that matters most for resume-writing tasks —
// stated once, referenced by every prompt that rewrites resume content.
const NO_FABRICATION_RULE = `
CRITICAL — DO NOT FABRICATE:
- Only use companies, job titles, dates, degrees, institutions, certifications, and technologies that are ALREADY present in the resume/content given to you below.
- Never invent a metric, percentage, or number that isn't implied by the source text. If a bullet has no quantifiable result to cite, strengthen it with a sharper action verb and clearer scope/ownership instead of inventing a fake statistic.
- If information needed to fully satisfy a rule above is missing from the source (e.g. no dates given), simply omit that detail rather than guessing or inventing one.
- You may rephrase, reorder, quantify-if-derivable, and re-emphasize existing content — you may NOT add new employers, projects, or achievements that were not in the input.
`;

// NEW: repeated at the end of every prompt so the model doesn't wrap JSON in
// markdown fences or add commentary around it, even though responseMimeType
// already asks the API to enforce this at the transport level.
const OUTPUT_RULES = `
OUTPUT FORMAT RULES:
- Return ONLY the raw JSON object matching the exact structure given below.
- No markdown code fences (no \`\`\`), no explanations, no preamble, no postamble — just the JSON object itself.
- Every field in the structure must be present. Use an empty array/string (not null, not omission) if you genuinely have nothing to put there.
`;

class AIService {
  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      // Don't crash the whole server just because AI isn't configured yet —
      // log a clear warning instead, and fail loudly only when an AI method is actually called.
      logger.warn('GEMINI_API_KEY is not set — AI features will not work until it is configured.');
    }
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    this.model = this.genAI.getGenerativeModel({
      // NOTE: gemini-3.6-flash is a real, current GA model (verified against
      // Google's Gemini API release notes) — left as-is, not a bug.
      model: process.env.GEMINI_MODEL || 'gemini-3.6-flash',
      // NEW: ask the API to return raw JSON directly instead of relying
      // solely on regex-scraping markdown-wrapped text out of a free-form
      // response — much more reliable for structured output.
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.4,
      },
    });
  }

  _ensureConfigured() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('AI features are not available: GEMINI_API_KEY is not configured on the server.');
    }
  }

  // NEW: shared, single source of truth for turning a model response into
  // parsed JSON. FIXED: this logic used to be copy-pasted 4 times (once per
  // method below), each with the same brittle "find the first {...}" regex
  // and no fallback if the model wrapped the JSON in markdown fences.
  _parseJSONResponse(text) {
    const cleaned = text.replace(/```json\s*|```/g, '').trim();
    try {
      return JSON.parse(cleaned);
    } catch {
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('AI response was not valid JSON.');
    }
  }

  async _generateJSON(prompt, errorContext) {
    try {
      const result = await this.model.generateContent(prompt);
      const text = result.response.text();
      return this._parseJSONResponse(text);
    } catch (error) {
      console.error(`${errorContext} Error:`, error);
      // FIXED: previously threw a generic message and discarded the real
      // error entirely, making failures (bad API key, rate limit, malformed
      // JSON, network error) indistinguishable from the server logs alone.
      throw new Error(`Failed to ${errorContext.toLowerCase()}: ${error.message}`, { cause: error });
    }
  }

  // Analyze Job Description
  async analyzeJobDescription(jobDescription) {
    this._ensureConfigured();
    // NEW: basic input validation — previously an empty/near-empty string
    // would still trigger a full API call for a useless result.
    if (!jobDescription || typeof jobDescription !== 'string' || jobDescription.trim().length < 20) {
      throw new Error('A valid, non-empty job description (at least 20 characters) is required.');
    }

    const prompt = `
You are a senior technical recruiter and ATS (Applicant Tracking System) configuration specialist with 15+ years of experience screening resumes for technology roles. You are extremely precise: you extract only what the job description actually states or clearly implies, and you never pad the output with generic boilerplate skills that aren't relevant to this specific posting.

TASK: Read the job description below and extract a structured breakdown of it that a candidate could use to tailor their resume.

Guidance per field:
- requiredSkills: hard/technical skills explicitly stated as required, must-have, or clearly non-negotiable (languages, frameworks, tools, platforms, certifications).
- preferredSkills: skills described as "nice to have", "preferred", "a plus", or implied as secondary.
- softSkills: interpersonal/behavioral traits explicitly mentioned or strongly implied by the responsibilities described (e.g. "collaborate cross-functionally" implies communication/collaboration).
- keywords: the specific nouns/phrases an ATS keyword scan would look for — exact tool names, methodologies (e.g. "Agile", "CI/CD"), domain terms, and role-specific jargon used verbatim in the posting.
- roleResponsibilities: the actual day-to-day duties described, written as concise action phrases.
- companyCulture: values, working style, or team culture signals mentioned (e.g. "fast-paced startup", "remote-first", "mentorship-focused") — return an empty array if the posting gives no signal, don't invent one.
- experienceLevel: one of "Entry", "Junior", "Mid", "Senior", "Lead", or "Not specified" — infer conservatively from years-of-experience language or seniority of the title, don't guess if genuinely ambiguous.
- educationRequirements: quote or closely paraphrase what's stated; use "Not specified" if the posting says nothing about education.
- keyAchievements: the kinds of accomplishments this role expects someone to eventually point to (e.g. "shipped features that scaled to X users") — only if the posting gives enough signal to infer this; otherwise empty array.
- atsTips: 3-5 concrete, specific tips for how a candidate should tailor their resume for THIS posting (not generic advice) — reference the actual skills/keywords you extracted above.

Job Description:
"""
${jobDescription}
"""

Return exactly this JSON structure:
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
${OUTPUT_RULES}
    `;

    return this._generateJSON(prompt, 'Analyze job description');
  }

  // Parse raw PDF / DOCX extracted text into 100% accurate structured resume JSON
  async parseResumeTextWithAI(rawText) {
    this._ensureConfigured();
    if (!rawText || typeof rawText !== 'string' || rawText.trim().length < 20) {
      throw new Error('Raw text of at least 20 characters is required for parsing.');
    }

    const prompt = `
You are an expert ATS parser and resume structure extractor. Extract every piece of candidate data from the raw extracted resume text below into a clean, normalized, structured JSON format.

${NO_FABRICATION_RULE}

TASK: Extract all information strictly from the provided raw text. If any field is missing from the text, use an empty string or empty array — NEVER invent fake info.

Raw Resume Text:
"""
${rawText.slice(0, 10000)}
"""

Return exactly this JSON structure:
{
  "personalInfo": {
    "name": "Full Name",
    "email": "email@example.com",
    "phone": "+1 234 567 8900",
    "location": "City, State / Country",
    "linkedin": "linkedin.com/in/...",
    "portfolio": "github.com/... or website",
    "summary": "Full professional summary text (or empty string)"
  },
  "skills": ["Skill 1", "Skill 2"],
  "experience": [
    {
      "role": "Job Title",
      "company": "Company Name",
      "location": "Location",
      "startDate": "YYYY-MM-DD or YYYY or null",
      "endDate": "YYYY-MM-DD or YYYY or null",
      "isCurrent": false,
      "bulletPoints": [
        "Full achievement bullet point text"
      ]
    }
  ],
  "education": [
    {
      "degree": "Degree (e.g. Bachelor of Science)",
      "institution": "University / College Name",
      "field": "Field of Study",
      "startYear": "YYYY",
      "endYear": "YYYY",
      "gpa": "GPA or empty string"
    }
  ],
  "projects": [
    {
      "name": "Project Name",
      "technologies": ["Tech 1", "Tech 2"],
      "description": "Short description",
      "bulletPoints": ["Bullet point 1"],
      "link": "URL or empty string"
    }
  ],
  "certifications": [
    {
      "name": "Certification Name",
      "issuer": "Issuing Org",
      "date": "YYYY-MM-DD or YYYY or null"
    }
  ],
  "languages": ["Language 1"],
  "interests": []
}
${OUTPUT_RULES}
    `;

    return this._generateJSON(prompt, 'Parse resume text with AI');
  }

  // Optimize Resume for Job (returns both suggestions and full directOptimizedContent)
  async optimizeResumeForJob(resumeContent, jobAnalysis) {
    this._ensureConfigured();
    if (!resumeContent || typeof resumeContent !== 'object') {
      throw new Error('A parsed resume object is required to optimize it.');
    }
    if (!jobAnalysis || typeof jobAnalysis !== 'object') {
      throw new Error('A job analysis object is required to optimize the resume against.');
    }

    const prompt = `
You are an elite principal resume writer and ATS optimization engine. You rewrite the candidate's entire resume to match the target job with 95+ ATS compatibility, quantified metrics, and authoritative action verbs — without fabricating false employers or unearned degrees.

${ATS_RESUME_STANDARD}
${NO_FABRICATION_RULE}

TASK:
1. Optimize every bullet point in candidate's experience to directly showcase skills required by the job analysis.
2. Rewrite the professional summary into a high-converting 2-3 line hook.
3. Prioritize skills matching the job description.
4. Produce a complete "directOptimizedContent" JSON object that can be directly exported as a flawless 1-2 page ATS PDF.

Candidate's Resume Content:
"""
${JSON.stringify(resumeContent)}
"""

Job Analysis:
"""
${JSON.stringify(jobAnalysis)}
"""

Return exactly this JSON structure:
{
  "optimizedBulletPoints": ["rewritten bullet 1", "rewritten bullet 2"],
  "skillImprovements": {
    "add": ["relevant missing skill"],
    "remove": ["outdated skill"],
    "emphasize": ["core matched skill"]
  },
  "summaryRewrite": "2-3 line magnetic tailored professional summary",
  "keywordOptimization": "placement advice for top keywords",
  "achievementMetrics": "quantification suggestions",
  "atsScore": 88,
  "improvements": ["improvement action 1", "improvement action 2"],
  "beforeAfter": [{"before": "original text", "after": "improved text"}],
  "directOptimizedContent": {
    "personalInfo": {
      "name": "Candidate Name",
      "email": "email",
      "phone": "phone",
      "location": "location",
      "linkedin": "linkedin",
      "portfolio": "portfolio",
      "summary": "new summary"
    },
    "experience": [
      {
        "role": "Role",
        "company": "Company",
        "location": "Location",
        "startDate": "startDate",
        "endDate": "endDate",
        "isCurrent": false,
        "bulletPoints": [
          "Strong action verb + quantified metric + target tech bullet"
        ]
      }
    ],
    "education": [
      {
        "degree": "Degree",
        "institution": "Institution",
        "field": "Field",
        "endYear": "Year",
        "gpa": "GPA"
      }
    ],
    "skills": ["Top matched skill 1", "Skill 2", "Skill 3"],
    "projects": [
      {
        "name": "Project Name",
        "technologies": ["Tech 1", "Tech 2"],
        "description": "Overview",
        "bulletPoints": ["Quantified bullet 1"],
        "link": "url"
      }
    ],
    "certifications": []
  }
}
${OUTPUT_RULES}
    `;

    return this._generateJSON(prompt, 'Optimize resume');
  }

  // Calculate ATS Score
  async calculateATSScore(resume, jobDescription) {
    this._ensureConfigured();
    if (!resume || typeof resume !== 'object') {
      throw new Error('A parsed resume object is required to calculate an ATS score.');
    }
    if (!jobDescription || typeof jobDescription !== 'string' || jobDescription.trim().length < 20) {
      throw new Error('A valid, non-empty job description (at least 20 characters) is required.');
    }

    const prompt = `
You are an ATS (Applicant Tracking System) compatibility scoring engine, modeling how real-world systems (Workday, Greenhouse, Taleo, iCIMS) parse and rank resumes against a job posting. You score conservatively and explain your reasoning through the recommendations you give — you don't hand out inflated scores.

${ATS_RESUME_STANDARD}

TASK: Score how well the candidate's resume (given as structured content, not a raw file) matches the job description, across the categories below.

Guidance per field:
- overallScore: 0-100, weighted composite of the sub-scores below.
- keywordMatch: 0-100, based on how many of the job's key skills/tools/terms appear (verbatim or as a clear synonym) in the resume.
- formatScore: 0-100 — since you're given structured JSON (not the raw PDF layout), judge this on structural ATS-friendliness: are section labels standard, are dates consistent/parseable, is there a skills section, are achievements bullet-based rather than dense paragraphs.
- experienceMatch: 0-100, how well the candidate's work history/seniority aligns with what the job expects.
- educationMatch: 0-100, how well the resume's education aligns with the job's stated requirements (score 100 if the job specifies no requirement and the candidate has any relevant education).
- skillMatch: 0-100, overlap between the resume's skills section and the job's required+preferred skills.
- recommendations: 3-6 specific, prioritized actions — reference the actual gaps you found, not generic advice.
- missingKeywords: keywords/skills the job description uses that do NOT appear anywhere in the resume (check synonyms before flagging — e.g. "JS" counts as "JavaScript").
- formattingIssues: structural issues only (see formatScore guidance above) — e.g. "no dedicated Skills section", "experience entries missing dates". Empty array if none found.

Resume Content:
"""
${JSON.stringify(resume)}
"""

Job Description:
"""
${jobDescription}
"""

Return exactly this JSON structure:
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
${OUTPUT_RULES}
    `;

    return this._generateJSON(prompt, 'Calculate ATS score');
  }

  // Generate Interview Questions
  async generateInterviewQuestions(resume, jobDescription) {
    this._ensureConfigured();
    if (!resume || typeof resume !== 'object') {
      throw new Error('A parsed resume object is required to generate interview questions.');
    }
    if (!jobDescription || typeof jobDescription !== 'string' || jobDescription.trim().length < 20) {
      throw new Error('A valid, non-empty job description (at least 20 characters) is required.');
    }

    const prompt = `
You are a hiring manager and technical interviewer preparing a candidate-specific interview kit. Every question you write must clearly connect to either something specific in THIS candidate's resume or something specific in THIS job description — never generic, interchangeable-with-any-candidate questions.

TASK: Generate an interview question set tailored to this exact candidate and role.

Guidance per field:
- technicalQuestions: reference specific technologies, projects, or achievements actually named in the resume below (e.g. if the resume mentions "built a Redis caching layer", ask them to go deeper on that decision) — cross-checked against what the job actually requires.
- behavioralQuestions: STAR-friendly prompts ("Tell me about a time you...") tied to responsibilities in the resume or job description — not generic culture-fit filler.
- situationalQuestions: hypothetical scenarios directly relevant to the day-to-day responsibilities in the job description.
- questionsForInterviewer: 2-4 sharp questions this candidate should ask the interviewer, informed by gaps or ambiguities between their resume and the job description.

Resume Content:
"""
${JSON.stringify(resume)}
"""

Job Description:
"""
${jobDescription}
"""

Return exactly this JSON structure:
{
  "technicalQuestions": ["question1"],
  "behavioralQuestions": ["question2"],
  "situationalQuestions": ["question3"],
  "questionsForInterviewer": ["question4"]
}
${OUTPUT_RULES}
    `;

    return this._generateJSON(prompt, 'Generate interview questions');
  }

  // Generate Tailored Cover Letter
  async generateCoverLetter(resumeContent, jobAnalysis, options = {}) {
    this._ensureConfigured();
    if (!resumeContent || typeof resumeContent !== 'object') {
      throw new Error('A parsed resume object is required to generate a cover letter.');
    }

    const {
      tone = 'confident',
      target = 'hiring_manager',
      company = jobAnalysis?.company || 'the hiring team',
      jobTitle = jobAnalysis?.jobTitle || 'the open role',
      extraNotes = ''
    } = options;

    const prompt = `
You are an elite career strategist and executive copywriter. You write compelling, persuasive, and authentic cover letters that immediately capture hiring managers' attention. You NEVER use generic clichés like "I am writing to express my enthusiasm for..." or "I believe I am the ideal candidate because...".

${NO_FABRICATION_RULE}

Tone Style: ${tone.toUpperCase()} (e.g. confident = authoritative & outcome-driven, enthusiastic = passionate & energetic, professional = polished & structured, direct = concise & punchy).
Target Recipient: ${target.replace('_', ' ').toUpperCase()} at ${company} for the role of ${jobTitle}.
Additional User Instructions: ${extraNotes || 'None'}

TASK: Write a customized, compelling cover letter grounded STRICTLY in the candidate's actual resume experience and tailored to the job analysis.

Guidance:
- subject: High-impact email/application subject line.
- salutation: Appropriate greeting for ${target}.
- openingParagraph: A magnetic hook highlighting 1 standout achievement or aligned passion.
- bodyParagraph1: Deep dive into the candidate's top 1-2 relevant technical projects or work experiences from the resume that solve the job's core challenges.
- bodyParagraph2: Emphasize ownership, problem-solving, and cross-functional impact directly relevant to the role responsibilities.
- closingParagraph: Confident call-to-action inviting a conversation, stating availability without being pushy.
- fullLetter: The complete assembled letter ready for copy/pasting.
- keyHighlights: 3 quick bulleted proof points why this candidate matches.
- matchingScore: 0-100 estimate of narrative fit.

Candidate Resume:
"""
${JSON.stringify(resumeContent)}
"""

Target Job Analysis / Description:
"""
${JSON.stringify(jobAnalysis)}
"""

Return exactly this JSON structure:
{
  "subject": "Application for Role - Name",
  "salutation": "Dear Hiring Manager,",
  "openingParagraph": "...",
  "bodyParagraph1": "...",
  "bodyParagraph2": "...",
  "closingParagraph": "...",
  "signoff": "Sincerely,\\n[Candidate Name]",
  "fullLetter": "Complete letter text...",
  "keyHighlights": ["Highlight 1", "Highlight 2", "Highlight 3"],
  "matchingScore": 90
}
${OUTPUT_RULES}
    `;

    return this._generateJSON(prompt, 'Generate cover letter');
  }

  // Generate Cold Outreach & Networking Messages
  async generateColdOutreach(resumeContent, jobAnalysis, options = {}) {
    this._ensureConfigured();

    const {
      platform = 'linkedin_inmail',
      recipientRole = 'Hiring Manager',
      company = jobAnalysis?.company || 'Target Company',
      jobTitle = jobAnalysis?.jobTitle || 'Target Role'
    } = options;

    const prompt = `
You are a world-class tech recruiter and networking coach. You write ultra-high-converting cold outreach messages that get responses from busy hiring managers, founders, and recruiters.

${NO_FABRICATION_RULE}

Outreach Context:
- Platform: ${platform}
- Target Recipient Role: ${recipientRole}
- Target Company: ${company}
- Target Job: ${jobTitle}

TASK: Generate a multi-format outreach kit tailored to this candidate and company.

Guidance per field:
- subject: Catchy, non-spammy subject line (under 50 chars).
- message: The full cold email / InMail body (under 150 words — concise, value-first, mentions 1 specific metric or project from the resume, with a low-friction ask like "Open to a 10-min chat next week?").
- connectionNote: LinkedIn connection request note (STRICTLY UNDER 280 CHARACTERS including spaces — friendly, punchy, contextual).
- followUpTemplate: A polite follow-up message to send 4-5 days later if no reply.
- strategyTips: 2-3 tactical tips for reaching this person (e.g. best time to send, personalization hook).

Candidate Resume:
"""
${JSON.stringify(resumeContent)}
"""

Target Job Analysis:
"""
${JSON.stringify(jobAnalysis)}
"""

Return exactly this JSON structure:
{
  "subject": "...",
  "message": "...",
  "connectionNote": "...",
  "followUpTemplate": "...",
  "strategyTips": ["Tip 1", "Tip 2"]
}
${OUTPUT_RULES}
    `;

    return this._generateJSON(prompt, 'Generate cold outreach');
  }

  // Generate Quantified Resume Project Bullets from GitHub Repos
  async generateGitHubProjectBullets(repositories, targetRole = 'Software Engineer') {
    this._ensureConfigured();
    if (!Array.isArray(repositories) || repositories.length === 0) {
      throw new Error('At least one repository object is required.');
    }

    const prompt = `
You are an expert technical resume writer. You convert raw GitHub repository metadata (repo name, description, primary language, topics, stars) into polished, high-impact resume project entries.

${ATS_RESUME_STANDARD}

Target Role Context: ${targetRole}

TASK: For each repository provided below, produce an ATS-optimized Project section entry for a tech resume.

Guidance per project:
- name: Clean display name of the project.
- technologies: Array of technologies derived from languages, topics, and description.
- description: Concise 1-line summary of what the project does.
- bulletPoints: 2-3 quantified, action-verb driven bullets following the ATS standard (e.g., "Architected a full-stack web application with...", "Engineered responsive UI using...", "Integrated RESTful APIs handling..."). Do not invent fake business revenue, but emphasize architectural scale, design patterns, and technical execution.
- link: URL to the repository.

Repositories:
"""
${JSON.stringify(repositories)}
"""

Return exactly this JSON structure:
{
  "projects": [
    {
      "name": "Project Name",
      "technologies": ["React", "Node.js"],
      "description": "Short project description",
      "bulletPoints": [
        "Bullet 1 with strong action verb",
        "Bullet 2 highlighting technical implementation"
      ],
      "link": "https://github.com/..."
    }
  ]
}
${OUTPUT_RULES}
    `;

    return this._generateJSON(prompt, 'Generate GitHub project bullets');
  }

  // AI Inline Bullet Point Copilot
  async improveBulletPoint(bulletText, action = 'stronger', options = {}) {
    this._ensureConfigured();
    if (!bulletText || typeof bulletText !== 'string' || bulletText.trim().length < 5) {
      throw new Error('A bullet point text (at least 5 characters) is required.');
    }

    const { targetRole = 'Software Engineer', extraContext = '' } = options;

    const actionDescriptions = {
      stronger: 'Strengthen action verbs, elevate ownership, remove passive voice and filler words.',
      metrics: 'Quantify impact, prompt for realistic latency/scale/efficiency metrics, highlight business and technical outcomes.',
      shorten: 'Make concise, ultra-punchy, single-line ATS bullet without losing core achievement.',
      leadership: 'Highlight mentorship, technical decision making, cross-functional collaboration, and architectural ownership.',
      tailor: `Tailor specifically for the role of ${targetRole}, incorporating high-demand industry keywords.`
    };

    const prompt = `
You are a principal technical recruiter and resume copilot. Rewrite the given bullet point with extreme precision and impact.

${ATS_RESUME_STANDARD}
${NO_FABRICATION_RULE}

Transformation Goal: ${action.toUpperCase()} (${actionDescriptions[action] || actionDescriptions.stronger})
Target Role Context: ${targetRole}
Extra Instructions: ${extraContext || 'None'}

Original Bullet Point:
"""
${bulletText}
"""

TASK: Provide 3 high-impact alternative variations of this bullet point, each optimizing for different nuances of the goal, along with an explanation of what makes each version superior.

Return exactly this JSON structure:
{
  "original": "${bulletText.replace(/"/g, '\\"')}",
  "action": "${action}",
  "suggestions": [
    {
      "text": "Rewritten bullet point 1...",
      "highlight": "Stronger verb + scale",
      "impactScore": 95
    },
    {
      "text": "Rewritten bullet point 2...",
      "highlight": "Metric & efficiency focused",
      "impactScore": 92
    },
    {
      "text": "Rewritten bullet point 3...",
      "highlight": "Architecture & ownership focused",
      "impactScore": 90
    }
  ],
  "atsTips": "Quick 1-sentence tip on how recruiters evaluate this type of bullet."
}
${OUTPUT_RULES}
    `;

    return this._generateJSON(prompt, 'Improve bullet point');
  }

  // Real-time AI Mock Interview Turn Evaluator
  async evaluateInterviewTurn(history, currentAnswer, targetRole = 'Software Engineer', resumeSummary = {}) {
    this._ensureConfigured();

    const lastQuestion = history[history.length - 1]?.question || 'Tell me about yourself and your background.';

    const prompt = `
You are a Senior Principal Interviewer conducting an interactive, professional mock interview for a ${targetRole} position.

Candidate Resume Context:
"""
${JSON.stringify(resumeSummary)}
"""

Interview History so far:
"""
${JSON.stringify(history)}
"""

Current Question:
"${lastQuestion}"

Candidate's Answer:
"""
${currentAnswer}
"""

TASK:
1. Evaluate the candidate's answer using the STAR method (Situation, Task, Action, Result).
2. Rate the answer on a scale of 1-10.
3. Provide constructive, encouraging feedback highlighting strengths and missing elements.
4. Provide a sample "Ideal Answer" showing how a top 1% candidate would phrase this.
5. Formulate the NEXT logical question for the interview (vary between Technical Deep Dive, System Design/Architecture, Behavioral/Conflict, and Impact).

Return exactly this JSON structure:
{
  "score": 8,
  "starBreakdown": {
    "situation": "Clear context established...",
    "task": "Identified core challenge...",
    "action": "Explained specific steps taken...",
    "result": "Quantified outcome / impact..."
  },
  "feedback": "2-3 sentences of sharp, constructive feedback...",
  "strengths": ["Clear technical explanation", "Good ownership"],
  "improvementTips": ["Could quantify latency reduction or team size"],
  "idealAnswer": "How an elite candidate would answer...",
  "nextQuestion": "The next interview question to ask...",
  "questionCategory": "Technical Deep Dive",
  "isInterviewComplete": false
}
${OUTPUT_RULES}
    `;

    return this._generateJSON(prompt, 'Evaluate interview turn');
  }

  // Final Mock Interview Performance Summary
  async generateInterviewSummary(fullTranscript, targetRole = 'Software Engineer') {
    this._ensureConfigured();

    const prompt = `
You are the Interview Hiring Committee Lead evaluating a completed mock interview for a ${targetRole} candidate.

Full Interview Transcript:
"""
${JSON.stringify(fullTranscript)}
"""

TASK: Generate a comprehensive post-interview assessment scorecard.

Guidance:
- overallScore: 0-100 composite score.
- recommendation: One of "Strong Hire", "Hire", "Lean Hire", "Needs Work".
- breakdown: Scores out of 100 for Technical Proficiency, Communication & Clarity, Problem Solving & Structure, Behavioral / STAR Alignment.
- keyStrengths: 3-4 specific strengths observed during the session.
- areasForGrowth: 3-4 actionable tips to improve interview performance.
- summaryNotes: 2-3 paragraph executive summary of the candidate's performance.

Return exactly this JSON structure:
{
  "overallScore": 88,
  "recommendation": "Hire",
  "breakdown": {
    "technical": 85,
    "communication": 90,
    "problemSolving": 88,
    "starMethod": 86
  },
  "keyStrengths": ["Strength 1", "Strength 2", "Strength 3"],
  "areasForGrowth": ["Area 1", "Area 2", "Area 3"],
  "summaryNotes": "Executive evaluation paragraph..."
}
${OUTPUT_RULES}
    `;

    return this._generateJSON(prompt, 'Generate interview summary');
  }
}

const AI = new AIService();
module.exports = AI;
