import { useTheme } from "./ThemeContext";
import { cn } from '@workspace/ui/lib/utils';

const ThemeSelector = () => {
  const { currentTheme, setTheme, availableThemes } = useTheme();

  return (
    <div className="w-fit p-1 rounded-lg border border-[var(--primary)] flex">
      {availableThemes.map((theme) => (
        <button
          key={theme.name}
          onClick={() => setTheme(theme)}
          className={cn(
            "px-2 py-1 mx-1 rounded-lg transition-colors",
            currentTheme.name === theme.name &&
              "bg-[var(--primary)] text-[var(--background)]"
          )}
        >
          {theme.label}
        </button>
      ))}
    </div>
  );
};

export default ThemeSelector;
