const React = require('react');
const { Document, Page, Text, View, StyleSheet, pdf } = require('@react-pdf/renderer');

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 11,
    lineHeight: 1.4,
    color: '#000',
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#000',
    paddingBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000',
  },
  contact: {
    fontSize: 10,
    color: '#333',
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 4,
    textTransform: 'uppercase',
  },
  summaryText: {
    fontSize: 11,
    lineHeight: 1.5,
    marginBottom: 10,
    color: '#222',
  },
  entryContainer: {
    marginBottom: 10,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  entryTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#000',
  },
  entrySubtitle: {
    fontSize: 10,
    color: '#444',
    fontStyle: 'italic',
  },
  entryDate: {
    fontSize: 10,
    color: '#555',
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 4,
    marginLeft: 10,
  },
  bullet: {
    width: 15,
    fontSize: 11,
    color: '#000',
  },
  bulletText: {
    flex: 1,
    fontSize: 10,
    color: '#222',
    lineHeight: 1.4,
  },
  skillBadge: {
    display: 'inline-block',
    padding: '2px 6px',
    marginRight: 6,
    marginBottom: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    fontSize: 9,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
});

const generateResumePDFBuffer = async (resume, optimization) => {
  const { content } = resume;

  // Apply optimization if provided
  let displaySummary = content.personalSummary || '';
  const beforeAfterMap = {};

  if (optimization?.beforeAfter) {
    optimization.beforeAfter.forEach(({ before, after }) => {
      beforeAfterMap[before] = after;
    });
  }

  if (optimization?.summaryRewrite) {
    displaySummary = optimization.summaryRewrite;
  }

  const h = React.createElement;
  const doc = h(
    Document,
    null,
    h(
      Page,
      { size: 'A4', style: styles.page },
      h(
        View,
        { style: styles.header },
        h(Text, { style: styles.name }, content.personalInfo?.fullName || 'Unknown'),
        h(
          View,
          { style: { flexDirection: 'row', justifyContent: 'space-between' } },
          h(
            View,
            null,
            content.personalInfo?.email && h(Text, { style: styles.contact }, content.personalInfo.email),
            content.personalInfo?.phone && h(Text, { style: styles.contact }, content.personalInfo.phone)
          ),
          content.personalInfo?.location && h(Text, { style: styles.contact }, content.personalInfo.location)
        )
      ),
      displaySummary && h(
        View,
        null,
        h(Text, { style: styles.sectionTitle }, 'Summary'),
        h(Text, { style: styles.summaryText }, displaySummary)
      ),
      content.experience?.length > 0 && h(
        View,
        null,
        h(Text, { style: styles.sectionTitle }, 'Experience'),
        content.experience.map((job, idx) => h(
          View,
          { key: idx, style: styles.entryContainer },
          h(
            View,
            { style: styles.entryHeader },
            h(Text, { style: styles.entryTitle }, job.position),
            h(Text, { style: styles.entryDate }, `${job.startDate} - ${job.isCurrentlyWorking ? 'Present' : job.endDate}`)
          ),
          h(Text, { style: styles.entrySubtitle }, job.companyName),
          job.description && h(Text, { style: styles.summaryText }, job.description),
          job.achievements?.length > 0 && h(
            View,
            null,
            job.achievements.map((achievement, aidx) => h(
              View,
              { key: aidx, style: styles.bulletPoint },
              h(Text, { style: styles.bullet }, '*'),
              h(Text, { style: styles.bulletText }, beforeAfterMap[achievement] || achievement)
            ))
          )
        ))
      ),
      content.education?.length > 0 && h(
        View,
        null,
        h(Text, { style: styles.sectionTitle }, 'Education'),
        content.education.map((edu, idx) => h(
          View,
          { key: idx, style: styles.entryContainer },
          h(
            View,
            { style: styles.entryHeader },
            h(Text, { style: styles.entryTitle }, edu.degree),
            h(Text, { style: styles.entryDate }, edu.graduationYear || 'N/A')
          ),
          h(Text, { style: styles.entrySubtitle }, edu.university),
          edu.field && h(Text, { style: styles.summaryText }, `Field: ${edu.field}`),
          edu.description && h(Text, { style: styles.summaryText }, edu.description)
        ))
      ),
      content.skills?.length > 0 && h(
        View,
        null,
        h(Text, { style: styles.sectionTitle }, 'Skills'),
        h(
          View,
          { style: styles.skillsContainer },
          content.skills.map((skill, idx) => h(Text, { key: idx, style: styles.skillBadge }, skill))
        )
      ),
      content.certifications?.length > 0 && h(
        View,
        null,
        h(Text, { style: styles.sectionTitle }, 'Certifications'),
        content.certifications.map((cert, idx) => h(
          View,
          { key: idx, style: styles.entryContainer },
          h(Text, { style: styles.entryTitle }, cert.name),
          cert.issuer && h(Text, { style: styles.entrySubtitle }, `Issued by: ${cert.issuer}`),
          cert.issueDate && h(Text, { style: styles.entryDate }, `Issued: ${cert.issueDate}`)
        ))
      ),
      content.projects?.length > 0 && h(
        View,
        null,
        h(Text, { style: styles.sectionTitle }, 'Projects'),
        content.projects.map((proj, idx) => h(
          View,
          { key: idx, style: styles.entryContainer },
          h(Text, { style: styles.entryTitle }, proj.title),
          proj.description && h(Text, { style: styles.summaryText }, proj.description),
          proj.technologies?.length > 0 && h(Text, { style: styles.entrySubtitle }, `Tech: ${proj.technologies.join(', ')}`),
          proj.link && h(Text, { style: styles.entryDate }, proj.link)
        ))
      )
    )
  );

  // Render to buffer
  const buffer = await pdf(doc).toBuffer();
  return buffer;
};

module.exports = { generateResumePDFBuffer };