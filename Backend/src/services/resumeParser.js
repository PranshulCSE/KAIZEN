const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

// FIXED: real resumes put section headings on their own line (often ALL CAPS,
// no colon) — the old regexes required "Heading: content" inline, which
// almost never matches, so Skills/Experience/Education/Projects came back
// empty on every upload.
const SECTION_HEADINGS = {
  summary: ['summary', 'professional summary', 'objective', 'career objective', 'about', 'profile'],
  skills: ['skills', 'technical skills', 'core skills', 'competencies', 'key skills'],
  experience: ['experience', 'work experience', 'professional experience', 'work history', 'employment history'],
  education: ['education', 'academic background', 'academic qualifications'],
  certifications: ['certifications', 'certificates', 'licenses', 'licenses & certifications'],
  projects: ['projects', 'academic projects', 'personal projects', 'key projects'],
  languages: ['languages'],
  interests: ['interests', 'hobbies'],
};
const ALL_HEADING_WORDS = Object.values(SECTION_HEADINGS).flat();

class ResumeParser {
  async parsePDF(fileBuffer) {
    try {
      const data = await pdfParse(fileBuffer);
      return this.extractStructure(data.text);
    } catch (error) {
      console.error('PDF parsing error:', error);
      throw new Error('Failed to parse PDF');
    }
  }

  async parseDOCX(fileBuffer) {
    try {
      const result = await mammoth.extractRawText({ buffer: fileBuffer });
      return this.extractStructure(result.value);
    } catch (error) {
      console.error('DOCX parsing error:', error);
      throw new Error('Failed to parse DOCX');
    }
  }

  extractStructure(text) {
    return {
      personalInfo: {
        name: this.extractName(text),
        email: this.extractEmail(text),
        phone: this.extractPhone(text),
        location: this.extractLocation(text),
        linkedin: this.extractLinkedIn(text),
        portfolio: this.extractPortfolio(text),
        summary: this.extractSummary(text),
      },
      skills: this.extractSkills(text),
      experience: this.extractExperience(text),
      education: this.extractEducation(text),
      certifications: this.extractCertifications(text),
      projects: this.extractProjects(text),
      languages: this.extractLanguages(text),
      interests: this.extractInterests(text),
    };
  }

  // NEW: finds a section by its heading LINE (colon optional) and returns
  // everything up to the next known heading, instead of requiring inline
  // "Heading: content".
  _extractSection(text, sectionKey) {
    const headingWords = SECTION_HEADINGS[sectionKey];
    const lines = text.split('\n');

    const isHeadingLine = (line, words) => {
      const cleaned = line.trim().replace(/[:\-–—]+$/, '').trim();
      if (!cleaned) return false;
      return words.some((w) => new RegExp(`^${w}$`, 'i').test(cleaned));
    };

    let start = -1;
    for (let i = 0; i < lines.length; i++) {
      if (isHeadingLine(lines[i], headingWords)) { start = i + 1; break; }
    }
    if (start === -1) return '';

    let end = lines.length;
    for (let i = start; i < lines.length; i++) {
      if (isHeadingLine(lines[i], ALL_HEADING_WORDS)) { end = i; break; }
    }

    return lines.slice(start, end).join('\n').trim();
  }

  extractName(text) {
    const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
    const ignorePatterns = [
      /^(resume|curriculum vitae|cv|page \d|contact|profile|summary|personal info)/i,
      /@/,
      /^\+?\d/,
      /^(https?:\/\/|www\.)/i,
      /^(experience|education|skills|projects|objective)/i,
    ];
    for (const line of lines.slice(0, 8)) {
      if (line.length >= 2 && line.length <= 50 && !ignorePatterns.some((p) => p.test(line))) {
        const cleaned = line.replace(/^(name\s*[:\-]|candidate\s*[:\-])/i, '').trim();
        if (cleaned.length >= 2) return cleaned;
      }
    }
    return lines[0]?.trim() || 'Unknown';
  }

  extractEmail(text) {
    const match = text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/);
    return match ? match[0] : '';
  }

  extractPhone(text) {
    const match = text.match(/(\+?\d{1,3}[-.\s]?)?\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/);
    return match ? match[0] : '';
  }

  extractLocation(text) {
    const lines = text.split('\n');
    for (const line of lines) {
      if (/(city|location|address)/i.test(line)) {
        return line.replace(/(city|location|address):/i, '').trim();
      }
    }
    return '';
  }

  extractLinkedIn(text) {
    const match = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9\-]+)/);
    return match ? match[0] : '';
  }

  extractPortfolio(text) {
    const match = text.match(/(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}/);
    return match ? match[0] : '';
  }

  extractSummary(text) {
    // FIXED: was only grabbing the single line right after "summary" — most
    // summaries wrap across 2-4 lines and got truncated to one.
    return this._extractSection(text, 'summary');
  }

  extractSkills(text) {
    const block = this._extractSection(text, 'skills'); // FIXED: was requiring "Skills:" inline
    if (!block) return [];
    return block
      .split(/[,;\n]/)
      .map((skill) => skill.replace(/^[•\-*]\s*/, '').trim())
      .filter((skill) => skill.length > 0 && skill.length < 60);
  }

  extractExperience(text) {
    const block = this._extractSection(text, 'experience'); // FIXED
    if (!block) return [];
    const experiences = [];
    const entries = block.split(/\n(?=[A-Z])/);
    for (const entry of entries) {
      const lines = entry.split('\n').filter((line) => line.trim());
      if (lines.length > 0) {
        experiences.push({
          company: lines[0]?.trim() || '',
          role: lines[1]?.trim() || '',
          location: lines[2]?.trim() || '',
          bulletPoints: lines.slice(3).map((line) => line.trim()),
          achievements: [],
        });
      }
    }
    return experiences;
  }

  extractEducation(text) {
    const block = this._extractSection(text, 'education'); // FIXED
    if (!block) return [];
    const education = [];
    const entries = block.split(/\n(?=[A-Z])/);
    for (const entry of entries) {
      const lines = entry.split('\n').filter((line) => line.trim());
      if (lines.length > 0) {
        education.push({
          institution: lines[0]?.trim() || '',
          degree: lines[1]?.trim() || '',
          field: lines[2]?.trim() || '',
          achievements: lines.slice(3).map((line) => line.trim()),
        });
      }
    }
    return education;
  }

  extractCertifications(text) {
    const block = this._extractSection(text, 'certifications'); // FIXED
    if (!block) return [];
    return block
      .split('\n')
      .map((cert) => ({ name: cert.trim(), issuer: '', date: null }))
      .filter((cert) => cert.name.length > 0);
  }

  extractProjects(text) {
    const block = this._extractSection(text, 'projects'); // FIXED
    if (!block) return [];
    const projects = [];
    const entries = block.split(/\n(?=[A-Z])/);
    for (const entry of entries) {
      const lines = entry.split('\n').filter((line) => line.trim());
      if (lines.length > 0) {
        projects.push({
          name: lines[0]?.trim() || '',
          description: lines[1]?.trim() || '',
          technologies: lines[2]?.split(',').map((t) => t.trim()) || [],
        });
      }
    }
    return projects;
  }

  extractLanguages(text) {
    const block = this._extractSection(text, 'languages'); // FIXED
    if (!block) return [];
    return block
      .split(/[,;\n]/)
      .map((lang) => lang.trim())
      .filter((lang) => lang.length > 0)
      .map((name) => ({ name, proficiency: 'Fluent' }));
  }

  extractInterests(text) {
    const block = this._extractSection(text, 'interests'); // FIXED
    if (!block) return [];
    return block
      .split(/[,;\n]/)
      .map((interest) => interest.trim())
      .filter((interest) => interest.length > 0);
  }
}

module.exports = new ResumeParser();