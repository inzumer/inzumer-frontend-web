import type { Locale } from '@utils/locale';

export interface CvProfile {
  name: string;
  headline: string;
  location: string;
  summary: string;
  experience: {
    company: string;
    client?: string;
    role: string;
    dates: string;
    location: string;
    highlights: string[];
  }[];
  skills: { label: string; items: string[] }[];
  education: { school: string; program: string; dates: string }[];
  languages: { name: string; level: string }[];
}

export interface CvHeadings {
  contact: string;
  summary: string;
  experience: string;
  skills: string;
  education: string;
  languages: string;
}

export interface CvContact {
  email: string;
  site: string;
  linkedin: string;
  github: string;
  countryCode: string;
}

const MONTHS: Record<string, string> = {
  jan: '01',
  ene: '01',
  feb: '02',
  mar: '03',
  apr: '04',
  abr: '04',
  may: '05',
  jun: '06',
  jul: '07',
  aug: '08',
  ago: '08',
  sep: '09',
  oct: '10',
  nov: '11',
  dec: '12',
  dic: '12',
};

/** "Jan 2026" or "Ene 2026" → "2026-01"; "2025" → "2025"; "Present" → undefined. */
export const isoDate = (value: string): string | undefined => {
  const [first = '', year] = value.trim().split(/\s+/);
  const month = MONTHS[first.slice(0, 3).toLowerCase()];

  if (month && year && /^\d{4}$/.test(year)) {
    return `${year}-${month}`;
  }

  return /^\d{4}$/.test(first) ? first : undefined;
};

/** "Jan 2024 – Feb 2025" → start and end; the end is missing while it's the current one. */
export const dateRange = (dates: string): { startDate?: string; endDate?: string } => {
  const [start = '', end = ''] = dates.split(/\s*[–-]\s*/);
  const startDate = isoDate(start);
  const endDate = isoDate(end);

  return { ...(startDate && { startDate }), ...(endDate && { endDate }) };
};

const companyOf = ({ company, client }: CvProfile['experience'][number]) =>
  client ? `${company} · ${client}` : company;

/** Plain Markdown, one column and standard headings: easy for ATS filters and AI readers. */
export const cvMarkdown = (profile: CvProfile, headings: CvHeadings, contact: CvContact): string =>
  [
    `# ${profile.name}`,
    '',
    `**${profile.headline}** · ${profile.location}`,
    '',
    `## ${headings.contact}`,
    '',
    `- Email: ${contact.email}`,
    `- Web: ${contact.site}`,
    `- LinkedIn: ${contact.linkedin}`,
    `- GitHub: ${contact.github}`,
    '',
    `## ${headings.summary}`,
    '',
    profile.summary,
    '',
    `## ${headings.experience}`,
    ...profile.experience.flatMap((job) => [
      '',
      `### ${job.role} — ${companyOf(job)}`,
      '',
      `${job.dates} · ${job.location}`,
      '',
      ...job.highlights.map((highlight) => `- ${highlight}`),
    ]),
    '',
    `## ${headings.skills}`,
    '',
    ...profile.skills.map((group) => `- **${group.label}:** ${group.items.join(', ')}`),
    '',
    `## ${headings.education}`,
    '',
    ...profile.education.map((item) => `- ${item.program} — ${item.school} (${item.dates})`),
    '',
    `## ${headings.languages}`,
    '',
    ...profile.languages.map((language) => `- ${language.name}: ${language.level}`),
    '',
  ].join('\n');

/** The CV in the JSON Resume standard (jsonresume.org), for tools that import it. */
export const jsonResume = (
  profile: CvProfile,
  contact: CvContact,
  lang: Locale,
  canonical: string,
) => ({
  $schema: 'https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json',
  basics: {
    name: profile.name,
    label: profile.headline,
    email: contact.email,
    url: contact.site,
    summary: profile.summary,
    location: { city: profile.location.split(',')[0], countryCode: contact.countryCode },
    profiles: [
      { network: 'LinkedIn', username: 'inzumer', url: contact.linkedin },
      { network: 'GitHub', username: 'inzumer', url: contact.github },
    ],
  },
  work: profile.experience.map((job) => ({
    name: companyOf(job),
    position: job.role,
    location: job.location,
    ...dateRange(job.dates),
    highlights: job.highlights,
  })),
  education: profile.education.map((item) => ({
    institution: item.school,
    area: item.program,
    ...dateRange(item.dates),
  })),
  skills: profile.skills.map((group) => ({ name: group.label, keywords: group.items })),
  languages: profile.languages.map((language) => ({
    language: language.name,
    fluency: language.level,
  })),
  meta: { canonical, language: lang },
});

/** `llms.txt`: who this is and where the machine-readable CV lives, in each language. */
export const llmsTxt = (profile: CvProfile, site: string, langs: readonly Locale[]): string =>
  [
    `# ${profile.name}`,
    '',
    `> ${profile.headline}. ${profile.summary}`,
    '',
    '## CV',
    '',
    ...langs.flatMap((lang) => [
      `- [CV (${lang}, Markdown)](${site}/${lang}/cv.md)`,
      `- [CV (${lang}, JSON Resume)](${site}/${lang}/cv.json)`,
      `- [CV (${lang}, PDF)](${site}/${lang}/cv.pdf)`,
    ]),
    '',
    '## Site',
    '',
    ...langs.map((lang) => `- [Portfolio (${lang})](${site}/${lang})`),
    '',
  ].join('\n');
