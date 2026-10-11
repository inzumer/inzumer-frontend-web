import { SETTINGS_STORAGE_KEY } from '@constants';
import { createMemoryStorage } from '@test/memory-storage';
import { readSettings, updateSettings } from '../settings';

describe('settings', () => {
  it('should read nothing when there is no saved value or storage', () => {
    expect(readSettings(createMemoryStorage())).toStrictEqual({});
    expect(readSettings(null)).toStrictEqual({});
  });

  it('should merge a patch into the saved preferences', () => {
    const storage = createMemoryStorage();
    storage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify({ locale: 'es' }));

    expect(updateSettings({ colorScheme: 'dark' }, storage)).toStrictEqual({
      locale: 'es',
      colorScheme: 'dark',
    });
    expect(readSettings(storage)).toStrictEqual({ locale: 'es', colorScheme: 'dark' });
  });

  it('should use the browser storage by default', () => {
    updateSettings({ locale: 'en' });

    expect(readSettings()).toStrictEqual({ locale: 'en' });
    localStorage.clear();
  });
});
