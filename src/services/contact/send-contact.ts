import type { ContactInput } from '@utils';

export const CONTACT_ENDPOINT = '/api/contact';

/** Posts the form to the endpoint; `true` when both emails went out. */
export const sendContact = async (
  input: ContactInput,
  fetcher: typeof fetch = fetch,
): Promise<boolean> => {
  try {
    const response = await fetcher(CONTACT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });

    return response.ok;
  } catch {
    return false;
  }
};
