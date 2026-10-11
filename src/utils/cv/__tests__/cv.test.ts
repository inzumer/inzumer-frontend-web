import profileEn from '@i18n/profile/en.json';
import {
  CV_CONTACT,
  cvMarkdown,
  cvSource,
  dateRange,
  isoDate,
  jsonResume,
  llmsTxt,
} from '../index';

const { headings } = cvSource('en');

describe('cv', () => {
  it('should turn English and Spanish months and plain years into ISO dates', () => {
    expect(isoDate('Jan 2026')).toBe('2026-01');
    expect(isoDate('Dic 2023')).toBe('2023-12');
    expect(isoDate('2025')).toBe('2025');
    expect(isoDate('Present')).toBeUndefined();
    expect(isoDate('Actualidad')).toBeUndefined();
  });

  it('should leave the end out while the role is current', () => {
    expect(dateRange('Jan 2026 – Present')).toStrictEqual({ startDate: '2026-01' });
    expect(dateRange('Ago 2025 – Ene 2026')).toStrictEqual({
      startDate: '2025-08',
      endDate: '2026-01',
    });
    expect(dateRange('2022 – 2023')).toStrictEqual({ startDate: '2022', endDate: '2023' });
  });

  it('should write the CV as one-column Markdown with standard headings', () => {
    const markdown = cvMarkdown(profileEn, headings, CV_CONTACT);

    expect(markdown.startsWith('# Nahuel Zamuner\n')).toBe(true);
    expect(markdown).toContain('## Experience');
    expect(markdown).toContain(
      '### Senior Software Engineer — Randstad Digital · PortAventura World',
    );
    expect(markdown).toContain('- Email: inzumer@gmail.com');
    expect(markdown).toContain('- Italian: Elementary (A2)');
  });

  it('should follow the JSON Resume shape', () => {
    const resume = jsonResume(profileEn, CV_CONTACT, 'en', 'https://www.inzumer.com/en/cv.json');

    expect(resume.basics).toMatchObject({
      name: 'Nahuel Zamuner',
      label: 'Senior Frontend Engineer',
      location: { city: 'Zaragoza', countryCode: 'ES' },
    });
    expect(resume.work[0]).toMatchObject({
      name: 'Randstad Digital · PortAventura World',
      startDate: '2026-01',
    });
    expect(resume.work[0]).not.toHaveProperty('endDate');
    expect(resume.education[0]).toMatchObject({ institution: 'Platzi', startDate: '2025' });
    expect(resume.meta).toStrictEqual({
      canonical: 'https://www.inzumer.com/en/cv.json',
      language: 'en',
    });
  });

  it('should list every CV format in llms.txt', () => {
    const text = llmsTxt(profileEn, 'https://www.inzumer.com', ['es', 'en']);

    expect(text).toContain('# Nahuel Zamuner');
    expect(text).toContain('- [CV (es, PDF)](https://www.inzumer.com/es/cv.pdf)');
    expect(text).toContain('- [CV (en, JSON Resume)](https://www.inzumer.com/en/cv.json)');
  });

  it('should gather the Spanish profile and headings', () => {
    const source = cvSource('es');

    expect(source.headings.education).toBe('Formación');
    expect(source.fileName).toBe('Nahuel-Zamuner-CV-es.pdf');
    expect(source.contact.linkedin).toBe('https://www.linkedin.com/in/inzumer');
  });
});
