import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { siteConfig } from '@/config/site'
import EasterEgg from '@/components/EasterEgg'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: siteConfig.meta.defaultTitle,
    template: siteConfig.meta.titleTemplate,
  },
  description: siteConfig.meta.defaultDescription,
  keywords: [...siteConfig.meta.keywords],
  authors: [{ name: siteConfig.author.name }],
  creator: siteConfig.author.name,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.meta.defaultTitle,
    description: siteConfig.meta.defaultDescription,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.meta.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: siteConfig.meta.twitter.card,
    title: siteConfig.meta.defaultTitle,
    description: siteConfig.meta.defaultDescription,
    creator: siteConfig.meta.twitter.site,
  },
  icons: {
    icon: siteConfig.favicon.path,
    apple: siteConfig.favicon.appleTouchIcon,
  },
}

import { prisma } from '@/lib/prisma'
import { themes } from '@/lib/themes'
import { getSiteConfig } from '@/lib/settings'

export const dynamic = 'force-dynamic';

export default async function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  const settings = await getSiteConfig(); // Use for generic stuff if needed, though RootLayout mostly focuses on Theme

  // Fetch active theme from DB
  let currentThemeId = 'default'
  try {
    const themeSettings = await prisma.settings.findUnique({
      where: { key: 'theme' },
    })
    if (themeSettings) {
      currentThemeId = themeSettings.value
    }
  } catch (e) {
    // Fallback if DB is not ready or accessible
    console.warn('Failed to fetch theme settings', e)
  }

  const currentTheme = themes.find(t => t.id === currentThemeId) || themes[0]

  return (
    <html lang="en">
      <head>
        {settings.favicon.enabled && (
          <>
            <link rel="icon" href={settings.favicon.path} />
            <link rel="apple-touch-icon" href={settings.favicon.appleTouchIcon} />
          </>
        )}
      </head>
      <body
        style={{
          '--background': currentTheme.colors.background,
          '--foreground': currentTheme.colors.foreground,
          '--text-secondary': currentTheme.colors.foreground + 'b3', // ~70% opacity
          '--text-muted': currentTheme.colors.foreground + '80', // ~50% opacity
          '--color-primary': currentTheme.colors.foreground,
          '--color-secondary': currentTheme.colors.foreground,
        } as React.CSSProperties}
        className="antialiased min-h-screen transition-colors duration-500"
      >
        {children}
        <EasterEgg />
      </body>
    </html>
  )
}

