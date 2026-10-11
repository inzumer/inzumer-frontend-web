import type { Config } from 'tailwindcss';
import { DefaultPreset } from '@inzumer/tokens/tailwind';

/** Legacy config loaded by `@config` in global.css so the `@inzumer/tokens` preset keeps working. */
const config: Config = {
  presets: [DefaultPreset],
  content: [],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-body)'],
      },
      maxWidth: {
        layout: 'var(--layout-max-width)',
      },
    },
  },
};

export default config;
