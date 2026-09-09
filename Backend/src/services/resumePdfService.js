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
 try {
    const { content } = resume;
 
    // Apply optimization if provided
    let displaySummary = content.personalSummary || '';
    const beforeAfterMap = {};
 
    if (optimization?.beforeAfter && Array.isArray(optimization.beforeAfter)) {
      optimization.beforeAfter.forEach(({ before, after }) => {
        if (before && after) {
          beforeAfterMap[before] = after;
        }
      });
    }
 
    if (optimization?.summaryRewrite) {
      displaySummary = optimization.summaryRewrite;
    }
 
    // Build document with safe JSX (no empty strings as children)
    const doc = (
      <Document>
        <Page size="A4" style={styles.page}>
          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.name}>
              {content.personalInfo?.fullName || content.personalInfo?.name || 'Resume'}
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View>
                {content.personalInfo?.email ? (
                  <Text style={styles.contact}>{content.personalInfo.email}</Text>
                ) : null}
                {content.personalInfo?.phone ? (
                  <Text style={styles.contact}>{content.personalInfo.phone}</Text>
                ) : null}
              </View>
              {content.personalInfo?.location ? (
                <Text style={styles.contact}>{content.personalInfo.location}</Text>
              ) : null}
            </View>
          </View>
 
          {/* SUMMARY */}
          {displaySummary ? (
            <View>
              <Text style={styles.sectionTitle}>Summary</Text>
              <Text style={styles.summaryText}>{displaySummary}</Text>
            </View>
          ) : null}
 
          {/* EXPERIENCE */}
          {content.experience && content.experience.length > 0 ? (
            <View>
              <Text style={styles.sectionTitle}>Experience</Text>
              {content.experience.map((job, idx) => (
                <View key={idx} style={styles.entryContainer}>
                  <View style={styles.entryHeader}>
                    <Text style={styles.entryTitle}>{job.position || 'Position'}</Text>
                    <Text style={styles.entryDate}>
                      {job.startDate || ''} - {job.isCurrentlyWorking ? 'Present' : job.endDate || ''}
                    </Text>
                  </View>
                  {job.companyName ? (
                    <Text style={styles.entrySubtitle}>{job.companyName}</Text>
                  ) : null}
                  {job.description ? (
                    <Text style={styles.summaryText}>{job.description}</Text>
                  ) : null}
                  {job.achievements && Array.isArray(job.achievements) && job.achievements.length > 0 ? (
                    <View>
                      {job.achievements.map((achievement, aidx) => {
                        const displayAchievement =
                          beforeAfterMap[achievement] || achievement || '';
                        return displayAchievement ? (
                          <View key={aidx} style={styles.bulletPoint}>
                            <Text style={styles.bullet}>•</Text>
                            <Text style={styles.bulletText}>{displayAchievement}</Text>
                          </View>
                        ) : null;
                      })}
                    </View>
                  ) : null}
                </View>
              ))}
            </View>
          ) : null}
 
          {/* EDUCATION */}
          {content.education && content.education.length > 0 ? (
            <View>
              <Text style={styles.sectionTitle}>Education</Text>
              {content.education.map((edu, idx) => (
                <View key={idx} style={styles.entryContainer}>
                  <View style={styles.entryHeader}>
                    <Text style={styles.entryTitle}>{edu.degree || 'Degree'}</Text>
                    <Text style={styles.entryDate}>{edu.graduationYear || ''}</Text>
                  </View>
                  {edu.university ? (
                    <Text style={styles.entrySubtitle}>{edu.university}</Text>
                  ) : null}
                  {edu.field ? (
                    <Text style={styles.summaryText}>Field: {edu.field}</Text>
                  ) : null}
                  {edu.description ? (
                    <Text style={styles.summaryText}>{edu.description}</Text>
                  ) : null}
                </View>
              ))}
            </View>
          ) : null}
 
          {/* SKILLS */}
          {content.skills && content.skills.length > 0 ? (
            <View>
              <Text style={styles.sectionTitle}>Skills</Text>
              <View style={styles.skillsContainer}>
                {content.skills.map((skill, idx) =>
                  skill ? (
                    <Text key={idx} style={styles.skillBadge}>
                      {skill}
                    </Text>
                  ) : null
                )}
              </View>
            </View>
          ) : null}
 
          {/* CERTIFICATIONS */}
          {content.certifications && content.certifications.length > 0 ? (
            <View>
              <Text style={styles.sectionTitle}>Certifications</Text>
              {content.certifications.map((cert, idx) => (
                <View key={idx} style={styles.entryContainer}>
                  <Text style={styles.entryTitle}>{cert.name || 'Certification'}</Text>
                  {cert.issuer ? (
                    <Text style={styles.entrySubtitle}>Issued by: {cert.issuer}</Text>
                  ) : null}
                  {cert.issueDate ? (
                    <Text style={styles.entryDate}>Issued: {cert.issueDate}</Text>
                  ) : null}
                </View>
              ))}
            </View>
          ) : null}
 
          {/* PROJECTS */}
          {content.projects && content.projects.length > 0 ? (
            <View>
              <Text style={styles.sectionTitle}>Projects</Text>
              {content.projects.map((proj, idx) => (
                <View key={idx} style={styles.entryContainer}>
                  <Text style={styles.entryTitle}>{proj.title || 'Project'}</Text>
                  {proj.description ? (
                    <Text style={styles.summaryText}>{proj.description}</Text>
                  ) : null}
                  {proj.technologies && proj.technologies.length > 0 ? (
                    <Text style={styles.entrySubtitle}>
                      Tech: {proj.technologies.join(', ')}
                    </Text>
                  ) : null}
                  {proj.link ? (
                    <Text style={styles.entryDate}>{proj.link}</Text>
                  ) : null}
                </View>
              ))}
            </View>
          ) : null}
        </Page>
      </Document>
    );
 
    // Convert stream to buffer using promise wrapper
    return new Promise((resolve, reject) => {
      const chunks = [];
      const stream = pdf(doc).toStream();
 
      stream.on('data', (chunk) => {
        chunks.push(chunk);
      });
 
      stream.on('end', () => {
        const buffer = Buffer.concat(chunks);
        resolve(buffer);
      });
 
      stream.on('error', (err) => {
        reject(err);
      });
    });
  } catch (error) {
    console.error('PDF Generation Error:', error);
    throw new Error(`Failed to generate PDF: ${error.message}`);
  }
};

module.exports = { generateResumePDFBuffer };