import { z } from 'zod/mini';
import { LOCALES } from '@utils/locale';

// Our CSP blocks eval; without this Zod tries it once to compile faster.
z.config({ jitless: true });

/** Contact form fields, checked the same way in the browser and in the endpoint (zod/mini: light). */
export const contactSchema = z.object({
  name: z.string().check(z.trim(), z.minLength(2), z.maxLength(80)),
  email: z.email().check(z.maxLength(254)),
  message: z.string().check(z.trim(), z.minLength(10), z.maxLength(5000)),
  lang: z.enum(LOCALES),
  /** Honeypot: people never see it, so anything here means a bot. */
  website: z.optional(z.string().check(z.maxLength(0))),
});

export type ContactInput = z.infer<typeof contactSchema>;

export type ContactField = 'name' | 'email' | 'message';

/** Fields that failed validation, for the form to mark them. */
export const invalidContactFields = (input: unknown): ContactField[] => {
  const result = contactSchema.safeParse(input);

  if (result.success) {
    return [];
  }

  const fields = result.error.issues.map((issue) => issue.path[0]);

  return (['name', 'email', 'message'] as const).filter((field) => fields.includes(field));
};
