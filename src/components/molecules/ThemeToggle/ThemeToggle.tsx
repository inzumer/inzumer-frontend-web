import { Button } from '@inzumer/ui-library';
import { ContrastIcon } from '@components/atoms/Icons';
import { useColorScheme } from '@hooks';
import { trackingId } from '@utils';

export interface ThemeToggleProps {
  labels: { toDark: string; toLight: string };
}

/** Rail button between dark and light; its name says where it goes. */
export const ThemeToggle = ({ labels }: ThemeToggleProps) => {
  const { scheme, setScheme } = useColorScheme();
  const dark = scheme === 'dark';

  return (
    <Button
      id={trackingId('rail', 'button', 'theme')}
      variant="ghost"
      size="icon"
      aria-label={dark ? labels.toLight : labels.toDark}
      onClick={() => setScheme(dark ? 'light' : 'dark')}
      className="size-11 rounded-full"
    >
      <ContrastIcon className="size-5" />
    </Button>
  );
};
