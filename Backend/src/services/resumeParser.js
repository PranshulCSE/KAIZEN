const pdfParse = require ('pdf-parse');
const mammoth = require ('mammoth');

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
    const content = {
      personalInfo: {
        name: this.extractName(text),
        email: this.extractEmail(text),
        phone: this.extractPhone(text),
        location: this.extractLocation(text),
        linkedin: this.extractLinkedIn(text),
        portfolio: this.extractPortfolio(text),
        summary: this.extractSummary(text)
      },
      skills: this.extractSkills(text),
      experience: this.extractExperience(text),
      education: this.extractEducation(text),
      certifications: this.extractCertifications(text),
      projects: this.extractProjects(text),
      languages: this.extractLanguages(text),
      interests: this.extractInterests(text)
    };

    return content;
  }

  extractName(text) {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    const ignorePatterns = [
      /^(resume|curriculum vitae|cv|page \d|contact|profile|summary|personal info)/i,
      /@/,
      /^\+?\d/,
      /^(https?:\/\/|www\.)/i,
      /^(experience|education|skills|projects|objective)/i
    ];

    for (const line of lines.slice(0, 8)) {
      if (line.length >= 2 && line.length <= 50 && !ignorePatterns.some(p => p.test(line))) {
        // Strip common prefixes
        const cleaned = line.replace(/^(name\s*[:\-]|candidate\s*[:\-])/i, '').trim();
        if (cleaned.length >= 2) return cleaned;
      }
    }
    return lines[0]?.trim() || 'Unknown';
  }

  extractEmail(text) {
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/;
    const match = text.match(emailRegex);
    return match ? match[0] : '';
  }

  extractPhone(text) {
    const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/;
    const match = text.match(phoneRegex);
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
    const linkedinRegex = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9\-]+)/;
    const match = text.match(linkedinRegex);
    return match ? match[0] : '';
  }

  extractPortfolio(text) {
    const urlRegex = /(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}/;
    const match = text.match(urlRegex);
    return match ? match[0] : '';
  }

  extractSummary(text) {
    const lines = text.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (/(summary|about|objective)/i.test(lines[i])) {
        return lines[i + 1]?.trim() || '';
      }
    }
    return '';
  }

  extractSkills(text) {
    const skillsRegex = /(?:skills?|competencies?):\s*([^]*?)(?=\n(?:experience|education|projects|certifications)|$)/i;
    const match = text.match(skillsRegex);
    
    if (match) {
      return match[1]
        .split(/[,;]|\n/)
        .map(skill => skill.trim())
        .filter(skill => skill.length > 0);
    }
    return [];
  }

  extractExperience(text) {
    const experienceRegex = /(?:experience|work history):\s*([^]*?)(?=\n(?:education|skills|projects|certifications)|$)/i;
    const match = text.match(experienceRegex);
    
    if (!match) return [];

    const experiences = [];
    const entries = match[1].split(/\n(?=[A-Z])/);

    for (const entry of entries) {
      const lines = entry.split('\n').filter(line => line.trim());
      if (lines.length > 0) {
        experiences.push({
          company: lines[0]?.trim() || '',
          role: lines[1]?.trim() || '',
          location: lines[2]?.trim() || '',
          bulletPoints: lines.slice(3).map(line => line.trim()),
          achievements: []
        });
      }
    }

    return experiences;
  }

  extractEducation(text) {
    const educationRegex = /(?:education|academic):\s*([^]*?)(?=\n(?:skills|experience|projects|certifications)|$)/i;
    const match = text.match(educationRegex);

    if (!match) return [];

    const education = [];
    const entries = match[1].split(/\n(?=[A-Z])/);

    for (const entry of entries) {
      const lines = entry.split('\n').filter(line => line.trim());
      if (lines.length > 0) {
        education.push({
          institution: lines[0]?.trim() || '',
          degree: lines[1]?.trim() || '',
          field: lines[2]?.trim() || '',
          achievements: lines.slice(3).map(line => line.trim())
        });
      }
    }

    return education;
  }

  extractCertifications(text) {
    const certRegex = /(?:certifications?|licenses?):\s*([^]*?)(?=\n(?:skills|experience|education|projects)|$)/i;
    const match = text.match(certRegex);

    if (!match) return [];

    return match[1]
      .split(/\n/)
      .map(cert => ({
        name: cert.trim(),
        issuer: '',
        date: null
      }))
      .filter(cert => cert.name.length > 0);
  }

  extractProjects(text) {
    const projectsRegex = /(?:projects?):\s*([^]*?)(?=\n(?:skills|experience|education|certifications)|$)/i;
    const match = text.match(projectsRegex);

    if (!match) return [];

    const projects = [];
    const entries = match[1].split(/\n(?=[A-Z])/);

    for (const entry of entries) {
      const lines = entry.split('\n').filter(line => line.trim());
      if (lines.length > 0) {
        projects.push({
          name: lines[0]?.trim() || '',
          description: lines[1]?.trim() || '',
          technologies: lines[2]?.split(',').map(t => t.trim()) || []
        });
      }
    }

    return projects;
  }

  extractLanguages(text) {
    const langRegex = /(?:languages?):\s*([^]*?)(?=\n(?:skills|experience|education|certifications)|$)/i;
    const match = text.match(langRegex);

    if (!match) return [];

    return match[1]
      .split(/[,;]|\n/)
      .map(lang => ({ name: lang.trim(), proficiency: 'Fluent' }))
      .filter(lang => lang.name.length > 0);
  }

  extractInterests(text) {
    const interestRegex = /(?:interests?):\s*([^]*?)$/i;
    const match = text.match(interestRegex);

    if (!match) return [];

    return match[1]
      .split(/[,;]|\n/)
      .map(interest => interest.trim())
      .filter(interest => interest.length > 0);
  }
}

module.exports = new ResumeParser();
