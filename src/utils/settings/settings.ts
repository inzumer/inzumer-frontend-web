import { SETTINGS_STORAGE_KEY } from '@constants';
import type { Locale } from '@utils/locale';
import { getBrowserStorage, readJson, writeJson, type KeyValueStorage } from '@utils/storage';

export type ColorScheme = 'light' | 'dark';

/** Saved preferences; the inline theme and language scripts read the same JSON. */
export interface Settings {
  colorScheme?: ColorScheme;
  locale?: Locale;
}

export const readSettings = (storage: KeyValueStorage | null = getBrowserStorage()): Settings =>
  readJson<Settings>(storage, SETTINGS_STORAGE_KEY) ?? {};

export const updateSettings = (
  patch: Settings,
  storage: KeyValueStorage | null = getBrowserStorage(),
): Settings => {
  const next = { ...readSettings(storage), ...patch };
  writeJson(storage, SETTINGS_STORAGE_KEY, next);

  return next;
};
