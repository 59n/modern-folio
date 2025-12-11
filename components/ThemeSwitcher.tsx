'use client';

import { useTheme } from './ThemeProvider';
import { themes } from '@/lib/themes';

export default function ThemeSwitcher() {
    const { theme, setTheme } = useTheme();

    return (
        <div className="flex items-center gap-2 mt-4">
            <label htmlFor="theme-select" className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                Theme
            </label>
            <select
                id="theme-select"
                value={theme.id}
                onChange={(e) => setTheme(e.target.value)}
                className="h-8 rounded-md border border-input bg-background/50 px-3 py-1 text-xs text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                aria-label="Select Theme"
            >
                {themes.map((t) => (
                    <option key={t.id} value={t.id}>
                        {t.name}
                    </option>
                ))}
            </select>
        </div>
    );
}
