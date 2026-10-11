import { cvSource } from '@utils';
import { renderCvPdf } from '../cv-pdf';

describe('renderCvPdf', () => {
  it('should render a text PDF with the document metadata', async () => {
    const { fileName: _fileName, ...source } = cvSource('es');
    const pdf = await renderCvPdf({ ...source, lang: 'es' });
    const raw = pdf.toString('latin1');

    expect(raw.startsWith('%PDF-')).toBe(true);
    expect(raw).toContain('/Title');
    expect(raw).toContain('/Lang (es)');
    expect(raw).toContain('/Helvetica');
    expect(pdf.length).toBeGreaterThan(3000);
  }, 20000);
});
