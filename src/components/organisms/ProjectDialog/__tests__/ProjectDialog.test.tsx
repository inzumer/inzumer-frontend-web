import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { dialogLabels, projectFixture, stubMatchMedia } from '@test/projects';
import { ProjectDialog } from '../ProjectDialog';

const belo = projectFixture('belo', 'Belo');

describe('ProjectDialog', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should show the whole project in a bottom sheet on phones', () => {
    render(<ProjectDialog project={belo} open onClose={vi.fn()} labels={dialogLabels} />);

    const dialog = screen.getByRole('dialog', { name: 'Belo' });

    expect(dialog.className).toContain('rounded-t-[2.4rem]');
    expect(screen.getByRole('heading', { level: 2, name: 'Belo' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Belo title' })).toBeInTheDocument();
    expect(screen.getByText('Belo body')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Belo screen' })).toBeInTheDocument();
    expect(screen.getByText('Datadog')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Abrir la página completa/ })).toHaveAttribute(
      'href',
      '/es/projects/belo',
    );
    expect(screen.queryByRole('link', { name: /^Visitar/ })).not.toBeInTheDocument();
  });

  it('should use a modal on desktop and link the live site when there is one', () => {
    stubMatchMedia(true);
    render(
      <ProjectDialog
        project={{ ...belo, url: 'https://belo.app', urlLabel: 'belo.app' }}
        open
        onClose={vi.fn()}
        labels={dialogLabels}
      />,
    );

    expect(screen.getByRole('dialog', { name: 'Belo' }).className).toContain('max-w-[1080px]');
    expect(screen.getByRole('link', { name: /Visitar belo.app/ })).toHaveAttribute(
      'href',
      'https://belo.app',
    );
  });

  it('should close from its button', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<ProjectDialog project={belo} open onClose={onClose} labels={dialogLabels} />);

    await user.click(screen.getByRole('button', { name: 'Cerrar proyecto' }));

    expect(onClose).toHaveBeenCalledOnce();
  });

  it('should render nothing without a project', () => {
    const { container } = render(
      <ProjectDialog project={undefined} open onClose={vi.fn()} labels={dialogLabels} />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
