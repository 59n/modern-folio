'use client'

import Link from 'next/link'
import { SiteConfig } from '@/config/site'
import ClickableTitle from '@/components/ClickableTitle'

export default function Header({ siteConfig }: { siteConfig: SiteConfig }) {
  return (
    <header className="mb-16">
      <ClickableTitle href="/" siteConfig={siteConfig} />

      {siteConfig.header.showSocialIcons && (
        <div className="mb-8 flex items-center justify-center gap-6">
          <a
            href={siteConfig.social.github}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-all duration-300 hover:scale-110 hover:opacity-80"
            style={{ color: siteConfig.colors.text.muted }}
            aria-label="GitHub"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
          </a>
          <a
            href={`mailto:${siteConfig.social.email}`}
            className="transition-all duration-300 hover:scale-110 hover:opacity-80"
            style={{ color: siteConfig.colors.text.muted }}
            aria-label="Email"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
            </svg>
          </a>
          <a
            href={siteConfig.social.solo}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-all duration-300 hover:scale-110 hover:opacity-80"
            style={{ color: siteConfig.colors.text.muted }}
            aria-label="Solo.to"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
            </svg>
          </a>
        </div>
      )}

      <div className="mb-8 space-y-2 max-w-lg mx-auto">
        <p
          className="text-base md:text-lg font-normal leading-relaxed"
          style={{ color: siteConfig.colors.text.secondary }}
        >
          {siteConfig.header.subtitle}
        </p>
        <div
          className="text-base md:text-lg font-normal leading-relaxed"
          style={{ color: siteConfig.colors.text.secondary }}
        >
          {Array.isArray(siteConfig.header.description)
            ? siteConfig.header.description.map((line, i) => (
              <p key={i}>{line}</p>
            ))
            : <p>{siteConfig.header.description}</p>
          }
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex items-center justify-center gap-6">
        {siteConfig.navigation.showBlogButton && (
          <Link
            href="/blog"
            className="rounded-xl border px-10 py-4 text-base font-medium transition-all duration-300 hover:border-gray-700/50 hover:bg-gray-800/60 hover:text-white min-w-[140px]"
            style={{
              borderColor: siteConfig.colors.button.border,
              backgroundColor: siteConfig.colors.button.background,
              color: siteConfig.colors.button.text,
            }}
          >
            {siteConfig.navigation.blogLabel}
          </Link>
        )}

        {siteConfig.navigation.showProjectsButton && (
          <Link
            href="/projects"
            className="rounded-xl border px-10 py-4 text-base font-medium transition-all duration-300 hover:border-gray-700/50 hover:bg-gray-800/60 hover:text-white min-w-[140px]"
            style={{
              borderColor: siteConfig.colors.button.border,
              backgroundColor: siteConfig.colors.button.background,
              color: siteConfig.colors.button.text,
            }}
          >
            {siteConfig.navigation.projectsLabel}
          </Link>
        )}
      </nav>
    </header>
  )
}
