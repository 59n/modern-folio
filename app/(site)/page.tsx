import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getSiteConfig } from '@/lib/settings'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic';

export default async function Home() {
  const siteConfig = await getSiteConfig();

  // Fetch active links
  const links = await prisma.link.findMany({
    where: { active: true },
    orderBy: { order: 'asc' }
  }).catch(() => []);

  return (
    <main
      className="flex min-h-screen items-center justify-center antialiased text-center"
      style={{
        backgroundColor: siteConfig.colors.background,
        color: siteConfig.colors.foreground,
      }}
    >
      <div
        className="mx-auto w-full"
        style={{
          maxWidth: siteConfig.layout.maxWidth,
          paddingLeft: siteConfig.layout.padding.mobile,
          paddingRight: siteConfig.layout.padding.mobile,
        }}
      >
        <Header siteConfig={siteConfig} links={links} />
        {siteConfig.footer.enabled && <Footer siteConfig={siteConfig} />}
      </div>
    </main>
  )
}
