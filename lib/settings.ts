import { prisma } from '@/lib/prisma';
import { siteConfig, type SiteConfig } from '@/config/site';
export type { SiteConfig };

/**
 * Validates and merges the partial DB config with the default siteConfig.
 * Ensures the returned object always matches the SiteConfig type structure.
 */
function mergeConfigs(defaults: SiteConfig, overrides: any): SiteConfig {
    if (!overrides || typeof overrides !== 'object') return defaults;

    // Deep merge helper (simplified for our specific depth needs)
    const merged = { ...defaults };

    if (overrides.name) merged.name = overrides.name;
    if (overrides.title) merged.title = overrides.title;
    if (overrides.description) merged.description = overrides.description;

    // Deep merge helper for nested objects
    if (overrides.author) {
        merged.author = { ...defaults.author, ...overrides.author };
    }

    if (overrides.header) {
        merged.header = { ...defaults.header, ...overrides.header };
    }

    if (overrides.social) {
        merged.social = { ...defaults.social, ...overrides.social };
    }

    if (overrides.footer) {
        // Deep merge footer copyright if present
        const footerCopyright = overrides.footer.copyright
            ? { ...defaults.footer.copyright, ...overrides.footer.copyright }
            : defaults.footer.copyright;

        merged.footer = {
            ...defaults.footer,
            ...overrides.footer,
            copyright: footerCopyright
        };
    }

    if (overrides.navigation) {
        merged.navigation = { ...defaults.navigation, ...overrides.navigation };
    }

    if (overrides.blog) {
        merged.blog = { ...defaults.blog, ...overrides.blog };
    }

    if (overrides.projects) {
        merged.projects = { ...defaults.projects, ...overrides.projects };
    }

    if (overrides.meta) {
        merged.meta = { ...defaults.meta, ...overrides.meta };
    }

    if (overrides.favicon) {
        merged.favicon = { ...defaults.favicon, ...overrides.favicon };
    }

    return merged;
}

export async function getSiteConfig(): Promise<SiteConfig> {
    try {
        const settings = await prisma.settings.findUnique({
            where: { key: 'site_config' },
        });

        let computedConfig = { ...siteConfig };

        if (settings?.value) {
            const overrides = JSON.parse(settings.value);
            computedConfig = mergeConfigs(computedConfig, overrides);
        }

        return computedConfig;
    } catch (error) {
        console.warn('Failed to fetch site config from DB, using defaults:', error);
    }

    return siteConfig;
}
