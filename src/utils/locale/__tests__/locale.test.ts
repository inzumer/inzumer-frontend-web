import { DEFAULT_LOCALE, isLocale, LOCALES } from '../locale';

describe('locale', () => {
  it('should support Spanish and English, with Spanish as default', () => {
    expect(LOCALES).toStrictEqual(['es', 'en']);
    expect(DEFAULT_LOCALE).toBe('en');
  });

  it.each(['es', 'en'])('should recognize "%s" as a supported locale', (value) => {
    expect(isLocale(value)).toBe(true);
  });

  it.each(['fr', 'ES', '', undefined, null, 42])(
    'should not recognize %s as a supported locale',
    (value) => {
      expect(isLocale(value)).toBe(false);
    },
  );
});
