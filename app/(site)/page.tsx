import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getSiteConfig } from '@/lib/settings'
import { prisma } from '@/lib/prisma'
import { Icon } from '@/components/Icons'
import Link from 'next/link'

export const dynamic = 'force-dynamic';

export default async function Home() {
  const siteConfig = await getSiteConfig();

  // Fetch active links
  const links = await prisma.link.findMany({
    where: { active: true },
    orderBy: { order: 'asc' }
  }).catch(() => []);

  // Filter social links for the hero
  const socialLinks = links.filter(l => l.type === 'SOCIAL' && l.active);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-300">
      <Header siteConfig={siteConfig} links={links} />

      <main className="flex flex-1 flex-col items-center justify-center -mt-16 sm:-mt-20 p-4 text-center">
        <div className="flex flex-col items-center gap-6 max-w-2xl mx-auto">

          {/* Main Title */}
          <h1 className={`font-bold tracking-tight ${{
            'tiny': 'text-2xl sm:text-3xl',
            'small': 'text-3xl sm:text-4xl',
            'medium': 'text-4xl sm:text-5xl',
            'large': 'text-5xl sm:text-6xl',
            'extra-large': 'text-6xl sm:text-7xl',
            'huge': 'text-7xl sm:text-8xl',
            'gigantic': 'text-8xl sm:text-9xl',
          }[siteConfig.header.titleSize || 'large'] ?? 'text-5xl sm:text-6xl'
            }`}>
            {siteConfig.header.title}
          </h1>

          {/* Social Icons Row */}
          {socialLinks.length > 0 && (
            <div className="flex items-center gap-6 text-muted-foreground">
              {socialLinks.map(link => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors duration-200"
                  aria-label={link.title}
                >
                  <Icon name={link.icon} className={`
                    ${{
                      'tiny': 'w-4 h-4 sm:w-5 sm:h-5',
                      'small': 'w-5 h-5 sm:w-6 sm:h-6',
                      'medium': 'w-6 h-6 sm:w-7 sm:h-7',
                      'large': 'w-7 h-7 sm:w-8 sm:h-8',
                      'extra-large': 'w-8 h-8 sm:w-9 sm:h-9',
                      'huge': 'w-9 h-9 sm:w-10 sm:h-10',
                      'gigantic': 'w-10 h-10 sm:w-12 sm:h-12',
                    }[siteConfig.header.iconSize || 'medium'] ?? 'w-6 h-6 sm:w-7 sm:h-7'}
                  `} />
                </a>
              ))}
            </div>
          )}

          {/* Bio / Description */}
          <div className="space-y-4 max-w-lg mt-4">
            <h2 className={`font-light text-muted-foreground leading-relaxed ${{
              'tiny': 'text-base sm:text-lg',
              'small': 'text-lg sm:text-xl',
              'medium': 'text-xl sm:text-2xl',
              'large': 'text-2xl sm:text-3xl',
              'extra-large': 'text-3xl sm:text-4xl',
              'huge': 'text-4xl sm:text-5xl',
              'gigantic': 'text-5xl sm:text-6xl',
            }[siteConfig.header.subtitleSize || 'medium'] ?? 'text-xl sm:text-2xl'
              }`}>
              {siteConfig.header.subtitle}
            </h2>
            {siteConfig.header.description && (
              <div className={`text-muted-foreground/80 leading-relaxed font-light ${{
                'tiny': 'text-xs sm:text-sm',
                'small': 'text-sm sm:text-base',
                'medium': 'text-base sm:text-lg',
                'large': 'text-lg sm:text-xl',
                'extra-large': 'text-xl sm:text-2xl',
                'huge': 'text-2xl sm:text-3xl',
                'gigantic': 'text-3xl sm:text-4xl',
              }[siteConfig.header.descriptionSize || 'small'] ?? 'text-sm sm:text-base'
                }`}>
                {Array.isArray(siteConfig.header.description)
                  ? siteConfig.header.description.map((d, i) => <p key={i}>{d}</p>)
                  : (siteConfig.header.description as string).split('\n').map((d, i) => <p key={i}>{d}</p>)
                }
              </div>
            )}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            {siteConfig.navigation.showBlogButton && (
              <Link
                href="/blog"
                className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-primary px-8 font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
              >
                <span>{siteConfig.navigation.blogLabel}</span>
              </Link>
            )}
            {siteConfig.navigation.showProjectsButton && (
              <Link
                href="/projects"
                className="group inline-flex h-12 items-center justify-center rounded-md border border-input bg-background px-8 font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <span>{siteConfig.navigation.projectsLabel}</span>
              </Link>
            )}
          </div>

        </div>
      </main>

      {siteConfig.footer.enabled && <Footer siteConfig={siteConfig} />}
    </div>
  )
}


