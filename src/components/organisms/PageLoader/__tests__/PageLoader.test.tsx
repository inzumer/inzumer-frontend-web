import { act, fireEvent, render, screen } from '@testing-library/react';
import { PAGE_LOADER_DELAY_MS, PageLoader } from '../PageLoader';

const questions = ['¿Quieres construir algo nuevo?'];

const renderWithLinks = () =>
  render(
    <>
      <a href="/es/projects/belo">Belo</a>
      <a href="#contact">Contacto</a>
      <a href="https://github.com/inzumer">GitHub</a>
      <a href="/es/projects/smart" target="_blank">
        Nueva pestaña
      </a>
      <PageLoader label="Cargando la página" messages={questions} />
    </>,
  );

/** jsdom doesn't navigate, so the page stays and the loader can be checked. */
const click = (name: string, init: MouseEventInit = {}) => {
  fireEvent.click(screen.getByRole('link', { name }), init);
  act(() => vi.advanceTimersByTime(PAGE_LOADER_DELAY_MS));
};

describe('PageLoader', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should cover the page while another page of the site loads', () => {
    renderWithLinks();

    click('Belo');

    expect(screen.getByRole('dialog', { name: 'Cargando la página' })).toBeInTheDocument();
    expect(screen.getByText('¿Quieres construir algo nuevo?')).toBeInTheDocument();

    act(() => {
      window.dispatchEvent(new Event('pageshow'));
    });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should stay hidden for anchors, other sites, new tabs and modifier keys', () => {
    renderWithLinks();

    click('Contacto');
    click('GitHub');
    click('Nueva pestaña');
    click('Belo', { metaKey: true });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
