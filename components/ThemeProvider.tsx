'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeInfo, themes } from '@/lib/themes';

interface ThemeContextType {
    theme: ThemeInfo;
    setTheme: (themeId: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    // Default to the first theme (Aurora/Dark) permanently
    const theme = themes[0];
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const root = document.documentElement;
        const colors = theme.colors;

        // Helper to determine if a color is light or dark (for contrast)
        const isDark = (hex: string) => {
            const c = hex.substring(1);
            const rgb = parseInt(c, 16);
            const r = (rgb >> 16) & 0xff;
            const g = (rgb >> 8) & 0xff;
            const b = (rgb >> 0) & 0xff;
            const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
            return luma < 128;
        };

        const isBgDark = isDark(colors.background);

        // Backgrounds
        root.style.setProperty('--background', colors.background);
        root.style.setProperty('--card', colors.background);
        root.style.setProperty('--popover', colors.background);

        // Foregrounds
        root.style.setProperty('--foreground', colors.foreground);
        root.style.setProperty('--card-foreground', colors.foreground);
        root.style.setProperty('--popover-foreground', colors.foreground);

        // Primary
        root.style.setProperty('--primary', colors.foreground);
        root.style.setProperty('--primary-foreground', colors.background);

        // Muted
        const mutedColor = isBgDark ? '#1f2937' : '#f3f4f6';
        const mutedFgColor = isBgDark ? '#9ca3af' : '#6b7280';
        root.style.setProperty('--muted', mutedColor);
        root.style.setProperty('--muted-foreground', mutedFgColor);
        root.style.setProperty('--border', mutedColor);
        root.style.setProperty('--input', mutedColor);
        root.style.setProperty('--accent', mutedColor);
        root.style.setProperty('--accent-foreground', colors.foreground);
        root.style.setProperty('--ring', colors.foreground);

        setMounted(true);
    }, []);

    // No context provider needed if we don't expose switching, 
    // BUT downstream components might use useTheme().
    // We should keeping providing the context with a dummy setTheme.
    return (
        <ThemeContext.Provider value={{ theme, setTheme: () => { } }}>
            {!mounted && (
                <div
                    className="fixed inset-0 z-[9999] bg-[#000000]"
                    aria-hidden="true"
                />
            )}
            {children}
        </ThemeContext.Provider>
    );
}
