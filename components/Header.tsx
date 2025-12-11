'use client'

import Link from 'next/link'
import { SiteConfig } from '@/config/site'
import { Icon } from '@/components/Icons'
import { useTheme } from '@/components/ThemeProvider'
import { useEffect, useState } from 'react'

type LinkItem = {
  id: string;
  title: string;
  url: string;
  icon: string;
  type: string;
  active: boolean;
  order: number;
};

export default function Header({ siteConfig, links = [] }: { siteConfig: SiteConfig, links?: LinkItem[] }) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = links.filter(l => l.type === 'NAV_ITEM' && l.active);

  // Use theme labels if mounted (client-side), otherwise server config string to avoid mismatch during hydration initially? 
  // Actually, standard hydration pattern: render server val, then effect updates it. 
  // Text mismatch warning might occur. We suppress or use 'mounted' check to show generic or server-side.
  // Ideally, 'blogLabel' changes should be instant. 
  // We'll use the 'mounted' check to swap to theme label.

  const blogLabel = (mounted && theme.blogLabel) || siteConfig.navigation.blogLabel;
  const projectsLabel = (mounted && theme.projectsLabel) || siteConfig.navigation.projectsLabel;

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-sm bg-background/80 border-b border-border/50 transition-colors duration-300">
      <div className="mx-auto flex h-10 max-w-screen-xl items-center justify-between px-4 sm:px-8">
        <Link href="/" className="font-semibold text-base tracking-tight hover:opacity-80 transition-opacity">
          {siteConfig.header.title || "Jack"}
        </Link>

        <nav className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
          {siteConfig.navigation.showBlogButton && (
            <Link href="/blog" className="hover:text-foreground transition-colors">
              {blogLabel}
            </Link>
          )}

          {siteConfig.navigation.showProjectsButton && (
            <Link href="/projects" className="hover:text-foreground transition-colors">
              {projectsLabel}
            </Link>
          )}

          {navLinks.map(link => (
            <Link
              key={link.id}
              href={link.url}
              target={link.url.startsWith('http') ? '_blank' : undefined}
              className="hover:text-foreground transition-colors"
            >
              {link.title}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
