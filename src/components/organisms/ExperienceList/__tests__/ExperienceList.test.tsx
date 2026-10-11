import { render, screen, within } from '@testing-library/react';
import { ExperienceList } from '../ExperienceList';

describe('ExperienceList', () => {
  it('should list each role with its company, client, dates and highlights', () => {
    render(
      <ExperienceList
        title="Experiencia"
        items={[
          {
            company: 'Randstad Digital',
            client: 'PortAventura World',
            role: 'Senior Software Engineer',
            dates: 'Ene 2026 – Actualidad',
            location: 'Zaragoza, España',
            highlights: ['Arquitectura.', 'Performance.'],
          },
          {
            company: 'Meliorar',
            role: 'Software Engineer',
            dates: 'Ago 2025 – Ene 2026',
            location: 'Zaragoza, España',
            highlights: ['Backend.'],
          },
        ]}
      />,
    );

    const section = screen.getByRole('region', { name: 'Experiencia' });
    const roles = within(section).getAllByRole('heading', { level: 3 });

    expect(roles.map((role) => role.textContent)).toStrictEqual([
      'Randstad Digital · PortAventura World',
      'Meliorar',
    ]);
    expect(screen.getByText('Senior Software Engineer · Zaragoza, España')).toBeInTheDocument();
    expect(screen.getByText('Ene 2026 – Actualidad')).toBeInTheDocument();
    expect(screen.getByText('Performance.')).toBeInTheDocument();
  });
});
