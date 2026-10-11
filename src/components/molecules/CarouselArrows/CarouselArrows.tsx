import { Button, Icon } from '@inzumer/ui-library';
import { trackingId } from '@utils';

export interface CarouselArrowsProps {
  /** Scope of the tracking ids (`<scope>-button-previous`). */
  scope: string;
  labels: { previous: string; next: string };
  disabled?: { previous?: boolean; next?: boolean };
  /** Id of the element the arrows move. */
  controls?: string;
  onPrevious: () => void;
  onNext: () => void;
}

/** Thin round previous / next buttons next to a section title. */
export const CarouselArrows = ({
  scope,
  labels,
  disabled = {},
  controls,
  onPrevious,
  onNext,
}: CarouselArrowsProps) => (
  <div className="flex gap-3">
    <Button
      id={trackingId(scope, 'button', 'previous')}
      variant="secondary"
      size="icon"
      className="size-11 rounded-full"
      aria-label={labels.previous}
      aria-controls={controls}
      disabled={disabled.previous}
      onClick={onPrevious}
    >
      <Icon name="chevron-left" size="sm" />
    </Button>
    <Button
      id={trackingId(scope, 'button', 'next')}
      variant="secondary"
      size="icon"
      className="size-11 rounded-full"
      aria-label={labels.next}
      aria-controls={controls}
      disabled={disabled.next}
      onClick={onNext}
    >
      <Icon name="chevron-right" size="sm" />
    </Button>
  </div>
);
