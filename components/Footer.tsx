import { SiteConfig } from '@/config/site'

export default function Footer({ siteConfig }: { siteConfig: SiteConfig }) {
  if (!siteConfig.footer.enabled) return null;

  return (
    <footer className="mt-20 border-t border-gray-800 pt-10 text-center text-sm text-gray-500">
      <div className="flex flex-col items-center gap-4">
        {siteConfig.footer.showLogo && (
          <span className="text-xl font-bold text-white">{siteConfig.footer.logo}</span>
        )}

        <p>
          &copy; {siteConfig.footer.copyright.year} {siteConfig.footer.copyright.text}.
          {siteConfig.footer.copyright.showLicense && (
            <>
              {'  Released under '}
              <a
                href={siteConfig.footer.copyright.license.url}
                className="hover:text-white underline decoration-gray-700 underline-offset-4 transition-all"
              >
                {siteConfig.footer.copyright.license.type}
              </a>
              .
            </>
          )}
        </p>

        {siteConfig.footer.showEmojis && (
          <p className="text-lg tracking-widest opacity-70 hover:opacity-100 transition-opacity">
            {siteConfig.footer.emojis}
          </p>
        )}
      </div>
    </footer>
  )
}
