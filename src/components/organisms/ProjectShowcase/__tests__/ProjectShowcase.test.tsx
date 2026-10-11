import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { dialogLabels, projectFixture as project } from '@test/projects';
import { ProjectShowcase } from '../ProjectShowcase';

const projects = [
  project('payments-v2', 'Payments'),
  project('belo', 'Belo'),
  project('smart', 'Coupons'),
];
const labels = {
  list: 'Elige un proyecto',
  view: 'Ver proyecto',
  previous: 'Proyecto anterior',
  next: 'Proyecto siguiente',
  dialog: dialogLabels,
};

describe('ProjectShowcase', () => {
  it('should show the first project in a panel named by its tab', () => {
    render(<ProjectShowcase title="Proyectos" projects={projects} labels={labels} />);

    const tab = screen.getByRole('tab', { name: 'Payments' });

    expect(tab).toHaveAttribute('aria-selected', 'true');
    expect(tab).toHaveAttribute('id', 'projects-button-tab-payments-v2');
    expect(screen.getByRole('tabpanel', { name: 'Payments' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Payments title' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Payments cover' })).toHaveAttribute('loading', 'eager');
    expect(screen.getByRole('button', { name: 'Ver proyecto' })).toHaveAttribute(
      'aria-haspopup',
      'dialog',
    );
    expect(screen.queryByText('Datadog')).not.toBeInTheDocument();
  });

  it('should move between tabs with the keyboard and keep one tab stop', async () => {
    const user = userEvent.setup();
    render(<ProjectShowcase title="Proyectos" projects={projects} labels={labels} />);

    act(() => screen.getByRole('tab', { name: 'Payments' }).focus());
    expect(screen.getByRole('tab', { name: 'Payments' })).toHaveFocus();

    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('tab', { name: 'Belo' })).toHaveFocus();
    expect(screen.getByRole('tab', { name: 'Belo' })).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('tab', { name: 'Payments' })).toHaveAttribute('tabindex', '-1');

    await user.keyboard('{End}');
    expect(screen.getByRole('tab', { name: 'Coupons' })).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Payments' })).toHaveFocus();
    await user.keyboard('{ArrowUp}');
    expect(screen.getByRole('tab', { name: 'Coupons' })).toHaveFocus();
    await user.keyboard('{Home}');
    expect(screen.getByRole('tab', { name: 'Payments' })).toHaveFocus();
    await user.keyboard('a');
    expect(screen.getByRole('tab', { name: 'Payments' })).toHaveFocus();
  });

  it('should select with a click and loop with the arrows', async () => {
    const user = userEvent.setup();
    render(<ProjectShowcase title="Proyectos" projects={projects} labels={labels} />);

    await user.click(screen.getByRole('tab', { name: 'Belo' }));
    expect(screen.getByRole('heading', { level: 3, name: 'Belo title' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Belo cover' })).toHaveAttribute('loading', 'lazy');

    await user.click(screen.getByRole('button', { name: 'Proyecto siguiente' }));
    expect(screen.getByRole('tab', { name: 'Coupons' })).toHaveAttribute('aria-selected', 'true');
    await user.click(screen.getByRole('button', { name: 'Proyecto siguiente' }));
    expect(screen.getByRole('tab', { name: 'Payments' })).toHaveAttribute('aria-selected', 'true');
    await user.click(screen.getByRole('button', { name: 'Proyecto anterior' }));
    expect(screen.getByRole('tab', { name: 'Coupons' })).toHaveAttribute('aria-selected', 'true');
  });

  it('should open the selected project in a dialog and close it', async () => {
    const user = userEvent.setup();
    render(<ProjectShowcase title="Proyectos" projects={projects} labels={labels} />);

    await user.click(screen.getByRole('tab', { name: 'Belo' }));
    await user.click(screen.getByRole('button', { name: 'Ver proyecto' }));

    expect(screen.getByRole('dialog', { name: 'Belo' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Cerrar proyecto' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('should render nothing without projects', () => {
    const { container } = render(
      <ProjectShowcase title="Proyectos" projects={[]} labels={labels} />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
