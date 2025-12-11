import { prisma } from '@/lib/prisma';
import { themes } from '@/lib/themes';
import SettingsTabs from './SettingsTabs';
import { getSiteConfig } from '@/lib/settings';

export default async function SettingsPage() {
    // Parallel data fetching
    const [settings, config, links] = await Promise.all([
        prisma.settings.findUnique({ where: { key: 'theme' } }),
        getSiteConfig(),
        prisma.link.findMany({ orderBy: { order: 'asc' } }),
    ]);

    const currentThemeId = settings?.value || 'default';

    return (
        <SettingsTabs
            config={config}
            themes={themes}
            currentThemeId={currentThemeId}
            links={links}
        />
    );
}
