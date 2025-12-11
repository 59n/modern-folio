import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getSiteConfig } from '@/lib/settings'

export const dynamic = 'force-dynamic';

export default async function Home() {
  const siteConfig = await getSiteConfig();

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
        <Header siteConfig={siteConfig} />
        {siteConfig.footer.enabled && <Footer siteConfig={siteConfig} />}
      </div>
    </main>
  )
}

