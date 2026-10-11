import { z } from 'zod';
import { LOCALES } from '@utils/locale';

/** Contact form fields, checked the same way in the browser and in the endpoint. */
export const contactSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.email().max(254),
  message: z.string().trim().min(10).max(5000),
  lang: z.enum(LOCALES),
  /** Honeypot: people never see it, so anything here means a bot. */
  website: z.string().max(0).optional(),
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
