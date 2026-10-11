import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SETTINGS_STORAGE_KEY } from '@constants';
import { ThemeToggle } from '../ThemeToggle';

const labels = { toDark: 'Pasar a modo oscuro', toLight: 'Pasar a modo claro' };

describe('ThemeToggle', () => {
  afterEach(() => {
    delete document.documentElement.dataset['colorScheme'];
  });

  it('should be named after the scheme it switches to', () => {
    document.documentElement.dataset['colorScheme'] = 'dark';
    render(<ThemeToggle labels={labels} />);

    expect(screen.getByRole('button', { name: 'Pasar a modo claro' })).toHaveAttribute(
      'id',
      'rail-button-theme',
    );
  });

  it('should switch between dark and light and save the choice', async () => {
    const user = userEvent.setup();
    document.documentElement.dataset['colorScheme'] = 'dark';
    render(<ThemeToggle labels={labels} />);

    await user.click(screen.getByRole('button', { name: 'Pasar a modo claro' }));
    expect(document.documentElement.dataset['colorScheme']).toBe('light');
    expect(JSON.parse(localStorage.getItem(SETTINGS_STORAGE_KEY) ?? '{}')).toStrictEqual({
      colorScheme: 'light',
    });

    await user.click(screen.getByRole('button', { name: 'Pasar a modo oscuro' }));
    expect(document.documentElement.dataset['colorScheme']).toBe('dark');
  });
});
