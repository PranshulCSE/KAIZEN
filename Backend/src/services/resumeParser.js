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

  // FIXED: pdf-parse occasionally drops the space between two adjacent text
  // runs that sit next to each other in the layout (e.g. a right-aligned
  // date glued onto a title: "Engineer02/05/2024"). These four patterns are
  // safe to repair — digit/letter boundaries and punctuation glued to the
  // next word — and deliberately do NOT touch lowercase→uppercase
  // transitions, because that would shred real compound tech terms like
  // "JavaScript", "GraphQL", "PostgreSQL", "DevOps", "GitHub".
  _repairSpacing(text) {
    return text
      .replace(/([a-zA-Z])(\d)/g, '$1 $2')
      .replace(/(\d)([a-zA-Z]{2,})/g, '$1 $2')
      .replace(/([a-z]{2,})\.([A-Z])/g, '$1. $2')
      .replace(/,([A-Za-z])/g, ', $1');
  }

  // FIXED: the old code started a new "entry" on every line beginning with
  // a capital letter — but nearly every resume line (titles, companies,
  // bullets) starts with a capital, so it was producing one broken entry
  // per line instead of one per job/degree/project. Bullets (•, -, *) are
  // always a continuation of the entry above; a new entry only starts when
  // a non-bullet "header" line shows up again after bullets have begun.
  // `isBoundarySignal(line)` lets callers say "a date range (or year range)
  // on this line always means a new entry is starting" — needed because
  // some jobs/degrees have zero bullet points, so "after bullets" alone
  // isn't enough to detect the next entry beginning.
  _groupEntries(block, isBoundarySignal = () => false) {
    const bulletRe = /^[•\-*▪●‣]\s*/;
    const lines = block
      .split('\n')
      .map((l) => this._repairSpacing(l.trim()))
      .filter(Boolean);

    const entries = [];
    let current = null;
    let pastBullets = false;

    for (const line of lines) {
      if (bulletRe.test(line)) {
        if (!current) {
          current = { headerLines: [], bulletLines: [] };
          entries.push(current);
        }
        current.bulletLines.push(line.replace(bulletRe, '').trim());
        pastBullets = true;
        continue;
      }

      const startsNewEntry =
        !current || pastBullets || (current.headerLines.length > 0 && isBoundarySignal(line));

      if (startsNewEntry) {
        current = { headerLines: [], bulletLines: [] };
        entries.push(current);
        pastBullets = false;
      }
      current.headerLines.push(line);
    }
    return entries;
  }

  // NEW: pulls a date range like "05/03/2023 - 01/26/2024", "Mar 2023 - Present",
  // or "2020 - 2021" out of a header line and returns the parsed dates plus
  // the line with the date text removed.
  _extractDateRange(line) {
    // Only real month abbreviations are allowed as the "letters" part of a
    // date token — an unrestricted [A-Za-z]{3,9} would happily match the
    // tail end of an unrelated word (e.g. "EngineerFeb" -> fake token
    // "gineerFeb"), eating into the job title.
    const month = '(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\\.?';
    const tokenRe = `(?:\\d{1,2}/\\d{1,2}/\\d{4}|${month}\\s+\\d{4}|\\d{4})`;
    const re = new RegExp(`(${tokenRe})\\s*[-–—]\\s*(present|current|${tokenRe})`, 'i');
    const match = line.match(re);
    if (!match) return null;

    const isCurrent = /present|current/i.test(match[2]);
    const startDate = new Date(match[1]);
    const endDate = isCurrent ? null : new Date(match[2]);

    return {
      startDate: isNaN(startDate) ? null : startDate,
      endDate: endDate && !isNaN(endDate) ? endDate : null,
      isCurrent,
      remainder: line.replace(match[0], '').trim().replace(/^[-–—,]\s*|[-–—,]\s*$/g, '').trim(),
    };
  }

  extractExperience(text) {
    const block = this._extractSection(text, 'experience');
    if (!block) return [];

    const isDateBoundary = (line) => this._extractDateRange(line) !== null;

    return this._groupEntries(block, isDateBoundary).map(({ headerLines, bulletLines }) => {
      let dateInfo = null;
      const remainingHeader = [];

      for (const line of headerLines) {
        const found = !dateInfo && this._extractDateRange(line);
        if (found) {
          dateInfo = found;
          if (found.remainder) remainingHeader.push(found.remainder);
        } else {
          remainingHeader.push(line);
        }
      }

      return {
        role: remainingHeader[0] || '',
        company: remainingHeader[1] || '',
        location: remainingHeader[2] || '',
        startDate: dateInfo?.startDate || null,
        endDate: dateInfo?.endDate || null,
        isCurrent: dateInfo?.isCurrent || false,
        bulletPoints: bulletLines,
        achievements: [],
      };
    });
  }

  extractEducation(text) {
    const block = this._extractSection(text, 'education');
    if (!block) return [];

    const yearRe = /(\d{4})\s*[-–—]\s*(\d{4}|present)/i;
    const isYearBoundary = (line) => yearRe.test(line);

    return this._groupEntries(block, isYearBoundary).map(({ headerLines, bulletLines }) => {
      let years = null;
      const remainingHeader = [];

      for (const line of headerLines) {
        const m = !years && line.match(yearRe);
        if (m) {
          years = { startYear: m[1], endYear: /present/i.test(m[2]) ? 'Present' : m[2] };
          const rest = line.replace(m[0], '').trim().replace(/^[-–—,]\s*|[-–—,]\s*$/g, '').trim();
          if (rest) remainingHeader.push(rest);
        } else {
          remainingHeader.push(line);
        }
      }

      return {
        degree: remainingHeader[0] || '',
        institution: remainingHeader[1] || '',
        field: remainingHeader[2] || '',
        startYear: years?.startYear || '',
        endYear: years?.endYear || '',
        achievements: bulletLines,
      };
    });
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
    const block = this._extractSection(text, 'projects');
    if (!block) return [];

    return this._groupEntries(block).map(({ headerLines, bulletLines }) => {
      const techLine = headerLines.find((l) => /^tech(nologies)?\s*:/i.test(l));
      const nonTechHeader = headerLines.filter((l) => l !== techLine);

      return {
        name: nonTechHeader[0] || '',
        description: [nonTechHeader[1], ...bulletLines].filter(Boolean).join(' '),
        technologies: techLine
          ? techLine.replace(/^tech(nologies)?\s*:/i, '').split(',').map((t) => t.trim()).filter(Boolean)
          : [],
      };
    });
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