'use client'

import Link from 'next/link'
import { SiteConfig } from '@/config/site'
import ClickableTitle from '@/components/ClickableTitle'
import { Icon } from '@/components/Icons'

// Define LinkItem type matching the DB model (simplified)
type LinkItem = {
  id: string;
  title: string;
  url: string;
  icon: string;
  type: string;
  active: boolean;
  order: number;
};

// Helper removed, using imported Icon component


export default function Header({ siteConfig, links = [] }: { siteConfig: SiteConfig, links?: LinkItem[] }) {
  const socialLinks = links.filter(l => l.type === 'SOCIAL' && l.active);
  const navLinks = links.filter(l => l.type === 'NAV_ITEM' && l.active);

  return (
    <header className="mb-16">
      <ClickableTitle href="/" siteConfig={siteConfig} />

      {/* Social Icons Area - Merging Configured and Custom */}
      {(siteConfig.header.showSocialIcons || socialLinks.length > 0) && (
        <div className="mb-8 flex items-center justify-center gap-6 flex-wrap">
          {/* Social Database Links */}
          {socialLinks.map(link => (
            <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="transition-all duration-300 hover:scale-110 hover:opacity-80" style={{ color: siteConfig.colors.text.muted }} aria-label={link.title}>
              <Icon name={link.icon} />
            </a>
          ))}
        </div>
      )}

      <div className="mb-8 space-y-2 max-w-lg mx-auto">
        <p className="text-base md:text-lg font-normal leading-relaxed" style={{ color: siteConfig.colors.text.secondary }}>
          {siteConfig.header.subtitle}
        </p>
        <div className="text-base md:text-lg font-normal leading-relaxed" style={{ color: siteConfig.colors.text.secondary }}>
          {Array.isArray(siteConfig.header.description)
            ? siteConfig.header.description.map((line, i) => <p key={i}>{line}</p>)
            : <p>{siteConfig.header.description}</p>
          }
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex items-center justify-center gap-6 flex-wrap">
        {siteConfig.navigation.showBlogButton && (
          <Link href="/blog" className="rounded-xl border px-10 py-4 text-base font-medium transition-all duration-300 hover:border-gray-700/50 hover:bg-gray-800/60 hover:text-white min-w-[140px]" style={{ borderColor: siteConfig.colors.button.border, backgroundColor: siteConfig.colors.button.background, color: siteConfig.colors.button.text }}>
            {siteConfig.navigation.blogLabel}
          </Link>
        )}

        {siteConfig.navigation.showProjectsButton && (
          <Link href="/projects" className="rounded-xl border px-10 py-4 text-base font-medium transition-all duration-300 hover:border-gray-700/50 hover:bg-gray-800/60 hover:text-white min-w-[140px]" style={{ borderColor: siteConfig.colors.button.border, backgroundColor: siteConfig.colors.button.background, color: siteConfig.colors.button.text }}>
            {siteConfig.navigation.projectsLabel}
          </Link>
        )}

        {/* Custom Navigation Links */}
        {navLinks.map(link => (
          <Link key={link.id} href={link.url} target={link.url.startsWith('http') ? '_blank' : undefined} className="rounded-xl border px-10 py-4 text-base font-medium transition-all duration-300 hover:border-gray-700/50 hover:bg-gray-800/60 hover:text-white min-w-[140px]" style={{ borderColor: siteConfig.colors.button.border, backgroundColor: siteConfig.colors.button.background, color: siteConfig.colors.button.text }}>
            {link.title}
          </Link>
        ))}
      </nav>
    </header>
  )
}
