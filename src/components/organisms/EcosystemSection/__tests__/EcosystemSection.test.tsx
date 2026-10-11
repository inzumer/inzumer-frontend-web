import { render, screen, within } from '@testing-library/react';
import { EcosystemSection } from '../EcosystemSection';

const pieces = [
  {
    id: 'ui-library',
    name: 'UI library',
    text: 'Components',
    href: 'https://ui-web.inzumer.com',
    linkLabel: 'See it',
  },
  {
    id: 'tokens',
    name: 'Tokens',
    text: 'Colors',
    href: 'https://github.com/inzumer/inzumer-tokens',
    linkLabel: 'See it',
  },
];
const ai = { title: 'AI with rules', text: 'Guides', points: ['Agent guides', 'Human review'] };

describe('EcosystemSection', () => {
  it('should number the pieces and link each one in a new tab', () => {
    render(<EcosystemSection title="Ecosystem" intro="One base" pieces={pieces} ai={ai} />);

    const [first] = screen.getAllByRole('list');
    const items = within(first as HTMLElement).getAllByRole('listitem');

    expect(screen.getByRole('region', { name: 'Ecosystem' })).toBeInTheDocument();
    expect(items).toHaveLength(2);
    expect(within(items[1] as HTMLElement).getByText('02')).toBeInTheDocument();
    expect(within(items[0] as HTMLElement).getByRole('link', { name: 'See it' })).toHaveAttribute(
      'id',
      'ecosystem-link-ui-library',
    );
    expect(within(items[0] as HTMLElement).getByRole('link')).toHaveAttribute('target', '_blank');
  });

  it('should explain the AI work with its points', () => {
    render(<EcosystemSection title="Ecosystem" intro="One base" pieces={pieces} ai={ai} />);

    expect(screen.getByRole('heading', { level: 3, name: 'AI with rules' })).toBeInTheDocument();
    expect(screen.getByText('Human review')).toBeInTheDocument();
  });
});
