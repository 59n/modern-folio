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
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
}


import { prisma } from '@/lib/prisma'
import { themes } from '@/lib/themes'
import { getSiteConfig } from '@/lib/settings'

export const dynamic = 'force-dynamic';

import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const globalConfig = await getSiteConfig()

  // Fetch active theme structure
  let currentThemeId = 'default'
  try {
    const themeSetting = await prisma.settings.findUnique({
      where: { key: 'theme' }
    });
    if (themeSetting?.value) {
      currentThemeId = themeSetting.value;
    }
  } catch (e) {
    console.warn('Failed to fetch theme', e);
  }

  // Determine current theme
  const currentTheme = themes.find(t => t.id === currentThemeId) || themes[0];

  return (
    <html lang="en">
      <head>
        {globalConfig.favicon.enabled && (
          <>
            <link rel="icon" href={globalConfig.favicon.path} />
            <link rel="apple-touch-icon" href={globalConfig.favicon.appleTouchIcon} />
          </>
        )}
      </head>
      <body
        style={{
          '--background': currentTheme.colors.background,
          '--foreground': currentTheme.colors.foreground,
          '--text-secondary': currentTheme.colors.foreground + 'b3',
          '--text-muted': currentTheme.colors.foreground + '80',
          '--color-primary': currentTheme.colors.foreground,
          '--color-secondary': currentTheme.colors.foreground,
        } as React.CSSProperties}
        className={`${inter.className} antialiased min-h-screen transition-colors duration-500`}
      >
        {children}
        <EasterEgg />
      </body>
    </html>
  )
}
