import { contactSchema, invalidContactFields } from '../contact';

const valid = {
  name: 'Ada',
  email: 'ada@example.com',
  message: 'Hola, quiero hablar de un proyecto.',
  lang: 'es',
};

describe('contact', () => {
  it('should accept a complete message and trim the text', () => {
    const result = contactSchema.parse({ ...valid, name: '  Ada  ', website: '' });

    expect(result.name).toBe('Ada');
    expect(invalidContactFields(valid)).toStrictEqual([]);
  });

  it('should report each invalid field in form order', () => {
    expect(
      invalidContactFields({ ...valid, email: 'nope', message: 'hi', name: '' }),
    ).toStrictEqual(['name', 'email', 'message']);
  });

  it('should reject a filled honeypot or an unknown language', () => {
    expect(contactSchema.safeParse({ ...valid, website: 'spam.example' }).success).toBe(false);
    expect(contactSchema.safeParse({ ...valid, lang: 'fr' }).success).toBe(false);
    expect(invalidContactFields({ ...valid, lang: 'fr' })).toStrictEqual([]);
  });
});
