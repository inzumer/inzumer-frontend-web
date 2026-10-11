import { useEffect, useState } from 'react';
import { CookieConsent, type CookieChoices } from '@inzumer/ui-library';
import { CONSENT_CATEGORIES } from '@constants';
import { disableAnalytics, loadAnalytics, trackClicks } from '@services/analytics';
import { readSettings, trackingId, updateSettings } from '@utils';

export interface ConsentManagerLabels {
  title: string;
  description: string;
  privacyLink: string;
  accept: string;
  reject: string;
  customize: string;
  preferencesTitle: string;
  preferencesDescription: string;
  save: string;
  cancel: string;
  required: string;
  necessary: { title: string; description: string };
  analytics: { title: string; description: string };
}

export interface ConsentManagerProps {
  /** GA4 id; without it there is nothing to consent to and the banner stays hidden. */
  measurementId: string | undefined;
  privacyHref: string;
  labels: ConsentManagerLabels;
}

/** Opens the preferences again, e.g. from the footer link. */
export const COOKIES_HASH = '#cookies';

/** Cookie banner and preferences; Google Analytics loads only once the visitor accepts it. */
export const ConsentManager = ({ measurementId, privacyHref, labels }: ConsentManagerProps) => {
  // Client-only island (`client:only`), so the saved answer is read on the first render.
  const [consent, setConsent] = useState<CookieChoices | null>(
    () => readSettings().consent ?? null,
  );
  const [open, setOpen] = useState(() => window.location.hash === COOKIES_HASH);
  const allowed = Boolean(measurementId && consent?.[CONSENT_CATEGORIES.analytics]);

  useEffect(() => {
    const clearHash = () =>
      history.replaceState(null, '', window.location.pathname + window.location.search);
    const onHashChange = () => {
      if (window.location.hash === COOKIES_HASH) {
        setOpen(true);
        clearHash();
      }
    };

    if (window.location.hash === COOKIES_HASH) {
      clearHash();
    }

    window.addEventListener('hashchange', onHashChange);

    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    if (!measurementId) {
      return undefined;
    }

    if (!allowed) {
      disableAnalytics(measurementId);

      return undefined;
    }

    loadAnalytics(measurementId);

    return trackClicks();
  }, [allowed, measurementId]);

  if (!measurementId) {
    return null;
  }

  const save = (value: CookieChoices) => {
    updateSettings({ consent: value });
    setConsent(value);
  };

  return (
    <CookieConsent
      mode="banner"
      categories={[
        { id: CONSENT_CATEGORIES.necessary, ...labels.necessary, required: true },
        { id: CONSENT_CATEGORIES.analytics, ...labels.analytics },
      ]}
      value={consent}
      onChange={save}
      open={open}
      onOpenChange={setOpen}
      getId={(kind, name) => trackingId('cookies', kind, name)}
      labels={{
        ...labels,
        description: (
          <>
            {labels.description}{' '}
            <a
              id={trackingId('cookies', 'link', 'privacy')}
              href={privacyHref}
              className="underline underline-offset-4"
            >
              {labels.privacyLink}
            </a>
          </>
        ),
      }}
    />
  );
};
