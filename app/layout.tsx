import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { getSiteConfig } from '@/lib/settings'
import EasterEgg from '@/components/EasterEgg'
import { ThemeProvider } from '@/components/ThemeProvider'
import './globals.css'

export async function generateMetadata(): Promise<Metadata> {
  const siteConfig = await getSiteConfig()
  const description = (Array.isArray(siteConfig.header.description)
    ? siteConfig.header.description.join(' ')
    : siteConfig.header.description) as string;

  return {
    title: {
      default: siteConfig.name,
      template: `%s | ${siteConfig.name}`,
    },
    description: description,
    keywords: ['Next.js', 'React', 'Portfolio'],
    authors: [{ name: siteConfig.name }],
    creator: siteConfig.name,
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: 'https://example.com',
      title: siteConfig.name,
      description: description,
      siteName: siteConfig.name,
    },
  }
}

export default async function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  const siteConfig = await getSiteConfig()

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {siteConfig.favicon.enabled && (
          <>
            <link rel="icon" href={`${siteConfig.favicon.path}?v=${siteConfig.favicon.version}`} />
            <link rel="apple-touch-icon" href={siteConfig.favicon.appleTouchIcon} />
          </>
        )}
      </head>
      <body className="antialiased font-sans bg-background text-foreground transition-colors duration-300">
        <ThemeProvider>
          {children}
          <EasterEgg />
        </ThemeProvider>
      </body>
    </html>
  )
}

