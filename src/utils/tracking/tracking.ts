import type { TrackingKind } from '@constants';

const kebab = (value: string | number): string =>
  String(value)
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[^A-Za-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();

/** Stable `<scope>-<kind>-<name>` element id for analytics click triggers. */
export const trackingId = (
  scope: string,
  kind: TrackingKind,
  ...name: (string | number)[]
): string =>
  [scope, kind, ...name]
    .map(kebab)
    .filter((part) => part.length > 0)
    .join('-');

/** The tracking id as `id` and the same `data-testid`: Tag Manager reads the first, tests the second. */
export const trackingProps = (
  scope: string,
  kind: TrackingKind,
  ...name: (string | number)[]
): { id: string; 'data-testid': string } => {
  const id = trackingId(scope, kind, ...name);

  return { id, 'data-testid': id };
};
