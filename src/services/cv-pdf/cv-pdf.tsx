import { Document, Link, Page, renderToBuffer, StyleSheet, Text, View } from '@react-pdf/renderer';
import type { CvContact, CvHeadings, CvProfile } from '@utils';

export interface CvPdfInput {
  profile: CvProfile;
  headings: CvHeadings;
  contact: CvContact;
  title: string;
  lang: string;
}

const INK = '#151515';
const MUTED = '#525252';
const RULE = '#d4d4d4';

// Helvetica is built into every PDF reader: real, selectable text that ATS filters can parse.
const styles = StyleSheet.create({
  page: {
    paddingVertical: 32,
    paddingHorizontal: 48,
    fontFamily: 'Helvetica',
    fontSize: 9,
    lineHeight: 1.35,
    color: INK,
  },
  name: { fontFamily: 'Helvetica-Bold', fontSize: 22, lineHeight: 1.2 },
  headline: { fontSize: 10.5, color: MUTED, marginTop: 2 },
  contact: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8, color: MUTED },
  contactItem: { marginRight: 14, color: MUTED, textDecoration: 'none' },
  section: { marginTop: 11 },
  // No letter spacing: ATS parsers read spaced capitals as separate letters.
  heading: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 8.5,
    textTransform: 'uppercase',
    color: MUTED,
    paddingBottom: 3,
    marginBottom: 6,
    borderBottomWidth: 0.6,
    borderBottomColor: RULE,
  },
  job: { marginBottom: 5 },
  jobTitle: { fontFamily: 'Helvetica-Bold', fontSize: 10 },
  jobMeta: { color: MUTED, marginBottom: 3 },
  bullet: { flexDirection: 'row', marginBottom: 2 },
  bulletMark: { width: 10, color: MUTED },
  bulletText: { flex: 1 },
  row: { marginBottom: 2 },
  label: { fontFamily: 'Helvetica-Bold' },
});

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <View style={styles.section}>
    {/* A heading never ends a page alone. */}
    <Text style={styles.heading} minPresenceAhead={24}>
      {title}
    </Text>
    {children}
  </View>
);

/** The CV as a document: one column, standard headings, no images or tables. */
export const CvDocument = ({ profile, headings, contact, title, lang }: CvPdfInput) => (
  <Document title={title} author={profile.name} subject={profile.headline} language={lang}>
    <Page size="A4" style={styles.page}>
      <Text style={styles.name}>{profile.name}</Text>
      <Text style={styles.headline}>
        {profile.headline} · {profile.location}
      </Text>
      <View style={styles.contact}>
        <Link src={`mailto:${contact.email}`} style={styles.contactItem}>
          {contact.email}
        </Link>
        {[contact.site, contact.linkedin, contact.github].map((url) => (
          <Link key={url} src={url} style={styles.contactItem}>
            {url.replace(/^https:\/\/(www\.)?/, '')}
          </Link>
        ))}
      </View>

      <Section title={headings.summary}>
        <Text>{profile.summary}</Text>
      </Section>

      <Section title={headings.experience}>
        {profile.experience.map((job) => (
          <View key={`${job.company}-${job.role}`} style={styles.job} wrap={false}>
            <Text style={styles.jobTitle}>
              {job.role} — {job.client ? `${job.company} · ${job.client}` : job.company}
            </Text>
            <Text style={styles.jobMeta}>
              {job.dates} · {job.location}
            </Text>
            {job.highlights.map((highlight) => (
              <View key={highlight} style={styles.bullet}>
                <Text style={styles.bulletMark}>•</Text>
                <Text style={styles.bulletText}>{highlight}</Text>
              </View>
            ))}
          </View>
        ))}
      </Section>

      <Section title={headings.skills}>
        {profile.skills.map((group) => (
          <Text key={group.label} style={styles.row}>
            <Text style={styles.label}>{group.label}: </Text>
            {group.items.join(', ')}
          </Text>
        ))}
      </Section>

      <Section title={headings.education}>
        {profile.education.map((item) => (
          <Text key={`${item.school}-${item.program}`} style={styles.row}>
            <Text style={styles.label}>{item.program}</Text> — {item.school} ({item.dates})
          </Text>
        ))}
      </Section>

      <Section title={headings.languages}>
        <Text>
          {profile.languages.map((language) => `${language.name}: ${language.level}`).join(' · ')}
        </Text>
      </Section>
    </Page>
  </Document>
);

/** Renders the CV to PDF bytes at build time. */
export const renderCvPdf = (input: CvPdfInput): Promise<Buffer> =>
  renderToBuffer(<CvDocument {...input} />);
