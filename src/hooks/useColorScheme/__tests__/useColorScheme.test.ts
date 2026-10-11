import { act, renderHook } from '@testing-library/react';
import { SETTINGS_STORAGE_KEY } from '@constants';
import { useColorScheme } from '../useColorScheme';

afterEach(() => {
  delete document.documentElement.dataset['colorScheme'];
  localStorage.clear();
});

describe('useColorScheme', () => {
  it('should read the scheme applied by the head script', () => {
    document.documentElement.dataset['colorScheme'] = 'light';
    const { result } = renderHook(() => useColorScheme());

    expect(result.current.scheme).toBe('light');
  });

  it('should apply and save a new scheme', () => {
    const { result } = renderHook(() => useColorScheme());

    act(() => result.current.setScheme('dark'));

    expect(result.current.scheme).toBe('dark');
    expect(document.documentElement.dataset['colorScheme']).toBe('dark');
    expect(JSON.parse(localStorage.getItem(SETTINGS_STORAGE_KEY) ?? '{}')).toStrictEqual({
      colorScheme: 'dark',
    });
  });
});
