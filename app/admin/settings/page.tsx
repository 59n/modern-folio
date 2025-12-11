import { prisma } from '@/lib/prisma';
import { themes } from '@/lib/themes';
import SettingsTabs from './SettingsTabs';
import { getSiteConfig } from '@/lib/settings';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
    // Parallel data fetching
    const [config, links] = await Promise.all([
        getSiteConfig(),
        prisma.link.findMany({ orderBy: { order: 'asc' } }),
    ]);

    return (
        <SettingsTabs
            config={config}
            themes={themes}
            currentThemeId="default"
            links={links}
        />
    );
}
