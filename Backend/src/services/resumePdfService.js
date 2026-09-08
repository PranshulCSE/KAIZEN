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
  const personal = content.personalInfo || {};

  const doc = h(
    Document,
    null,
    h(
      Page,
      { size: 'A4', style: styles.page },
      h(
        View,
        { style: styles.header },
        h(Text, { style: styles.name }, personal.fullName || personal.name || 'Candidate'),
        h(
          View,
          { style: { flexDirection: 'row', justifyContent: 'space-between' } },
          h(
            View,
            null,
            Boolean(personal.email) ? h(Text, { style: styles.contact }, personal.email) : null,
            Boolean(personal.phone) ? h(Text, { style: styles.contact }, personal.phone) : null
          ),
          Boolean(personal.location) ? h(Text, { style: styles.contact }, personal.location) : null
        )
      ),
      Boolean(displaySummary)
        ? h(
            View,
            null,
            h(Text, { style: styles.sectionTitle }, 'Summary'),
            h(Text, { style: styles.summaryText }, displaySummary)
          )
        : null,
      content.experience?.length > 0
        ? h(
            View,
            null,
            h(Text, { style: styles.sectionTitle }, 'Experience'),
            content.experience.map((job, idx) =>
              h(
                View,
                { key: idx, style: styles.entryContainer },
                h(
                  View,
                  { style: styles.entryHeader },
                  h(Text, { style: styles.entryTitle }, job.position || job.role || 'Role'),
                  h(
                    Text,
                    { style: styles.entryDate },
                    `${job.startDate || ''} - ${job.isCurrentlyWorking || job.isCurrent ? 'Present' : job.endDate || ''}`
                  )
                ),
                job.companyName || job.company
                  ? h(Text, { style: styles.entrySubtitle }, job.companyName || job.company)
                  : null,
                job.description ? h(Text, { style: styles.summaryText }, job.description) : null,
                job.achievements?.length > 0
                  ? h(
                      View,
                      null,
                      job.achievements.map((achievement, aidx) => {
                        const achText = typeof achievement === 'string' ? achievement : achievement.description || '';
                        return h(
                          View,
                          { key: aidx, style: styles.bulletPoint },
                          h(Text, { style: styles.bullet }, '*'),
                          h(Text, { style: styles.bulletText }, beforeAfterMap[achText] || achText)
                        );
                      })
                    )
                  : null,
                job.bulletPoints?.length > 0
                  ? h(
                      View,
                      null,
                      job.bulletPoints.map((bullet, bidx) =>
                        h(
                          View,
                          { key: bidx, style: styles.bulletPoint },
                          h(Text, { style: styles.bullet }, '*'),
                          h(Text, { style: styles.bulletText }, beforeAfterMap[bullet] || bullet)
                        )
                      )
                    )
                  : null
              )
            )
          )
        : null,
      content.education?.length > 0
        ? h(
            View,
            null,
            h(Text, { style: styles.sectionTitle }, 'Education'),
            content.education.map((edu, idx) =>
              h(
                View,
                { key: idx, style: styles.entryContainer },
                h(
                  View,
                  { style: styles.entryHeader },
                  h(Text, { style: styles.entryTitle }, edu.degree || 'Degree'),
                  h(Text, { style: styles.entryDate }, edu.graduationYear || edu.endYear || 'N/A')
                ),
                edu.university || edu.institution
                  ? h(Text, { style: styles.entrySubtitle }, edu.university || edu.institution)
                  : null,
                edu.field ? h(Text, { style: styles.summaryText }, `Field: ${edu.field}`) : null,
                edu.description ? h(Text, { style: styles.summaryText }, edu.description) : null
              )
            )
          )
        : null,
      content.skills?.length > 0
        ? h(
            View,
            null,
            h(Text, { style: styles.sectionTitle }, 'Skills'),
            h(
              View,
              { style: styles.skillsContainer },
              content.skills.map((skill, idx) => h(Text, { key: idx, style: styles.skillBadge }, skill))
            )
          )
        : null,
      content.certifications?.length > 0
        ? h(
            View,
            null,
            h(Text, { style: styles.sectionTitle }, 'Certifications'),
            content.certifications.map((cert, idx) =>
              h(
                View,
                { key: idx, style: styles.entryContainer },
                h(Text, { style: styles.entryTitle }, cert.name || 'Certification'),
                cert.issuer ? h(Text, { style: styles.entrySubtitle }, `Issued by: ${cert.issuer}`) : null,
                cert.issueDate || cert.date
                  ? h(Text, { style: styles.entryDate }, `Issued: ${cert.issueDate || cert.date}`)
                  : null
              )
            )
          )
        : null,
      content.projects?.length > 0
        ? h(
            View,
            null,
            h(Text, { style: styles.sectionTitle }, 'Projects'),
            content.projects.map((proj, idx) =>
              h(
                View,
                { key: idx, style: styles.entryContainer },
                h(Text, { style: styles.entryTitle }, proj.title || proj.name || 'Project'),
                proj.description ? h(Text, { style: styles.summaryText }, proj.description) : null,
                proj.technologies?.length > 0
                  ? h(Text, { style: styles.entrySubtitle }, `Tech: ${proj.technologies.join(', ')}`)
                  : null,
                proj.link ? h(Text, { style: styles.entryDate }, proj.link) : null
              )
            )
          )
        : null
    )
  );

  // Render to buffer stream and collect chunks into a Node.js Buffer
  const stream = await pdf(doc).toBuffer();
  if (Buffer.isBuffer(stream)) {
    return stream;
  }
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
};

module.exports = { generateResumePDFBuffer };