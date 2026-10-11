import { render } from '@testing-library/react';
import { LoaderMark } from '../LoaderMark';

describe('LoaderMark', () => {
  it('should draw a thin ring with the text color on top', () => {
    const { container } = render(<LoaderMark />);

    expect(container.firstChild).toHaveClass('rounded-full', 'border', 'border-t-(--text-primary)');
  });
});
