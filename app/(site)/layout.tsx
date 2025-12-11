import { getSiteConfig } from '@/lib/settings'

export default async function SiteLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const globalConfig = await getSiteConfig()

    return (
        <div className="w-full max-w-3xl mx-auto flex flex-col min-h-[calc(100vh-4rem)]">
            <main className="flex-1 w-full relative">
                {children}
            </main>
        </div>
    )
}
