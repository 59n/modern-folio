'use client';

import { SiteConfig } from '@/config/site'
import { useTheme } from '@/components/ThemeProvider';
import { useEffect, useState } from 'react';

export default function Footer({ siteConfig }: { siteConfig: SiteConfig }) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!siteConfig.footer.enabled) return null;

  // Prefer theme emojis, fallback to config
  const emojis = siteConfig.footer.emojis;

  return (
    <footer className="mt-20 border-t border-border pt-10 pb-10 text-center text-sm text-muted-foreground w-full">
      <div className="flex flex-col items-center gap-4">
        {siteConfig.footer.showLogo && (
          <span className="text-xl font-bold text-foreground">{siteConfig.footer.logo}</span>
        )}

        {siteConfig.footer.showCopyright && (
          <p>
            &copy; {siteConfig.footer.copyright.year} {siteConfig.footer.copyright.text}.
            {siteConfig.footer.copyright.showLicense && (
              <>
                {'  Released under '}
                <a
                  href={siteConfig.footer.copyright.license.url}
                  className="hover:text-foreground underline decoration-muted-foreground underline-offset-4 transition-all"
                >
                  {siteConfig.footer.copyright.license.type}
                </a>
                .
              </>
            )}
          </p>
        )}

        {siteConfig.footer.showEmojis && mounted && (
          <p className="text-lg tracking-widest opacity-70 hover:opacity-100 transition-opacity animate-in fade-in duration-500">
            {emojis}
          </p>
        )}
      </div>
    </footer>
  )
}
