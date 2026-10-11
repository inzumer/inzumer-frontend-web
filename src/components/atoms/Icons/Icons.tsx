import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

/** Outlined 1.5 stroke, like the ui-library icons; they take the current text color. */
const Stroke = ({ children, ...props }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
    {...props}
  >
    {children}
  </svg>
);

export const SpeedIcon = (props: IconProps) => (
  <Stroke {...props}>
    <path d="M4 18a8 8 0 1 1 16 0" />
    <path d="M12 18l4-6" />
  </Stroke>
);

export const PhoneIcon = (props: IconProps) => (
  <Stroke {...props}>
    <rect x="7" y="3" width="10" height="18" rx="2.5" />
    <path d="M11 18h2" />
  </Stroke>
);

export const GridIcon = (props: IconProps) => (
  <Stroke {...props}>
    <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
    <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
    <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
    <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
  </Stroke>
);

export const AccessibilityIcon = (props: IconProps) => (
  <Stroke {...props}>
    <circle cx="12" cy="4.5" r="1.5" />
    <path d="M5 8l7 1.5L19 8M12 9.5V14m0 0l-3 6m3-6l3 6" />
  </Stroke>
);

export const CheckIcon = (props: IconProps) => (
  <Stroke {...props}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M8.5 12.5l2.5 2.5 4.5-5" />
  </Stroke>
);

export const LayersIcon = (props: IconProps) => (
  <Stroke {...props}>
    <path d="M12 4l8.5 4.5L12 13 3.5 8.5z" />
    <path d="M3.5 12.5L12 17l8.5-4.5M3.5 16.5L12 21l8.5-4.5" />
  </Stroke>
);

/** Half-filled circle: switches between dark and light. */
export const ContrastIcon = (props: IconProps) => (
  <Stroke {...props}>
    <circle cx="12" cy="12" r="8" />
    <path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor" />
  </Stroke>
);

/** Until the ui-library release with `GitHubIcon` (ui-library #78). */
export const GitHubIcon = (props: IconProps) => (
  <Stroke {...props}>
    <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />
  </Stroke>
);

/** Icons of the "How I can help" cards, by the `icon` key in `i18n/home`. */
export const SERVICE_ICONS = {
  speed: SpeedIcon,
  phone: PhoneIcon,
  grid: GridIcon,
  accessibility: AccessibilityIcon,
  check: CheckIcon,
  layers: LayersIcon,
} as const;

export type ServiceIconName = keyof typeof SERVICE_ICONS;

export const isServiceIconName = (value: string): value is ServiceIconName =>
  value in SERVICE_ICONS;
