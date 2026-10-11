import { IconLink, LinkedInIcon } from '@inzumer/ui-library';
import { GitHubIcon } from '@components/atoms/Icons';
import { ThemeToggle } from '@components/molecules/ThemeToggle';
import { SOCIAL_LINKS } from '@constants';
import { trackingId } from '@utils';

export interface SiteRailProps {
  languages: { lang: string; href: string; current: boolean }[];
  labels: { rail: string; language: string; toDark: string; toLight: string };
}

const Divider = () => <span aria-hidden className="my-2 h-px w-4 bg-(--border-strong)" />;

/** Fixed on the start side from tablets up: profiles, language and theme. Phones use the menu. */
export const SiteRail = ({ languages, labels }: SiteRailProps) => (
  <nav
    aria-label={labels.rail}
    className="fixed top-1/2 left-[calc(1.6rem_+_env(safe-area-inset-left))] z-30 hidden -translate-y-1/2 flex-col items-center gap-2 md:flex"
  >
    <IconLink
      id={trackingId('rail', 'link', 'github')}
      href={SOCIAL_LINKS.github}
      label="GitHub"
      icon={<GitHubIcon />}
      external
    />
    <IconLink
      id={trackingId('rail', 'link', 'linkedin')}
      href={SOCIAL_LINKS.linkedin}
      label="LinkedIn"
      icon={<LinkedInIcon />}
      external
    />
    <Divider />
    <ul aria-label={labels.language} className="flex flex-col gap-1">
      {languages.map(({ lang, href, current }) => (
        <li key={lang}>
          <a
            id={trackingId('rail', 'link', 'language', lang)}
            href={href}
            hrefLang={lang}
            lang={lang}
            aria-current={current ? 'true' : undefined}
            className={`grid size-11 place-items-center rounded-full text-[1.1rem] font-medium tracking-[0.14em] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--border-focus) ${
              current
                ? 'border border-(--border-strong)'
                : 'text-(--text-tertiary) hover:text-(--text-primary)'
            }`}
          >
            {lang.toUpperCase()}
          </a>
        </li>
      ))}
    </ul>
    <Divider />
    <ThemeToggle labels={{ toDark: labels.toDark, toLight: labels.toLight }} />
  </nav>
);
