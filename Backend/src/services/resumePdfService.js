const React = require('react');
const { Document, Page, Text, View, StyleSheet, renderToBuffer } = require('@react-pdf/renderer');

const e = React.createElement;

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: 'Helvetica', color: '#14161A' },
  name: { fontSize: 20, fontFamily: 'Helvetica-Bold', marginBottom: 2 },
  contactLine: { fontSize: 9, color: '#444444', marginBottom: 12 },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 14,
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#14161A',
    paddingBottom: 3
  },
  summary: { fontSize: 10, lineHeight: 1.5, marginBottom: 4 },
  skillsRow: { fontSize: 10, lineHeight: 1.5 },
  entryHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  entryTitle: { fontSize: 10.5, fontFamily: 'Helvetica-Bold' },
  entryDates: { fontSize: 9, color: '#444444' },
  entrySubtitle: { fontSize: 9.5, color: '#333333', marginBottom: 3 },
  bullet: { flexDirection: 'row', marginBottom: 2 },
  bulletDot: { width: 10, fontSize: 10 },
  bulletText: { flex: 1, fontSize: 9.5, lineHeight: 1.4 }
});

/**
 * Builds a lookup of "before" -> "after" bullet text from the AI's
 * beforeAfter pairs so the PDF can render the optimized wording without
 * requiring the caller to have already persisted it onto the resume.
 */
const buildReplacementMap = (beforeAfter = []) => {
  const map = new Map();
  beforeAfter.forEach((pair) => {
    if (pair?.before) map.set(pair.before.trim().toLowerCase(), pair.after);
  });
  return map;
};

const resolveBullet = (text, replacementMap) => {
  const match = replacementMap.get((text || '').trim().toLowerCase());
  return match || text;
};

const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

const ResumeDocument = ({ resume, optimization }) => {
  const content = resume.content || {};
  const personal = content.personalInfo || {};
  const replacementMap = buildReplacementMap(optimization?.beforeAfter);
  const summary = optimization?.summaryRewrite || personal.summary;

  const contactParts = [personal.email, personal.phone, personal.location, personal.linkedin, personal.portfolio].filter(
    Boolean
  );

  return e(
    Document,
    {},
    e(
      Page,
      { size: 'A4', style: styles.page },
      // Header
      e(Text, { style: styles.name }, personal.name || resume.title),
      contactParts.length > 0 && e(Text, { style: styles.contactLine }, contactParts.join('  ·  ')),

      // Summary
      summary && e(Text, { style: styles.sectionTitle }, 'Summary'),
      summary && e(Text, { style: styles.summary }, summary),

      // Skills
      content.skills?.length > 0 && e(Text, { style: styles.sectionTitle }, 'Skills'),
      content.skills?.length > 0 && e(Text, { style: styles.skillsRow }, content.skills.join('  ·  ')),

      // Experience
      content.experience?.length > 0 && e(Text, { style: styles.sectionTitle }, 'Experience'),
      ...(content.experience || []).map((exp, i) =>
        e(
          View,
          { key: `exp-${i}`, wrap: false },
          e(
            View,
            { style: styles.entryHeaderRow },
            e(Text, { style: styles.entryTitle }, exp.role || ''),
            e(
              Text,
              { style: styles.entryDates },
              `${formatDate(exp.startDate)} — ${exp.isCurrent ? 'Present' : formatDate(exp.endDate)}`
            )
          ),
          e(Text, { style: styles.entrySubtitle }, [exp.company, exp.location].filter(Boolean).join(' · ')),
          ...(exp.bulletPoints || []).map((bp, j) =>
            e(
              View,
              { key: `exp-${i}-bp-${j}`, style: styles.bullet },
              e(Text, { style: styles.bulletDot }, '•'),
              e(Text, { style: styles.bulletText }, resolveBullet(bp, replacementMap))
            )
          )
        )
      ),

      // Education
      content.education?.length > 0 && e(Text, { style: styles.sectionTitle }, 'Education'),
      ...(content.education || []).map((edu, i) =>
        e(
          View,
          { key: `edu-${i}`, wrap: false },
          e(
            View,
            { style: styles.entryHeaderRow },
            e(Text, { style: styles.entryTitle }, [edu.degree, edu.field].filter(Boolean).join(', ')),
            e(Text, { style: styles.entryDates }, edu.endYear || '')
          ),
          e(Text, { style: styles.entrySubtitle }, edu.institution || '')
        )
      ),

      // Certifications
      content.certifications?.length > 0 && e(Text, { style: styles.sectionTitle }, 'Certifications'),
      content.certifications?.length > 0 &&
        e(
          Text,
          { style: styles.summary },
          content.certifications.map((c) => c.name).filter(Boolean).join('  ·  ')
        ),

      // Projects
      content.projects?.length > 0 && e(Text, { style: styles.sectionTitle }, 'Projects'),
      ...(content.projects || []).map((proj, i) =>
        e(
          View,
          { key: `proj-${i}`, wrap: false },
          e(Text, { style: styles.entryTitle }, proj.name || ''),
          proj.description && e(Text, { style: styles.bulletText }, proj.description)
        )
      )
    )
  );
};

/**
 * Renders a resume (optionally with AI-optimized wording swapped in) to a
 * PDF Buffer, ready to stream back as a file download.
 */
const generateResumePDFBuffer = async (resume, optimization) => {
  return renderToBuffer(e(ResumeDocument, { resume, optimization }));
};

module.exports = { generateResumePDFBuffer };
