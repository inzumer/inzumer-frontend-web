import { render, screen } from '@testing-library/react';
import { SectionHeader } from '../SectionHeader';

describe('SectionHeader', () => {
  it('should render the title as a level 2 heading with its id', () => {
    render(<SectionHeader id="projects-title" title="Proyectos" />);

    expect(screen.getByRole('heading', { level: 2, name: 'Proyectos' })).toHaveAttribute(
      'id',
      'projects-title',
    );
  });
});
