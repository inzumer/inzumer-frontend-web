import { useCallback, useEffect, useState } from 'react';
import { updateSettings, type ColorScheme } from '@utils';

/** Scheme applied by the inline head script (or by a previous toggle). */
const readAppliedColorScheme = (): ColorScheme =>
  document.documentElement.dataset['colorScheme'] === 'dark' ? 'dark' : 'light';

/** Color scheme: starts `dark` to match the server markup, synced after hydration and saved. */
export const useColorScheme = (): {
  scheme: ColorScheme;
  setScheme: (scheme: ColorScheme) => void;
} => {
  const [scheme, setSchemeState] = useState<ColorScheme>('dark');

  useEffect(() => {
    setSchemeState(readAppliedColorScheme());
  }, []);

  const setScheme = useCallback((next: ColorScheme) => {
    document.documentElement.dataset['colorScheme'] = next;
    updateSettings({ colorScheme: next });
    setSchemeState(next);
  }, []);

  return { scheme, setScheme };
};
