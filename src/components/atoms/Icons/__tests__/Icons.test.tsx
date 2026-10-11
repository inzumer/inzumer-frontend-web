import { render } from '@testing-library/react';
import { ContrastIcon, GitHubIcon, isServiceIconName, SERVICE_ICONS } from '../Icons';

describe('Icons', () => {
  it('should draw every icon as a decorative SVG in the current color', () => {
    for (const Icon of [...Object.values(SERVICE_ICONS), ContrastIcon, GitHubIcon]) {
      const { container, unmount } = render(<Icon width={24} />);
      const svg = container.querySelector('svg');

      expect(svg).toHaveAttribute('aria-hidden', 'true');
      expect(svg).toHaveAttribute('stroke', 'currentColor');
      expect(svg).toHaveAttribute('width', '24');
      unmount();
    }
  });

  it('should recognize only the service icon names', () => {
    expect(isServiceIconName('speed')).toBe(true);
    expect(isServiceIconName('rocket')).toBe(false);
  });
});
